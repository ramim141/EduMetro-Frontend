"use client"

import { Star } from "lucide-react"

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  size = "md",
  color = "warning",
  showValue = false,
  spacing = "md",
  className = "",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-6 h-6"
      case "xl":
        return "w-8 h-8"
      default:
        return "w-5 h-5"
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "text-primary-500"
      case "secondary":
        return "text-secondary-500"
      case "accent":
        return "text-accent-500"
      case "success":
        return "text-success-500"
      case "warning":
        return "text-yellow-500"
      case "danger":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getSpacingClasses = () => {
    switch (spacing) {
      case "none":
        return "gap-0"
      case "sm":
        return "gap-0.5"
      case "lg":
        return "gap-2"
      default:
        return "gap-1"
    }
  }

  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`star-${i}`}
        className={`${getSizeClasses()} ${getColorClasses()} fill-current`}
      />
    )
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <div key="half-star" className="relative">
        <Star className={`${getSizeClasses()} text-gray-300`} />
        <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
          <Star className={`${getSizeClasses()} ${getColorClasses()} fill-current`} />
        </div>
      </div>
    )
  }

  // Add empty stars
  const emptyStars = maxRating - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-star-${i}`}
        className={`${getSizeClasses()} text-gray-300`}
      />
    )
  }

  return (
    <div className={`flex items-center ${getSpacingClasses()} ${className}`}>
      {stars}
      {showValue && (
        <span className={`ml-1 text-sm font-medium ${getColorClasses()}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default RatingStars 