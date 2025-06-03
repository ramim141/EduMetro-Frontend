"use client"

import { motion } from "framer-motion"

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      case "purple":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs"
      case "lg":
        return "px-3 py-1 text-sm"
      default:
        return "px-2.5 py-0.5 text-sm"
    }
  }

  const baseClasses = "inline-flex items-center font-medium rounded-full"
  const clickableClasses = onClick ? "cursor-pointer hover:opacity-80" : ""

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  )
}

export default Badge 