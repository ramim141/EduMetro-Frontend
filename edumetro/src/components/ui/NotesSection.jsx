"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import api from "../../utils/api"
import NoteCard from "./NoteCard"
import Spinner from "./Spinner"

const NotesSection = ({ title, description, limit = 4, ordering = "-created_at" }) => {
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState("")
  const [notes, setNotes] = useState([])
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    const fetchNotes = async () => {
      setNotesLoading(true)
      setNotesError("")
      try {
        const response = await api.get(`/api/notes/?ordering=${ordering}&limit=${limit}`)
        setNotes(response.data.results || [])
      } catch (err) {
        console.error("Failed to fetch notes:", err)

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

    fetchNotes()
  }, [limit, ordering])

  return (
    <section ref={sectionRef} className="py-12">
      <div className="container px-4 mx-auto">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{title}</h2>
            {description && <p className="text-gray-600">{description}</p>}
          </div>
        )}

        {notesLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : notesError ? (
          <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
            <p>{notesError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {notes.map((note, index) => (
              <NoteCard key={note.id} note={note} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default NotesSection 