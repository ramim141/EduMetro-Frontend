"use client"

import { motion } from "framer-motion"
import { FaFilter, FaUniversity, FaStar, FaBookOpen, FaSort, FaTimes } from "react-icons/fa"
import Input from "./Input"
import Dropdown from "./ui/Dropdown"
import Button from "./Button"
import RatingStars from "./RatingStars"

const FilterSidebar = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  className = "",
}) => {
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
    {
      value: "2",
      label: (
        <div className="flex items-center">
          <RatingStars rating={2} size="sm" />
          <span className="ml-2">2+ Stars</span>
        </div>
      ),
    },
    {
      value: "1",
      label: (
        <div className="flex items-center">
          <RatingStars rating={1} size="sm" />
          <span className="ml-2">1+ Stars</span>
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 z-50 flex flex-col h-screen bg-white/95 backdrop-blur-lg border-r border-gray-200 shadow-xl transition-all duration-300 ${
          isOpen ? "w-80" : "w-0 lg:w-80"
        } ${className}`}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Header */}
        <div className="relative p-6 text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
          <motion.div
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-3 items-center">
              <motion.div
                className="p-2 rounded-lg bg-white/20"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <FaFilter className="w-5 h-5" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Filter & Sort</h2>
                <p className="text-sm text-indigo-100">Find your perfect notes</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 text-white rounded-lg transition-colors hover:bg-white/20 lg:hidden"
              aria-label="Close filters"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Filter Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Input
              icon="search"
              type="text"
              placeholder="Search notes, courses, authors..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full"
              label="Search"
            />
          </motion.div>

          {/* Course Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Input
              type="text"
              label={
                <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                  <FaBookOpen className="w-4 h-4 text-indigo-500" />
                  Course
                </div>
              }
              placeholder="Enter course name or code..."
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
              className="w-full"
            />
          </motion.div>

          {/* Department Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Input
              type="text"
              label={
                <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                  <FaUniversity className="w-4 h-4 text-indigo-500" />
                  Department
                </div>
              }
              placeholder="Enter department name..."
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="w-full"
            />
          </motion.div>

          {/* Rating Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Dropdown
              label={
                <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                  <FaStar className="w-4 h-4 text-yellow-500" />
                  Minimum Rating
                </div>
              }
              options={ratingOptions}
              value={filters.rating}
              onChange={(e) => handleFilterChange("rating", e.target.value)}
              placeholder="Select minimum rating"
              className="w-full"
            />
          </motion.div>

          {/* Sort Options */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Dropdown
              label={
                <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                  <FaSort className="w-4 h-4 text-indigo-500" />
                  Sort By
                </div>
              }
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              placeholder="Select sort option"
              className="w-full"
            />
          </motion.div>

          {/* Filter Summary */}
          <motion.div
            className="p-4 bg-gray-50 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Active Filters</h4>
            <div className="space-y-1 text-xs text-gray-600">
              {filters.search && <div>Search: "{filters.search}"</div>}
              {filters.course && <div>Course: {filters.course}</div>}
              {filters.department && <div>Department: {filters.department}</div>}
              {filters.rating && <div>Rating: {filters.rating}+ stars</div>}
              {!filters.search && !filters.course && !filters.department && !filters.rating && (
                <div className="text-gray-400">No active filters</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-3 bg-gray-50 border-t border-gray-200">
          <Button onClick={onApplyFilters} className="w-full" size="md" variant="primary">
            <FaFilter className="mr-2 w-4 h-4" />
            Apply Filters
          </Button>
          <Button onClick={onClearFilters} variant="outline" className="w-full" size="md">
            <FaTimes className="mr-2 w-4 h-4" />
            Clear All
          </Button>
        </div>
      </motion.aside>
    </>
  )
}

export default FilterSidebar
