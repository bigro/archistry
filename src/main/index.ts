import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';

// 開発環境の場合のみelectron-reloadを有効化
if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
        forceHardReset: true,
        hardResetMethod: 'exit'
    });
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const waitForWebpack = async () => {
    return new Promise((resolve) => {
        // 開発環境の場合、webpack-dev-serverが起動するまで待機
        if (process.env.NODE_ENV === 'development') {
            const tryConnection = () => {
                const req = require('http').get('http://localhost:3000', (res: any) => {
                    if (res.statusCode === 200) {
                        resolve(true);
                    }
                });
                req.on('error', () => {
                    setTimeout(tryConnection, 100);
                });
            };
            tryConnection();
        } else {
            resolve(true);
        }
    });
};

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            devTools: process.env.NODE_ENV === 'development',  // 開発時のみDevToolsを有効化
        }
    });

    // 開発時のみDevToolsを自動で開く
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // and load the index.html of the app.
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC通信の設定
ipcMain.handle('dialog:openDirectory', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result;
});