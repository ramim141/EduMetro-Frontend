"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Download,
  Eye,
  Heart,
} from "lucide-react"
import Button from "./Button"
import RatingStars from "./RatingStars"
import noteThumbnail from "../../assets/images/note_thum.jpg"

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
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
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

export default NoteCard 