"use client"

import { useState, useCallback } from "react"
import api from "../utils/api"

const useNoteActions = (notes, setNotes) => {
  const [actionLoading, setActionLoading] = useState({})

  const setNoteActionLoading = useCallback((noteId, action, loading) => {
    setActionLoading((prev) => ({
      ...prev,
      [`${noteId}-${action}`]: loading,
    }))
  }, [])

  const handleLike = useCallback(
    async (noteId) => {
      setNoteActionLoading(noteId, "like", true)

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
        console.error("Failed to toggle like:", err)
        throw new Error("Could not like note. Please try again.")
      } finally {
        setNoteActionLoading(noteId, "like", false)
      }
    },
    [setNotes, setNoteActionLoading],
  )

  const handleBookmark = useCallback(
    async (noteId) => {
      setNoteActionLoading(noteId, "bookmark", true)

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
        console.error("Failed to toggle bookmark:", err)
        throw new Error("Could not bookmark note. Please try again.")
      } finally {
        setNoteActionLoading(noteId, "bookmark", false)
      }
    },
    [setNotes, setNoteActionLoading],
  )

  const handleDownload = useCallback(
    async (noteId) => {
      setNoteActionLoading(noteId, "download", true)

      try {
        const response = await api.get(`/api/notes/${noteId}/download/`, {
          responseType: "blob",
        })

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url

        // Extract filename from response headers
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

        // Update download count
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId ? { ...note, download_count: (note.download_count || 0) + 1 } : note,
          ),
        )
      } catch (err) {
        console.error("Failed to download note:", err)
        throw new Error("Failed to download note. Please try again.")
      } finally {
        setNoteActionLoading(noteId, "download", false)
      }
    },
    [setNotes, setNoteActionLoading],
  )

  return {
    handleLike,
    handleBookmark,
    handleDownload,
    actionLoading,
  }
}

export default useNoteActions
