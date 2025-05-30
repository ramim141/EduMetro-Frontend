import React from 'react';

const Spinner = ({ 
  className = '', 
  size = 'md', 
  variant = 'primary',
  thickness = 'medium',
  speed = 'normal',
  label = 'Loading...',
  fullscreen = false,
  overlay = false,
  type = 'border',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  // Border thickness
  const thicknessClasses = {
    thin: 'border-2',
    medium: 'border-4',
    thick: 'border-6'
  };

  // Animation speed
  const speedClasses = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  };

  // Color variants
  const variantClasses = {
    primary: 'border-primary-600 border-r-transparent',
    secondary: 'border-secondary-600 border-r-transparent',
    accent: 'border-accent-500 border-r-transparent',
    white: 'border-white border-r-transparent',
    success: 'border-success-500 border-r-transparent',
    warning: 'border-warning-500 border-r-transparent',
    danger: 'border-danger-500 border-r-transparent',
    info: 'border-blue-500 border-r-transparent',
    dark: 'border-gray-800 border-r-transparent',
    light: 'border-gray-200 border-r-transparent'
  };

  // Dot spinner color variants
  const dotVariantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-500',
    white: 'bg-white',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    info: 'bg-blue-500',
    dark: 'bg-gray-800',
    light: 'bg-gray-200'
  };

  // Grow spinner color variants
  const growVariantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-500',
    white: 'bg-white',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    info: 'bg-blue-500',
    dark: 'bg-gray-800',
    light: 'bg-gray-200'
  };

  // Fullscreen and overlay classes
  const containerClasses = fullscreen
    ? 'fixed inset-0 flex items-center justify-center z-50 ' + (overlay ? 'bg-black/50' : '')
    : '';

  // Render different spinner types
  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`flex space-x-1 ${sizeClasses[size] || sizeClasses.md}`}>
            <div className={`animate-bounce ${dotVariantClasses[variant]} rounded-full ${sizeClasses.xs}`}></div>
            <div className={`animate-bounce delay-75 ${dotVariantClasses[variant]} rounded-full ${sizeClasses.xs}`}></div>
            <div className={`animate-bounce delay-150 ${dotVariantClasses[variant]} rounded-full ${sizeClasses.xs}`}></div>
          </div>
        );
      case 'grow':
        return (
          <div className={`animate-pulse ${growVariantClasses[variant]} ${sizeClasses[size] || sizeClasses.md} rounded-full`}></div>
        );
      case 'border':
      default:
        return (
          <div 
            className={`
              inline-block rounded-full border-solid
              ${speedClasses[speed] || 'animate-spin'} 
              ${thicknessClasses[thickness] || 'border-4'} 
              ${variantClasses[variant] || variantClasses.primary} 
              ${sizeClasses[size] || sizeClasses.md} 
              ${className}
            `} 
            role="status"
            aria-label={label}
            {...props}
          >
            <span className="sr-only">{label}</span>
          </div>
        );
    }
  };

  // If fullscreen, wrap in a container
  if (fullscreen) {
    return (
      <div className={containerClasses}>
        {renderSpinner()}
      </div>
    );
  }

  // Otherwise, just return the spinner
  return renderSpinner();
};

export default Spinner;