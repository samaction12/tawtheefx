import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // أو './styles.css' حسب اسم ملف الـ CSS عندك

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
