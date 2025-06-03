// src/App.js (Updated)

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow w-full pt-16"> {/* Added flex-grow and full width */}
          <div className="max-w-full mx-auto"> {/* Container for max-width control */}
            <AppRoutes />
          </div>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;