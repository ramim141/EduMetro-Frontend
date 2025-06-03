"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa"

const Message = ({ type = "info", message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <FaExclamationCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <FaExclamationCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <FaInfoCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50"
      case "error":
        return "bg-red-50"
      case "warning":
        return "bg-yellow-50"
      default:
        return "bg-blue-50"
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-200"
      case "error":
        return "border-red-200"
      case "warning":
        return "border-yellow-200"
      default:
        return "border-blue-200"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 mb-4 rounded-lg border ${getBackgroundColor()} ${getBorderColor()}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1 ml-3">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
            {onClose && (
              <button
                onClick={() => {
                  setIsVisible(false)
                  onClose()
                }}
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Message
