const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  installApps: appsList => ipcRenderer.invoke('execute-winget-install', appsList),
  saveBackup: appsList => ipcRenderer.invoke('download-bat-backup', appsList),
  onWingetLog: callback => {
    if (typeof callback !== 'function') return () => {};
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('winget-log', listener);
    return () => ipcRenderer.removeListener('winget-log', listener);
  },
  controlWindow: action => ipcRenderer.invoke('window-control', action),
  openUrl: url => ipcRenderer.invoke('open-external-url', url),
  searchWinget: query => ipcRenderer.invoke('search-winget', query),
  downloadCustomApp: (url, name) => ipcRenderer.invoke('download-custom-app', { url, name }),
  searchGroq: (query, apiKey) => ipcRenderer.invoke('groq-search', { query, apiKey }),
  testGroq: apiKey => ipcRenderer.invoke('groq-test', apiKey),
  exportList: list => ipcRenderer.invoke('export-list', list),
  importList: () => ipcRenderer.invoke('import-list')
});
