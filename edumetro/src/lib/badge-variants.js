// src/lib/badge-variants.js

import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 text-primary-700 hover:bg-primary-200 hover:text-primary-800 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800',
        secondary:
          'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 hover:text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800',
        accent:
          'bg-accent-100 text-accent-700 hover:bg-accent-200 hover:text-accent-800 dark:bg-accent-900 dark:text-accent-300 dark:hover:bg-accent-800',
        success:
          'bg-success-100 text-success-700 hover:bg-success-200 hover:text-success-800 dark:bg-success-900 dark:text-success-300 dark:hover:bg-success-800',
        warning:
          'bg-warning-100 text-warning-700 hover:bg-warning-200 hover:text-warning-800 dark:bg-warning-900 dark:text-warning-300 dark:hover:bg-warning-800',
        danger:
          'bg-danger-100 text-danger-700 hover:bg-danger-200 hover:text-danger-800 dark:bg-danger-900 dark:text-danger-300 dark:hover:bg-danger-800',
        outline:
          'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
        gradient:
          'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600',
        soft:
          'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
      rounded: {
        default: 'rounded-full',
        md: 'rounded-md',
        lg: 'rounded-lg',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'default',
    },
  }
);