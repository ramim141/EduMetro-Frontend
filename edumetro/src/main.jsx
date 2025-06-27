// src/main.jsx (Corrected)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NoteProvider } from './context/NoteContext.jsx'; // ✅ NoteProvider ইম্পোর্ট করুন
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NoteProvider> {/* ✅ AuthProvider-এর ভেতরে NoteProvider যুক্ত করুন */}
          <App />
        </NoteProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);