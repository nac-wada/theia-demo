// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from './common/types';
/**
 * IElectronAPI 型を明示的に指定することで、
 * src/common/types.ts との実装の乖離をコンパイル時に検知します。
 */
const api: IElectronAPI = {
  winMinimize: () => {
    ipcRenderer.send('window-minimize');
  },
  winMaximize: () => {
    ipcRenderer.send('window-maximize');
  },
  winClose: () => {
    ipcRenderer.send('window-close');
  },
  getStartupOutput: () => ipcRenderer.invoke('get-startup-output'),
};

// 'electronAPI' という名前でメインワールド（レンダラープロセス）に公開
contextBridge.exposeInMainWorld('electronAPI', api);