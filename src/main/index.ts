import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import { registerFileSystemHandlers } from './handlers/fileSystemHandlers';

// ウィンドウオブジェクトをグローバル参照として保持
// これは、JavaScriptオブジェクトがガベージコレクトされると
// ウィンドウが自動的に閉じられるのを防ぐため
let mainWindow: BrowserWindow | null = null;

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
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: process.env.NODE_ENV === 'development',  // 開発時のみDevToolsを有効化
            preload: path.join(__dirname, 'preload.js')
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
        mainWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    }

    // ウィンドウが閉じられたときに呼ばれる
    mainWindow.on('closed', () => {
        // ウィンドウオブジェクトの参照を解除
        mainWindow = null;
    });

};

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // macOS以外では、ユーザーがCmd + Qで明示的に終了するまで
    // アプリケーションはアクティブのままにするのが一般的
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Electronの初期化が完了したら呼ばれる
app.whenReady().then(() => {
    // ファイルシステム関連のハンドラーを登録
    registerFileSystemHandlers();

    createWindow();

    app.on('activate', () => {
        // macOSでは、ドックアイコンをクリックしてウィンドウがない場合に
        // アプリケーションのウィンドウを再作成するのが一般的
        if (mainWindow === null) createWindow();
    });
});