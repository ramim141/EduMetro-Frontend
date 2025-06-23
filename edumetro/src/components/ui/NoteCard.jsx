// src/components/ui/NoteCard.jsx

"use client"

import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  User as Users,
  Download,
  Eye,
  Heart,
  Bookmark, // ✅ Bookmark icon
  MessageCircle,
} from "lucide-react"
import Button from "./Button"
import RatingStars from "./RatingStars"
import noteThumbnail from "../../assets/images/note_thum.jpg"
import { useContext } from 'react'
import AuthContext from '@/context/AuthContext'
import { toast } from 'react-hot-toast'

// Default styling for stats icons and text
const STAT_ICON_CLASSES = "w-4 h-4 text-gray-500"
const STAT_TEXT_CLASSES = "text-sm text-gray-600"

const NoteCard = ({
  note,
  index,
  onDownload,
  onLike,
  onBookmark,
  showApprovalStatus = false,
}) => {
  console.log('NoteCard rendering with note:', note);
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  const handleCardClick = () => {
    navigate(`/notes/${note.id}`)
  }

  const handleLikeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please log in to like a note.')
      navigate('/login')
      return
    }
    if (onLike) onLike(note.id)
  }

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please log in to bookmark a note.')
      navigate('/login')
      return
    }
    if (onBookmark) onBookmark(note.id)
  }

  const handleDownloadClick = (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error('Please log in or register to download this note.')
      navigate('/login')
      return
    }
    if (onDownload) onDownload(note.id)
  }

  const handleViewDetailsClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/notes/${note.id}`)
  }

  // Renders a badge for the note's category if available
  const renderCategoryBadge = () => {
    if (!note.category) return null;
    return (
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full shadow">
          {note.category_name}
        </span>
      </div>
    );
  };

  const renderApprovalStatus = () => {
    if (!showApprovalStatus) return null

    if (note.is_approved) {
      return (
        <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full top-3 right-3">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          Approved
        </div>
      )
    } else {
      return (
        <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full top-3 right-3">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          Pending
        </div>
      )
    }
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
      className="w-full cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="overflow-hidden transition-all duration-500 bg-white border-0 shadow-lg rounded-2xl backdrop-blur-sm hover:shadow-xl">
        {/* Image Section */}
        <div className="relative flex items-center justify-center h-48 overflow-hidden bg-gray-100">
          <motion.img
            src={note.file_url || noteThumbnail}
            alt={note.title || "Note thumbnail"}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = noteThumbnail
            }}
          />

          {/* Subject Badge */}
          <div className="absolute top-3 left-3">
            <motion.span
              className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {note.course_name || "General"}
            </motion.span>
          </div>

          {/* Rating Badge (Top Right) */}
          {/* {note.average_rating > 0 && (
            <motion.div
              className="absolute flex items-center gap-1 px-2 py-1 text-xs font-medium text-white rounded-full top-3 right-3 backdrop-blur-sm bg-black/40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <RatingStars rating={1} maxRating={1} size="xs" color="warning" spacing="none" />
              {(note.average_rating || 0).toFixed(1)}
            </motion.div>
          )} */}
          {/* Here would be note category badge if available */}
          {renderCategoryBadge()}
          {renderApprovalStatus()}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <motion.h3
            className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 line-clamp-2 group-hover:text-indigo-600"
            whileHover={{ x: 4 }}
          >
            {note.title || "Untitled Note"}
          </motion.h3>

          {/* Author Info */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Users className={STAT_ICON_CLASSES} />
            <span>
              by {note.uploader_first_name || note.uploader_username || "Anonymous"} {note.uploader_last_name || ""}
            </span>
          </div>

          {/* Rating Display below author info */}
          <div className="flex items-center gap-2 mb-4">
            <RatingStars rating={note.average_rating || 0} size="sm" color="warning" showValue={false} spacing="xs" />
            <span className="text-sm text-gray-500">({note.star_ratings?.length || 0} reviews)</span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
            {/* Downloads */}
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Download className={STAT_ICON_CLASSES} />
              <span>{(note.download_count || 0).toLocaleString()}</span>
            </motion.div>

            {/* Views */}
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Eye className={STAT_ICON_CLASSES} />
              <span>{(note.view_count || 0).toLocaleString()}</span>
            </motion.div>

            {/* Like Count */}
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Heart className={STAT_ICON_CLASSES} />
              <span>{note.likes_count || 0}</span>
            </motion.div>

            {/* Bookmark Count */}
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Bookmark className={STAT_ICON_CLASSES} />
              <span>{note.bookmarks_count || 0}</span>
            </motion.div>

            {/* Comment Count */}
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <MessageCircle className={STAT_ICON_CLASSES} />
              <span>{note.comments?.length || 0}</span>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* View Note Button */}
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleViewDetailsClick}
                size="md"
                variant="primary"
                className="w-full py-3 font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                icon={<Eye className="w-4 h-4" />}
                iconPosition="left"
              >
                View Note
              </Button>
            </motion.div>

            {/* Bookmark Button (Right side, as per screenshot) */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleBookmarkClick}
                size="md"
                variant="outline"
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  note.is_bookmarked_by_current_user
                    ? 'border-blue-500 text-blue-600 hover:border-blue-600 hover:text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${note.is_bookmarked_by_current_user ? 'fill-current' : ''}`} />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NoteCard