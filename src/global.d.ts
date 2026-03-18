export interface IElectronAPI {
  winMinimize: () => void;
  winMaximize: () => void;
  winClose: () => void;
}

/**
 * windowオブジェクトの型定義（TypeScript用）
 */
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}