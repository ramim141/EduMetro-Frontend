// src/components/Modal.jsx

"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes } from "react-icons/fa"

const Modal = ({ isOpen, onClose, title, children, size = "md", customClasses = '' }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-sm"
      case "md":
        return "max-w-md"
      case "lg":
        return "max-w-2xl"
      case "xl":
        return "max-w-4xl"
      default:
        return "max-w-md"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black bg-opacity-50"
          />

          {/* Modal Container (centers the modal content) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            // ✅ `p-4` সরানো হয়েছে।
            className="flex fixed inset-0 z-[9999] justify-center items-center"
          >
            {/* Modal Content Box */}
            <div
              ref={modalRef}
              // ✅ এখানে `p-0` বা `p-auto` ক্লাস যোগ করার দরকার নেই।
              // কারণ `customClasses` এ `p-0` বা `p-auto` থাকলে তা `Modal.jsx` এর `children` কে প্রভাবিত করবে।
              // `w-full bg-white rounded-xl shadow-xl` এর সাথে `getSizeClasses()` এবং `customClasses`
              className={`w-full bg-white rounded-xl shadow-xl ${getSizeClasses()} ${customClasses}`}
            >
              {/* Header (optional, only if title is provided) */}
              {title && (
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Content */}
              {/* ✅ এই div থেকে ডিফল্ট padding (p-4) সরিয়ে নিন, কারণ আপনার children এর নিজস্ব padding আছে */}
              <div>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;