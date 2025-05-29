import React from 'react';

const Spinner = ({ className = '', size = 'default', variant = 'primary' }) => {
  // Size classes
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  // Color variants
  const variantClasses = {
    primary: 'border-indigo-600 border-r-transparent',
    secondary: 'border-gray-600 border-r-transparent',
    white: 'border-white border-r-transparent',
    success: 'border-green-500 border-r-transparent',
    danger: 'border-red-500 border-r-transparent'
  };

  return (
    <div 
      className={`
        inline-block animate-spin rounded-full 
        border-4 border-solid 
        ${variantClasses[variant] || variantClasses.primary} 
        ${sizeClasses[size] || sizeClasses.default} 
        ${className}
      `} 
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;