import React from 'react';
import { FolderOpen } from 'lucide-react';

interface FolderSelectorProps {
  onFolderSelect: (path: string) => void;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({ onFolderSelect }) => {
  const handleClick = async () => {
    // @ts-ignore (electronはグローバルに利用可能)
    const result = await window.electron.showOpenDialog({
      properties: ['openDirectory']
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      onFolderSelect(result.filePaths[0]);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <FolderOpen className="w-5 h-5" />
      <span>プロジェクトを開く</span>
    </button>
  );
};

export default FolderSelector;