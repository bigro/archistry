import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

// プロジェクトのルートパスを保存する変数
let projectRootPath: string | null = null;

// ファイルシステム関連のハンドラーを登録する関数
export function registerFileSystemHandlers(): void {
    // フォルダ選択ダイアログを開く処理
    ipcMain.handle('open-folder-dialog', async () => {
        try {
            const selectedPaths = await dialog.showOpenDialog({
                properties: ['openDirectory']
            });

            if (!selectedPaths || selectedPaths.length === 0) {
                return null;
            }

            projectRootPath = selectedPaths[0];
            return projectRootPath;
        } catch (error) {
            console.error('Error opening folder dialog:', error);
            return null;
        }
    });

    // フォルダ構造を再帰的に読み取る処理
    ipcMain.handle('read-directory', async (_, dirPath?: string) => {
        try {
            const folderPath = dirPath || projectRootPath;
            if (!folderPath) return null;

            return await scanDirectory(folderPath);
        } catch (error) {
            console.error('Error reading directory:', error);
            return { error: (error as Error).message };
        }
    });

    // マークダウンファイルの内容を読み込む処理
    ipcMain.handle('read-markdown-file', async (_, filePath: string) => {
        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            return content;
        } catch (error) {
            console.error('Error reading file:', error);
            return { error: (error as Error).message };
        }
    });

    // マークダウンファイルの内容を保存する処理
    ipcMain.handle('save-markdown-file', async (_, filePath: string, content: string) => {
        try {
            await fs.promises.writeFile(filePath, content, 'utf-8');
            return { success: true };
        } catch (error) {
            console.error('Error saving file:', error);
            return { error: (error as Error).message };
        }
    });
}

// ディレクトリ構造の型定義
interface DirectoryItem {
    name: string;
    path: string;
    type: 'directory' | 'file';
    children?: DirectoryItem[];
    extension?: string;
}

// ディレクトリを再帰的にスキャンする関数
async function scanDirectory(dirPath: string): Promise<DirectoryItem> {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const result: DirectoryItem = {
        name: path.basename(dirPath),
        path: dirPath,
        type: 'directory',
        children: []
    };

    for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);

        // 隠しファイルやフォルダをスキップする (.gitなど)
        if (entry.name.startsWith('.')) {
            continue;
        }

        if (entry.isDirectory()) {
            const subDir = await scanDirectory(entryPath);
            result.children!.push(subDir);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            // マークダウンファイルのみを対象とする
            result.children!.push({
                name: entry.name,
                path: entryPath,
                type: 'file',
                extension: path.extname(entry.name)
            });
        }
    }

    // 名前でソート (ディレクトリが先、ファイルが後)
    result.children!.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type === 'directory' ? -1 : 1;
    });

    return result;
}