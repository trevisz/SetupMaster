const catalog = [
  ['Launchers de jogos','Steam','Valve.Steam','S','a78bfa'],['Launchers de jogos','Epic Games Launcher','EpicGames.EpicGamesLauncher','E','a78bfa'],['Launchers de jogos','EA app','ElectronicArts.EADesktop','EA','a78bfa'],['Launchers de jogos','Ubisoft Connect','Ubisoft.Connect','U','a78bfa'],['Launchers de jogos','GOG Galaxy','GOG.Galaxy','G','a78bfa'],['Launchers de jogos','Battle.net','Blizzard.BattleNet','B','a78bfa'],['Launchers de jogos','Riot Client','RiotGames.LeagueOfLegends','R','a78bfa'],['Launchers de jogos','Xbox','Microsoft.GamingApp','X','a78bfa'],
  ['Drivers e periféricos','AMD Software: Adrenalin Edition','AdvancedMicroDevicesInc.AMDRadeonSoftware','A','fb923c'],['Drivers e periféricos','NVIDIA App','Nvidia.GeForceExperience','N','fb923c'],['Drivers e periféricos','Logitech G HUB','Logitech.GHUB','L','fb923c'],['Drivers e periféricos','SteelSeries GG','SteelSeries.GG','S','fb923c'],['Drivers e periféricos','Razer Synapse 4','RazerInc.RazerInstaller.Synapse4','R','fb923c'],['Drivers e periféricos','Redragon Lamia H320 (driver)','','R','fb923c'],
  ['Comunicação','Discord','Discord.Discord','D','60a5fa'],['Comunicação','Telegram','Telegram.TelegramDesktop','T','60a5fa'],['Comunicação','WhatsApp','WhatsApp.WhatsApp','W','60a5fa'],['Comunicação','Zoom Workplace','Zoom.Zoom','Z','60a5fa'],
  ['Entretenimento','Spotify','9NCBCSZSJRSB','S','60a5fa'],['Entretenimento','OBS Studio','OBSProject.OBSStudio','O','60a5fa'],['Entretenimento','VLC media player','VideoLAN.VLC','V','60a5fa'],['Entretenimento','Audacity','Audacity.Audacity','A','60a5fa'],['Entretenimento','foobar2000','PeterPawlowski.foobar2000','F','60a5fa'],['Entretenimento','Plex Media Server','Plex.PlexMediaServer','P','60a5fa'],
  ['Utilitários','WinRAR','RARLab.WinRAR','R','34d399'],['Utilitários','7-Zip','7zip.7zip','7','34d399'],['Utilitários','Visual C++ Redistributable','Microsoft.VCRedist.2015+.x64','C++','34d399'],['Utilitários','DirectX Runtime','Microsoft.DirectX','DX','34d399'],['Utilitários','MSI Afterburner','Guru3D.Afterburner','M','34d399'],['Utilitários','Everything','voidtools.Everything','E','34d399'],['Utilitários','TreeSize Free','JAMSoftware.TreeSize.Free','T','34d399'],['Utilitários','SpaceSniffer','UderzoSoftware.SpaceSniffer','S','34d399'],['Utilitários','CrystalDiskInfo','CrystalDewWorld.CrystalDiskInfo','C','34d399'],['Utilitários','HWMonitor','CPUID.HWMonitor','H','34d399'],['Utilitários','CPU-Z','CPUID.CPU-Z','C','34d399'],['Utilitários','GPU-Z','TechPowerUp.GPU-Z','G','34d399'],
  ['Navegadores','Google Chrome','Google.Chrome','C','22d3ee'],['Navegadores','Mozilla Firefox','Mozilla.Firefox','F','22d3ee'],['Navegadores','Opera','Opera.Opera','O','22d3ee'],['Navegadores','Opera GX','Opera.OperaGX','O','22d3ee'],['Navegadores','Brave','Brave.Brave','B','22d3ee'],['Navegadores','Microsoft Edge','Microsoft.Edge','E','22d3ee'],
  ['Adobe','Adobe Creative Cloud','Adobe.CreativeCloud','A','f472b6'],['Adobe','Adobe Acrobat Reader','Adobe.Acrobat.Reader.64-bit','A','f472b6'],
  ['Desenvolvimento','Visual Studio Code','Microsoft.VisualStudioCode','VS','22d3ee'],['Desenvolvimento','JetBrains Toolbox','JetBrains.Toolbox','J','22d3ee'],['Desenvolvimento','IntelliJ IDEA Community','JetBrains.IntelliJIDEA.Community','I','22d3ee'],['Desenvolvimento','PyCharm Community','JetBrains.PyCharm.Community','P','22d3ee'],['Desenvolvimento','Python 3','Python.Python.3.13','Py','22d3ee'],['Desenvolvimento','Git','Git.Git','G','22d3ee'],['Desenvolvimento','Docker Desktop','Docker.DockerDesktop','D','22d3ee'],['Desenvolvimento','Node.js LTS','OpenJS.NodeJS.LTS','N','22d3ee'],['Desenvolvimento','PowerToys','Microsoft.PowerToys','P','22d3ee']
].map(([category,name,wingetId,mark,color])=>({category,name,wingetId,mark,color}));
catalog.find(app=>app.name==='Redragon Lamia H320 (driver)').downloadUrl='https://solidpower.cloudstorage.pw/SoftwaresRedragon/Headsets/Redragon%20Lamia%20H320%20Headset.7z';
catalog.find(app=>app.name==='Redragon Lamia H320 (driver)').downloadMode='direct';
catalog.find(app=>app.name==='Spotify').source='msstore';
const brandIcons={'Steam':'steam','Epic Games Launcher':'epic','EA app':'ea','Ubisoft Connect':'ubisoft','GOG Galaxy':'gog','Battle.net':'battlenet','AMD Software: Adrenalin Edition':'amd','NVIDIA App':'nvidia','SteelSeries GG':'steelseries','Discord':'discord','Telegram':'telegram','WhatsApp':'whatsapp','Spotify':'spotify','OBS Studio':'obs','VLC':'vlc','7-Zip':'7zip','Git':'git','Docker Desktop':'docker','Node.js LTS':'nodejs','Google Chrome':'chrome','Mozilla Firefox':'firefox'};
catalog.forEach(app=>{app.icon=brandIcons[app.name]||''});
const presets = {
  'Essencial':['Google Chrome','Mozilla Firefox','7-Zip','Discord','Spotify','Visual C++ Redistributable'],
  'Gamer Pro':['Steam','Epic Games Launcher','Discord','Spotify','NVIDIA App','MSI Afterburner','7-Zip'],
  'Dev Tools':['Visual Studio Code','Git','Docker Desktop','Node.js LTS','Google Chrome']
};
const $ = selector => document.querySelector(selector);
$('#searchGroq').insertAdjacentHTML('beforebegin','<button id="searchWinget" class="rounded-lg border border-white/10 bg-white/5 px-3 text-xs whitespace-nowrap">Pesquisar WinGet</button>');
$('#aiResult').insertAdjacentHTML('afterend','<div id="wingetResults" class="scroll max-h-36 overflow-y-auto mt-2"></div>');
$('#manualUrl').closest('label').insertAdjacentHTML('afterend','<label class="text-xs text-slate-400 col-span-2">Ação do link<select id="manualDownloadMode" class="input block w-full rounded-lg px-3 py-2 mt-1.5 text-sm"><option value="page">Página de suporte: abrir no navegador</option><option value="direct">Arquivo direto: baixar no computador</option></select></label>');
$('#settingsModal h2').closest('div').parentElement.insertAdjacentHTML('afterend','<label class="block text-xs text-slate-400 mt-5 mb-2">Tema do aplicativo<select id="themeSelect" class="input rounded-lg w-full px-3 py-2 mt-1.5 text-sm"><option value="midnight">Midnight Blue</option><option value="graphite">Grafite</option><option value="emerald">Neon Emerald</option><option value="violet">Violet Gamer</option><option value="crimson">Crimson Arena</option></select></label>');
const read = (key, fallback) => { try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };
function migrateSpotifySource(app) {
  if(app&&app.wingetId==='Spotify.Spotify'&&/spotify/i.test(app.name||'')){app.wingetId='9NCBCSZSJRSB';app.source='msstore'}
  return app;
}
function iconFor(name='') {
  const key=Object.keys(brandIcons).find(label=>label.toLowerCase()===String(name).trim().toLowerCase());
  const aliases={'chrome':'chrome','firefox':'firefox','spotify music':'spotify','steam client':'steam','discord app':'discord'};
  return brandIcons[key]||aliases[String(name).trim().toLowerCase()]||'';
}
const availableIcons=new Set(Object.values(brandIcons));
const catalogByName=new Map(catalog.map(app=>[app.name.toLowerCase(),app]));
const catalogById=new Map(catalog.filter(app=>app.wingetId).map(app=>[app.wingetId.toLowerCase(),app]));
const legacyNames={'vlc':'VLC media player','redragon (site oficial)':'Redragon Lamia H320 (driver)'};
function normalizeApp(app) {
  migrateSpotifySource(app);
  if(!app)return app;
  const legacy=legacyNames[String(app.name||'').toLowerCase()];if(legacy)app.name=legacy;
  const standard=(app.wingetId&&catalogById.get(app.wingetId.toLowerCase()))||catalogByName.get(String(app.name||'').toLowerCase());
  if(standard){app.name=standard.name;app.category=standard.category;app.wingetId=standard.wingetId;app.source=standard.source||app.source;app.icon=standard.icon||app.icon;app.mark=standard.mark;app.color=standard.color;app.downloadUrl=app.downloadUrl||standard.downloadUrl;app.downloadMode=app.downloadMode||standard.downloadMode}
  if(!availableIcons.has(app.icon))app.icon=iconFor(app.name);
  return app;
}
const storedValue=read('sm-apps',[]), storedApps=Array.isArray(storedValue)?storedValue:[];
const standardKeys=new Set([...catalog.flatMap(app=>[app.name.toLowerCase(),app.wingetId&&app.wingetId.toLowerCase()].filter(Boolean)),...Object.keys(legacyNames)]);
let apps=catalog.map(standard=>{const saved=storedApps.find(item=>item&&(item.wingetId?.toLowerCase()===standard.wingetId?.toLowerCase()||item.name?.toLowerCase()===standard.name.toLowerCase()));return normalizeApp({...saved,...standard,downloadUrl:saved?.downloadUrl||standard.downloadUrl,downloadMode:saved?.downloadMode||standard.downloadMode})});
for(const saved of storedApps){if(!saved)continue;const key=saved.wingetId?.toLowerCase()||saved.name?.toLowerCase();if(!standardKeys.has(key)){const app=normalizeApp(saved);if(!apps.some(item=>item.name.toLowerCase()===app.name.toLowerCase()))apps.push(app)}}
const savedQueue=read('sm-queue',[]);
const queue = new Set((Array.isArray(savedQueue)?savedQueue:[]).map(name=>legacyNames[String(name).toLowerCase()]||name));
const storedLists=read('sm-lists', []);
let lists = (Array.isArray(storedLists)?storedLists:[]).filter(list=>list&&typeof list.id==='string'&&typeof list.name==='string'&&Array.isArray(list.apps)).map(list=>({...list,apps:list.apps.map(normalizeApp)}));
let category = 'Todos';
let page = 'catalog';
let installing = false;
let editingListId = null;
let selectedListApps = new Set();
let theme=localStorage.getItem('sm-theme')||'midnight';
localStorage.removeItem('sm-gemini-key');

