import React, { useState } from 'react';
import { FaFolder, FaFolderOpen, FaMarkdown, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './ProjectExplorer.css';

const { ipcRenderer } = window.require('electron');

// ディレクトリ構造の型定義
interface DirectoryItem {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children?: DirectoryItem[];
  extension?: string;
}

interface FileTreeItemProps {
  item: DirectoryItem;
  level: number;
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
}

interface ProjectExplorerProps {
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ item, level, onSelectFile, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDirectory = item.type === 'directory';
  const isSelected = selectedFile === item.path;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleClick = () => {
    if (isDirectory) {
      toggleExpand();
    } else {
      onSelectFile(item.path);
    }
  };
  
  return (
    <div className="file-tree-item">
      <div 
        className={`file-tree-node ${isSelected ? 'selected' : ''}`} 
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        <span className="expand-icon">
          {isDirectory && (
            isExpanded ? <FaChevronDown /> : <FaChevronRight />
          )}
        </span>
        <span className="icon">
          {isDirectory ? (
            isExpanded ? <FaFolderOpen /> : <FaFolder />
          ) : (
            <FaMarkdown />
          )}
        </span>
        <span className="name">{item.name}</span>
      </div>
      
      {isDirectory && isExpanded && item.children && (
        <div className="file-tree-children">
          {item.children.map((child) => (
            <FileTreeItem 
              key={child.path} 
              item={child} 
              level={level + 1}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ onSelectFile, selectedFile }) => {
  const [structure, setStructure] = useState<DirectoryItem | null>(null);
  const [projectPath, setProjectPath] = useState<string | null>(null);
  
  const openFolder = async () => {
    const folderPath = await ipcRenderer.invoke('open-folder-dialog');
    if (folderPath) {
      setProjectPath(folderPath);
      const structure = await ipcRenderer.invoke('read-directory', folderPath);
      setStructure(structure);
    }
  };
  
  return (
    <div className="project-explorer">
      <div className="project-toolbar">
        <button onClick={openFolder}>
          {projectPath ? 'Change Folder' : 'Open Folder'}
        </button>
        {projectPath && <span className="project-path">{projectPath}</span>}
      </div>
      
      <div className="file-tree">
        {structure ? (
          <FileTreeItem 
            item={structure} 
            level={0}
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
          />
        ) : (
          <div className="empty-state">
            No project opened. Click "Open Folder" to start.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplorer;