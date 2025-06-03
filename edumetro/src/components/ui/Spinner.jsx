"use client"

import { motion } from "framer-motion"

const Spinner = ({ size = "md", color = "indigo" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-8 h-8"
      case "xl":
        return "w-12 h-12"
      default:
        return "w-6 h-6"
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "border-blue-500"
      case "green":
        return "border-green-500"
      case "red":
        return "border-red-500"
      case "yellow":
        return "border-yellow-500"
      case "purple":
        return "border-purple-500"
      default:
        return "border-indigo-500"
    }
  }

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`${getSizeClasses()} border-2 border-t-transparent rounded-full ${getColorClasses()}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

export default Spinner 