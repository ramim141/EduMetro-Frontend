// src/App.jsx (This file is correct, no changes needed)

import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';
import './App.css';

const App = () => {
  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 5000,
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
          },
          success: {
            style: {
              background: '#4CAF50',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#F44336',
              color: 'white',
            },
          },
        }}
      />
      
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow w-full pt-16">
          <div className="max-w-full mx-auto">
            <AppRoutes />
          </div>
        </main>
      </div>
    </>
  );
};

export default App;