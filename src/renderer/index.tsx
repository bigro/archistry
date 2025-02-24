import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import FolderSelector from './components/FolderSelector';

const App = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleFolderSelect = (path: string) => {
    setSelectedPath(path);
    console.log('Selected folder:', path);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-blue-600">
          Archistry
        </h1>
        <FolderSelector onFolderSelect={handleFolderSelect} />
        {selectedPath && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700">選択されたフォルダ:</p>
            <p className="font-mono text-sm">{selectedPath}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);