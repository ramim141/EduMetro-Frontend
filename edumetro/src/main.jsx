// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // ✅ AuthProvider ইম্পোর্ট করুন

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ AuthProvider দিয়ে আপনার App বা Route রেন্ডার করুন */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);