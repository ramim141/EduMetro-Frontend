// // src/components/Pagination.jsx

// import React from 'react';
// import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

// const Pagination = ({
//   currentPage = 1,
//   totalPages = 1,
//   onPageChange,
//   className = '',
//   size = 'md',
//   variant = 'default',
//   showFirstLast = false,
//   showPageNumbers = true,
//   maxVisiblePages = 5,
//   animated = false,
//   disabled = false,
//   ariaLabel = 'Pagination navigation',
// }) => {
//   // Don't render pagination if there's only one page
//   if (totalPages <= 1) return null;

//   // Size classes
//   const sizeClasses = {
//     sm: 'text-xs h-7 w-7 min-w-7',
//     md: 'text-sm h-9 w-9 min-w-9',
//     lg: 'text-base h-11 w-11 min-w-11',
//     xl: 'text-lg h-12 w-12 min-w-12',
//   }[size] || 'text-sm h-9 w-9 min-w-9';

//   // Variant classes
//   const getVariantClasses = (isActive) => {
//     const baseClasses = 'flex items-center justify-center rounded-md transition-all duration-200';
    
//     if (isActive) {
//       switch (variant) {
//         case 'outline':
//           return `${baseClasses} bg-white text-primary-600 border-2 border-primary-600 font-bold`;
//         case 'filled':
//           return `${baseClasses} bg-primary-600 text-white font-bold`;
//         case 'minimal':
//           return `${baseClasses} bg-primary-100 text-primary-700 font-bold`;
//         case 'rounded':
//           return `${baseClasses} bg-primary-600 text-white font-bold rounded-full`;
//         default: // default
//           return `${baseClasses} bg-primary-600 text-white font-bold`;
//       }
//     } else {
//       switch (variant) {
//         case 'outline':
//           return `${baseClasses} bg-white text-gray-600 border border-gray-300 hover:border-primary-400 hover:text-primary-500`;
//         case 'filled':
//           return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
//         case 'minimal':
//           return `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-primary-600`;
//         case 'rounded':
//           return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full`;
//         default: // default
//           return `${baseClasses} bg-white text-gray-600 border border-gray-300 hover:border-primary-400 hover:text-primary-500`;
//       }
//     }
//   };

//   // Animation classes
//   const animationClasses = animated ? 'animate-fadeIn' : '';
  
//   // Disabled classes
//   const disabledClasses = disabled ? 'opacity-50 pointer-events-none' : '';

//   // Calculate visible page range
//   const getVisiblePageNumbers = () => {
//     if (totalPages <= maxVisiblePages) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }

//     // Always show first and last page
//     const halfVisible = Math.floor(maxVisiblePages / 2);
//     let startPage = Math.max(currentPage - halfVisible, 1);
//     let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

//     // Adjust if we're near the end
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(endPage - maxVisiblePages + 1, 1);
//     }

//     const pages = [];
    
//     // Add first page if not included
//     if (startPage > 1) {
//       pages.push(1);
//       if (startPage > 2) pages.push('ellipsis-start');
//     }

//     // Add visible pages
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     // Add last page if not included
//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) pages.push('ellipsis-end');
//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   const visiblePages = showPageNumbers ? getVisiblePageNumbers() : [];

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages || page === currentPage || disabled) return;
//     onPageChange(page);
//   };

//   return (
//     <nav 
//       className={`flex justify-center items-center mt-6 space-x-1 ${className} ${animationClasses} ${disabledClasses}`}
//       aria-label={ariaLabel}
//     >
//       {/* First page button */}
//       {showFirstLast && (
//         <button
//           onClick={() => handlePageChange(1)}
//           disabled={currentPage === 1 || disabled}
//           className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
//           aria-label="Go to first page"
//         >
//           <FaChevronLeft className="mr-0.5" />
//           <FaChevronLeft className="-ml-3" />
//         </button>
//       )}

//       {/* Previous page button */}
//       <button
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage === 1 || disabled}
//         className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
//         aria-label="Previous page"
//       >
//         <FaChevronLeft />
//       </button>

//       {/* Page numbers */}
//       {showPageNumbers && visiblePages.map((page, index) => {
//         if (page === 'ellipsis-start' || page === 'ellipsis-end') {
//           return (
//             <span 
//               key={`ellipsis-${page}`} 
//               className={`flex justify-center items-center text-gray-500 ${sizeClasses}`}
//             >
//               <FaEllipsisH />
//             </span>
//           );
//         }

