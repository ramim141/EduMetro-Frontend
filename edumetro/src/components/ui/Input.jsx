"use client"

import { forwardRef } from "react"
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaSearch,
  FaCalendar,
  FaPhone,
  FaBookOpen,
} from "react-icons/fa"

const Input = forwardRef(
  ({ label, type = "text", error, icon, size = "md", variant = "outlined", className = "", ...props }, ref) => {
    const renderIcon = () => {
      if (!icon) return null

      const iconProps = {
        className: `w-4 h-4 ${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} text-gray-400`,
      }

      switch (icon) {
        case "user":
          return <FaUser {...iconProps} />
        case "lock":
          return <FaLock {...iconProps} />
        case "envelope":
          return <FaEnvelope {...iconProps} />
        case "id-card":
          return <FaIdCard {...iconProps} />
        case "building":
          return <FaBuilding {...iconProps} />
        case "search":
          return <FaSearch {...iconProps} />
        case "calendar":
          return <FaCalendar {...iconProps} />
        case "phone":
          return <FaPhone {...iconProps} />
        case "book-open":
          return <FaBookOpen {...iconProps} />
        default:
          return null
      }
    }

    const getVariantClasses = () => {
      const baseClasses =
        "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
      const errorClasses = error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"

      const variants = {
        outlined: `${baseClasses} ${errorClasses} bg-white`,
        filled: `${baseClasses} ${errorClasses} bg-gray-50`,
        flushed: "w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent rounded-none",
      }

      return variants[variant]
    }

    const getSizeClasses = () => {
      const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
      }

      return sizes[size]
    }

    return (
      <div className={`w-full ${className}`}>
        {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">{renderIcon()}</div>
          )}
          <input
            ref={ref}
            type={type}
            className={`${getVariantClasses()} ${getSizeClasses()} ${icon ? "pl-10" : ""}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
