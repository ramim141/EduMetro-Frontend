"use client"

import { motion } from "framer-motion"
import { FaUser } from "react-icons/fa"

const Avatar = ({
  src,
  alt,
  size = "md",
  status,
  className = "",
  onClick,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8 text-xs"
      case "lg":
        return "w-16 h-16 text-lg"
      case "xl":
        return "w-24 h-24 text-2xl"
      default:
        return "w-12 h-12 text-base"
    }
  }

  const getStatusClasses = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return ""
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const baseClasses = "relative inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden"
  const clickableClasses = onClick ? "cursor-pointer hover:opacity-90" : ""

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${baseClasses} ${getSizeClasses()} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500">
          {alt ? (
            <span className="font-medium">{getInitials(alt)}</span>
          ) : (
            <FaUser className="w-1/2 h-1/2" />
          )}
        </div>
      )}

      {/* Status Indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusClasses()}`}
        />
      )}
    </motion.div>
  )
}

export default Avatar 