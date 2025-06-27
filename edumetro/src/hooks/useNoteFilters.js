// hooks/useNoteFilters.js
"use client"

import { useState, useEffect, useCallback } from "react"
import api from "../utils/api"
import { useLocation } from "react-router-dom"

// Debounce helper function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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
    category: "All",
    rating: "",
    sortBy: "newest",
  })
  
  const debouncedSearch = useDebounce(filters.search, 500); // 500ms ডিলে

  const location = useLocation()

  const buildApiParams = useCallback((page, filterParams) => {
    const params = new URLSearchParams({ page: page.toString() })
    params.append("is_approved", "true")

    if (filterParams.search) params.append("search", filterParams.search)
    if (filterParams.course) params.append("course__name__icontains", filterParams.course)
    if (filterParams.department) params.append("department__name__icontains", filterParams.department)
    if (filterParams.category && filterParams.category !== "All") params.append("category__name", filterParams.category)
    if (filterParams.rating) params.append("average_rating__gte", filterParams.rating)

    const sortMapping = {
      newest: "-created_at",
      oldest: "created_at",
      rating: "-average_rating",
      downloads: "-download_count",
      likes: "-likes_count",
    }
    const ordering = sortMapping[filterParams.sortBy]
    if (ordering) params.append("ordering", ordering)

    return params
  }, [])

  const fetchNotes = useCallback(
    async (page = 1, filterParams = filters) => {
      setLoading(true)
      setError(null)
      try {
        const params = buildApiParams(page, filterParams)
        const response = await api.get(`/api/notes/?${params.toString()}`)
        
        // ✅ CORRECTED LOGIC: Handle both paginated and non-paginated responses
        if (response.data && Array.isArray(response.data.results)) {
          // Case 1: Paginated response like { count: 5, results: [...] }
          setNotes(response.data.results)
          setTotalPages(Math.ceil((response.data.count || 0) / 10)) // Assuming page size is 10
          setTotalNotes(response.data.count || 0)
        } else if (Array.isArray(response.data)) {
          // Case 2: Simple array response like [...]
          setNotes(response.data);
          setTotalPages(1); // If it's a simple array, there's only one page
          setTotalNotes(response.data.length);
        } else {
          // If the format is still unexpected, throw an error
          throw new Error("Invalid response format from server. Expected notes data.");
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Failed to load notes.")
      } finally {
        setLoading(false)
      }
    },
    [buildApiParams], // filters is not needed here
  )

  // Fetch on initial load & when filters (except search) change
  useEffect(() => {
    // We use debouncedSearch here to avoid rapid API calls while typing
    const currentFilters = { ...filters, search: debouncedSearch };
    fetchNotes(currentPage, currentFilters);
  }, [debouncedSearch, filters.course, filters.department, filters.category, filters.rating, filters.sortBy, currentPage, fetchNotes]);

  const updateFilters = useCallback((newFilter) => {
    setFilters((prevFilters) => {
      const updated = { ...prevFilters, ...newFilter };
      // If a filter is updated, always reset to page 1
      if(JSON.stringify(prevFilters) !== JSON.stringify(updated)) {
        setCurrentPage(1);
      }
      return updated;
    });
  }, [])

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      course: "",
      department: "",
      category: "All",
      rating: "",
      sortBy: "newest",
    }
    setFilters(clearedFilters);
    setCurrentPage(1);
  }, [])

  const applyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchNotes(1, filters);
  }, [fetchNotes, filters]);

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
    setNotes,
  }
}

export default useNoteFilters;