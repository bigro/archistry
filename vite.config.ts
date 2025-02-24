import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';


export default defineConfig({
    plugins: [tailwindcss()],
    root: path.resolve(__dirname, 'renderer'), // フロントエンドのルートディレクトリ
    server: {
      host: 'localhost',
      port: 3000, // Electron の `main/index.ts` で設定されたポートと一致させる
      strictPort: true, // ポートが空いていない場合に自動変更しない
    },
    build: {
      outDir: path.resolve(__dirname, '../dist'), // Electron がロードするディレクトリ
      emptyOutDir: true, // ビルド前に出力ディレクトリをクリーン
      assetsDir: 'assets', // 静的アセットのディレクトリ
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'renderer/src'), // 絶対パスのエイリアス
      },
    },
});
