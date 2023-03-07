import { contextBridge, ipcRenderer } from "electron"
contextBridge.exposeInMainWorld(
  'electron',{
    send: (evt: string, args: any[]) => ipcRenderer.send(evt, args),
    on: (evt: string, cb: (evt: any, ...args: any[]) => void) => ipcRenderer.on (evt, cb),
    once: (evt: string, cb: (evt: any, ...args: any[]) => void) => ipcRenderer.on (evt, cb),
    removeListener: (evt: string, listener: (...args: any[]) => void) => ipcRenderer.removeListener(evt, listener),
    invoke: (evt: string, args: any[]) => ipcRenderer.invoke(evt, args),
  }
);