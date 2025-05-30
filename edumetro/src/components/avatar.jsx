"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ 
  className, 
  size = "md",
  variant = "default",
  status,
  statusPosition = "bottom-right",
  animated = false,
  ...props 
}, ref) => {
  // Size classes
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20"
  }[size] || "h-10 w-10";
  
  // Variant classes
  const variantClasses = {
    default: "rounded-full",
    rounded: "rounded-xl",
    square: "rounded-none"
  }[variant] || "rounded-full";
  
  // Animation classes
  const animationClasses = animated ? "animate-fadeIn" : "";
  
  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md",
          sizeClasses,
          variantClasses,
          animationClasses,
          className
        )}
        {...props}
      />
      
      {status && (
        <span 
          className={cn(
            "absolute block rounded-full ring-2 ring-white",
            {
              "w-2.5 h-2.5": size === "xs" || size === "sm",
              "w-3 h-3": size === "md",
              "w-3.5 h-3.5": size === "lg" || size === "xl" || size === "2xl"
            },
            {
              "bg-success-500": status === "online",
              "bg-warning-500": status === "away",
              "bg-danger-500": status === "busy",
              "bg-gray-400": status === "offline"
            },
            {
              "bottom-0 right-0": statusPosition === "bottom-right",
              "bottom-0 left-0": statusPosition === "bottom-left",
              "top-0 right-0": statusPosition === "top-right",
              "top-0 left-0": statusPosition === "top-left"
            }
          )}
        />
      )}
    </div>
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover transition-opacity duration-300", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium transition-colors duration-200",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
