// src/pages/MyNotesPage.jsx

"use client"

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import NoteCard from '../components/ui/NoteCard'; // ✅ নিশ্চিত করুন সঠিক পাথ (ui ফোল্ডারে আছে)
import Spinner from '../components/ui/Spinner'; // ✅ নিশ্চিত করুন সঠিক পাথ
import Message from '../components/ui/Message'; // ✅ নিশ্চিত করুন সঠিক পাথ
import Pagination from '../components/Pagination';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import Footer from '../components/footer';
import Button from '../components/Button';


const MyNotesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notes, setNotes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const { isAuthenticated, user, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);


  const fetchMyNotes = async (page = 1, tab = activeTab) => {
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let endpoint = `/api/notes/my-notes/?page=${page}`;
      if (tab === 'pending') {
        endpoint += '&is_approved=false'; // Fetch only pending notes
      } else if (tab === 'all') {
        endpoint += '&is_approved=true'; // ✅ "All Notes" ট্যাবে শুধুমাত্র Approved Notes দেখাবে
      }

      const response = await api.get(endpoint);
      console.log(`My Notes API response for tab ${tab}:`, response.data);

      setNotes(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming page_size=10 in backend
      setTotalNotes(response.data.count);
      setCurrentPage(page);

    } catch (err) {
      console.error('Failed to fetch my notes:', err.response ? err.response.data : err.message);
      setError('Failed to load your notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchMyNotes(currentPage, activeTab);
    }
  }, [isAuthenticated, currentPage, activeTab, authLoading]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // ট্যাব পরিবর্তন হলে পেজিনেশন রিসেট করুন
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLike = async (noteId) => {
    if (!isAuthenticated) { return; }
    try {
      const response = await api.post(`/api/notes/${noteId}/toggle_like/`);
      const { liked, likes_count } = response.data;
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId ? { ...note, is_liked_by_current_user: liked, likes_count: likes_count } : note
        )
      );
    } catch (err) { console.error('Failed to toggle like:', err.response ? err.response.data : err.message); }
  };

  const handleBookmark = async (noteId) => {
    if (!isAuthenticated) { return; }
    try {
      const response = await api.post(`/api/notes/${noteId}/toggle_bookmark/`);
      const { bookmarked, bookmarks_count } = response.data;
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId ? { ...note, is_bookmarked_by_current_user: bookmarked, bookmarks_count: bookmarks_count } : note
        )
      );
      // এখানে toast মেসেজ দেওয়া হয়েছে, কিন্তু `BookmarksPage` কে রিফ্রেশ করতে হবে।
      // এই পেজ থেকে বুকমার্ক/আনবুকমার্ক করা হলে, `BookmarksPage` এ গিয়ে ডেটা আবার লোড করতে হবে।
      // (যদি আপনি অন্য কোনো পেজে থাকেন এবং এখানে বুকমার্ক করেন, তাহলে `BookmarksPage` এ গিয়ে এটি দেখা যাবে।)
      toast.success(bookmarked ? 'Note bookmarked successfully.' : 'Note removed from bookmarks.');
    } catch (err) { console.error('Failed to toggle bookmark:', err.response ? err.response.data : err.message); }
  };


  const handleDownload = async (noteId) => {
    if (!isAuthenticated) { return; }
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
        setNotes(prevNotes =>
            prevNotes.map(note =>
              note.id === noteId ? { ...note, download_count: (note.download_count || 0) + 1 } : note
            )
        );
    } catch (err) { console.error('Failed to download note:', err.response ? err.response.data : err.message); }
  };


  return (
    <section className="bg-gray-50"> {/* ✅ Background */}
      <div className="container p-4 px-4 py-8 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Notes Library</h1>
          <Link
            to="/upload-note"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md transition-colors duration-200 hover:bg-blue-700"
          >
            <FaUpload className="mr-2" /> Upload New Note
          </Link>
        </div>

        {/* ✅ ট্যাব নেভিগেশন */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'all' ? 'text-indigo-600 border-indigo-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => handleTabChange('all')}
                role="tab"
                aria-selected={activeTab === 'all'}
              >
                All Notes ({totalNotes})
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'pending' ? 'text-indigo-600 border-indigo-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => handleTabChange('pending')}
                role="tab"
                aria-selected={activeTab === 'pending'}
              >
                Pending Notes ({totalNotes})
              </button>
            </li>
          </ul>
        </div>


        {error && (
          <Message type="error" message={error} onClose={() => setError(null)} duration={5000} className="mb-6" />
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center space-y-4 h-64">
            <Spinner size="w-12 h-12" />
            <p className="text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-8 h-64 text-center bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">
              {activeTab === 'all' ? "You have not uploaded any notes yet." : "No notes pending approval currently."}
            </p>
            {activeTab === 'all' && (
              <Link to="/upload-note" className="mt-4 text-blue-600 transition-colors duration-200 hover:text-blue-800">
                Upload your first note!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onDownload={handleDownload}
                showApprovalStatus={true}
              />
            ))}
          </div>
        )}

        {/* ✅ লোড মোর বাটন (পেজিনেশনের জন্য) */}
        {totalNotes > 0 && totalPages > 1 && currentPage < totalPages && (
            <div className="mt-20 text-center">
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    variant="secondary"
                    size="lg"
                >
                    Load More Notes ({totalNotes - (currentPage * 10)} remaining)
                </Button>
            </div>
        )}
      </div>
      <Footer/>
    </section>
  );
};

export default MyNotesPage;