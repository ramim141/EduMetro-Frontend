"use client"

import { motion } from "framer-motion"

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  hover = false,
  onClick,
  padding = true,
}) => {
  const baseClasses = "bg-white rounded-xl shadow-sm overflow-hidden"
  const paddingClasses = padding ? "p-6" : ""
  const hoverClasses = hover
    ? "transition-all duration-200 hover:shadow-md hover:-translate-y-1"
    : ""
  const clickableClasses = onClick ? "cursor-pointer" : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${paddingClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>

      {/* Footer */}
      {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
    </motion.div>
  )
}

export default Card 