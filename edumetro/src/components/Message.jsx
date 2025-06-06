// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';

// const Message = ({ type = 'info', message, onClose, duration = 3000 }) => {
//   const [isVisible, setIsVisible] = useState(true);
  
//   useEffect(() => {
//     if (duration && onClose) {
//       const timer = setTimeout(() => {
//         setIsVisible(false);
//         setTimeout(onClose, 300); // Wait for fade out animation before calling onClose
//       }, duration);
//       return () => clearTimeout(timer);
//     }
//   }, [duration, onClose]);

//   const styles = {
//     info: 'bg-blue-50 text-blue-800 border-blue-200',
//     success: 'bg-green-50 text-green-800 border-green-200',
//     error: 'bg-red-50 text-red-800 border-red-200',
//     warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
//   };
  
//   const iconStyles = {
//     info: (
//       <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//       </svg>
//     ),
//     success: (
//       <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//       </svg>
//     ),
//     error: (
//       <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 5a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
//       </svg>
//     ),
//     warning: (
//       <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//       </svg>
//     ),
//   };

//   return (
//     <div 
//       className={`flex items-center p-4 mb-4 rounded-lg border ${styles[type]} transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}
//       role="alert"
//     >
//       <div className="inline-flex flex-shrink-0 justify-center items-center mr-3 w-8 h-8 rounded-lg">
//         {iconStyles[type]}
//       </div>
//       <div className="text-sm font-medium">{message}</div>
//       {onClose && (
//         <button
//           onClick={() => {
//             setIsVisible(false);
//             setTimeout(onClose, 300);
//           }}
//           className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-25 hover:bg-gray-500 focus:outline-none focus:ring-gray-400"
//           aria-label="Close"
//         >
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//             <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
//       )}
//     </div>
//   );
// };

// Message.propTypes = {
//   type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
//   message: PropTypes.string.isRequired,
//   onClose: PropTypes.func,
//   duration: PropTypes.number,
// };

// export default Message;


"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"

const Message = ({ type = "info", message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for fade out animation before calling onClose
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const styles = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  }

  const iconStyles = {
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg
        className="w-5 h-5 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 5a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5 text-yellow-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg border ${styles[type]} transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"}`}
      role="alert"
    >
      <div className="inline-flex flex-shrink-0 justify-center items-center mr-3 w-8 h-8 rounded-lg">
        {iconStyles[type]}
      </div>
      <div className="text-sm font-medium">{message}</div>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-25 hover:bg-gray-500 focus:outline-none focus:ring-gray-400"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

Message.propTypes = {
  type: PropTypes.oneOf(["info", "success", "error", "warning"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  duration: PropTypes.number,
}

export default Message
