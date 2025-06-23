// src/pages/notes/BookmarksPage.jsx

"use client"

import React, { useState, useEffect, useContext, useCallback } from 'react';
import api, { getBookmarkedNotes } from '../utils/api';
import NoteCard from '../components/ui/NoteCard';
import Spinner from '../components/ui/Spinner';
import Message from '../components/ui/Message';
import Pagination from '../components/Pagination';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/footer';
import Heading from '../components/ui/Heading';
import { toast } from 'react-hot-toast';
import { BookIcon } from './../components/dashboard/DashboardIcons';
import { Bookmark } from 'lucide-react';

// ✅ পেজের সাইজ একটি কনস্ট্যান্ট হিসেবে রাখা ভালো, যাতে সহজে পরিবর্তন করা যায়
const PAGE_SIZE = 12; // গ্রিড লেআউটের জন্য সাইজ বাড়ানো হলো
const CATEGORIES = ['All', 'Assignment', 'Class Note', 'Previous QS'];

const BookmarksPage = () => {
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to view your bookmarks.");
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchBookmarks = useCallback(async (page, category) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);

    const params = {
      page,
      page_size: PAGE_SIZE,
    };

    if (category !== 'All') {
      // Backend API-কে category_name দিয়ে ফিল্টার করতে হবে। আপনার API-এর প্যারামিটার ভিন্ন হলে এটি পরিবর্তন করুন।
      params.category_name = category; 
    }

    try {
      const response = await getBookmarkedNotes(params);
      setBookmarkedNotes(response.data.results || []);
      setTotalPages(Math.ceil((response.data.count || 0) / PAGE_SIZE));
      setTotalNotes(response.data.count || 0);
    } catch (err) {
      console.error('Failed to fetch bookmarked notes:', err.response ? err.response.data : err.message);
      const errorMessage = 'Failed to load your bookmarked notes. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBookmarks(currentPage, selectedCategory);
    }
  }, [isAuthenticated, currentPage, selectedCategory, authLoading, fetchBookmarks]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // ক্যাটাগরি পরিবর্তন হলে প্রথম পেজে ফিরে যাবে
  };

  const handleLike = async (noteId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to like a note.');
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/api/notes/${noteId}/toggle_like/`);
      const { liked, likes_count } = response.data;
      setBookmarkedNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId ? { ...note, is_liked_by_current_user: liked, likes_count } : note
        )
      );
      toast.success(liked ? 'Note liked!' : 'Like removed');
    } catch (err) {
      console.error('Failed to toggle like:', err);
      toast.error('Could not update like status.');
    }
  };

  const handleBookmark = async (noteId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage bookmarks.');
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/api/notes/${noteId}/toggle_bookmark/`);
      const { bookmarked } = response.data;

      if (!bookmarked) {
        toast.success('Note removed from bookmarks.');
        if (bookmarkedNotes.length === 1 && currentPage > 1) {
          setCurrentPage(prevPage => prevPage - 1);
        } else {
          fetchBookmarks(currentPage, selectedCategory);
        }
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      toast.error('Could not manage bookmark. Please try again.');
    }
  };
  
  const handleDownload = async (noteId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to download this note.');
      navigate('/login');
      return;
    }
    const toastId = toast.loading('Preparing download...');
    try {
        const response = await api.get(`/api/notes/${noteId}/download/`);
        const fileUrl = response.data.file_url;
        
        if (!fileUrl) {
            throw new Error("File URL not provided by the server.");
        }

        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', fileUrl.split('/').pop() || 'downloaded_note');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success('Download started!', { id: toastId });

        setBookmarkedNotes(prevNotes =>
            prevNotes.map(note =>
              note.id === noteId ? { ...note, download_count: response.data.download_count || (note.download_count + 1) } : note
            )
        );
    } catch (err) {
        console.error('Failed to download note:', err);
        toast.error('Failed to download note. Please try again.', { id: toastId });
    }
  };

  const renderContent = () => {
    if (loading && bookmarkedNotes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Spinner size="lg" />
          <p className="text-lg text-gray-600">Loading Your Bookmarks...</p>
        </div>
      );
    }
    
    if (error) {
        return <Message type="error" message={error} onClose={() => setError(null)} />;
    }

    if (!loading && bookmarkedNotes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
          <Heading level={3} size="xl" className="text-gray-700">No Bookmarks Found</Heading>
          <p className="mt-2 text-gray-500">
            {selectedCategory === 'All' 
              ? "You haven't bookmarked any notes yet."
              : `You have no bookmarked notes in the "${selectedCategory}" category.`
            }
          </p>
          <Link to="/notes" className="inline-block px-6 py-2 mt-6 font-semibold text-white transition-transform duration-200 bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 hover:scale-105">
            Explore Notes
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookmarkedNotes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              index={index}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onDownload={handleDownload}
              showApprovalStatus={false}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="outline"
              showFirstLast
            />
          </div>
        )}
      </>
    );
  }

  return (
   <div className="">
     <div className="flex flex-col min-h-screen mx-auto bg-gray-50 max-w-7xl">
      <main className="container flex-grow p-4 py-8 mx-auto md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 mt-8 mb-12 transition-transform duration-300 md:flex-row md:items-center ">
          <Heading level={1} className="flex items-center gap-1">
            <Bookmark className="w-12 h-12 text-indigo-600" />
           
            <h1 className="text-5xl font-extrabold text-center">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Bookmarks
              </span></h1>
          </Heading>
          {!loading && (
            <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
              {totalNotes} {totalNotes === 1 ? 'Note' : 'Notes'} Found
            </span>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-2 mb-8 bg-gray-100 border border-gray-200 rounded-xl md:gap-4">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`flex-grow px-4 py-2 text-sm font-semibold text-center transition-all duration-300 rounded-lg md:flex-initial ${ 
                selectedCategory === category 
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'text-gray-700 bg-white hover:bg-indigo-100 hover:text-indigo-700'
              }`}>
              {category}
            </button>
          ))}
        </div>

        {renderContent()}
      </main>
    </div>
     <Footer/>
   </div>
      
  );
};

export default BookmarksPage;
