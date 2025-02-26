import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React 18の新しいルートAPIを使用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);