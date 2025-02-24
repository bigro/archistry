import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-600">
        Hello Electron + React + TailwindCSS!
      </h1>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);