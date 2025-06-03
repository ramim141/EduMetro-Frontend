"use client"

import { motion } from "framer-motion"

const Heading = ({
  children,
  level = 1,
  size,
  className = "",
  align = "left",
  color = "gray-900",
  weight = "semibold",
  truncate = false,
}) => {
  const getSizeClasses = () => {
    if (size) {
      switch (size) {
        case "xs":
          return "text-xs"
        case "sm":
          return "text-sm"
        case "md":
          return "text-base"
        case "lg":
          return "text-lg"
        case "xl":
          return "text-xl"
        case "2xl":
          return "text-2xl"
        case "3xl":
          return "text-3xl"
        case "4xl":
          return "text-4xl"
        default:
          return "text-base"
      }
    }

    // Default sizes based on heading level
    switch (level) {
      case 1:
        return "text-4xl"
      case 2:
        return "text-3xl"
      case 3:
        return "text-2xl"
      case 4:
        return "text-xl"
      case 5:
        return "text-lg"
      case 6:
        return "text-base"
      default:
        return "text-base"
    }
  }

  const getWeightClasses = () => {
    switch (weight) {
      case "light":
        return "font-light"
      case "normal":
        return "font-normal"
      case "medium":
        return "font-medium"
      case "semibold":
        return "font-semibold"
      case "bold":
        return "font-bold"
      default:
        return "font-semibold"
    }
  }

  const getAlignClasses = () => {
    switch (align) {
      case "center":
        return "text-center"
      case "right":
        return "text-right"
      case "justify":
        return "text-justify"
      default:
        return "text-left"
    }
  }

  const baseClasses = `text-${color} ${getSizeClasses()} ${getWeightClasses()} ${getAlignClasses()}`
  const truncateClasses = truncate ? "truncate" : ""
  const Tag = `h${level}`

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Tag className={`${baseClasses} ${truncateClasses} ${className}`}>{children}</Tag>
    </motion.div>
  )
}

export default Heading
