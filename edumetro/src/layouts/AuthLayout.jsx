// src/components/AuthLayout.jsx

import React from 'react';
import Footer from "@/component/Footer"
const AuthLayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center p-8 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-70 blur-xl"></div>
        <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-indigo-200 rounded-full opacity-70 blur-xl"></div>
        <div className="absolute -left-5 top-1/2 w-10 h-40 bg-blue-200 rounded-full opacity-50 blur-lg -translate-y-1/2"></div>
        
        {/* Main card */}
        <div className="overflow-hidden relative z-10 p-12 w-full bg-white rounded-2xl border border-gray-100 shadow-xl backdrop-blur-sm">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white/80 to-white/30"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default AuthLayout;