function esc(value='') { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function persist() { localStorage.setItem('sm-apps', JSON.stringify(apps)); localStorage.setItem('sm-queue', JSON.stringify([...queue])); localStorage.setItem('sm-lists', JSON.stringify(lists)); render(); }
function setModal(modal, visible) { $(modal).classList.toggle('hidden', !visible); $(modal).classList.toggle('modal-open', visible); }
function selectedApps() { return apps.filter(app => queue.has(app.name)); }
function setKeyStatus() { const hasKey=Boolean(localStorage.getItem('sm-groq-key')); $('#aiStatus').textContent=hasKey?'Groq ativa':'IA desligada'; $('#aiStatus').className=`ml-auto text-[10px] ${hasKey?'text-emerald-400':'text-slate-600'}`; $('#keyStatus').textContent=hasKey?'Chave Groq salva neste perfil':'Nenhuma chave Groq configurada'; }
function renderLists() {
  $('#customLists').innerHTML=lists.length?lists.map(list=>`<div class="flex items-center gap-0.5 px-1 py-0.5"><button class="load-list min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-xs text-slate-400 hover:bg-white/5 hover:text-white" data-id="${esc(list.id)}" title="Carregar ${esc(list.name)} na fila">▤ <span class="ml-1">${esc(list.name)}</span><span class="ml-1 text-slate-600">${list.apps.length}</span></button><button class="edit-list rounded px-1 py-1 text-xs text-slate-600 hover:text-white" data-id="${esc(list.id)}" title="Editar lista">✎</button><button class="export-list rounded px-1 py-1 text-xs text-slate-600 hover:text-blue-300" data-id="${esc(list.id)}" title="Exportar JSON">↗</button><button class="delete-list rounded px-1 py-1 text-xs text-slate-600 hover:text-rose-300" data-id="${esc(list.id)}" title="Excluir lista">×</button></div>`).join(''):'<div class="px-3 py-1 text-[11px] text-slate-600">Crie ou importe sua primeira lista.</div>';
  document.querySelectorAll('.load-list').forEach(button=>button.onclick=()=>loadList(button.dataset.id));
  document.querySelectorAll('.edit-list').forEach(button=>button.onclick=()=>openListEditor(lists.find(list=>list.id===button.dataset.id)));
  document.querySelectorAll('.export-list').forEach(button=>button.onclick=()=>exportList(button.dataset.id));
  document.querySelectorAll('.delete-list').forEach(button=>button.onclick=()=>deleteList(button.dataset.id));
}
function renderCategories() {
  const categories=['Todos',...new Set(apps.map(app=>app.category))];
  $('#categories').innerHTML=categories.map(item=>`<button class="category-chip border border-white/5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${category===item?'selected':'bg-white/5 text-slate-400'}">${esc(item)}</button>`).join('');
  document.querySelectorAll('.category-chip').forEach(button=>button.onclick=()=>{category=button.textContent;render()});
}
function cardMarkup(app) {
  const inQueue=queue.has(app.name), canInstall=Boolean(app.wingetId);
  const action=canInstall
    ? `<button class="toggle w-8 h-8 rounded-lg ${inQueue?'bg-blue-500 text-white':'bg-white/5 text-slate-400 hover:bg-white/10'}" data-name="${esc(app.name)}" title="${inQueue?'Remover da fila':'Adicionar à fila'}">${inQueue?'✓':'＋'}</button>`
    : app.downloadUrl ? `<button class="${app.downloadMode==='direct'?'download-custom':'open-download'} px-2.5 py-2 rounded-lg border border-white/10 text-[11px] text-slate-300 hover:bg-white/10" data-name="${esc(app.name)}">${app.downloadMode==='direct'?'Baixar arquivo ↓':'Abrir site ↗'}</button>` : '<span class="text-[10px] text-slate-500">ID indisponível</span>';
  const openLink=canInstall&&app.downloadUrl?`<button class="open-download ml-1 w-8 h-8 rounded-lg text-slate-500 hover:text-blue-300 hover:bg-white/5" data-name="${esc(app.name)}" title="Abrir site oficial">↗</button>`:'';
  const sourceLabel=app.source==='msstore'?'Microsoft Store':app.wingetId;
  const logo=app.icon?`<img class="app-logo w-6 h-6" src="assets/icons/${esc(app.icon)}.svg" alt="">`:`<span class="font-semibold text-xs">${esc(app.mark||app.name.slice(0,2).toUpperCase())}</span>`;
  return `<article class="app-card glass rounded-xl p-4 flex gap-3 items-center"><div class="app-mark w-10 h-10 rounded-xl grid place-items-center shrink-0" style="color:#${esc(app.color||'60a5fa')}">${logo}</div><div class="min-w-0 flex-1"><div class="font-medium text-sm truncate">${esc(app.name)}</div><div class="text-xs text-slate-500 truncate">${esc(app.category)}${canInstall?' · '+esc(sourceLabel):' · link direto'}</div></div><div class="flex items-center">${action}${openLink}</div></article>`;
}
function render() {
  document.body.dataset.theme=theme;
  renderCategories();
  renderLists();
  $('#queueCount').textContent=queue.size;
  $('#selectedText').textContent=`${queue.size} ${queue.size===1?'aplicativo selecionado':'aplicativos selecionados'}`;
  const query=$('#filter').value.trim().toLowerCase();
  const filtered=apps.filter(app=>(page==='queue'?queue.has(app.name):true)&&(category==='Todos'||category===app.category)&&(`${app.name} ${app.category} ${app.wingetId}`.toLowerCase().includes(query)));
  $('#appGrid').innerHTML=filtered.length?filtered.map(cardMarkup).join(''):'<div class="col-span-full text-center text-sm text-slate-500 py-16">Nenhum aplicativo encontrado.</div>';
  document.querySelectorAll('.toggle').forEach(button=>button.onclick=()=>{const name=button.dataset.name;queue.has(name)?queue.delete(name):queue.add(name);persist()});
  document.querySelectorAll('.open-download').forEach(button=>button.onclick=async()=>{const app=apps.find(item=>item.name===button.dataset.name);if(app?.downloadUrl)try{await window.electronAPI.openUrl(app.downloadUrl)}catch(error){log(error.message,'error')}});
  document.querySelectorAll('.download-custom').forEach(button=>button.onclick=async()=>{const app=apps.find(item=>item.name===button.dataset.name);try{const result=await window.electronAPI.downloadCustomApp(app.downloadUrl,app.name);if(result.ok)log(`Download salvo em ${result.path}. Extraia o arquivo e abra o instalador.`)}catch(error){log(error.message,'error')}});
}
function renderListEditorApps() {
  const query=$('#listSearch').value.trim().toLowerCase();
  const filtered=apps.filter(app=>`${app.name} ${app.category} ${app.wingetId}`.toLowerCase().includes(query));
  $('#listApps').innerHTML=filtered.length?filtered.map(app=>`<label class="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer"><input class="list-app-check accent-blue-500" type="checkbox" value="${esc(app.name)}" ${selectedListApps.has(app.name)?'checked':''}><span class="app-mark w-7 h-7 rounded-lg grid place-items-center text-[10px] font-semibold" style="color:#${esc(app.color||'60a5fa')}">${app.icon?`<img class="app-logo w-4 h-4" src="assets/icons/${esc(app.icon)}.svg" alt="">`:esc(app.mark||app.name.slice(0,2).toUpperCase())}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs text-slate-200">${esc(app.name)}</span><span class="block truncate text-[10px] text-slate-500">${esc(app.category)}${app.wingetId?' · '+esc(app.wingetId):' · link/site'}</span></span></label>`).join(''):'<div class="px-3 py-6 text-center text-xs text-slate-500">Nenhum app corresponde à busca.</div>';
  $('#listSelectionCount').textContent=`${selectedListApps.size} selecionado(s)`;
  document.querySelectorAll('.list-app-check').forEach(input=>input.onchange=()=>{input.checked?selectedListApps.add(input.value):selectedListApps.delete(input.value);$('#listSelectionCount').textContent=`${selectedListApps.size} selecionado(s)`});
}
function openListEditor(list=null) {
  editingListId=list?.id||null;selectedListApps=new Set((list?.apps||[]).map(app=>app.name));
  $('#listModalTitle').textContent=list?'Editar lista':'Criar lista';$('#listName').value=list?.name||'';$('#listSearch').value='';$('#listFeedback').textContent='';
  renderListEditorApps();setModal('#listModal',true);$('#listName').focus();
}
function loadList(id) {
  const list=lists.find(item=>item.id===id);if(!list)return;
  for(const item of list.apps){
    const current=apps.find(app=>app.name.toLowerCase()===item.name.toLowerCase());
    const merged=normalizeApp({...(current||{}),...item});
    apps=apps.filter(app=>app.name.toLowerCase()!==item.name.toLowerCase());apps.push(merged);
    if(merged.wingetId)queue.add(merged.name);
  }
  persist();document.querySelector('[data-page="queue"]').click();
  log(`Lista “${list.name}” carregada. ${list.apps.filter(app=>app.wingetId).length} app(s) com Winget ID estão na fila.`);
}
async function exportList(id) {
  const list=lists.find(item=>item.id===id);if(!list)return;
  try{const result=await window.electronAPI.exportList({name:list.name,apps:list.apps});if(result.ok)log(`Lista “${list.name}” exportada para ${result.path}.`)}catch(error){log(error.message,'error')}
}
function deleteList(id) {
  const list=lists.find(item=>item.id===id);if(!list)return;
  if(!window.confirm(`Excluir a lista “${list.name}”? Os aplicativos do catálogo não serão removidos.`))return;
  lists=lists.filter(item=>item.id!==id);persist();log(`Lista “${list.name}” removida.`);
}
function log(message,type='info') { const line=document.createElement('div'); line.className=type==='stderr'||type==='error'?'text-rose-400':type==='done'?'text-emerald-400':'text-slate-400'; line.textContent=typeof message==='string'?message:JSON.stringify(message); $('#terminal').append(line); $('#terminal').scrollTop=$('#terminal').scrollHeight; }
function showSettings() { $('#apiKey').value=localStorage.getItem('sm-groq-key')||''; $('#apiKey').type='password'; $('#toggleKey').textContent='Mostrar'; $('#settingsFeedback').textContent=''; $('#themeSelect').value=theme; setKeyStatus(); setModal('#settingsModal',true); }
function applyTheme(value){theme=value;localStorage.setItem('sm-theme',theme);render()}

document.querySelectorAll('[data-window]').forEach(button=>button.onclick=()=>window.electronAPI.controlWindow(button.dataset.window));
document.querySelectorAll('[data-page]').forEach(button=>button.onclick=()=>{page=button.dataset.page;category='Todos';$('#pageTitle').textContent=page==='queue'?'Minha fila':'Monte seu setup';$('#pageSubtitle').textContent=page==='queue'?'Revise os aplicativos selecionados antes de instalar.':'Escolha os aplicativos para montar seu novo Windows.';document.querySelectorAll('[data-page]').forEach(item=>item.classList.toggle('nav-active',item===button));render()});
document.querySelectorAll('.preset').forEach(button=>button.onclick=()=>{for(const name of presets[button.dataset.preset]||[])queue.add(name);persist();log(`Preset ${button.dataset.preset} adicionado à fila.`)});
$('#filter').addEventListener('input',render);
$('#addApp').onclick=()=>{setModal('#modal',true);$('#aiResult').textContent='';$('#searchName').focus()};
$('#closeModal').onclick=$('#cancelModal').onclick=()=>setModal('#modal',false);
$('#settingsButton').onclick=showSettings;
$('#themeSelect').onchange=()=>{theme=$('#themeSelect').value;localStorage.setItem('sm-theme',theme);render()};
$('#createList').onclick=()=>openListEditor();
$('#closeListModal').onclick=$('#cancelList').onclick=()=>setModal('#listModal',false);
$('#listModal').addEventListener('click',event=>{if(event.target.id==='listModal')setModal('#listModal',false)});
$('#listSearch').addEventListener('input',renderListEditorApps);
$('#saveList').onclick=()=>{
  const name=$('#listName').value.trim();
  if(!name){$('#listFeedback').textContent='Digite um nome para a lista.';return}
  if(!selectedListApps.size){$('#listFeedback').textContent='Selecione pelo menos um aplicativo.';return}
  const conflict=lists.find(list=>list.name.toLowerCase()===name.toLowerCase()&&list.id!==editingListId);
  if(conflict){$('#listFeedback').textContent='Já existe uma lista com esse nome. Escolha outro.';return}
  const record={id:editingListId||globalThis.crypto?.randomUUID?.()||`list-${Date.now()}-${Math.random().toString(16).slice(2)}`,name,apps:apps.filter(app=>selectedListApps.has(app.name)).map(app=>({...app}))};
  const index=lists.findIndex(list=>list.id===record.id);if(index>=0)lists[index]=record;else lists.push(record);
  persist();setModal('#listModal',false);log(`Lista “${name}” salva com ${record.apps.length} app(s).`);
};
$('#importList').onclick=async()=>{
  try{
    const result=await window.electronAPI.importList();if(!result.ok)return;
    const incoming=result.list;let id=globalThis.crypto?.randomUUID?.()||`list-${Date.now()}`;
    const existing=lists.find(list=>list.name.toLowerCase()===incoming.name.toLowerCase());
    if(existing){if(!window.confirm(`Já existe uma lista chamada “${incoming.name}”. Substituir pelo arquivo importado?`))return;id=existing.id;}
    for(const item of incoming.apps)if(!apps.some(app=>app.name.toLowerCase()===item.name.toLowerCase()))apps.push(normalizeApp(item));
    const record={...incoming,id};if(existing)lists=lists.map(list=>list.id===existing.id?record:list);else lists.push(record);
    persist();log(`Lista “${record.name}” importada com ${record.apps.length} app(s).`);
  }catch(error){log(`Falha ao importar JSON: ${error.message}`,'error')}
};
$('#closeSettings').onclick=()=>setModal('#settingsModal',false);
$('#settingsModal').addEventListener('click',event=>{if(event.target.id==='settingsModal')setModal('#settingsModal',false)});
$('#modal').addEventListener('click',event=>{if(event.target.id==='modal')setModal('#modal',false)});
$('#toggleKey').onclick=()=>{const field=$('#apiKey');field.type=field.type==='password'?'text':'password';$('#toggleKey').textContent=field.type==='password'?'Mostrar':'Ocultar'};
$('#saveKey').onclick=()=>{const key=$('#apiKey').value.trim();if(key)localStorage.setItem('sm-groq-key',key);else localStorage.removeItem('sm-groq-key');$('#settingsFeedback').textContent=key?'Chave Groq salva. A busca na Web está pronta.':'Chave removida.';setKeyStatus()};
$('#removeKey').onclick=()=>{$('#apiKey').value='';localStorage.removeItem('sm-groq-key');$('#settingsFeedback').textContent='Chave removida deste perfil.';setKeyStatus()};
$('#getKey').onclick=event=>{event.preventDefault();window.electronAPI.openUrl('https://console.groq.com/keys')};
$('#quotaHelp').onclick=event=>{event.preventDefault();window.electronAPI.openUrl('https://console.groq.com/docs/rate-limits')};
$('#testKey').onclick=async()=>{const key=$('#apiKey').value.trim();if(!key){$('#settingsFeedback').textContent='Cole uma chave da Groq antes de testar.';return}$('#testKey').disabled=true;$('#settingsFeedback').textContent='Validando a chave…';try{await window.electronAPI.testGroq(key);$('#settingsFeedback').textContent='Conexão confirmada. A chave da Groq está válida.'}catch(error){$('#settingsFeedback').textContent=error.message||'Não foi possível validar a chave.'}finally{$('#testKey').disabled=false}};

$('#searchGroq').onclick=async()=>{
  const query=$('#searchName').value.trim();
  if(!query){$('#aiResult').textContent='Digite o nome do aplicativo que deseja encontrar.';return}
  const apiKey=localStorage.getItem('sm-groq-key');
  if(!apiKey){setModal('#modal',false);showSettings();$('#settingsFeedback').textContent='Salve uma chave Groq para pesquisar na Web.';return}
  $('#searchGroq').disabled=true;$('#aiResult').textContent='Pesquisando na Web e conferindo o catálogo Winget…';
  try{
    const result=await window.electronAPI.searchGroq(query,apiKey);
    $('#manualName').value=result.name||query;$('#manualCategory').value=result.category||'Personalizados';$('#manualId').value=result.wingetId||'';$('#manualUrl').value=result.downloadUrl||'';
    $('#aiResult').textContent=`Sugestão encontrada${result.wingetId?' · '+result.wingetId:''}. Confira os dados antes de adicionar.`;
    if(result.sources?.length){const sources=document.createElement('div');sources.className='flex flex-wrap gap-2 mt-2';sources.innerHTML=result.sources.map(source=>`<button class="source-link rounded-md bg-white/5 px-2 py-1 text-[10px] text-blue-300 hover:bg-white/10" data-url="${esc(source.url)}">${esc(source.title)}</button>`).join('');$('#aiResult').append(sources);sources.querySelectorAll('.source-link').forEach(button=>button.onclick=()=>window.electronAPI.openUrl(button.dataset.url))}
  }
  catch(error){$('#aiResult').textContent=error.message||'Não foi possível pesquisar. Confira sua chave Groq e os limites da conta.'}
  finally{$('#searchGroq').disabled=false}
};

$('#searchWinget').onclick=async()=>{
  const query=$('#searchName').value.trim();if(!query){$('#aiResult').textContent='Digite o nome do aplicativo.';return}
  $('#searchWinget').disabled=true;$('#aiResult').textContent='Pesquisando no catálogo WinGet local…';
  try{const results=await window.electronAPI.searchWinget(query);$('#wingetResults').innerHTML=results.length?results.map((item,index)=>`<button class="winget-result block w-full text-left rounded-lg px-3 py-2 hover:bg-white/10" data-index="${index}"><span class="block text-xs text-white">${esc(item.name)}</span><span class="text-[10px] text-slate-500">${esc(item.wingetId)} · ${esc(item.version)}</span></button>`).join(''):'<div class="text-xs text-slate-500">Nenhum resultado.</div>';document.querySelectorAll('.winget-result').forEach(button=>button.onclick=()=>{const item=results[Number(button.dataset.index)];$('#manualName').value=item.name;$('#manualId').value=item.wingetId;$('#manualDownloadMode').value='page';$('#aiResult').textContent=`Winget ID selecionado: ${item.wingetId}`})}
  catch(error){$('#aiResult').textContent=error.message}
  finally{$('#searchWinget').disabled=false}
};

$('#saveApp').onclick=()=>{
  const name=$('#manualName').value.trim()||$('#searchName').value.trim();const id=$('#manualId').value.trim();const url=$('#manualUrl').value.trim();
  if(!name){$('#aiResult').textContent='Informe o nome do aplicativo.';return}
  if(!id&&!url){$('#aiResult').textContent='Informe um Winget ID para instalação direta ou uma URL oficial para abrir no navegador.';return}
  if(id&&!/^[\w.+-]+$/.test(id)){$('#aiResult').textContent='Winget ID inválido. Use letras, números, ponto, hífen, sublinhado ou +.';return}
  if(url){try{const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol))throw new Error()}catch{$('#aiResult').textContent='A URL precisa começar com https:// ou http://.';return}}
  const app={name,category:$('#manualCategory').value.trim()||'Personalizados',wingetId:id,downloadUrl:url,downloadMode:$('#manualDownloadMode').value,icon:iconFor(name),mark:name.slice(0,2).toUpperCase(),color:'60a5fa'};
  apps=apps.filter(item=>item.name.toLowerCase()!==name.toLowerCase());apps.push(app);if(id)queue.add(name);persist();setModal('#modal',false);
  for(const selector of ['#manualName','#manualCategory','#manualId','#manualUrl','#searchName'])$(selector).value='';
  if(!id)log(`${name} foi adicionado com link direto. Use “Abrir site” no cartão.`);
};

