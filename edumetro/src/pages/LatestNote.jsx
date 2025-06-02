"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  Upload,
  ArrowRight,
  XCircle,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Download,
  Eye,
  Heart,
} from "lucide-react"
import api from "../utils/api"
import Spinner from "../components/Spinner"
import Button from "../components/Button"
import RatingStars from "../components/RatingStars"
import noteThumbnail from "../assets/images/note_thum.jpg"

// Enhanced Note Card Component
const NoteCard = ({ note, index }) => {
  const [isLiked, setIsLiked] = useState(false)
  const navigate = useNavigate()

  const handleNoteClick = () => {
    navigate(`/notes/${note.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="cursor-pointer group"
      onClick={handleNoteClick}
    >
      <div className="overflow-hidden rounded-2xl border-0 shadow-lg backdrop-blur-sm transition-all duration-500 bg-white/80 hover:shadow-2xl hover:bg-white/90">
        <div className="overflow-hidden relative">
          <motion.img
            src={note.noteThumbnail || noteThumbnail}
            alt={note.title}
            className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110"
            whileHover={{ scale: 1.1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 from-black/60 group-hover:opacity-100" />

          {/* Floating Stats */}
          <motion.div
            className="flex absolute top-3 right-3 gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {note.rating && (
              <div className="flex gap-1 items-center px-2 py-1 text-xs font-medium text-white rounded-full backdrop-blur-sm bg-black/40">
                <RatingStars rating={note.rating} maxRating={1} size="xs" color="warning" spacing="none" />
                {note.rating}
              </div>
            )}
          </motion.div>

          {/* Subject Badge */}
          <div className="absolute top-3 left-3">
            <motion.span
              className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              {note.subject || note.course_name || "General"}
            </motion.span>
          </div>
        </div>

        <div className="p-6">
          <motion.h3
            className="mb-3 text-lg font-bold text-gray-900 transition-colors duration-300 line-clamp-2 group-hover:text-indigo-600"
            whileHover={{ x: 4 }}
          >
            {note.title}
          </motion.h3>

          <div className="flex gap-2 items-center mb-4 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              by {note.uploader_first_name || note.uploader_username || "Anonymous"} {note.uploader_last_name || ""}
            </span>
          </div>

          {/* Rating Display */}
          {note.rating && (
            <div className="flex gap-2 items-center mb-4">
              <RatingStars rating={note.rating} size="sm" color="warning" showValue={true} spacing="xs" />
            </div>
          )}

          {/* Stats Row */}
          <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
            <div className="flex gap-1 items-center">
              <Download className="w-3 h-3" />
              <span>{(note.downloads || 0).toLocaleString()}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Eye className="w-3 h-3" />
              <span>{(note.views || 0).toLocaleString()}</span>
            </div>
            <motion.button
              className={`flex items-center gap-1 transition-colors duration-300 ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
              onClick={() => setIsLiked(!isLiked)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
              <span>{(note.likes || 0) + (isLiked ? 1 : 0)}</span>
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              className="flex-1"
              icon={<Download className="w-4 h-4" />}
              iconPosition="left"
            >
              Download
            </Button>
            <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} className="px-3" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function EnhancedNotesSection() {
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState("")
  const [popularNotes, setPopularNotes] = useState([])
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    const fetchPopularNotes = async () => {
      setNotesLoading(true)
      setNotesError("")
      try {
        const response = await api.get("/api/notes/?ordering=-created_at&limit=4")
        setPopularNotes(response.data.results || [])
      } catch (err) {
        console.error("Failed to fetch notes for homepage:", err)

        // More specific error handling
        if (err.code === "ECONNABORTED") {
          setNotesError("Request timeout. Please check your connection and try again.")
        } else if (err.response?.status === 404) {
          setNotesError("Notes endpoint not found. Please contact support.")
        } else if (err.response?.status === 500) {
          setNotesError("Server error. Please try again later.")
        } else if (err.request) {
          setNotesError("Unable to connect to server. Please check your internet connection.")
        } else {
          setNotesError(err.message || "Failed to load notes. Please try again later.")
        }
      } finally {
        setNotesLoading(false)
      }
    }

    fetchPopularNotes()
  }, [])

  // Background blob animation variants
  const blobVariants = {
    animate: {
      x: [0, 100, 0],
      y: [0, -100, 0],
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const retryFetch = () => {
    setNotesError("")
    setNotesLoading(true)
    // Re-trigger the useEffect by forcing a re-render
    window.location.reload()
  }

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden relative px-4 py-16 bg-gradient-to-br from-gray-50 via-white sm:py-20 lg:py-24 xl:py-32 to-indigo-50/30"
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl sm:w-80 sm:h-80 lg:w-96 lg:h-96"
          variants={blobVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-pink-400 via-red-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl sm:w-64 sm:h-64 lg:w-72 lg:h-72"
          variants={blobVariants}
          animate="animate"
          style={{ animationDelay: "5s" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-400 via-cyan-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl sm:w-56 sm:h-56 lg:w-64 lg:h-64"
          variants={blobVariants}
          animate="animate"
          style={{ animationDelay: "10s" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="overflow-hidden absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-300 rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Enhanced Section Header */}
        <motion.div
          className="mb-12 text-center sm:mb-16 lg:mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="flex gap-3 justify-center items-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-indigo-500 sm:w-10 sm:h-10" />
            </motion.div>
            <motion.h2
              className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              whileHover={{ scale: 1.02 }}
            >
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-lg">
                Notes
              </span>
            </motion.h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <TrendingUp className="w-8 h-8 text-purple-500 sm:w-10 sm:h-10" />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="w-16 sm:w-20 lg:w-24 h-1 sm:h-1.5 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg"
          />

          <motion.p
            variants={itemVariants}
            className="px-4 mx-auto max-w-2xl text-base leading-relaxed text-gray-600 lg:max-w-4xl sm:text-lg lg:text-xl xl:text-2xl"
          >
            Dive into the freshest collection of high-quality study materials, meticulously curated and shared by our
            vibrant academic community.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center items-center mt-8 sm:gap-6 lg:gap-8 sm:mt-12"
          >
            {[
              { icon: BookOpen, label: "10K+ Notes", color: "text-indigo-600" },
              { icon: Users, label: "5K+ Students", color: "text-purple-600" },
              { icon: Download, label: "50K+ Downloads", color: "text-pink-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex gap-2 items-center px-4 py-2 rounded-full shadow-lg backdrop-blur-sm bg-white/60"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {notesLoading ? (
            <motion.div
              key="loading"
              className="flex flex-col justify-center items-center h-64 sm:h-80"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                }}
              >
                <Spinner size="xl" variant="primary" type="border" />
              </motion.div>
              <motion.p
                className="mt-6 text-lg font-medium text-gray-600 sm:text-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Loading amazing notes...
              </motion.p>
            </motion.div>
          ) : notesError ? (
            <motion.div
              key="error"
              className="py-12 text-center bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100 shadow-2xl sm:py-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <motion.div
                className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-red-100 rounded-full sm:w-28 sm:h-28"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                }}
              >
                <XCircle className="text-4xl text-red-600 sm:text-5xl" />
              </motion.div>
              <h3 className="mb-2 text-xl font-semibold text-red-700 sm:text-2xl">Oops! Something went wrong.</h3>
              <p className="mx-auto mb-8 max-w-md text-base text-red-500 sm:text-lg">{notesError}</p>
              <Button
                onClick={retryFetch}
                variant="danger"
                size="lg"
                icon={<Clock className="w-5 h-5" />}
                iconPosition="left"
              >
                Retry Loading
              </Button>
            </motion.div>
          ) : popularNotes.length === 0 ? (
            <motion.div
              key="empty"
              className="py-12 text-center rounded-2xl border border-gray-100 shadow-2xl backdrop-blur-sm sm:py-16 lg:py-20 bg-white/80"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                className="flex justify-center items-center mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full sm:w-32 sm:h-32 lg:w-36 lg:h-36"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <BookOpen className="text-4xl text-indigo-600 sm:text-5xl lg:text-6xl" />
              </motion.div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">No Notes Found</h3>
              <p className="px-4 mx-auto mb-8 max-w-md text-lg text-gray-600 sm:text-xl">
                Be the first to ignite the knowledge hub! Upload your valuable notes and share them with the community.
              </p>
              <Button size="lg" variant="primary" icon={<Upload className="w-5 h-5" />} iconPosition="left">
                Upload Your First Note
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Notes Grid */}
              <motion.div
                className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8 sm:mb-16 lg:mb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {popularNotes.map((note, index) => (
                  <NoteCard key={note.id} note={note} index={index} />
                ))}
              </motion.div>

              {/* Enhanced View All Notes Button */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="xl"
                    variant="primary"
                    className="px-8 py-4 text-lg font-bold rounded-full shadow-2xl sm:px-12 sm:py-6 sm:text-xl"
                  >
                    <div className="flex gap-3 items-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
                      </motion.div>
                      <span>View All Notes</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
