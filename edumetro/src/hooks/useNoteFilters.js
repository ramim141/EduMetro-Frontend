"use client"

import { useState, useEffect, useCallback } from "react"
import api from "../utils/api"
import { useLocation } from "react-router-dom"

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

  const location = useLocation()

  const buildApiParams = useCallback((page, filterParams) => {
    const params = new URLSearchParams({ page: page.toString() })
    params.append("is_approved", "true")

    if (filterParams.search) params.append("search", filterParams.search)
    if (filterParams.course) params.append("course__name", filterParams.course)
    if (filterParams.department) params.append("department__name", filterParams.department)
    if (filterParams.rating) params.append("min_rating", filterParams.rating)

    if (filterParams.sortBy) {
      const sortMapping = {
        newest: "-created_at",
        oldest: "created_at",
        rating: "-average_rating",
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
      console.log("useNoteFilters: Starting fetchNotes with page:", page, "and filters:", filterParams)

      // Set loading to true at the start
      setLoading(true)
      setError(null)

      try {
        const params = buildApiParams(page, filterParams)
        const url = `/api/notes/?${params.toString()}`
        console.log("useNoteFilters: API Request URL:", url)

        const response = await api.get(url)
        console.log("useNoteFilters: API Response Status:", response.status)
        console.log("useNoteFilters: API Response Data:", response.data)

        if (response.data && response.data.results) {
          const notesData = Array.isArray(response.data.results) ? response.data.results : []

          console.log("useNoteFilters: Setting notes data:", notesData)
          setNotes(notesData)
          setTotalPages(Math.ceil((response.data.count || 0) / 10))
          setTotalNotes(response.data.count || 0)
          setCurrentPage(page)

          console.log("useNoteFilters: Notes set successfully. Count:", notesData.length)
          console.log("useNoteFilters: Total notes:", response.data.count)
        } else {
          console.error("useNoteFilters: Invalid API response format:", response.data)
          setError("Invalid response format from server.")
          setNotes([])
          setTotalNotes(0)
          setTotalPages(1)
        }
      } catch (err) {
        console.error("useNoteFilters: Failed to fetch notes:", err)
        setError(err.response?.data?.detail || err.message || "Failed to load notes.")
        setNotes([])
        setTotalNotes(0)
        setTotalPages(1)
      } finally {
        // Always set loading to false at the end
        console.log("useNoteFilters: Setting loading to false")
        setLoading(false)
      }
    },
    [buildApiParams],
  )

  // Initial fetch based on URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const initialSearch = queryParams.get("search")
    const initialDepartmentName = queryParams.get("department__name")
    const initialCourseName = queryParams.get("course__name")
    const initialSortBy = queryParams.get("ordering")

    const sortMapping = {
      "-created_at": "newest",
      created_at: "oldest",
      "-average_rating": "rating",
      "-likes_count": "likes",
      "-views_count": "views",
    }
    const mappedSortBy = initialSortBy ? sortMapping[initialSortBy] : "newest"

    const initialFilters = {
      search: initialSearch || "",
      department: initialDepartmentName || "",
      course: initialCourseName || "",
      rating: "",
      sortBy: mappedSortBy,
    }

    setFilters(initialFilters)
    // Fetch notes immediately with initial filters
    fetchNotes(1, initialFilters)
  }, [location.search, fetchNotes])

  // Debounced effect for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("useNoteFilters: Filter change detected, fetching notes...")
      fetchNotes(1, filters)
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters.search, filters.course, filters.department, filters.rating, filters.sortBy])

  // Fetch notes when currentPage changes (but not on initial load)
  useEffect(() => {
    if (currentPage > 1) {
      console.log("useNoteFilters: Page change detected, fetching notes for page:", currentPage)
      fetchNotes(currentPage, filters)
    }
  }, [currentPage])

  const updateFilters = useCallback((newFilter) => {
    console.log("useNoteFilters: Updating filters:", newFilter)
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilter }))
  }, [])

  const clearFilters = useCallback(() => {
    console.log("useNoteFilters: Clearing all filters")
    const clearedFilters = {
      search: "",
      course: "",
      department: "",
      rating: "",
      sortBy: "newest",
    }
    setFilters(clearedFilters)
    fetchNotes(1, clearedFilters)
    setCurrentPage(1)
  }, [fetchNotes])

  const applyFilters = useCallback(() => {
    console.log("useNoteFilters: Applying filters manually")
    fetchNotes(1, filters)
    setCurrentPage(1)
  }, [fetchNotes, filters])

  return {
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
    refetch: fetchNotes,
    setNotes,
  }
}

export default useNoteFilters
