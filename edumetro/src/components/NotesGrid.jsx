"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FaBookOpen, FaThLarge, FaList, FaUsers, FaDownload } from "react-icons/fa"
import NoteCard from "./NoteCard"
import Spinner from "./Spinner"
import Button from "./Button"
import Pagination from "./Pagination"

const NotesGrid = ({
  notes,
  loading,
  error,
  totalNotes,
  currentPage,
  totalPages,
  viewMode,
  onViewModeChange,
  onPageChange,
  onLike,
  onBookmark,
  onDownload,
  onClearFilters,
  className = "",
}) => {
  const statsData = [
    { icon: FaBookOpen, label: `${totalNotes} Notes`, color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: FaUsers, label: "5K+ Students", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: FaDownload, label: "50K+ Downloads", color: "text-green-600", bg: "bg-green-50" },
  ]

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <motion.header
        className="sticky top-0 z-20 p-6 rounded-t-xl border-b border-gray-200 shadow-sm backdrop-blur-lg bg-white/95"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Stats Row */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <motion.div
            className="flex gap-4 items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`flex gap-3 items-center px-4 py-3 ${stat.bg} rounded-xl shadow-sm`}
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-sm font-semibold ${stat.color}`}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* View Mode Toggle */}
          <motion.div
            className="flex gap-1 items-center p-1 bg-gray-100 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="List view"
            >
              <FaList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Grid view"
            >
              <FaThLarge className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" error={error} />
          ) : notes.length === 0 ? (
            <EmptyState key="empty" onClearFilters={onClearFilters} />
          ) : (
            <NotesContent
              key="content"
              notes={notes}
              viewMode={viewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onLike={onLike}
              onBookmark={onBookmark}
              onDownload={onDownload}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const LoadingState = () => (
  <motion.div
    className="flex flex-col justify-center items-center space-y-6 h-96"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <Spinner size="xl" variant="primary" type="border" />
    <div className="text-center">
      <h3 className="mb-2 text-xl font-semibold text-gray-700">Loading Notes</h3>
      <p className="text-gray-500">Finding the best study materials for you...</p>
    </div>
  </motion.div>
)

const ErrorState = ({ error }) => (
  <motion.div
    className="flex flex-col justify-center items-center h-96 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
  >
    <div className="flex justify-center items-center mb-6 w-20 h-20 bg-red-100 rounded-full">
      <FaBookOpen className="w-10 h-10 text-red-600" />
    </div>
    <h3 className="mb-3 text-2xl font-bold text-gray-900">Something went wrong</h3>
    <p className="mb-6 max-w-md text-gray-600">{error}</p>
    <Button onClick={() => window.location.reload()} variant="primary" size="md">
      Try Again
    </Button>
  </motion.div>
)

const EmptyState = ({ onClearFilters }) => (
  <motion.div
    className="flex flex-col justify-center items-center h-96 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
  >
    <motion.div
      className="flex justify-center items-center mb-6 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
    >
      <FaBookOpen className="w-12 h-12 text-indigo-600" />
    </motion.div>
    <h3 className="mb-3 text-2xl font-bold text-gray-900">No notes found</h3>
    <p className="mb-6 max-w-md text-gray-600">
      We couldn't find any notes matching your criteria. Try adjusting your filters or search terms.
    </p>
    <Button onClick={onClearFilters} variant="primary" size="md">
      Clear All Filters
    </Button>
  </motion.div>
)

const NotesContent = ({ notes, viewMode, currentPage, totalPages, onPageChange, onLike, onBookmark, onDownload }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    {/* Notes Grid/List */}
    <div className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6" : "space-y-6"}>
      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <NoteCard note={note} index={index} onLike={onLike} onBookmark={onBookmark} onDownload={onDownload} />
        </motion.div>
      ))}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          variant="default"
          size="md"
          showFirstLast={true}
          animated={true}
          maxVisiblePages={5}
        />
      </motion.div>
    )}
  </motion.div>
)

export default NotesGrid
