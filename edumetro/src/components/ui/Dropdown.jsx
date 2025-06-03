"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaChevronDown } from "react-icons/fa"

const Dropdown = ({
  trigger,
  items,
  align = "left",
  width = "w-48",
  onSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (item) => {
    onSelect?.(item)
    setIsOpen(false)
  }

  const getAlignmentClasses = () => {
    switch (align) {
      case "right":
        return "right-0"
      case "center":
        return "left-1/2 -translate-x-1/2"
      default:
        return "left-0"
    }
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
        <FaChevronDown
          className={`ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 mt-2 ${width} ${getAlignmentClasses()}`}
          >
            <div className="py-1 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 ${
                    item.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={item.disabled}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown 