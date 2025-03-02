import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './MarkdownEditor.css';

const { ipcRenderer } = window.require('electron');

interface MarkdownEditorProps {
  filePath: string | null;
}

// error型を明示的に定義
interface ErrorResponse {
  error: string;
}

function isErrorResponse(obj: any): obj is ErrorResponse {
  return obj && typeof obj === 'object' && 'error' in obj;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (filePath) {
      loadFile(filePath);
    } else {
      setContent('');
    }
  }, [filePath]);

  const loadFile = async (path: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const content = await window.electronAPI.readMarkdownFile(path);

      if (isErrorResponse(content)) {
        setError(content.error);
      } else {
        setContent(content as string);
      }
    } catch (err) {
      setError(`Failed to load file: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFile = async () => {
    if (!filePath) return;

    try {
      setIsSaving(true);
      const result = await window.electronAPI.saveMarkdownFile(filePath, content);

      if (isErrorResponse(result)) {
        setError(`Failed to save: ${result.error}`);
      }
    } catch (err) {
      setError(`Failed to save file: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveFile();
    }
  };

  if (isLoading) {
    return <div className="markdown-loading">Loading...</div>;
  }

  if (error) {
    return <div className="markdown-error">{error}</div>;
  }

  if (!filePath) {
    return <div className="markdown-empty">No file selected</div>;
  }

  return (
    <div className="markdown-editor" onKeyDown={handleKeyDown}>
      <div className="editor-toolbar">
        <div className="file-path">{filePath}</div>
        <button onClick={saveFile} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <MDEditor
        value={content}
        onChange={(value) => setContent(value || '')}
        height="calc(100% - 40px)"
        preview="edit"
      />
    </div>
  );
};

export default MarkdownEditor;