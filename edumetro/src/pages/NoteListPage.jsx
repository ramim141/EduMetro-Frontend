// src/pages/NoteListPage.jsx (Updated for download authentication check)

import React, { useState, useEffect, useContext } from 'react'; // useContext ইম্পোর্ট করো
import { useNavigate } from 'react-router-dom'; // useNavigate ইম্পোর্ট করো
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import Dropdown from '../components/Dropdown';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import Pagination from '../components/Pagination';
import RatingStars from '../components/RatingStars';
import { FaSearch } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; // AuthContext ইম্পোর্ট করো

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  // ফিল্টার স্টেট
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterRating, setFilterRating] = useState('');
  
  // ড্রপডাউন অপশন
  const [courseOptions, setCourseOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const { isAuthenticated, user } = useContext(AuthContext); // AuthContext থেকে isAuthenticated এবং user নাও
  const navigate = useNavigate(); // useNavigate হুক নাও

  const ratingOptions = [
    { value: '5', label: <RatingStars rating={5} /> },
    { value: '4', label: <RatingStars rating={4} /> },
    { value: '3', label: <RatingStars rating={3} /> },
    { value: '2', label: <RatingStars rating={2} /> },
    { value: '1', label: <RatingStars rating={1} /> },
  ];

  // নোট ফেচ করার ফাংশন
  const fetchNotes = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page });
      if (filters.search) params.append('search', filters.search);
      if (filters.course) params.append('course', filters.course);
      if (filters.department) params.append('department', filters.department);
      if (filters.rating) params.append('min_rating', filters.rating);

      const response = await api.get(`/api/notes/?${params.toString()}`);
      setNotes(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setTotalNotes(response.data.count);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch notes:', err.response ? err.response.data : err.message);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ড্রপডাউন অপশন ফেচ করার জন্য useEffect
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const courseRes = await api.get('/api/courses/');
        const courses = courseRes.data.map(item => ({ value: item.id, label: item.name }));
        setCourseOptions(courses);

        const deptRes = await api.get('/api/departments/');
        const departments = deptRes.data.map(item => ({ value: item.id, label: item.name }));
        setDepartmentOptions(departments);
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };
    fetchDropdownOptions();
  }, []);

  // প্রাথমিক নোট লোড করার জন্য এবং ফিল্টার পরিবর্তন হলে
  useEffect(() => {
    fetchNotes(currentPage, {
      search: searchTerm,
      course: filterCourse,
      department: filterDepartment,
      rating: filterRating,
    });
  }, [currentPage, searchTerm, filterCourse, filterDepartment, filterRating]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchNotes(1, {
      search: searchTerm,
      course: filterCourse,
      department: filterDepartment,
      rating: filterRating,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLike = async (noteId) => {
    // লাইক/বুকমার্কের জন্যও অথেন্টিকেশন চেক করা ভালো, কারণ এগুলোও প্রোটেক্টেড API
    if (!isAuthenticated) {
      setError('Please log in to like a note.');
      navigate('/login');
      return;
    }
    try {
      await api.post(`/api/notes/${noteId}/toggle_like/`);
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, is_liked: !note.is_liked, likes_count: note.is_liked ? note.likes_count - 1 : note.likes_count + 1 } : note
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err.response ? err.response.data : err.message);
      setError('Could not like note. Please try again.');
    }
  };

  const handleBookmark = async (noteId) => {
    if (!isAuthenticated) {
      setError('Please log in to bookmark a note.');
      navigate('/login');
      return;
    }
    try {
      await api.post(`/api/notes/${noteId}/toggle_bookmark/`);
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, is_bookmarked: !note.is_bookmarked, bookmark_count: note.is_bookmarked ? note.bookmark_count - 1 : note.bookmark_count + 1 } : note
        )
      );
    } catch (err) {
      console.error('Failed to toggle bookmark:', err.response ? err.response.data : err.message);
      setError('Could not bookmark note. Please try again.');
    }
  };

  const handleDownload = async (noteId) => {
    // **এখানে অথেন্টিকেশন চেক করা হচ্ছে**
    if (!isAuthenticated) {
      setError('Please log in to download this note.'); // মেসেজ সেট করা
      navigate('/login'); // লগইন পেজে রিডাইরেক্ট
      return; // ফাংশন এক্সিকিউশন বন্ধ
    }

    try {
        const response = await api.get(`/api/notes/${noteId}/download/`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloaded_note.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setNotes(prevNotes => 
            prevNotes.map(note => 
              note.id === noteId ? { ...note, download_count: (note.download_count || 0) + 1 } : note
            )
        );
    } catch (err) {
        console.error('Failed to download note:', err.response ? err.response.data : err.message);
        setError('Failed to download note. Please try again.');
    }
};


  return (
    <div className="flex flex-col gap-6 px-8 py-12 mx-auto md:flex-row max-w-7xl">
      {/* Filter Section */}
      <div className="w-full p-6 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md md:w-1/4">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Filter Notes</h2>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
            <Input
              icon={<FaSearch />}
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Course</label>
            <Dropdown
              options={courseOptions}
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Department</label>
            <Dropdown
              options={departmentOptions}
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Minimum Rating</label>
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <label 
                  key={option.value} 
                  className="flex items-center p-2 space-x-2 transition-colors duration-200 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="ratingFilter"
                    value={option.value}
                    checked={filterRating === option.value}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="w-4 h-4 text-blue-600 form-radio"
                  />
                  {option.label}
                </label>
              ))}
              {filterRating && (
                <button
                  onClick={() => setFilterRating('')}
                  className="w-full mt-2 text-sm text-blue-600 transition-colors duration-200 hover:text-blue-800"
                >
                  Clear Rating Filter
                </button>
              )}
            </div>
          </div>

          <Button 
            onClick={handleApplyFilters} 
            className="w-full transition-all duration-200"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Notes List Section */}
      <div className="w-full md:w-3/4">
        {error && (
          <Message 
            type="error" 
            message={error} 
            onClose={() => setError(null)} 
            duration={5000}
            className="mb-4"
          />
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spinner size="w-12 h-12" />
            <p className="text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-600">No notes found matching your criteria.</p>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onDownload={handleDownload}
                className="transition-all duration-200 hover:shadow-md"
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteListPage;