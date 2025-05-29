// src/components/Input.jsx

import React from 'react';
// Import icons from react-icons
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaBuilding } from 'react-icons/fa';

const Input = ({ icon, type = 'text', placeholder, value, onChange, className = '', ...props }) => {
  // Icon mapping
  const renderIcon = () => {
    switch (icon) {
      case 'user':
        return <FaUser className="text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />;
      case 'lock':
        return <FaLock className="text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />;
      case 'envelope':
        return <FaEnvelope className="text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />;
      case 'idcard': // For Student ID
        return <FaIdCard className="text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />;
      case 'building': // For general organization/student ID context
        return <FaBuilding className="text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />;
      default:
        return null;
    }
  };

  return (
    <div className={`group relative flex items-center border border-gray-300 rounded-lg p-2.5 transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 hover:border-indigo-300 ${className}`}>
      {icon && (
        <div className="absolute left-3 transition-all duration-200 ease-in-out">
          {renderIcon()}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-1.5 pr-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 ${icon ? 'pl-9' : 'pl-3'}`}
        {...props}
      />
      
      {/* Animated bottom border effect */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 w-0 group-hover:w-full group-focus-within:w-full transition-all duration-300 ease-in-out"></div>
    </div>
  );
};

export default Input;