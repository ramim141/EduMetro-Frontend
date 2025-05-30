import React from 'react';
import { cn } from '@/lib/utils';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  animated = false,
  ...props 
}) => {
  // Base classes for all cards
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300';
  
  // Variant classes
  const variantClasses = {
    default: 'shadow-card border border-gray-100 dark:border-gray-700',
    elevated: 'shadow-card-lg border border-gray-50 dark:border-gray-700',
    outline: 'border border-gray-200 dark:border-gray-700 shadow-sm',
    filled: 'bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm',
    gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-card',
  }[variant] || 'shadow-card border border-gray-100 dark:border-gray-700';
  
  // Hover effect classes
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:translate-y-[-2px]' : '';
  
  // Animation classes
  const animationClasses = animated ? 'animate-fadeIn' : '';
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses,
        hoverClasses,
        animationClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card subcomponents for better organization
const CardHeader = ({ className = '', ...props }) => (
  <div className={cn('p-6 border-b border-gray-100 dark:border-gray-700', className)} {...props} />
);

const CardTitle = ({ className = '', ...props }) => (
  <h3 className={cn('text-xl font-semibold text-gray-900 dark:text-gray-100', className)} {...props} />
);

const CardDescription = ({ className = '', ...props }) => (
  <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)} {...props} />
);

const CardContent = ({ className = '', ...props }) => (
  <div className={cn('p-6', className)} {...props} />
);

const CardFooter = ({ className = '', ...props }) => (
  <div className={cn('p-6 pt-0 flex items-center', className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
