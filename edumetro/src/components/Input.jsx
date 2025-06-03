// // src/components/Input.jsx

// import React from 'react';
// // Import icons from react-icons
// import { FaUser, FaLock, FaEnvelope, FaIdCard, FaBuilding, FaSearch, FaCalendar, FaPhone } from 'react-icons/fa';

// const Input = ({ 
//   icon, 
//   type = 'text', 
//   placeholder, 
//   value, 
//   onChange, 
//   className = '', 
//   label,
//   error,
//   size = 'md',
//   variant = 'default',
//   ...props 
// }) => {
//   // Size classes
//   const sizeClasses = {
//     sm: "py-1 text-xs",
//     md: "py-1.5 text-sm",
//     lg: "py-2 text-base",
//     xl: "py-2.5 text-lg"
//   }[size] || "py-1.5 text-sm";

//   // Icon mapping with enhanced styling
//   const renderIcon = () => {
//     const iconClass = "group-hover:text-primary-600 group-focus-within:text-primary-600 transition-colors duration-200";
//     const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 20 : 16;
    
//     switch (icon) {
//       case 'user':
//         return <FaUser className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       case 'lock':
//         return <FaLock className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       case 'envelope':
//         return <FaEnvelope className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       case 'idcard': // For Student ID
//         return <FaIdCard className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       case 'building': // For general organization/student ID context
//         return <FaBuilding className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       case 'search':
//         return <FaSearch className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       case 'calendar':
//         return <FaCalendar className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       case 'phone':
//         return <FaPhone className={`text-primary-500 ${iconClass}`} size={iconSize} />;
//       default:
//         return null;
//     }
//   };

//   // Get variant classes
//   const getVariantClasses = () => {
//     if (error) {
//       return 'border-danger-500 focus-within:ring-danger-400 focus-within:border-danger-500';
//     }
    
//     switch (variant) {
//       case 'filled':
//         return 'bg-gray-50 border-gray-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-primary-400 focus-within:border-primary-500';
//       case 'outline':
//         return 'bg-transparent border-gray-300 hover:border-primary-300 focus-within:ring-primary-400 focus-within:border-primary-500';
//       case 'underlined':
//         return 'border-t-0 border-l-0 border-r-0 border-b-2 rounded-none hover:border-primary-300 focus-within:ring-0 focus-within:border-primary-500';
//       default:
//         return 'border-gray-300 hover:border-primary-300 focus-within:ring-primary-400 focus-within:border-primary-500';
//     }
//   };

//   return (
//     <div className={`mb-4 ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors duration-200">
//           {label}
//           {props.required && <span className="ml-1 text-danger-500">*</span>}
//         </label>
//       )}
      
//       <div className={`group relative flex items-center border ${getVariantClasses()} rounded-xl p-2.5 shadow-sm hover:shadow-input transition-all duration-300 ease-in-out focus-within:shadow-input-focus focus-within:ring-2`}>
//         {icon && (
//           <div className="absolute left-3 transition-all duration-200 ease-in-out">
//             {renderIcon()}
//           </div>
//         )}
//         <input
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           className={`w-full ${sizeClasses} pr-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 ${icon ? 'pl-9' : 'pl-3'}`}
//           {...props}
//         />
        
//         {/* Animated bottom border effect - enhanced with gradient */}
//         <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 w-0 group-hover:w-full group-focus-within:w-full transition-all duration-300 ease-in-out"></div>
//       </div>
      
//       {error && (
//         <p className="mt-1.5 text-sm text-danger-500 flex items-center animate-fadeIn">
//           <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           {error}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Input;


"use client"
// Import icons from react-icons
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaBuilding, FaSearch, FaCalendar, FaPhone } from "react-icons/fa"

const Input = ({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  label,
  error,
  size = "md",
  variant = "default",
  ...props
}) => {
  // Size classes
  const sizeClasses =
    {
      sm: "py-1 text-xs",
      md: "py-1.5 text-sm",
      lg: "py-2 text-base",
      xl: "py-2.5 text-lg",
    }[size] || "py-1.5 text-sm"

  // Icon mapping with enhanced styling
  const renderIcon = () => {
    const iconClass = "group-hover:text-primary-600 group-focus-within:text-primary-600 transition-colors duration-200"
    const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : size === "xl" ? 20 : 16

    switch (icon) {
      case "user":
        return <FaUser className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "lock":
        return <FaLock className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "envelope":
        return <FaEnvelope className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "idcard": // For Student ID
        return <FaIdCard className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "building": // For general organization/student ID context
        return <FaBuilding className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "search":
        return <FaSearch className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "calendar":
        return <FaCalendar className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "phone":
        return <FaPhone className={`text-primary-500 ${iconClass}`} size={iconSize} />
      case "book-open":
        return <FaBookOpen className={`text-primary-500 ${iconClass}`} size={iconSize} />
      default:
        return null
    }
  }

  // Get variant classes
  const getVariantClasses = () => {
    if (error) {
      return "border-danger-500 focus-within:ring-danger-400 focus-within:border-danger-500"
    }

    switch (variant) {
      case "filled":
        return "bg-gray-50 border-gray-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-primary-400 focus-within:border-primary-500"
      case "outline":
        return "bg-transparent border-gray-300 hover:border-primary-300 focus-within:ring-primary-400 focus-within:border-primary-500"
      case "underlined":
        return "border-t-0 border-l-0 border-r-0 border-b-2 rounded-none hover:border-primary-300 focus-within:ring-0 focus-within:border-primary-500"
      default:
        return "border-gray-300 hover:border-primary-300 focus-within:ring-primary-400 focus-within:border-primary-500"
    }
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors duration-200">
          {label}
          {props.required && <span className="ml-1 text-danger-500">*</span>}
        </label>
      )}

      <div
        className={`group relative flex items-center border ${getVariantClasses()} rounded-xl p-2.5 shadow-sm hover:shadow-input transition-all duration-300 ease-in-out focus-within:shadow-input-focus focus-within:ring-2`}
      >
        {icon && <div className="absolute left-3 transition-all duration-200 ease-in-out">{renderIcon()}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${sizeClasses} pr-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-200 ${icon ? "pl-9" : "pl-3"}`}
          {...props}
        />

        {/* Animated bottom border effect - enhanced with gradient */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 w-0 group-hover:w-full group-focus-within:w-full transition-all duration-300 ease-in-out"></div>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-danger-500 flex items-center animate-fadeIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
