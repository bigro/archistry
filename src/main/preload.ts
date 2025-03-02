import { contextBridge, ipcRenderer } from 'electron';

type DirectoryItem = {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children?: DirectoryItem[];
  extension?: string;
};

type SuccessResponse = {
  success: boolean;
};

type ErrorResponse = {
  error: string;
};

// APIをグローバルウィンドウオブジェクトに公開
contextBridge.exposeInMainWorld('electronAPI', {
  // フォルダ選択ダイアログを開く
  openFolder: () => ipcRenderer.invoke('open-folder-dialog') as Promise<string | null>,
  
  // ディレクトリ構造を読み込む
  readDirectory: (path: string) => 
    ipcRenderer.invoke('read-directory', path) as Promise<DirectoryItem | ErrorResponse>,
  
  // マークダウンファイルを読み込む
  readMarkdownFile: (path: string) => 
    ipcRenderer.invoke('read-markdown-file', path) as Promise<string | ErrorResponse>,
  
  // マークダウンファイルを保存する
  saveMarkdownFile: (path: string, content: string) => 
    ipcRenderer.invoke('save-markdown-file', path, content) as Promise<SuccessResponse | ErrorResponse>
});

console.log('Preload script loaded successfully');