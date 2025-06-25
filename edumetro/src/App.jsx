// src/App.jsx (Updated and Corrected)

import React from 'react';
import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext'; // ❌ এই লাইনটি সম্পূর্ণ রিমুভ করুন
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';
import './App.css';

const App = () => {
  return (
    // <AuthProvider> ❌ এই wrapper টি সম্পূর্ণ রিমুভ করুন
    <> {/* আপনি চাইলে এখানে React.Fragment বা <> ব্যবহার করতে পারেন */}
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
    // </AuthProvider> ❌ এই wrapper টি সম্পূর্ণ রিমুভ করুন
  );
};

export default App;