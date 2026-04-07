export interface IElectronAPI {
  winMinimize: () => void;
  winMaximize: () => void;
  winClose: () => void;
  getStartupOutput: () => Promise<string>;
}