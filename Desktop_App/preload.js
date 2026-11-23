const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
    isDesktop: true,
    platform: process.platform,
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    openExternal: (url) => ipcRenderer.invoke('app:open-external', url),
    print: (options) => ipcRenderer.invoke('app:print', options),
    backupDatabase: () => ipcRenderer.invoke('app:backup-database'),
    restoreDatabase: () => ipcRenderer.invoke('app:restore-database')
});
