// START OF FILE Card.jsx
"use client"

import { motion } from "framer-motion"

// Main Card Wrapper
const Card = ({ children, className = "", hover = false, onClick }) => {
  const baseClasses = "bg-white rounded-xl shadow-sm overflow-hidden"
  const hoverClasses = hover
    ? "transition-all duration-200 hover:shadow-md hover:-translate-y-1"
    : ""
  const clickableClasses = onClick ? "cursor-pointer" : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// Card Header Component
const CardHeader = ({ children, className = "", borderBottom = true }) => (
  <div className={`p-6 pb-4 ${borderBottom ? "border-b border-slate-100" : ""} ${className}`}>
    {children}
  </div>
)

// Card Content Component
const CardContent = ({ children, className = "", padding = true }) => (
  <div className={`${padding ? "p-6" : "p-0"} ${className}`}>
    {children}
  </div>
)

// Card Footer Component
const CardFooter = ({ children, className = "", borderTop = true }) => (
  <div className={`p-6 pt-4 ${borderTop ? "border-t border-slate-100" : ""} ${className}`}>
    {children}
  </div>
)

export { Card, CardHeader, CardContent, CardFooter }
// END OF FILE Card.jsx