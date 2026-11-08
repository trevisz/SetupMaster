const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');
const { Readable } = require('node:stream');

let win;
let installing = false;
let elevatedContext;

app.setPath('userData', path.join(app.getPath('appData'), 'setupmaster-desktop-pro'));

function isElevatedContext() {
  if (elevatedContext !== undefined) return elevatedContext;
  if (process.platform !== 'win32') return (elevatedContext = false);
  const result = spawnSync('whoami.exe', ['/groups'], { encoding: 'utf8', windowsHide: true, timeout: 3000 });
  elevatedContext = result.status === 0 && /\bS-1-16-(?:12288|16384|20480)\b/.test(result.stdout || '');
  return elevatedContext;
}

function queryInstalledPackage(item) {
  return new Promise(resolve => {
    const args=['list','--id',item.wingetId,'-e','--accept-source-agreements','--disable-interactivity'];
    if(item.source==='msstore')args.push('--source','msstore');
    const child=spawn('winget.exe',args,{windowsHide:true,shell:false});
    let output='';
    child.stdout.on('data',chunk=>output+=chunk.toString());
    child.stderr.on('data',chunk=>output+=chunk.toString());
    child.on('error',error=>resolve({installed:false,warning:error.message}));
    child.on('close',()=>{
      const escaped=item.wingetId.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const found=new RegExp(`(^|\\s)${escaped}(?=\\s|$)`,'im').test(output);
      resolve({installed:found});
    });
  });
}

