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

// ✅ পেজের সাইজ একটি কনস্ট্যান্ট হিসেবে রাখা ভালো, যাতে সহজে পরিবর্তন করা যায়
const PAGE_SIZE = 10;

const BookmarksPage = () => {
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ ব্যবহারকারী লগইন না থাকলে তাকে লগইন পেজে পাঠিয়ে দেওয়া হবে
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to view your bookmarks.");
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // ✅ useCallback ব্যবহার করে fetchBookmarks ফাংশনটিকে অপ্টিমাইজ করা হয়েছে
  const fetchBookmarks = useCallback(async (page) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getBookmarkedNotes({ page, page_size: PAGE_SIZE });
      setBookmarkedNotes(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
      setTotalNotes(response.data.count);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch bookmarked notes:', err.response ? err.response.data : err.message);
      const errorMessage = 'Failed to load your bookmarked notes. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ✅ যখন authentication স্ট্যাটাস বা currentPage পরিবর্তন হবে, তখন ডেটা আবার লোড হবে
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBookmarks(currentPage);
    }
  }, [isAuthenticated, currentPage, authLoading, fetchBookmarks]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // পেজ পরিবর্তনের পর উপরে স্ক্রল করার জন্য
  };

  // ✅ একটি নোটে লাইক দেওয়ার হ্যান্ডলার
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

  // ✅ বুকমার্ক রিমুভ করার জন্য উন্নত এবং নির্ভরযোগ্য হ্যান্ডলার
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
        
        // যদি বর্তমান পেজের এটিই শেষ নোট হয় এবং এটি প্রথম পেজ না হয়,
        // তাহলে ব্যবহারকারীকে আগের পেজে পাঠিয়ে দিন।
        if (bookmarkedNotes.length === 1 && currentPage > 1) {
          setCurrentPage(prevPage => prevPage - 1);
        } else {
          // অন্যথায়, বর্তমান পেজটি রিফ্রেশ করুন।
          fetchBookmarks(currentPage);
        }
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      toast.error('Could not manage bookmark. Please try again.');
    }
  };
  
  // ✅ নোট ডাউনলোড করার হ্যান্ডলার
  const handleDownload = async (noteId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to download this note.');
      navigate('/login');
      return;
    }
    const toastId = toast.loading('Preparing download...');
    try {
        const response = await api.get(`/api/notes/${noteId}/download/`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloaded_note';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
              filename = decodeURIComponent(filenameMatch[1]);
            }
        }
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success('Download started!', { id: toastId });
        setBookmarkedNotes(prevNotes =>
            prevNotes.map(note =>
              note.id === noteId ? { ...note, download_count: (note.download_count || 0) + 1 } : note
            )
        );
    } catch (err) {
        console.error('Failed to download note:', err);
        toast.error('Failed to download note. Please try again.', { id: toastId });
    }
  };

  // ✅ কন্টেন্ট রেন্ডার করার জন্য একটি ফাংশন, যা কোডকে পরিষ্কার রাখে
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
          <p className="mt-2 text-gray-500">You haven't bookmarked any notes yet.</p>
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
   <div>
     <div className="flex flex-col min-h-screen mx-auto bg-gray-50 max-w-7xl">
      <main className="container flex-grow p-4 py-8 mx-auto md:p-8">
        <div className="flex items-center justify-between mb-8">
          <Heading level={1} size="3xl" weight="bold" className="text-gray-800">
            My Bookmarks
          </Heading>
          {!loading && totalNotes > 0 && (
            <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
              {totalNotes} {totalNotes === 1 ? 'Note' : 'Notes'}
            </span>
          )}
        </div>
        {renderContent()}
      </main>
   
    </div>
     <Footer/>
   </div>
      
  );
};

export default BookmarksPage;