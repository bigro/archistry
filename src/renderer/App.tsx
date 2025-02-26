// src/renderer/App.tsx
import React, { useState } from 'react';
import ProjectExplorer from './components/ProjectExplorer';
import MarkdownEditor from './components/MarkdownEditor';
import './App.css';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  const handleSelectFile = (filePath: string) => {
    setSelectedFile(filePath);
  };
  
  return (
    <div className="app">
      <div className="sidebar">
        <ProjectExplorer 
          onSelectFile={handleSelectFile}
          selectedFile={selectedFile}
        />
      </div>
      <div className="content">
        <MarkdownEditor filePath={selectedFile} />
      </div>
    </div>
  );
};

export default App;