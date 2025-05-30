import React from "react"
import { cn } from "@/lib/utils"
import { badgeVariants } from "@/lib/badge-variants"

function Badge({ 
  className, 
  variant, 
  size,
  rounded,
  icon,
  iconPosition = 'left',
  animated = false,
  ...props 
}) {
  // Animation classes
  const animationClasses = animated ? 'animate-fadeIn' : '';
  
  return (
    <div 
      className={cn(
        badgeVariants({ variant, size, rounded }), 
        animationClasses,
        'flex items-center justify-center gap-1.5',
        className
      )} 
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="inline-flex">{icon}</span>
      )}
      <span>{props.children}</span>
      {icon && iconPosition === 'right' && (
        <span className="inline-flex">{icon}</span>
      )}
    </div>
  );
}

export { Badge, badgeVariants }