$('#backup').onclick=async()=>{const chosen=selectedApps().filter(app=>app.wingetId);try{const result=await window.electronAPI.saveBackup(chosen);if(result.ok)log(`Arquivo BAT salvo em ${result.path}`);else if(!result.canceled)log('O backup não foi salvo.','error')}catch(error){log(error.message,'error')}};
$('#install').onclick=async()=>{
  if(installing)return;const chosen=selectedApps().filter(app=>app.wingetId);
  if(!chosen.length){log('Adicione à fila pelo menos um aplicativo com Winget ID.','error');return}
  installing=true;$('#install').disabled=true;$('#backup').disabled=true;$('#terminalStatus').textContent='Instalando…';$('#progressBar').style.width='0%';$('#progressText').textContent='0%';log(`Iniciando a instalação de ${chosen.length} aplicativo(s).`);
  try{await window.electronAPI.installApps(chosen)}
  catch(error){log(error.message,'error')}
  finally{installing=false;$('#install').disabled=false;$('#backup').disabled=false;$('#terminalStatus').textContent='Processo encerrado'}
};

window.electronAPI.onWingetLog(entry=>{
  if(entry.type==='progress'){const percent=entry.data.total?Math.round(entry.data.current/entry.data.total*100):0;$('#progressBar').style.width=`${percent}%`;$('#progressText').textContent=`${percent}%`;if(entry.data.id)$('#terminalStatus').textContent=`${entry.data.current>=entry.data.total?'Finalizando':'Instalando'} ${entry.data.id}`}
  else log(entry.data,entry.type);
});
setKeyStatus();render();
