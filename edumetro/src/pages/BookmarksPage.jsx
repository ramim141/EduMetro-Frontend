// src/pages/notes/BookmarksPage.jsx

"use client"

import React, { useState, useEffect, useContext } from 'react';
import api, { getBookmarkedNotes as fetchBookmarkedNotesApi } from '../utils/api'; // ✅ API ফাংশন ইম্পোর্ট করুন
import NoteCard from '../components/ui/NoteCard';
import Spinner from '../components/ui/Spinner';
import Message from '../components/ui/Message';
import Pagination from '../components/Pagination';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/footer'; // আপনার Footer কম্পোনেন্ট
import Heading from '../components/ui/Heading'; // আপনার Heading কম্পোনেন্ট
import { toast } from 'react-hot-toast'; // toast নোটিফিকেশনের জন্য

const BookmarksPage = () => {
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch bookmarked notes
  const fetchBookmarks = async (page = 1) => {
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBookmarkedNotesApi(page); // API কল
      console.log('Bookmarked Notes API response:', response.data);
      setBookmarkedNotes(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming page_size=10
      setTotalNotes(response.data.count);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch bookmarked notes:', err.response ? err.response.data : err.message);
      setError('Failed to load your bookmarked notes. Please try again later.');
      toast.error('Failed to load bookmarked notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBookmarks(currentPage);
    }
  }, [isAuthenticated, currentPage, authLoading]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ লাইক হ্যান্ডলার (বুকমার্ক পেজেও লাইক/আনলাইক করার অনুমতি দিতে)
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
          note.id === noteId ? { ...note, is_liked_by_current_user: liked, likes_count: likes_count } : note
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err.response ? err.response.data : err.message);
      toast.error('Could not like note. Please try again.');
    }
  };

  // ✅ বুকমার্ক হ্যান্ডলার (বুকমার্ক রিমুভ করার জন্য)
  const handleBookmark = async (noteId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage bookmarks.');
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/api/notes/${noteId}/toggle_bookmark/`);
      const { bookmarked, bookmarks_count } = response.data;

      if (!bookmarked) {
        // If the note was unbookmarked, remove it from the list
        setBookmarkedNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        toast.success('Note removed from bookmarks.');
      } else {
        // If it was newly bookmarked (shouldn't happen on this page but for completeness)
        // You might refetch the list or update individual note if it's already in the list
        setBookmarkedNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === noteId ? { ...note, is_bookmarked_by_current_user: bookmarked, bookmarks_count: bookmarks_count } : note
          )
        );
        toast.success('Note added to bookmarks.');
      }
      // If unbookmarked, totalNotes and totalPages might need to be recalculated
      if (!bookmarked && totalNotes > 0) {
        setTotalNotes(prevTotal => prevTotal - 1);
        setTotalPages(Math.ceil((totalNotes - 1) / 10)); // Recalculate pages
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err.response ? err.response.data : err.message);
      toast.error('Could not manage bookmark. Please try again.');
    }
  };

  // ✅ ডাউনলোড হ্যান্ডলার
  const handleDownload = async (noteId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to download this note.');
      navigate('/login');
      return;
    }
    try {
        const response = await api.get(`/api/notes/${noteId}/download/`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloaded_note.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) { filename = filenameMatch[1]; }
            else { /* ... filenameStarMatch logic ... */ }
        }
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        // Update download_count in state
        setBookmarkedNotes(prevNotes =>
            prevNotes.map(note =>
              note.id === noteId ? { ...note, download_count: (note.download_count || 0) + 1 } : note
            )
        );
    } catch (err) {
        console.error('Failed to download note:', err.response ? err.response.data : err.message);
        toast.error('Failed to download note. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container p-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Heading level={1} className="text-3xl font-bold text-gray-800">
            My Bookmarks
          </Heading>
        </div>

        {error && (
          <Message type="error" message={error} onClose={() => setError(null)} duration={5000} className="mb-6" />
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center space-y-4 h-64">
            <Spinner size="w-12 h-12" />
            <p className="text-gray-600">Loading your bookmarks...</p>
          </div>
        ) : bookmarkedNotes.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-8 h-64 text-center bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">You haven't bookmarked any notes yet.</p>
            <Link to="/notes" className="mt-4 text-blue-600 transition-colors duration-200 hover:text-blue-800">
              Browse Notes to Bookmark
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookmarkedNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index}
                onLike={handleLike}
                onBookmark={handleBookmark} // NoteCard থেকে রিমুভ ট্রিগার হবে
                onDownload={handleDownload}
                // showApprovalStatus এখানে প্রয়োজন নেই কারণ এটি BookmarksPage
                showApprovalStatus={false}
              />
            ))}
          </div>
        )}

        {totalNotes > 0 && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default BookmarksPage;