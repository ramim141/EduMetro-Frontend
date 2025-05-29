// src/components/Button.jsx

import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  let baseClasses = "py-2.5 px-5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:shadow-lg active:scale-[0.98]";

  let variantClasses = "";
  switch (variant) {
    case 'primary':
      variantClasses = "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500";
      break;
    case 'secondary':
      variantClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
      break;
    case 'danger':
      variantClasses = "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-500";
      break;
    case 'outline':
      variantClasses = "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-300";
      break;
    case 'success':
      variantClasses = "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 focus:ring-green-500";
      break;
    default:
      variantClasses = "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500";
  }

  // Handle disabled state
  if (props.disabled) {
    variantClasses = "bg-gray-300 text-gray-500 cursor-not-allowed transform-none hover:shadow-none";
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
      {/* Add subtle shine effect */}
      {!props.disabled && (
        <div className="absolute inset-0 overflow-hidden rounded-lg opacity-0 hover:opacity-20 transition-opacity duration-300">
          <div className="absolute -inset-[100%] top-0 h-[50%] w-[200%] bg-gradient-to-r from-transparent via-white to-transparent transform rotate-[-25deg] translate-x-[-100%] animate-[shine_3s_ease-in-out_infinite]" />
        </div>
      )}
    </button>
  );
};

export default Button;