import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { spawn } from 'node:child_process';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let servicePort = ""; // 標準出力を保持する変数

const getExePath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'nact3dcore.exe')
    : path.join(app.getAppPath(), 'resources', 'nact3dcore.exe')
}

function runStartService() {
  try {
    const exePath = getExePath();
    console.log("Attempting to run EXE at:", exePath);

    if (!require('fs').existsSync(exePath)) {
      console.error("Critical Error: EXE file not found at path!");
      return;
    }

    const child = spawn(exePath);

    child.stdout.on('data', (data) => {
      const str = data.toString();

      console.log(`EXE RUN ${str}`);
      const match = str.match(/port:(\d+)/);
      if(match && match[1]) {
        servicePort = match[1];
      }
    });

    child.on('close', (code) => {
      console.log(`EXE finished with code ${code}`);
    });
    
    child.on('error', (err) => {
      console.error("Failed to start child process:", err);
    });

  } catch (error) {
    console.error("Unexpected error in runStartupExe:", error);
  }
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200, 
    height: 800,
    // 最小サイズ設定。小さすぎたり大きすぎたりすると最小化の挙動に干渉することがあります。
    minWidth: 600, 
    minHeight: 400,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  // メニューバーを完全に消去
  Menu.setApplicationMenu(null);

  // 起動時に最大化
  mainWindow.maximize();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
  runStartService(); //サービス起動
  createWindow(); //アプリウィンドウ作成
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC ハンドラ
ipcMain.on('window-minimize', (event) => {
  // 送信元のwebContentsに関連付けられたウィンドウを取得
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    // 確実にタスクバーへ格納する命令
    win.minimize(); 
  }
});

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.close();
  }
});

ipcMain.handle('get-startup-output', () => servicePort)