import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ শুধুমাত্র এখানেই AuthProvider থাকবে */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);