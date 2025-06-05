"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FaBookOpen } from "react-icons/fa"
import NoteCard from "./ui/NoteCard"
import Spinner from "./Spinner"
import Button from "./Button"
import Pagination from "./Pagination"

const NotesGrid = ({
  notes = [],
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
  hideHeader = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Content */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" error={error} />
          ) : !notes || notes.length === 0 ? (
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

const LoadingState = () => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center space-y-8 h-96"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <Spinner size="xl" variant="primary" type="border" />
        <motion.div
          className="flex absolute inset-0 justify-center items-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <FaBookOpen className="w-8 h-8 text-blue-600" />
        </motion.div>
      </motion.div>
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold text-gray-800">Loading Amazing Notes</h3>
        <p className="text-gray-600">Curating the best study materials just for you...</p>
      </div>
    </motion.div>
  )
}

const ErrorState = ({ error }) => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center h-96 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex justify-center items-center mb-6 w-24 h-24 bg-red-100 rounded-full">
        <FaBookOpen className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="mb-3 text-3xl font-bold text-gray-900">Oops! Something went wrong</h3>
      <p className="mb-6 max-w-md text-gray-600">{error}</p>
      <Button
        onClick={() => window.location.reload()}
        variant="primary"
        size="md"
        className="bg-blue-600 hover:bg-blue-700"
      >
        Try Again
      </Button>
    </motion.div>
  )
}

const EmptyState = ({ onClearFilters }) => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center h-96 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex justify-center items-center mb-6 w-32 h-32 bg-blue-100 rounded-full">
        <FaBookOpen className="w-16 h-16 text-blue-600" />
      </div>
      <h3 className="mb-3 text-3xl font-bold text-gray-900">No notes found</h3>
      <p className="mb-8 max-w-md text-gray-600">
        We couldn't find any notes matching your criteria. Try adjusting your filters or explore different search terms.
      </p>
      <Button onClick={onClearFilters} variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700">
        Clear All Filters
      </Button>
    </motion.div>
  )
}

const NotesContent = ({ notes, viewMode, currentPage, totalPages, onPageChange, onLike, onBookmark, onDownload }) => {
  if (!notes || !Array.isArray(notes)) {
    return <EmptyState onClearFilters={() => {}} />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Notes Grid/List */}
      <motion.div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
        layout
      >
        <AnimatePresence>
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              whileHover={{ y: -4 }}
            >
              <NoteCard
                note={note}
                index={index}
                onLike={onLike}
                onBookmark={onBookmark}
                onDownload={onDownload}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-lg">
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
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default NotesGrid
