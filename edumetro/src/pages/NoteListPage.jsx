"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaFilter } from "react-icons/fa"
import FilterSidebar from "../components/FilterSidebar"
import NotesGrid from "../components/NotesGrid"
import Message from "../components/Message"
import useNoteFilters from "../hooks/useNoteFilters"
import useNoteActions from "../hooks/useNoteActions"

const NoteListPage = ({ className = "" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState("list")
  const [actionError, setActionError] = useState(null)

  // Custom hooks for data management
  const {
    notes,
    loading,
    error,
    currentPage,
    totalPages,
    totalNotes,
    filters,
    updateFilters,
    clearFilters,
    applyFilters,
    setCurrentPage,
  } = useNoteFilters()

  const { handleLike, handleBookmark, handleDownload, actionLoading } = useNoteActions(notes, (setNotes) => {
    // This callback is used by the hook to update notes state
    // We need to pass the setter function from useNoteFilters
  })

  // Enhanced action handlers with error handling
  const handleLikeWithError = async (noteId) => {
    try {
      await handleLike(noteId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleBookmarkWithError = async (noteId) => {
    try {
      await handleBookmark(noteId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleDownloadWithError = async (noteId) => {
    try {
      await handleDownload(noteId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br via-blue-50 to-indigo-50 from-slate-50 ${className}`}>
      <div className="container px-4 py-8 mx-auto">
        {/* Error Messages */}
        {actionError && (
          <Message type="error" message={actionError} onClose={() => setActionError(null)} duration={5000} />
        )}

        <div className="flex gap-8 h-screen">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
            filters={filters}
            onFiltersChange={updateFilters}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
          />

          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-0" : "lg:ml-0"}`}>
            {/* Mobile Filter Toggle */}
            <motion.button
              onClick={toggleSidebar}
              className="fixed top-4 left-4 z-30 p-3 text-white bg-indigo-600 rounded-full shadow-lg lg:hidden hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle filters"
            >
              <FaFilter className="w-5 h-5" />
            </motion.button>

            {/* Notes Grid */}
            <NotesGrid
              notes={notes}
              loading={loading}
              error={error}
              totalNotes={totalNotes}
              currentPage={currentPage}
              totalPages={totalPages}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onPageChange={setCurrentPage}
              onLike={handleLikeWithError}
              onBookmark={handleBookmarkWithError}
              onDownload={handleDownloadWithError}
              onClearFilters={clearFilters}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteListPage
