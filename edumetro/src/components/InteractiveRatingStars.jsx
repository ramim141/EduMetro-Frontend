// src/components/InteractiveRatingStars.jsx

import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const InteractiveRatingStars = ({ 
  initialRating = 0, 
  onRatingChange, 
  maxRating = 5, 
  className = '',
  size = 'md',
  color = 'warning',
  showValue = false,
  animated = false,
  spacing = 'sm',
  allowHalfStar = false,
  label = '',
  ...props
}) => {
  const [hoverRating, setHoverRating] = useState(0); // When mouse hovers over stars
  const [selectedRating, setSelectedRating] = useState(initialRating); // Selected rating

  // Update selected rating if initialRating changes
  useEffect(() => {
    setSelectedRating(initialRating);
  }, [initialRating]);

  // Size classes
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    '2xl': "text-3xl"
  }[size] || "text-xl";
  
  // Color classes for filled stars
  const filledColorClasses = {
    primary: "text-primary-500",
    secondary: "text-secondary-500",
    accent: "text-accent-500",
    warning: "text-warning-400",
    success: "text-success-500",
    danger: "text-danger-500",
    gold: "text-yellow-400"
  }[color] || "text-warning-400";
  
  // Color classes for empty stars
  const emptyColorClasses = {
    primary: "text-primary-200",
    secondary: "text-secondary-200",
    accent: "text-accent-200",
    warning: "text-warning-200",
    success: "text-success-200",
    danger: "text-danger-200",
    gold: "text-gray-300"
  }[color] || "text-gray-300";
  
  // Spacing classes
  const spacingClasses = {
    none: "mr-0",
    xs: "mr-0.5",
    sm: "mr-1",
    md: "mr-1.5",
    lg: "mr-2"
  }[spacing] || "mr-1";
  
  // Animation classes
  const animationClasses = animated ? "animate-fadeIn" : "";

  const handleClick = (ratingValue, isHalf = false) => {
    const newRating = isHalf ? ratingValue - 0.5 : ratingValue;
    setSelectedRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating); // Return rating to parent component
    }
  };

  const handleMouseMove = (e, ratingValue) => {
    if (!allowHalfStar) {
      setHoverRating(ratingValue);
      return;
    }
    
    // For half star functionality
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const isHalfStar = e.clientX - rect.left < halfWidth;
    
    setHoverRating(isHalfStar ? ratingValue - 0.5 : ratingValue);
  };

  return (
    <div className={`${animated ? 'animate-fadeIn' : ''}`}>
      {label && (
        <label className={`block mb-1 font-medium text-gray-700 dark:text-gray-300 ${sizeClasses}`}>
          {label}
        </label>
      )}
      
      <div className={`flex items-center ${animationClasses} ${className}`} {...props}>
        {[...Array(maxRating)].map((_, index) => {
          const ratingValue = index + 1;
          const currentRating = hoverRating || selectedRating;
          
          // Determine if this star should be full, half, or empty
          let starComponent;
          if (currentRating >= ratingValue) {
            starComponent = <FaStar className={`${filledColorClasses} transition-all duration-200`} />;
          } else if (currentRating + 0.5 === ratingValue && allowHalfStar) {
            starComponent = <FaStarHalfAlt className={`${filledColorClasses} transition-all duration-200`} />;
          } else {
            starComponent = <FaRegStar className={`${emptyColorClasses} transition-all duration-200`} />;
          }
          
          return (
            <button
              key={ratingValue}
              type="button" // Prevent form submission
              onClick={(e) => handleClick(ratingValue, allowHalfStar && e.clientX - e.currentTarget.getBoundingClientRect().left < e.currentTarget.getBoundingClientRect().width / 2)}
              onMouseMove={(e) => handleMouseMove(e, ratingValue)}
              onMouseEnter={(e) => handleMouseMove(e, ratingValue)}
              onMouseLeave={() => setHoverRating(0)}
              className={`${spacingClasses} ${sizeClasses} cursor-pointer focus:outline-none hover:scale-110 transition-transform duration-200`}
              aria-label={`Rate ${ratingValue} out of ${maxRating}`}
            >
              {starComponent}
            </button>
          );
        })}
        
        {/* Show numerical value if requested */}
        {showValue && (
          <span className={`ml-2 font-medium text-gray-700 dark:text-gray-300 ${sizeClasses}`}>
            {Number(hoverRating || selectedRating).toFixed(allowHalfStar ? 1 : 0)}
          </span>
        )}
      </div>
    </div>
  );
};

export default InteractiveRatingStars;