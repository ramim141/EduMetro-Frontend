"use client"

import React from "react"

import { useState } from "react"
import { FaChevronDown, FaExclamationCircle } from "react-icons/fa"

const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  className = "",
  variant = "default",
  size = "md",
  error = "",
  placeholder = "",
  required = false,
  disabled = false,
  animated = false,
  icon = null,
  iconPosition = "left",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  // Size classes
  const sizeClasses =
    {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
      xl: "px-5 py-4 text-lg",
    }[size] || "px-3 py-2 text-sm"

  // Icon size classes
  const iconSizeClasses =
    {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    }[size] || "w-5 h-5"

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses =
      "w-full bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    const variantClasses =
      {
        default: "border-gray-300",
        error: "border-red-500",
        success: "border-green-500",
        warning: "border-yellow-500",
      }[error ? "error" : variant] || "border-gray-300"

    return `${baseClasses} ${variantClasses}`
  }

  // Animation classes
  const animationClasses = animated ? "animate-fadeIn" : ""

  // Disabled classes
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : ""

  // Placeholder text
  const placeholderText = placeholder || `Select ${label || "an option"}`

  return (
    <div className={`relative ${animationClasses} ${className}`}>
      {label && (
        <label className={`block mb-1 font-medium text-gray-700 ${disabled ? "opacity-60" : ""}`}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            {React.cloneElement(icon, { className: `${iconSizeClasses} text-gray-500` })}
          </div>
        )}

        <select
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${getVariantClasses()} 
            ${sizeClasses} 
            ${disabledClasses}
            ${icon && iconPosition === "left" ? "pl-10" : ""}
            pr-10
          `}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          {...props}
        >
          <option key="placeholder" value="">
            {placeholderText}
          </option>
          {Array.isArray(options) &&
            options.map((option, index) => (
              <option key={option.value || `option-${index}`} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>

        <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
          {error ? (
            <FaExclamationCircle className={`text-red-500 ${iconSizeClasses}`} aria-hidden="true" />
          ) : (
            <FaChevronDown
              className={`${iconSizeClasses} text-gray-400 transition-transform duration-200 ${isFocused ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{error}</p>}
    </div>
  )
}

export default Dropdown
