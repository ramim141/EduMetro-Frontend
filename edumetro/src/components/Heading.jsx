// src/components/Heading.jsx

import React from 'react';

const Heading = ({ 
  children, 
  className = '', 
  level = 2, 
  gradient = false,
  color = 'default',
  align = 'center',
  weight = 'bold',
  spacing = 'normal',
  animated = false,
  underline = false
}) => {
  // Base classes with improved spacing and typography
  const baseClasses = "mb-6 tracking-tight leading-tight transition-colors duration-300";
  
  // Font weight classes
  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold"
  }[weight] || "font-bold";
  
  // Text alignment classes
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align] || "text-center";
  
  // Letter spacing classes
  const spacingClasses = {
    tight: "tracking-tight",
    normal: "tracking-normal",
    wide: "tracking-wide",
    wider: "tracking-wider"
  }[spacing] || "tracking-normal";
  
  // Size classes based on heading level with improved responsive sizing
  const sizeClasses = {
    1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    2: "text-2xl sm:text-3xl md:text-4xl",
    3: "text-xl sm:text-2xl md:text-3xl",
    4: "text-lg sm:text-xl md:text-2xl",
    5: "text-base sm:text-lg md:text-xl",
    6: "text-sm sm:text-base md:text-lg"
  }[level] || "text-2xl sm:text-3xl md:text-4xl";
  
  // Color classes
  let colorClasses = '';
  if (!gradient) {
    switch (color) {
      case 'primary':
        colorClasses = "text-primary-600 dark:text-primary-400";
        break;
      case 'secondary':
        colorClasses = "text-secondary-600 dark:text-secondary-400";
        break;
      case 'accent':
        colorClasses = "text-accent-600 dark:text-accent-400";
        break;
      case 'success':
        colorClasses = "text-success-600 dark:text-success-400";
        break;
      case 'warning':
        colorClasses = "text-warning-600 dark:text-warning-400";
        break;
      case 'danger':
        colorClasses = "text-danger-600 dark:text-danger-400";
        break;
      case 'light':
        colorClasses = "text-gray-600";
        break;
      case 'dark':
        colorClasses = "text-gray-800 dark:text-gray-100";
        break;
      default:
        colorClasses = "text-gray-800 dark:text-gray-100";
    }
  }
  
  // Apply gradient text with enhanced gradients if specified
  let gradientClasses = '';
  if (gradient) {
    switch (color) {
      case 'primary':
        gradientClasses = "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent";
        break;
      case 'secondary':
        gradientClasses = "bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent";
        break;
      case 'accent':
        gradientClasses = "bg-gradient-to-r from-accent-500 to-primary-600 bg-clip-text text-transparent";
        break;
      case 'rainbow':
        gradientClasses = "bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 bg-clip-text text-transparent";
        break;
      default:
        gradientClasses = "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent";
    }
  }
  
  // Animation classes
  const animationClasses = animated ? "animate-fadeIn" : "";
  
  // Underline classes
  const underlineClasses = underline ? "border-b-2 pb-2 border-gray-200 dark:border-gray-700" : "";
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${weightClasses} ${sizeClasses} ${alignClasses} ${spacingClasses} ${colorClasses} ${gradientClasses} ${animationClasses} ${underlineClasses} ${className}`;
  
  // Render the appropriate heading level
  switch (level) {
    case 1:
      return <h1 className={combinedClasses}>{children}</h1>;
    case 3:
      return <h3 className={combinedClasses}>{children}</h3>;
    case 4:
      return <h4 className={combinedClasses}>{children}</h4>;
    case 5:
      return <h5 className={combinedClasses}>{children}</h5>;
    case 6:
      return <h6 className={combinedClasses}>{children}</h6>;
    default:
      return <h2 className={combinedClasses}>{children}</h2>;
  }
};

export default Heading;