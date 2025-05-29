// src/components/AuthLayout.jsx

import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-8">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-70 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-200 rounded-full opacity-70 blur-xl"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-40 bg-blue-200 rounded-full opacity-50 blur-lg"></div>
        
        {/* Main card */}
        <div className="bg-white p-12 rounded-2xl shadow-xl w-full backdrop-blur-sm border border-gray-100 relative z-10 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/80 to-white/30 z-0"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;