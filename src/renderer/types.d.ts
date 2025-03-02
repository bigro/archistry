// ディレクトリ構造の型定義
interface DirectoryItem {
    name: string;
    path: string;
    type: 'directory' | 'file';
    children?: DirectoryItem[];
    extension?: string;
  }
  
  interface SuccessResponse {
    success: boolean;
  }
  
  interface ErrorResponse {
    error: string;
  }
  
  // Electron APIのグローバル型定義
  declare global {
    interface Window {
      electronAPI: {
        openFolder: () => Promise<string | null>;
        readDirectory: (path: string) => Promise<DirectoryItem | ErrorResponse>;
        readMarkdownFile: (path: string) => Promise<string | ErrorResponse>;
        saveMarkdownFile: (path: string, content: string) => Promise<SuccessResponse | ErrorResponse>;
      }
    }
  }
  
  export {};