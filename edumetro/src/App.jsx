// src/App.jsx (Updated and Corrected)

import React from 'react';
import { Toaster } from 'react-hot-toast'; // ✅ ধাপ ১: Toaster ইম্পোর্ট করুন
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      {/* ✅ ধাপ ২: Toaster কম্পোনেন্টটি এখানে যোগ করুন */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 5000, // মেসেজ ৫ সেকেন্ড থাকবে
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
          },
          success: {
            style: {
              background: '#4CAF50', // সবুজ
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#F44336', // লাল
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
    </AuthProvider>
  );
};

export default App;