// // src/components/RatingStars.jsx

// import React from 'react';
// import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa'; // Star icons

// const RatingStars = ({ 
//   rating, 
//   maxRating = 5, 
//   className = '',
//   size = 'md',
//   color = 'warning',
//   showValue = false,
//   animated = false,
//   spacing = 'sm',
//   ...props
// }) => {
//   // Size classes
//   const sizeClasses = {
//     xs: "text-xs",
//     sm: "text-sm",
//     md: "text-lg",
//     lg: "text-xl",
//     xl: "text-2xl"
//   }[size] || "text-lg";
  
//   // Color classes for filled stars
//   const filledColorClasses = {
//     primary: "text-primary-500",
//     secondary: "text-secondary-500",
//     accent: "text-accent-500",
//     warning: "text-warning-400",
//     success: "text-success-500",
//     danger: "text-danger-500",
//     gold: "text-yellow-400"
//   }[color] || "text-warning-400";
  
//   // Color classes for empty stars
//   const emptyColorClasses = {
//     primary: "text-primary-200",
//     secondary: "text-secondary-200",
//     accent: "text-accent-200",
//     warning: "text-warning-200",
//     success: "text-success-200",
//     danger: "text-danger-200",
//     gold: "text-gray-300"
//   }[color] || "text-gray-300";
  
//   // Spacing classes
//   const spacingClasses = {
//     none: "mr-0",
//     xs: "mr-0.5",
//     sm: "mr-1",
//     md: "mr-1.5",
//     lg: "mr-2"
//   }[spacing] || "mr-0.5";
  
//   // Animation classes
//   const animationClasses = animated ? "animate-fadeIn" : "";

//   const stars = [];
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0; // Check if rating has decimal part

//   // Create full stars
//   for (let i = 0; i < fullStars; i++) {
//     stars.push(
//       <FaStar 
//         key={`full-${i}`} 
//         className={`transition-all duration-200 ${filledColorClasses} hover:scale-110`} 
//       />
//     );
//   }

//   // Add half star if needed
//   if (hasHalfStar) {
//     stars.push(
//       <FaStarHalfAlt 
//         key="half" 
//         className={`transition-all duration-200 ${filledColorClasses} hover:scale-110`} 
//       />
//     );
//   }

//   // Add empty stars
//   for (let i = stars.length; i < maxRating; i++) {
//     stars.push(
//       <FaRegStar 
//         key={`empty-${i}`} 
//         className={`transition-all duration-200 ${emptyColorClasses} hover:scale-110`} 
//       />
//     );
//   }

//   return (
//     <div className={`flex items-center ${animationClasses} ${className}`} {...props}>
//       {stars.map((star, index) => (
//         <span key={index} className={`${spacingClasses} ${sizeClasses}`}>
//           {star}
//         </span>
//       ))}
      
//       {/* Show numerical value if requested */}
//       {showValue && (
//         <span className={`ml-1.5 font-medium text-gray-700 dark:text-gray-300 ${sizeClasses}`}>
//           {Number(rating).toFixed(1)}
//         </span>
//       )}
//     </div>
//   );
// };

// export default RatingStars;


import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa" // Star icons

const RatingStars = ({
  rating,
  maxRating = 5,
  className = "",
  size = "md",
  color = "warning",
  showValue = false,
  animated = false,
  spacing = "sm",
  ...props
}) => {
  // Size classes
  const sizeClasses =
    {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
    }[size] || "text-lg"

  // Color classes for filled stars
  const filledColorClasses =
    {
      primary: "text-indigo-500",
      secondary: "text-gray-500",
      accent: "text-purple-500",
      warning: "text-yellow-400",
      success: "text-green-500",
      danger: "text-red-500",
      gold: "text-yellow-400",
    }[color] || "text-yellow-400"

  // Color classes for empty stars
  const emptyColorClasses =
    {
      primary: "text-indigo-200",
      secondary: "text-gray-200",
      accent: "text-purple-200",
      warning: "text-yellow-200",
      success: "text-green-200",
      danger: "text-red-200",
      gold: "text-gray-300",
    }[color] || "text-gray-300"

  // Spacing classes
  const spacingClasses =
    {
      none: "mr-0",
      xs: "mr-0.5",
      sm: "mr-1",
      md: "mr-1.5",
      lg: "mr-2",
    }[spacing] || "mr-0.5"

  // Animation classes
  const animationClasses = animated ? "animate-fadeIn" : ""

  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0 // Check if rating has decimal part

  // Create full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar key={`full-${i}`} className={`transition-all duration-200 ${filledColorClasses} hover:scale-110`} />,
    )
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt key="half" className={`transition-all duration-200 ${filledColorClasses} hover:scale-110`} />,
    )
  }

  // Add empty stars
  for (let i = stars.length; i < maxRating; i++) {
    stars.push(
      <FaRegStar key={`empty-${i}`} className={`transition-all duration-200 ${emptyColorClasses} hover:scale-110`} />,
    )
  }

  return (
    <div className={`flex items-center ${animationClasses} ${className}`} {...props}>
      {stars.map((star, index) => (
        <span key={index} className={`${spacingClasses} ${sizeClasses}`}>
          {star}
        </span>
      ))}

      {/* Show numerical value if requested */}
      {showValue && (
        <span className={`ml-1.5 font-medium text-gray-700 dark:text-gray-300 ${sizeClasses}`}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default RatingStars
