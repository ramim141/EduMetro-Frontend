"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import api from "../utils/api"
import NoteCard from "../components/NoteCard"
import Dropdown from "../components/Dropdown"
import Input from "../components/Input"
import Button from "../components/Button"
import Spinner from "../components/Spinner"
import Message from "../components/Message"
import Pagination from "../components/Pagination"
import RatingStars from "../components/RatingStars"
import Footer from "../components/Footer"
import {
  FaSearch,
  FaFilter,
  FaUniversity,
  FaStar,
  FaBookOpen,
  FaUsers,
  FaDownload,
  FaSort,
  FaThLarge,
  FaList,
} from "react-icons/fa"
import AuthContext from "../context/AuthContext"

const EnhancedNoteListPage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNotes, setTotalNotes] = useState(0)
  const [viewMode, setViewMode] = useState("list") // list or grid

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCourse, setFilterCourse] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterRating, setFilterRating] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const { isAuthenticated, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const ratingOptions = [
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
  ]

  // Fetch notes function
  const fetchNotes = async (page = 1, filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page })
      if (filters.search) params.append("search", filters.search)
      if (filters.course) params.append("course", filters.course)
      if (filters.department) params.append("department", filters.department)
      if (filters.rating) params.append("min_rating", filters.rating)
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "newest":
            params.append("ordering", "-created_at")
            break
          case "oldest":
            params.append("ordering", "created_at")
            break
          case "rating":
            params.append("ordering", "-average_rating")
            break
          case "downloads":
            params.append("ordering", "-download_count")
            break
          case "likes":
            params.append("ordering", "-likes_count")
            break
        }
      }

      const response = await api.get(`/api/notes/?${params.toString()}`)
      setNotes(response.data.results)
      setTotalPages(Math.ceil(response.data.count / 10))
      setTotalNotes(response.data.count)
      setCurrentPage(page)
    } catch (err) {
      console.error("Failed to fetch notes:", err.response ? err.response.data : err.message)
      setError("Failed to load notes. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes(currentPage, {
      search: searchTerm,
      course: filterCourse,
      department: filterDepartment,
      rating: filterRating,
      sortBy: sortBy,
    })
  }, [currentPage, searchTerm, filterCourse, filterDepartment, filterRating, sortBy])

  const handleApplyFilters = () => {
    setCurrentPage(1)
    fetchNotes(1, {
      search: searchTerm,
      course: filterCourse,
      department: filterDepartment,
      rating: filterRating,
      sortBy: sortBy,
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setFilterCourse("")
    setFilterDepartment("")
    setFilterRating("")
    setSortBy("newest")
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleLike = async (noteId) => {
    if (!isAuthenticated) {
      setError("Please log in to like a note.")
      navigate("/login")
      return
    }
    try {
      await api.post(`/api/notes/${noteId}/toggle_like/`)
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                is_liked: !note.is_liked,
                likes_count: note.is_liked ? note.likes_count - 1 : note.likes_count + 1,
              }
            : note,
        ),
      )
    } catch (err) {
      console.error("Failed to toggle like:", err.response ? err.response.data : err.message)
      setError("Could not like note. Please try again.")
    }
  }

  const handleBookmark = async (noteId) => {
    if (!isAuthenticated) {
      setError("Please log in to bookmark a note.")
      navigate("/login")
      return
    }
    try {
      await api.post(`/api/notes/${noteId}/toggle_bookmark/`)
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                is_bookmarked: !note.is_bookmarked,
                bookmark_count: note.is_bookmarked ? note.bookmark_count - 1 : note.bookmark_count + 1,
              }
            : note,
        ),
      )
    } catch (err) {
      console.error("Failed to toggle bookmark:", err.response ? err.response.data : err.message)
      setError("Could not bookmark note. Please try again.")
    }
  }

  const handleDownload = async (noteId) => {
    if (!isAuthenticated) {
      setError("Please log in to download this note.")
      navigate("/login")
      return
    }

    try {
      const response = await api.get(`/api/notes/${noteId}/download/`, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      const contentDisposition = response.headers["content-disposition"]
      let filename = "downloaded_note.pdf"
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, download_count: (note.download_count || 0) + 1 } : note,
        ),
      )
    } catch (err) {
      console.error("Failed to download note:", err.response ? err.response.data : err.message)
      setError("Failed to download note. Please try again.")
    }
  }

  return (
    <div>
      <div className="relative mx-auto mt-12 bg-gradient-to-br from-gray-50 via-white rounded-lg shadow-lg to-indigo-50/30 lg:px-32">
      <div className="flex gap-8 h-screen">
        {/* Enhanced Filter Sidebar - Fixed */}
        <motion.div
          className="flex overflow-hidden flex-col w-80 bg-white border-r border-gray-200 shadow-lg"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {/* Filter Header */}
          <div className="p-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600">
            <motion.div
              className="flex gap-3 items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <FaFilter className="w-5 h-5" />
              </motion.div>
              <h2 className="text-xl font-bold">Filter Notes</h2>
            </motion.div>
            <motion.p
              className="mt-1 text-sm text-indigo-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Find exactly what you're looking for
            </motion.p>
          </div>

          {/* Filter Content - Scrollable */}
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Input
                icon="search"
                type="text"
                label={
                  <div className="flex gap-2 items-center mb-2 text-sm font-semibold text-gray-700">
                    <FaSearch className="w-4 h-4 text-indigo-500" />
                    Search Notes
                  </div>
                }
                placeholder="Search by title, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                variant="default"
                size="md"
              />
            </motion.div>

            {/* Course Filter */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Input
                icon="building"
                type="text"
                label={
                  <div className="flex gap-2 items-center mb-2 text-sm font-semibold text-gray-700">
                    <FaBookOpen className="w-4 h-4 text-indigo-500" />
                    Course
                  </div>
                }
                placeholder="Enter course name..."
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full"
                variant="default"
                size="md"
              />
            </motion.div>

            {/* Department Filter */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Input
                icon="building"
                type="text"
                label={
                  <div className="flex gap-2 items-center mb-2 text-sm font-semibold text-gray-700">
                    <FaUniversity className="w-4 h-4 text-indigo-500" />
                    Department
                  </div>
                }
                placeholder="Enter department name..."
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full"
                variant="default"
                size="md"
              />
            </motion.div>

            {/* Rating Filter */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Dropdown
                label={
                  <div className="flex gap-2 items-center mb-2 text-sm font-semibold text-gray-700">
                    <FaStar className="w-4 h-4 text-yellow-500" />
                    Minimum Rating
                  </div>
                }
                options={ratingOptions}
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                placeholder="Select minimum rating"
                variant="default"
                size="md"
                animated={true}
                className="w-full"
              />
            </motion.div>

            {/* Sort Options */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Dropdown
                label={
                  <div className="flex gap-2 items-center mb-2 text-sm font-semibold text-gray-700">
                    <FaSort className="w-4 h-4 text-indigo-500" />
                    Sort By
                  </div>
                }
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                placeholder="Select sort option"
                variant="default"
                size="md"
                animated={true}
                className="w-full"
              />
            </motion.div>
          </div>

          {/* Filter Actions */}
          <div className="p-4 space-y-2 bg-gray-50 border-t border-gray-200">
            <Button onClick={handleApplyFilters} className="w-full" size="md">
              <FaFilter className="mr-2 w-4 h-4" />
              Apply Filters
            </Button>
            <Button onClick={clearAllFilters} variant="outline" className="w-full" size="md">
              Clear All Filters
            </Button>
          </div>
        </motion.div>

        {/* Main Content Area - Scrollable */}
        <div className="flex overflow-hidden flex-col flex-1">
          {/* Header */}
          <motion.div
            className="p-4 bg-white border-b border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Study Notes</h1>
                <p className="mt-1 text-sm text-gray-600">{totalNotes > 0 ? `${totalNotes} notes found` : "No notes found"}</p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 items-center p-1 bg-gray-100 rounded-lg">
                <motion.button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaList className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaThLarge className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Stats Row */}
            <motion.div
              className="flex gap-4 items-center mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {[
                { icon: FaBookOpen, label: `${totalNotes} Notes`, color: "text-indigo-600" },
                { icon: FaUsers, label: "5K+ Students", color: "text-purple-600" },
                { icon: FaDownload, label: "50K+ Downloads", color: "text-green-600" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex gap-2 items-center px-3 py-1.5 bg-gray-50 rounded-full"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Notes Content - Scrollable */}
          <div className="overflow-y-auto flex-1 p-4">
            {error && <Message type="error" message={error} onClose={() => setError(null)} duration={5000} />}

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  className="flex flex-col justify-center items-center space-y-4 h-96"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Spinner size="xl" variant="primary" type="border" animated={true} label="Loading amazing notes..." />
                  <p className="text-lg text-gray-600">Loading amazing notes...</p>
                </motion.div>
              ) : notes.length === 0 ? (
                <motion.div
                  key="empty"
                  className="flex flex-col justify-center items-center h-96 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    className="flex justify-center items-center mb-4 w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <FaBookOpen className="w-10 h-10 text-indigo-600" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">No notes found</h3>
                  <p className="mb-4 text-sm text-gray-600">Try adjusting your filters or search terms.</p>
                  <Button onClick={clearAllFilters} variant="primary" size="md">
                    Clear All Filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Notes List */}
                  <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-4"}>
                    {notes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <NoteCard
                          note={note}
                          index={index}
                          onLike={handleLike}
                          onBookmark={handleBookmark}
                          onDownload={handleDownload}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      className="flex justify-center mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        variant="default"
                        size="md"
                        showFirstLast={true}
                        animated={true}
                        maxVisiblePages={5}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>

    <Footer/>
    </div>
  )
}

export default EnhancedNoteListPage
