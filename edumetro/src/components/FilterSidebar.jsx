"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FaFilter, FaSearch, FaTimes, FaPencilAlt, FaUniversity, FaStar, FaSort } from "react-icons/fa"
import Input from "./Input"
import Dropdown from "./ui/Dropdown"
import Button from "./Button"
import RatingStars from "./RatingStars"
import { useEffect, useState } from "react"

const FilterSidebar = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  className = "",
}) => {
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === "sortBy") return false
      return value && value.toString().trim() !== ""
    }).length
    setActiveFiltersCount(count)
  }, [filters])

  const ratingOptions = [
    { value: "", label: "Any Rating" },
    {
      value: "5",
      label: (
        <div className="flex items-center">
          <RatingStars rating={5} size="sm" />
          <span className="ml-2">5 Stars</span>
        </div>
      ),
    },
    {
      value: "4",
      label: (
        <div className="flex items-center">
          <RatingStars rating={4} size="sm" />
          <span className="ml-2">4+ Stars</span>
        </div>
      ),
    },
    {
      value: "3",
      label: (
        <div className="flex items-center">
          <RatingStars rating={3} size="sm" />
          <span className="ml-2">3+ Stars</span>
        </div>
      ),
    },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "downloads", label: "Most Downloaded" },
    { value: "likes", label: "Most Liked" },
    { value: "views", label: "Most Viewed" },
  ]

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className={`w-80 bg-white border-r border-gray-200 shadow-lg rounded-xl ${className}`}
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Header */}
          <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
                  <FaFilter className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    Smart Filters
                    <FaPencilAlt className="w-4 h-4" />
                  </h2>
                  <p className="text-sm text-purple-100">Refine your search</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 transition-colors rounded-lg text-white/80 hover:text-white hover:bg-white/20"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Quick Search */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaSearch className="w-4 h-4 text-blue-500" />
                Quick Search
              </div>
              <Input
                type="text"
                placeholder="Search notes, topics, authors..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Course Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Course
              </div>
              <Input
                type="text"
                placeholder="e.g., Computer Science 101"
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Department Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaUniversity className="w-4 h-4 text-purple-500" />
                Department
              </div>
              <Input
                type="text"
                placeholder="e.g., Engineering, Science"
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaStar className="w-4 h-4 text-yellow-500" />
                Minimum Rating
              </div>
              <Dropdown
                options={ratingOptions}
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                placeholder="Select minimum rating"
                className="w-full"
              />
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaSort className="w-4 h-4 text-indigo-500" />
                Sort By
              </div>
              <Dropdown
                options={sortOptions}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                placeholder="Select sort option"
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-3 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={onApplyFilters}
              className="w-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="md"
            >
              Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            <Button
              onClick={onClearFilters}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-100"
              size="md"
            >
              Clear All Filters
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default FilterSidebar
