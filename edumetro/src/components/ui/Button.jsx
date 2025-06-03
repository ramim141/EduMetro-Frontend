"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { FaSpinner } from "react-icons/fa"

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
      outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
      ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    }

    const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
        disabled={isDisabled || isLoading}
        whileHover={!isDisabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!isDisabled && !isLoading ? { scale: 0.98 } : {}}
        {...props}
      >
        {isLoading && (
          <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = "Button"

export default Button 