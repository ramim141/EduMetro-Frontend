"use client"

import { useState, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaSearch,
  FaFilter,
  FaBookOpen,
  FaUsers,
  FaDownload,
  FaStar,
  FaChevronUp,
  FaChevronDown,
  FaThLarge,
  FaList,
} from "react-icons/fa"
import FilterSidebar from "../components/FilterSidebar"
import NotesGrid from "../components/NotesGrid"
import Message from "../components/Message"
import useNoteFilters from "../hooks/useNoteFilters"
import useNoteActions from "../hooks/useNoteActions"
import AuthContext from "../context/AuthContext"
import { toast } from "react-hot-toast"

const NoteListPage = ({ className = "" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [actionError, setActionError] = useState(null)

  const { isAuthenticated } = useContext(AuthContext)

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
    setNotes,
  } = useNoteFilters()

  const {
    handleLike: handleLikeAction,
    handleBookmark: handleBookmarkAction,
    handleDownload: handleDownloadAction,
    actionLoading: individualActionLoading,
  } = useNoteActions(notes, setNotes, isAuthenticated, toast)

  // Enhanced action handlers
  const handleLikeWithError = async (noteId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to like a note.")
      return
    }
    try {
      await handleLikeAction(noteId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleBookmarkWithError = async (noteId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark a note.")
      return
    }
    try {
      await handleBookmarkAction(noteId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleDownloadWithError = async (noteId) => {
    if (!isAuthenticated) {
      toast.error("Please log in or register to download this note.")
      return
    }
    try {
      await handleDownloadAction(noteId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      

      {/* Main Content Area */}
      <div className="flex">
        {/* Filter Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <FilterSidebar
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
              filters={filters}
              onFiltersChange={updateFilters}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main className="flex-1 transition-all duration-300" layout>
          <div className="p-6">
            {/* Error Messages */}
            <AnimatePresence>
              {actionError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Message type="error" message={actionError} onClose={() => setActionError(null)} duration={5000} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Bar */}
            <div className="p-6 mb-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex flex-wrap gap-4 justify-between items-center">
                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex gap-2 items-center px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                    <FaBookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">{totalNotes || 5} Notes</span>
                  </div>
                  <div className="flex gap-2 items-center px-4 py-2 bg-purple-50 rounded-xl border border-purple-200">
                    <FaUsers className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">5K+ Students</span>
                  </div>
                  <div className="flex gap-2 items-center px-4 py-2 bg-green-50 rounded-xl border border-green-200">
                    <FaDownload className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">50K+ Downloads</span>
                  </div>
                  <div className="flex gap-2 items-center px-4 py-2 bg-orange-50 rounded-xl border border-orange-200">
                    <FaStar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-700">98% Success Rate</span>
                  </div>
                </div>

               
              </div>

              {/* Results Info */}
              <div className="flex gap-2 items-center mt-4 text-sm text-gray-600">
                <span>Showing</span>
                <span className="px-2 py-1 font-semibold text-blue-700 bg-blue-100 rounded-full">
                  {Math.min((currentPage - 1) * 10 + 1, totalNotes)}-{Math.min(currentPage * 10, totalNotes)}
                </span>
                <span>of</span>
                <span className="font-semibold text-gray-900">{totalNotes || 5}</span>
                <span>results</span>
              </div>
            </div>
            

            {/* Notes Grid */}
            <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
              <NotesGrid
                notes={notes || []}
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
                hideHeader={true}
              />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default NoteListPage
