// src/components/NotesSection.jsx

"use client"
import { ArrowRight, RefreshCw } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import NoteCard from "./NoteCard" 
import Spinner from "./Spinner"
import Button from "./Button"
import { FaArrowRight } from "react-icons/fa"

const NotesSection = ({ title, description, limit = 3, ordering = "-created_at" }) => {
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState("")
  const [notes, setNotes] = useState([])
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const navigate = useNavigate()


  useEffect(() => {
    console.log("NotesSection component mounted or re-rendered.");
    console.log("Initial state - notesLoading:", notesLoading, "notesError:", notesError, "notes.length:", notes.length);
  }, []); // Only on mount

  useEffect(() => {
    const fetchNotes = async () => {
      setNotesLoading(true)
      setNotesError("")
      try {
        const response = await api.get("/api/notes/");
        const notes = Array.isArray(response.data)
          ? response.data
          : (response.data.results || []);
        setNotes(notes);
 
        console.log("NotesSection: API Response received:", response.data);
        console.log("NotesSection: Fetched notes count:", notes.length);
        console.log("NotesSection: Fetched notes data:", notes);
      } catch (err) {
        console.error("NotesSection: Failed to fetch notes:", err); 
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
        console.log("NotesSection: Loading finished, final state - notesLoading:", false, "notesError:", notesError, "notes.length:", notes.length); // ✅ ফাইনাল স্টেট
      }
    }

    
    console.log("NotesSection: Fetching notes API call initiated.");
    fetchNotes()
  }, [limit, ordering])

  const handleViewAllNotes = () => {
    navigate('/note'); 
  };

  return (
    <section ref={sectionRef} className="py-12">

      {console.log("NotesSection: Inside render block. notesLoading:", notesLoading, "notesError:", notesError, "notes.length:", notes.length)}
      <div className="container px-4 mx-auto">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{title}</h2>
            {description && <p className="text-gray-600">{description}</p>}
          </div>
        )}

        {notesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : notesError ? (
          <div className="p-4 text-center text-red-500 rounded-lg bg-red-50">
            <p>{notesError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ✅ DEBUG LOG: নোট রেন্ডার করা হচ্ছে কিনা */}
            {console.log("NotesSection: Rendering NoteCards. Total notes:", notes.length)}
            {notes.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"> {/* ✅ গ্রিড কলামে flex-wrap এর প্রয়োজন নেই, gap ব্যবহার করুন */}
                {notes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={index}
                    onLike={() => console.log('Like clicked for note:', note.id)}
                    onBookmark={() => console.log('Bookmark clicked for note:', note.id)}
                    onDownload={() => console.log('Download clicked for note:', note.id)}
                  />
                ))}
              </div>
            ) : (
                <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
                    <p>No notes to display.</p>
                </div>
            )}

            {notes.length > 0 && (
              <div className="p-4 mt-20 text-center">
                <button
                  onClick={handleViewAllNotes}
                  className="relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden text-lg font-semibold text-white transition-all duration-300 ease-out transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl group hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Background animation */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:opacity-100" />

                  {/* Content */}
                  <span className="relative z-10">View All Notes</span>
                  <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 transition-opacity duration-500 -skew-x-12 opacity-0 bg-gradient-to-r from-transparent to-transparent via-white/20 group-hover:opacity-100 group-hover:animate-pulse" />
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default NotesSection