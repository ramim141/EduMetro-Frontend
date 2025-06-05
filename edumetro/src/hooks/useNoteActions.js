// src/hooks/useNoteActions.js

"use client"

import { useState, useCallback } from "react"
import api from "../utils/api"

// ✅ notes: বর্তমান নোটস স্টেট
// ✅ setNotes: notes স্টেট আপডেটার ফাংশন
// ✅ isAuthenticated: AuthContext থেকে আসা প্রমাণীকৃত অবস্থা
// ✅ toastInstance: react-hot-toast ইনস্ট্যান্স
const useNoteActions = (notes, setNotes, isAuthenticated, toastInstance) => {
  const [actionLoading, setActionLoading] = useState({}) // প্রতিটি অ্যাকশনের জন্য লোডিং স্টেট ট্র্যাক করতে

  const setNoteActionLoading = useCallback((noteId, action, loading) => {
    setActionLoading((prev) => ({
      ...prev,
      [`${noteId}-${action}`]: loading,
    }))
  }, [])

  const handleLike = useCallback(
    async (noteId) => {
      // ✅ Authentication চেক এখানে হবে না, প্যারেন্ট কম্পোনেন্ট `handleLikeWithError` এ এটি হ্যান্ডেল করবে।
      setNoteActionLoading(noteId, "like", true)

      try {
        const response = await api.post(`/api/notes/${noteId}/toggle_like/`)
        const { liked, likes_count } = response.data; // Ensure these fields exist in backend response

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  is_liked_by_current_user: liked, // ✅ is_liked_by_current_user ব্যবহার করুন
                  likes_count: likes_count,
                }
              : note,
          ),
        )
        toastInstance.success(liked ? 'Note liked successfully!' : 'Note unliked.'); // ✅ toast মেসেজ
      } catch (err) {
        console.error("useNoteActions: Failed to toggle like:", err)
        toastInstance.error("Failed to toggle like. Please try again."); // ✅ toast মেসেজ
        throw new Error("Could not like note. Please try again.") // ✅ এরর থ্রো করুন
      } finally {
        setNoteActionLoading(noteId, "like", false)
      }
    },
    [setNotes, setNoteActionLoading, toastInstance], // ✅ toastInstance কে ডিপেন্ডেন্সিতে রাখুন
  )

  const handleBookmark = useCallback(
    async (noteId) => {
      // ✅ Authentication চেক এখানে হবে না
      setNoteActionLoading(noteId, "bookmark", true)

      try {
        const response = await api.post(`/api/notes/${noteId}/toggle_bookmark/`)
        const { bookmarked, bookmarks_count } = response.data; // Ensure these fields exist in backend response

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  is_bookmarked_by_current_user: bookmarked, // ✅ is_bookmarked_by_current_user ব্যবহার করুন
                  bookmarks_count: bookmarks_count, // ✅ bookmarks_count ব্যবহার করুন
                }
              : note,
          ),
        )
        toastInstance.success(bookmarked ? 'Note bookmarked successfully!' : 'Note removed from bookmarks.'); // ✅ toast মেসেজ
      } catch (err) {
        console.error("useNoteActions: Failed to toggle bookmark:", err)
        toastInstance.error("Failed to toggle bookmark. Please try again."); // ✅ toast মেসেজ
        throw new Error("Could not bookmark note. Please try again.") // ✅ এরর থ্রো করুন
      } finally {
        setNoteActionLoading(noteId, "bookmark", false)
      }
    },
    [setNotes, setNoteActionLoading, toastInstance], // ✅ toastInstance কে ডিপেন্ডেন্সিতে রাখুন
  )

  const handleDownload = useCallback(
    async (noteId) => {
      // ✅ Authentication চেক এখানে হবে না
      setNoteActionLoading(noteId, "download", true)

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
          } else { // Fallback for filename* format
                const filenameStarMatch = contentDisposition.match(/filename\*=(UTF-8|utf-8)''([^;]+)/i);
                if (filenameStarMatch && filenameStarMatch[2]) {
                    try {
                        filename = decodeURIComponent(filenameStarMatch[2]);
                    } catch (decodeError) {
                        console.error("Error decoding filename from content-disposition:", decodeError);
                    }
                }
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
        toastInstance.success('Download started!'); // ✅ toast মেসেজ
      } catch (err) {
        console.error("useNoteActions: Failed to download note:", err)
        toastInstance.error("Failed to download note. Please try again."); // ✅ toast মেসেজ
        throw new Error("Failed to download note. Please try again.") // ✅ এরর থ্রো করুন
      } finally {
        setNoteActionLoading(noteId, "download", false)
      }
    },
    [setNotes, setNoteActionLoading, toastInstance], // ✅ toastInstance কে ডিপেন্ডেন্সিতে রাখুন
  )

  return {
    handleLike,
    handleBookmark,
    handleDownload,
    actionLoading,
  }
}

export default useNoteActions;