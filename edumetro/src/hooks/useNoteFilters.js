"use client"

import { useState, useEffect, useCallback } from "react"
import api from "../utils/api"

const useNoteFilters = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNotes, setTotalNotes] = useState(0)

  const [filters, setFilters] = useState({
    search: "",
    course: "",
    department: "",
    rating: "",
    sortBy: "newest",
  })

  const buildApiParams = useCallback((page, filterParams) => {
    const params = new URLSearchParams({ page: page.toString() })

    if (filterParams.search) params.append("search", filterParams.search)
    if (filterParams.course) params.append("course", filterParams.course)
    if (filterParams.department) params.append("department", filterParams.department)
    if (filterParams.rating) params.append("min_rating", filterParams.rating)

    // Handle sorting
    if (filterParams.sortBy) {
      const sortMapping = {
        newest: "-created_at",
        oldest: "created_at",
        rating: "-average_rating",
        downloads: "-download_count",
        likes: "-likes_count",
        views: "-views_count",
      }
      const ordering = sortMapping[filterParams.sortBy]
      if (ordering) params.append("ordering", ordering)
    }

    return params
  }, [])

  const fetchNotes = useCallback(
    async (page = 1, filterParams = filters) => {
      setLoading(true)
      setError(null)

      try {
        const params = buildApiParams(page, filterParams)
        const response = await api.get(`/api/notes/?${params.toString()}`)

        setNotes(response.data.results || [])
        setTotalPages(Math.ceil(response.data.count / 10))
        setTotalNotes(response.data.count || 0)
        setCurrentPage(page)
      } catch (err) {
        console.error("Failed to fetch notes:", err)
        setError(err.response?.data?.message || err.message || "Failed to load notes. Please try again later.")
        setNotes([])
        setTotalNotes(0)
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    },
    [filters, buildApiParams],
  )

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchNotes(1, filters)
      } else {
        setCurrentPage(1)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters])

  // Fetch notes when page changes
  useEffect(() => {
    fetchNotes(currentPage, filters)
  }, [currentPage])

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      course: "",
      department: "",
      rating: "",
      sortBy: "newest",
    })
    setCurrentPage(1)
  }, [])

  const applyFilters = useCallback(() => {
    setCurrentPage(1)
    fetchNotes(1, filters)
  }, [filters, fetchNotes])

  return {
    // Data
    notes,
    loading,
    error,
    currentPage,
    totalPages,
    totalNotes,
    filters,

    // Actions
    updateFilters,
    clearFilters,
    applyFilters,
    setCurrentPage,
    refetch: () => fetchNotes(currentPage, filters),
  }
}

export default useNoteFilters