async function getInstalledWingetIds(packages) {
  const installed=new Set(), warnings=[];
  for(const item of packages){
    const result=await queryInstalledPackage(item);
    if(result.installed)installed.add(item.wingetId.toLowerCase());
    if(result.warning)warnings.push(result.warning);
  }
  return {ids:installed,warning:warnings[0]};
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    frame: false,
    backgroundColor: '#0b0f17',
    icon: path.join(__dirname, 'assets', 'setupmaster.ico'),
    webPreferences: { nodeIntegration: false, contextIsolation: true, preload: path.join(__dirname, 'preload.js') }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('window-control', (_event, action) => {
  if (!win) return;
  if (action === 'minimize') win.minimize();
  if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
  if (action === 'close') win.close();
});

ipcMain.handle('execute-winget-install', async (event, apps) => {
  if (process.platform !== 'win32') throw new Error('A instalação por winget está disponível apenas no Windows.');
  if (installing) throw new Error('Já existe uma instalação em andamento.');
  if (!Array.isArray(apps) || apps.length === 0) throw new Error('Selecione pelo menos um aplicativo.');
  const packages = apps.map(item => typeof item === 'string' ? { wingetId: item } : item);
  const ids = packages.map(item => item?.wingetId).filter(id => typeof id === 'string' && /^[\w.+-]+$/.test(id));
  if (ids.length !== apps.length) throw new Error('Um ou mais IDs do winget são inválidos.');
  installing = true;
  const send = (type, data) => {
    if (event.sender.isDestroyed()) return;
    const payload = Buffer.isBuffer(data) ? data.toString('utf8') : data;
    event.sender.send('winget-log', { type, data: payload });
  };
  const failures = [];
  try {
    send('stdout', 'Verificando quais aplicativos já estão instalados…\n');
    const installedResult = await getInstalledWingetIds(packages);
    if (installedResult.warning) send('stderr', `Não foi possível consultar a lista instalada; vou tentar instalar todos. ${installedResult.warning}`);
    let skipped = 0;
    for (let i = 0; i < ids.length; i++) {
      send('progress', { current: i, total: ids.length, id: ids[i] });
      if (installedResult.ids.has(ids[i].toLowerCase())) {
        skipped++;
        send('stdout', `↷ ${ids[i]} já está instalado; pulando.\n`);
        send('progress', { current: i + 1, total: ids.length, id: ids[i] });
        continue;
      }
      send('stdout', `\n> Instalando ${ids[i]} (${i + 1}/${ids.length})\n`);
      if (ids[i].toLowerCase() === 'spotify.spotify' && isElevatedContext()) {
        const message = 'Spotify bloqueia a instalação quando o processo está elevado. Feche o SetupMaster e abra-o na sessão normal do Windows, sem “Executar como administrador”; o escopo --user não remove a elevação do processo.';
        failures.push({ id: ids[i], error: message });
        send('error', message);
        send('progress', { current: i + 1, total: ids.length, id: ids[i] });
        continue;
      }
      try {
        await new Promise((resolve, reject) => {
          const output = [];
          const args = ['install', '--id', ids[i], '-e', '--silent', '--accept-package-agreements', '--accept-source-agreements'];
          if (packages[i]?.source === 'msstore') args.push('--source', 'msstore');
          if (ids[i].toLowerCase() === 'spotify.spotify') args.push('--scope', 'user');
          const child = spawn('winget.exe', args, { windowsHide: true, shell: false });
          child.stdout.on('data', chunk => { output.push(chunk.toString()); send('stdout', chunk); });
          child.stderr.on('data', chunk => { output.push(chunk.toString()); send('stderr', chunk); });
          child.on('error', reject);
          child.on('close', code => {
            if (code === 0) { resolve(); return; }
            const unsignedCode = Number(code) >>> 0;
            const hresult = `0x${unsignedCode.toString(16).toUpperCase().padStart(8, '0')}`;
            const installerCode = output.join('').match(/Installer failed with exit code:\s*(\d+)/i)?.[1];
            const spotifyHint = ids[i].toLowerCase() === 'spotify.spotify' && installerCode
              ? ` O instalador do Spotify encerrou com código ${installerCode}. Feche qualquer processo do Spotify e tente novamente com o SetupMaster aberto na sessão normal do usuário, sem “Executar como administrador”. Se persistir, consulte os logs do WinGet em %LOCALAPPDATA%\\Packages\\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe\\LocalState\\DiagOutputDir.`
              : '';
            reject(new Error(`Falha ao instalar ${ids[i]}: WinGet retornou ${hresult}.${spotifyHint}`));
          });
        });
        send('stdout', `\n✓ ${ids[i]} instalado.\n`);
      } catch (error) {
        failures.push({ id: ids[i], error: error.message });
        send('error', error.message);
      }
      send('progress', { current: i + 1, total: ids.length, id: ids[i] });
    }
    const summary = `${ids.length - skipped - failures.length} instalado(s), ${skipped} já instalado(s) ignorado(s), ${failures.length} falha(s).`;
    send(failures.length ? 'error' : 'done', summary);
    return { ok: failures.length === 0, failures, skipped, summary };
  } finally { installing = false; }
});

ipcMain.handle('download-bat-backup', async (_event, apps) => {
  const packages = (Array.isArray(apps) ? apps : []).map(item => typeof item === 'string' ? { wingetId: item } : item).filter(item => typeof item?.wingetId === 'string' && /^[\w.+-]+$/.test(item.wingetId));
  if (!packages.length) throw new Error('Selecione pelo menos um aplicativo com ID winget válido.');
  const lines = ['@echo off', 'setlocal', 'title SetupMaster - Backup', 'echo SetupMaster - instalacao de aplicativos', ''];
  packages.forEach(item => {
    const id=item.wingetId;
    const source=item.source==='msstore'?' --source msstore':'';
    lines.push(`echo Instalando ${id}...`, `winget install --id "${id}" -e${source} --silent --accept-package-agreements --accept-source-agreements`, 'if errorlevel 1 (', `  echo ERRO: falha ao instalar ${id} com codigo %ERRORLEVEL%`, ') else (', `  echo OK: ${id} instalado`, ')', '');
  });
  lines.push('echo Processo finalizado.', 'pause', 'endlocal');
  const result = await dialog.showSaveDialog(win, { title: 'Salvar backup de instalação', defaultPath: 'SetupMaster-Backup.bat', filters: [{ name: 'Arquivo BAT', extensions: ['bat'] }] });
  if (result.canceled || !result.filePath) return { canceled: true };
  require('node:fs').writeFileSync(result.filePath, '\ufeff' + lines.join('\r\n'), 'utf8');
  return { ok: true, path: result.filePath };
});

ipcMain.handle('open-external-url', async (_event, url) => {
  let parsed;
  try { parsed = new URL(url); } catch { throw new Error('URL inválida.'); }
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Somente links HTTP/HTTPS podem ser abertos.');
  await shell.openExternal(parsed.href);
});

ipcMain.handle('search-winget', async (_event, query) => {
  if (process.platform !== 'win32') throw new Error('A busca WinGet está disponível apenas no Windows.');
  if (typeof query !== 'string' || !query.trim() || query.length > 120) throw new Error('Digite o nome do aplicativo.');
  return new Promise((resolve, reject) => {
    const child=spawn('winget.exe',['search','--query',query.trim(),'--accept-source-agreements','--disable-interactivity'],{windowsHide:true,shell:false});
    let output='', error='';
    child.stdout.on('data',chunk=>output+=chunk.toString());
    child.stderr.on('data',chunk=>error+=chunk.toString());
    child.on('error',()=>reject(new Error('Não foi possível iniciar o WinGet. Confira se ele está instalado.')));
    child.on('close',code=>{
      if(code!==0) return reject(new Error(error.trim()||'O WinGet não encontrou resultados.'));
      const lines=output.split(/\r?\n/), header=lines.findIndex(line=>/^\s*Name\s+Id\s+Version\b/i.test(line));
      if(header<0) return resolve([]);
      const columns=lines[header].match(/\S+/g)||[], idStart=lines[header].indexOf(columns[1]), versionStart=lines[header].indexOf(columns[2]);
      const results=lines.slice(header+2).filter(line=>line.trim()&&!/^\s*-{3,}/.test(line)).map(line=>({name:line.slice(0,idStart).trim(),wingetId:line.slice(idStart,versionStart).trim(),version:line.slice(versionStart).trim()})).filter(item=>item.name&&/^[\w.+-]+$/.test(item.wingetId)).slice(0,30);
      resolve(results);
    });
  });
});

ipcMain.handle('download-custom-app', async (_event, { url, name }) => {
  let parsed;
  try { parsed=new URL(url); } catch { throw new Error('URL de download inválida.'); }
  if(!['https:','http:'].includes(parsed.protocol)) throw new Error('Somente links HTTP/HTTPS podem ser baixados.');
  const result=await dialog.showSaveDialog(win,{title:'Salvar instalador',defaultPath:path.join(app.getPath('downloads'),`${String(name||'aplicativo').replace(/[<>:"/\\|?*]/g,'_')}${path.extname(parsed.pathname)||'.download'}`)});
  if(result.canceled||!result.filePath)return {canceled:true};
  const response=await fetch(parsed.href,{redirect:'follow'});
  if(!response.ok||!response.body)throw new Error(`Download falhou: HTTP ${response.status}.`);
  const finalUrl=new URL(response.url);
  if(!['https:','http:'].includes(finalUrl.protocol))throw new Error('O destino do download não é permitido.');
  await pipeline(Readable.fromWeb(response.body),fs.createWriteStream(result.filePath));
  return {ok:true,path:result.filePath};
});

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function groqRequest(url, apiKey, options = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${apiKey}` }
    });
    const raw = await response.text();
    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch {}
    if (response.ok) return body;

    const apiError = body.error || {};
    const details = Array.isArray(apiError.details) ? apiError.details : [];
    const retryInfo = details.find(item => String(item['@type'] || '').includes('RetryInfo'));
    const retryDelay = String(retryInfo?.retryDelay || '').match(/^(\d+(?:\.\d+)?)s$/);
    const delayMs = Math.min(3000, retryDelay ? Number(retryDelay[1]) * 1000 : 1200 * (attempt + 1));
    const detail = apiError.message || response.statusText || 'Sem detalhes fornecidos pela API.';

    if (response.status === 429) {
      const retryHeader = Number(response.headers.get('retry-after'));
      const retryMs = Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader * 1000 : delayMs;
      if (attempt === 0 && retryMs <= 3000) { await wait(retryMs); continue; }
      throw new Error(`Groq HTTP 429: ${detail} Aguarde o período indicado pela Groq e verifique os limites da sua conta.`);
    }
    if (response.status === 401) throw new Error('A chave da Groq foi recusada. Confira a chave nas Preferências.');
    if (response.status === 402) throw new Error(`Groq HTTP 402: ${detail} Confira o saldo e o plano da conta Groq.`);
    throw new Error(`Groq HTTP ${response.status}: ${detail}`);
  }
  throw new Error('A Groq não respondeu após a tentativa de repetição.');
}

ipcMain.handle('groq-search', async (_event, { query, apiKey }) => {
  if (typeof query !== 'string' || !query.trim() || query.length > 160) throw new Error('Informe um nome de aplicativo válido.');
  if (typeof apiKey !== 'string' || !apiKey.trim() || apiKey.length > 300) throw new Error('Configure sua chave da Groq nas Preferências.');
  const payload = await groqRequest('https://api.groq.com/openai/v1/chat/completions', apiKey, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: 'Pesquise aplicativos para Windows usando Browser Search. Confira IDs de pacote no catálogo oficial Microsoft winget e use páginas oficiais do fornecedor para links. Nunca invente um Winget ID. Responda somente com um objeto JSON válido, sem Markdown, com os campos name, category, wingetId, downloadUrl, description e sources. Se não tiver evidência confiável para um valor, use null; sources deve ser uma lista de objetos title e url.' },
        { role: 'user', content: `Pesquise o aplicativo Windows: ${query.trim()}. Verifique nome oficial, categoria, Winget ID exato e página oficial de download.` }
      ],
      tools: [{ type: 'browser_search' }],
      tool_choice: 'required',
      temperature: 0.2,
      max_completion_tokens: 2048,
      reasoning_effort: 'low',
      stream: false
    })
  });
  const text = payload.choices?.[0]?.message?.content || '';
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('A Groq respondeu sem um resultado JSON reconhecível. Tente uma busca mais específica.');
  let parsed;
  try { parsed = JSON.parse(text.slice(start, end + 1)); } catch { throw new Error('A Groq retornou um resultado que não pôde ser lido como JSON. Tente novamente.'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('O formato do resultado Groq é inválido.');
  if (parsed.wingetId && (typeof parsed.wingetId !== 'string' || !/^[\w.+-]+$/.test(parsed.wingetId))) parsed.wingetId = null;
  if (parsed.downloadUrl) {
    try { const parsedUrl = new URL(parsed.downloadUrl); if (!['https:', 'http:'].includes(parsedUrl.protocol)) parsed.downloadUrl = null; }
    catch { parsed.downloadUrl = null; }
  }
  parsed.sources = Array.isArray(parsed.sources) ? parsed.sources.filter(source => source && typeof source.title === 'string' && typeof source.url === 'string' && /^https?:\/\//i.test(source.url)).slice(0, 4) : [];
  return parsed;
});

ipcMain.handle('groq-test', async (_event, apiKey) => {
  if (typeof apiKey !== 'string' || !apiKey.trim() || apiKey.length > 300) throw new Error('Cole uma chave da Groq válida para testar.');
  await groqRequest('https://api.groq.com/openai/v1/models', apiKey);
  return { ok: true };
});

function sanitizeList(input) {
  const name = typeof input?.name === 'string' ? input.name.trim().slice(0, 80) : '';
  if (!name) throw new Error('O arquivo não contém um nome de lista válido.');
  if (!Array.isArray(input.apps) || input.apps.length > 200) throw new Error('A lista precisa conter até 200 aplicativos.');
  const apps = [];
  const seen = new Set();
  for (const entry of input.apps) {
    if (!entry || typeof entry.name !== 'string') continue;
    const appName = entry.name.trim().slice(0, 120);
    if (!appName || seen.has(appName.toLowerCase())) continue;
    const wingetId = typeof entry.wingetId === 'string' && /^[\w.+-]{1,128}$/.test(entry.wingetId) ? entry.wingetId : '';
    const source = entry.source === 'msstore' ? 'msstore' : undefined;
    let downloadUrl = '';
    if (typeof entry.downloadUrl === 'string') {
      try { const url = new URL(entry.downloadUrl); if (['http:', 'https:'].includes(url.protocol)) downloadUrl = url.href; } catch {}
    }
    if (!wingetId && !downloadUrl) continue;
    const color = typeof entry.color === 'string' && /^[0-9a-f]{6}$/i.test(entry.color) ? entry.color : '60a5fa';
    apps.push({
      name: appName,
      category: typeof entry.category === 'string' ? entry.category.trim().slice(0, 64) || 'Personalizados' : 'Personalizados',
      wingetId,
      ...(source ? { source } : {}),
      downloadUrl,
      downloadMode: entry.downloadMode === 'direct' ? 'direct' : 'page',
      icon: typeof entry.icon === 'string' && /^[a-z0-9-]{1,40}$/.test(entry.icon) ? entry.icon : '',
      mark: typeof entry.mark === 'string' ? entry.mark.trim().slice(0, 4) : appName.slice(0, 2).toUpperCase(),
      color
    });
    seen.add(appName.toLowerCase());
  }
  return { schema: 'setupmaster-list', version: 1, name, apps };
}

ipcMain.handle('export-list', async (_event, input) => {
  const list = sanitizeList(input);
  const result = await dialog.showSaveDialog(win, {
    title: 'Exportar lista do SetupMaster',
    defaultPath: `${list.name.replace(/[<>:"/\\|?*]/g, '_')}.setupmaster.json`,
    filters: [{ name: 'Lista SetupMaster (JSON)', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  require('node:fs').writeFileSync(result.filePath, JSON.stringify(list, null, 2), 'utf8');
  return { ok: true, path: result.filePath };
});

ipcMain.handle('import-list', async () => {
  const result = await dialog.showOpenDialog(win, {
    title: 'Importar lista do SetupMaster',
    properties: ['openFile'],
    filters: [{ name: 'Lista SetupMaster (JSON)', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePaths?.[0]) return { canceled: true };
  let contents;
  try { contents = JSON.parse(require('node:fs').readFileSync(result.filePaths[0], 'utf8')); }
  catch { throw new Error('Não foi possível ler o JSON. Escolha um arquivo de lista SetupMaster válido.'); }
  if (contents.schema !== 'setupmaster-list' || contents.version !== 1) throw new Error('Formato não reconhecido. Importe um JSON exportado pelo SetupMaster.');
  return { ok: true, list: sanitizeList(contents) };
});