//         return (
//           <button
//             key={`page-${page}`}
//             onClick={() => handlePageChange(page)}
//             className={`${sizeClasses} ${getVariantClasses(page === currentPage)}`}
//             aria-label={`Page ${page}`}
//             aria-current={page === currentPage ? 'page' : undefined}
//           >
//             {page}
//           </button>
//         );
//       })}

//       {/* Next page button */}
//       <button
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage === totalPages || disabled}
//         className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
//         aria-label="Next page"
//       >
//         <FaChevronRight />
//       </button>

//       {/* Last page button */}
//       {showFirstLast && (
//         <button
//           onClick={() => handlePageChange(totalPages)}
//           disabled={currentPage === totalPages || disabled}
//           className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
//           aria-label="Go to last page"
//         >
//           <FaChevronRight className="mr-0.5" />
//           <FaChevronRight className="-ml-3" />
//         </button>
//       )}
//     </nav>
//   );
// };

// export default Pagination;


"use client"
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa"

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
  size = "md",
  variant = "default",
  showFirstLast = false,
  showPageNumbers = true,
  maxVisiblePages = 5,
  animated = false,
  disabled = false,
  ariaLabel = "Pagination navigation",
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null

  // Size classes
  const sizeClasses =
    {
      sm: "text-xs h-7 w-7 min-w-7",
      md: "text-sm h-9 w-9 min-w-9",
      lg: "text-base h-11 w-11 min-w-11",
      xl: "text-lg h-12 w-12 min-w-12",
    }[size] || "text-sm h-9 w-9 min-w-9"

  // Variant classes
  const getVariantClasses = (isActive) => {
    const baseClasses = "flex items-center justify-center rounded-md transition-all duration-200"

    if (isActive) {
      switch (variant) {
        case "outline":
          return `${baseClasses} bg-white text-primary-600 border-2 border-primary-600 font-bold`
        case "filled":
          return `${baseClasses} bg-primary-600 text-white font-bold`
        case "minimal":
          return `${baseClasses} bg-primary-100 text-primary-700 font-bold`
        case "rounded":
          return `${baseClasses} bg-primary-600 text-white font-bold rounded-full`
        default: // default
          return `${baseClasses} bg-primary-600 text-white font-bold`
      }
    } else {
      switch (variant) {
        case "outline":
          return `${baseClasses} bg-white text-gray-600 border border-gray-300 hover:border-primary-400 hover:text-primary-500`
        case "filled":
          return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`
        case "minimal":
          return `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-primary-600`
        case "rounded":
          return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full`
        default: // default
          return `${baseClasses} bg-white text-gray-600 border border-gray-300 hover:border-primary-400 hover:text-primary-500`
      }
    }
  }

  // Animation classes
  const animationClasses = animated ? "animate-fadeIn" : ""

  // Disabled classes
  const disabledClasses = disabled ? "opacity-50 pointer-events-none" : ""

  // Calculate visible page range
  const getVisiblePageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first and last page
    const halfVisible = Math.floor(maxVisiblePages / 2)
    let startPage = Math.max(currentPage - halfVisible, 1)
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1)
    }

    const pages = []

    // Add first page if not included
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push("ellipsis-start")
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add last page if not included
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("ellipsis-end")
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = showPageNumbers ? getVisiblePageNumbers() : []

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) return
    onPageChange(page)
  }

  return (
    <nav
      className={`flex justify-center items-center mt-6 space-x-1 ${className} ${animationClasses} ${disabledClasses}`}
      aria-label={ariaLabel}
    >
      {/* First page button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || disabled}
          className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label="Go to first page"
        >
          <FaChevronLeft className="mr-0.5" />
          <FaChevronLeft className="-ml-3" />
        </button>
      )}

      {/* Previous page button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {/* Page numbers */}
      {showPageNumbers &&
        visiblePages.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span
                key={`ellipsis-${page}`}
                className={`flex justify-center items-center text-gray-500 ${sizeClasses}`}
              >
                <FaEllipsisH />
              </span>
            )
          }

          return (
            <button
              key={`page-${page}`}
              onClick={() => handlePageChange(page)}
              className={`${sizeClasses} ${getVariantClasses(page === currentPage)}`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        })}

      {/* Next page button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>

      {/* Last page button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || disabled}
          className={`${sizeClasses} ${getVariantClasses(false)} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label="Go to last page"
        >
          <FaChevronRight className="mr-0.5" />
          <FaChevronRight className="-ml-3" />
        </button>
      )}
    </nav>
  )
}

export default Pagination
