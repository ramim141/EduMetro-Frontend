// src/components/Button.jsx

import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', size = 'md', icon, iconPosition = 'left', loading = false, ...props }) => {
  // Base classes for all buttons
  let baseClasses = "relative overflow-hidden font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:shadow-button-hover active:scale-[0.98]";
  
  // Size classes
  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2.5 px-5 text-sm",
    lg: "py-3 px-6 text-base",
    xl: "py-4 px-8 text-lg"
  }[size] || "py-2.5 px-5 text-sm";

  // Variant classes with improved gradients and hover effects
  let variantClasses = "";
  switch (variant) {
    case 'primary':
      variantClasses = "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 focus:ring-primary-500 shadow-md";
      break;
    case 'secondary':
      variantClasses = "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 focus:ring-gray-400 shadow-sm";
      break;
    case 'danger':
      variantClasses = "bg-gradient-to-r from-danger-500 to-accent-500 text-white hover:from-danger-600 hover:to-accent-600 focus:ring-danger-500 shadow-md";
      break;
    case 'outline':
      variantClasses = "bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-300 shadow-sm";
      break;
    case 'success':
      variantClasses = "bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 focus:ring-success-500 shadow-md";
      break;
    case 'ghost':
      variantClasses = "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-300";
      break;
    case 'link':
      variantClasses = "bg-transparent text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-300 shadow-none p-0";
      break;
    default:
      variantClasses = "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 focus:ring-primary-500 shadow-md";
  }

  // Handle disabled state
  if (props.disabled) {
    variantClasses = "bg-gray-200 text-gray-400 cursor-not-allowed transform-none hover:shadow-none border border-gray-200";
  }

  // Handle loading state
  const isLoading = loading && !props.disabled;

  return (
    <button
      onClick={isLoading ? null : onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className} ${isLoading ? 'cursor-wait' : ''}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && iconPosition === 'left' && !isLoading && <span>{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && !isLoading && <span>{icon}</span>}
      </div>
      
      {/* Enhanced shine effect */}
      {!props.disabled && variant !== 'link' && variant !== 'ghost' && (
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-20 hover:opacity-20 transition-opacity duration-300">
          <div className="absolute -inset-[100%] top-0 h-[50%] w-[200%] bg-gradient-to-r from-transparent via-white to-transparent transform rotate-[-25deg] translate-x-[-100%] animate-shine" />
        </div>
      )}
    </button>
  );
};

export default Button;