// pages/NoteListPage.jsx
"use client"

import { useState, useContext, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaFilter, FaBookOpen, FaTimes } from "react-icons/fa"
import FilterSidebar from "../components/FilterSidebar"
import NoteCard from "../components/ui/NoteCard"
import Message from "../components/Message"
import Spinner from "../components/ui/Spinner"
import Pagination from "../components/Pagination"
import Button from "../components/Button"
import useNoteFilters from "../hooks/useNoteFilters"
import useNoteActions from "../hooks/useNoteActions"
import AuthContext from "../context/AuthContext"
import { toast } from "react-hot-toast"
import Footer from "@/components/footer"
import { getNoteCategories } from "../utils/api"

const NoteListPage = ({ className = "" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024)
  const [viewMode, setViewMode] = useState("grid")
  const [categories, setCategories] = useState(["All"])

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

  const { handleLike, handleBookmark, handleDownload } = useNoteActions(notes, setNotes, isAuthenticated, toast)

  // ✅ Corrected useEffect hook
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getNoteCategories()
        // ✅ FIX: Directly access the .results array from the paginated response
        if (response.data && Array.isArray(response.data.results)) {
          const categoryNames = response.data.results.map(cat => cat.name)
          setCategories(["All", ...categoryNames])
        } else {
            // This is a safety check in case the API response is not as expected
            throw new Error("Invalid data format for categories");
        }
      } catch (error) {
        console.error("Failed to fetch note categories:", error)
        toast.error("Could not load note categories.")
        // Fallback to a default list if the API call fails
        setCategories(["All", "Assignment", "Class Note", "Previous QS"])
      }
    }

    fetchCategories()
  }, []) // Empty dependency array ensures this runs only once

  const renderContent = () => {
    if (loading && notes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 sm:py-20 lg:py-24 sm:space-y-6">
          <Spinner size="lg" />
          <p className="px-4 text-base font-medium text-center text-gray-600 sm:text-lg lg:text-xl">
            Finding amazing notes for you...
          </p>
        </div>
      )
    }

    if (error) {
      return <Message type="error" message={error} onClose={() => {}} />
    }

    if (!loading && notes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 mx-2 text-center border shadow-xl sm:p-12 lg:p-16 border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl sm:mx-0">
          <div className="flex items-center justify-center w-24 h-24 mb-4 rounded-full shadow-lg sm:w-32 sm:h-32 lg:w-40 lg:h-40 sm:mb-6 bg-gradient-to-br from-blue-100 to-purple-100">
            <FaBookOpen
              className="w-12 h-12 text-transparent sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-transparent sm:mb-3 sm:text-3xl lg:text-4xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
            No notes found
          </h3>
          <p className="max-w-sm px-2 mb-6 text-sm leading-relaxed text-gray-600 sm:max-w-md lg:max-w-lg sm:mb-8 sm:text-base lg:text-lg">
            We couldn't find any notes matching your criteria. Try adjusting your filters to discover more content.
          </p>
          <Button
            onClick={clearFilters}
            variant="primary"
            size="md"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Clear All Filters
          </Button>
        </div>
      )
    }

    return (
      <>
        <motion.div
          className={
            viewMode === "grid"
              ? `grid grid-cols-1 sm:grid-cols-2 ${
                  isSidebarOpen
                    ? "lg:grid-cols-2"
                    : "lg:grid-cols-3"
                } gap-6 lg:gap-8 px-2 sm:px-0`
              : "space-y-6 px-2 sm:px-0"
          }
          layout
        >
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 20 }}
              >
                <NoteCard
                  note={note}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onDownload={handleDownload}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {totalPages > 1 && (
          <motion.div className="flex justify-center px-2 mt-8 sm:mt-12 lg:mt-16 sm:px-0">
            <div className="p-2 border shadow-xl sm:p-3 bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl sm:rounded-3xl">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </motion.div>
        )}
      </>
    )
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#B1E0F6] via-[#E8F4FD] to-[#EFD4EA] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 via-transparent to-purple-50/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100/20 via-transparent to-pink-100/20"></div>

      <div className={`relative z-10 ${className} pb-8 sm:pb-12 lg:pb-16`}>
        <div className="container flex flex-col min-h-screen px-3 py-6 pt-8 mx-auto sm:px-4 lg:px-6 xl:px-8 sm:py-8 lg:py-12 sm:pt-12 lg:pt-16 max-w-7xl">
          <div className="flex flex-col gap-2 lg:flex-row sm:gap-1 lg:gap-1">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  key="desktop-sidebar"
                  initial={{ width: 0, opacity: 0, marginRight: 0 }}
                  animate={{ width: window.innerWidth >= 1280 ? 384 : 320, opacity: 1, marginRight: window.innerWidth >= 1024 ? 32 : 24 }}
                  exit={{ width: 0, opacity: 0, marginRight: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="hidden lg:block shrink-0"
                >
                  <FilterSidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onApplyFilters={applyFilters}
                    onClearFilters={clearFilters}
                    className="w-80 xl:w-96"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile Filter Sidebar */}
            <AnimatePresence>
              {isSidebarOpen && window.innerWidth < 1024 && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                  <motion.div initial={{ x: "-100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 bottom-0 left-0 z-50 overflow-y-auto shadow-2xl w-80 sm:w-96 bg-white/95 backdrop-blur-md lg:hidden">
                    <div className="flex items-center justify-between p-4 border-b sm:p-6 border-gray-200/50 bg-gradient-to-r from-blue-500 to-purple-600">
                      <h2 className="text-lg font-bold text-white sm:text-xl">Filters</h2>
                      <button onClick={() => setIsSidebarOpen(false)} className="p-2 transition-all duration-200 rounded-lg text-white/80 hover:text-white bg-white/10 hover:bg-white/20" aria-label="Close Filters"><FaTimes className="w-5 h-5" /></button>
                    </div>
                    <div className="p-4 sm:p-6 rounded-xl">
                      <FilterSidebar isOpen={true} onToggle={() => setIsSidebarOpen(false)} filters={filters} onFiltersChange={updateFilters} onApplyFilters={(filters) => { applyFilters(filters); setIsSidebarOpen(false); }} onClearFilters={() => { clearFilters(); setIsSidebarOpen(false); }} className="w-full" />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <motion.main className="flex-1 min-w-0" layout>
              {/* Header Section */}
              <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 border shadow-xl sm:flex-row sm:gap-6 sm:p-6 lg:p-8 sm:mb-6 lg:mb-8 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 backdrop-blur-sm rounded-xl sm:rounded-2xl border-white/20">
                <div className="flex-1">
                  <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl lg:text-4xl xl:text-5xl sm:mb-2">Explore <span className="bg-gradient-to-r from-[#FCB045] via-[#FFD700] to-[#FFA500] bg-clip-text text-transparent font-extrabold drop-shadow-sm">Notes</span></h1>
                  <p className="text-sm font-medium sm:text-base lg:text-lg text-blue-50">Discover and share the best study materials.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-blue-800 bg-gradient-to-r from-blue-100 to-white rounded-full shadow-md border border-blue-200/50 whitespace-nowrap">{totalNotes} Notes Found</span>
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 sm:p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl hover:shadow-lg transition-all duration-200 backdrop-blur-sm transform hover:scale-105" aria-label="Toggle Filters"><FaFilter className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-col items-center justify-between gap-4 p-3 mb-4 border shadow-lg sm:flex-row sm:gap-6 sm:p-4 lg:p-5 sm:mb-6 lg:mb-8 border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2 p-1.5 sm:p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-inner w-full sm:w-auto">
                  {categories.map((category) => (
                    <button key={category} onClick={() => updateFilters({ category })} className={`px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${filters.category === category ? "bg-gradient-to-r from-white to-gray-50 text-gray-800 shadow-lg border border-gray-200/50" : "text-gray-600 hover:bg-white/50 hover:text-gray-800"}`}>{category}</button>
                  ))}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="p-4 border bg-white/40 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:p-6 lg:p-6 border-white/20">
                {renderContent()}
              </div>
            </motion.main>
          </div>
        </div>
      </div>
      <Footer className="relative z-10" />
    </section>
  )
}

export default NoteListPage