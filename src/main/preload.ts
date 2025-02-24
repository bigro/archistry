import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  showOpenDialog: (options: any) => ipcRenderer.invoke('dialog:openDirectory', options)
});