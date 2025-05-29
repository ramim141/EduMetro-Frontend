// src/components/Heading.jsx

import React from 'react';

const Heading = ({ children, className = '', level = 2, gradient = false }) => {
  const baseClasses = "font-bold text-center mb-6";
  
  // Size classes based on heading level
  const sizeClasses = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base"
  }[level] || "text-2xl";
  
  // Apply gradient text if requested
  const gradientClasses = gradient ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" : "text-gray-800";
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${sizeClasses} ${gradientClasses} ${className}`;
  
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