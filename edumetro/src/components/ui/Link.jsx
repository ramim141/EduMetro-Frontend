"use client"

import { motion } from "framer-motion"
import { Link as RouterLink } from "react-router-dom"

const Link = ({
  to,
  children,
  variant = "default",
  className = "",
  external = false,
  onClick,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "text-indigo-600 hover:text-indigo-700"
      case "secondary":
        return "text-gray-600 hover:text-gray-700"
      case "success":
        return "text-green-600 hover:text-green-700"
      case "danger":
        return "text-red-600 hover:text-red-700"
      case "warning":
        return "text-yellow-600 hover:text-yellow-700"
      default:
        return "text-blue-600 hover:text-blue-700"
    }
  }

  const baseClasses = "inline-flex items-center font-medium transition-colors duration-200"
  const variantClasses = getVariantClasses()

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault()
      onClick(e)
    }
  }

  if (external) {
    return (
      <motion.a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses} ${className}`}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <RouterLink
        to={to}
        className={`${baseClasses} ${variantClasses} ${className}`}
        onClick={handleClick}
      >
        {children}
      </RouterLink>
    </motion.div>
  )
}

export default Link 