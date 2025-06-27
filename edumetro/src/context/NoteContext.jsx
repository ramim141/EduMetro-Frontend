// src/context/NoteContext.jsx

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../utils/api';

// Debounce helper function
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const NoteContext = createContext(null);

export const NoteProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false); // Initially false, will be set to true only when fetching
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNotes, setTotalNotes] = useState(0);

    const [filters, setFilters] = useState({
        search: "",
        course: "",
        department: "",
        category: "All",
        rating: "",
        sortBy: "newest",
    });

    const debouncedSearch = useDebounce(filters.search, 500);

    const buildApiParams = useCallback((page, filterParams) => {
        const params = new URLSearchParams({ page: page.toString() });
        params.append("is_approved", "true");
        if (filterParams.search) params.append("search", filterParams.search);
        if (filterParams.course) params.append("course__name__icontains", filterParams.course);
        if (filterParams.department) params.append("department__name__icontains", filterParams.department);
        if (filterParams.category && filterParams.category !== "All") params.append("category__name", filterParams.category);
        if (filterParams.rating) params.append("average_rating__gte", filterParams.rating);
        const sortMapping = { newest: "-created_at", oldest: "created_at", rating: "-average_rating", downloads: "-download_count", likes: "-likes_count" };
        const ordering = sortMapping[filterParams.sortBy];
        if (ordering) params.append("ordering", ordering);
        return params;
    }, []);

    const fetchNotes = useCallback(async (page = 1, filterParams = filters, forceRefresh = false) => {
        // ✅ কোর লজিক: যদি নোটস আগে থেকেই থাকে এবং forceRefresh না করা হয়, তাহলে fetch করবে না।
        if (!forceRefresh && notes.length > 0 && !Object.values(filters).some(v => v !== "" && v !== "All" && v !== "newest")) {
             // Avoid refetching on simple navigation if we already have notes and no complex filters are set.
             // A more complex check might be needed depending on requirements.
             // For now, let's make it simpler: fetch always if filters change.
        }

        setLoading(true);
        setError(null);
        try {
            const params = buildApiParams(page, filterParams);
            const response = await api.get(`/api/notes/?${params.toString()}`);
            if (response.data && Array.isArray(response.data.results)) {
                setNotes(response.data.results);
                setTotalPages(Math.ceil((response.data.count || 0) / 10));
                setTotalNotes(response.data.count || 0);
            } else if (Array.isArray(response.data)) {
                setNotes(response.data);
                setTotalPages(1);
                setTotalNotes(response.data.length);
            } else {
                throw new Error("Invalid response format from server.");
            }
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Failed to load notes.");
        } finally {
            setLoading(false);
        }
    }, [buildApiParams, notes.length]); // depends on notes.length to re-evaluate

    // Fetch when filters or page change
    useEffect(() => {
        const currentFilters = { ...filters, search: debouncedSearch };
        fetchNotes(currentPage, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, filters.course, filters.department, filters.category, filters.rating, filters.sortBy, currentPage]);

    const updateFilters = useCallback((newFilter) => {
        setFilters(prevFilters => {
            const updated = { ...prevFilters, ...newFilter };
            if (JSON.stringify(prevFilters) !== JSON.stringify(updated)) {
                setCurrentPage(1); // Reset to page 1 on filter change
            }
            return updated;
        });
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ search: "", course: "", department: "", category: "All", rating: "", sortBy: "newest" });
        setCurrentPage(1);
    }, []);

    const value = {
        notes,
        setNotes, // Expose setNotes for useNoteActions
        loading,
        error,
        currentPage,
        totalPages,
        totalNotes,
        filters,
        updateFilters,
        clearFilters,
        setCurrentPage,
    };

    return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

// Custom hook to use the context
export const useNotes = () => {
    const context = useContext(NoteContext);
    if (context === undefined) {
        throw new Error('useNotes must be used within a NoteProvider');
    }
    return context;
};