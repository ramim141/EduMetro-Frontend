// src/pages/MyNotesPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import Pagination from '../components/Pagination';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import Footer from '../components/footer'; // ✅ আপনার Footer কম্পোনেন্টের সঠিক পাথ

const MyNotesPage = () => {
  // ✅ নোটগুলোকে দুটি আলাদা স্টেটে ভাগ করা হয়েছে
  const [approvedNotes, setApprovedNotes] = useState([]);
  const [pendingNotes, setPendingNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0); // This will represent total count of ALL notes (approved + pending)

  const { isAuthenticated, user, isLoading: authLoading } = useContext(AuthContext); // AuthContext থেকে user, isAuthenticated, এবং authLoading নাও
  const navigate = useNavigate();

  // যেহেতু My Notes পেজ শুধু লগইন করা ইউজারের জন্য,
  // যদি user অবজেক্ট না থাকে বা AuthContext লোডিং শেষ না হয়, তাহলে রিডাইরেক্ট করো।
  useEffect(() => {
    // Wait until AuthContext is done loading and has determined isAuthenticated status
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // নোট ফেচ করার ফাংশন
  const fetchMyNotes = async (page = 1) => {
    // Only fetch if authenticated and not in initial authLoading state
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch user's notes using the dedicated endpoint
      const response = await api.get(`/api/notes/my-notes/?page=${page}`);
      console.log('My Notes API response:', response.data);

      const allFetchedNotes = response.data.results;

      // ✅ fetched নোটগুলোকে is_approved স্ট্যাটাস অনুযায়ী ভাগ করা
      const approved = allFetchedNotes.filter(note => note.is_approved);
      const pending = allFetchedNotes.filter(note => !note.is_approved);

      setApprovedNotes(approved);
      setPendingNotes(pending);
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

  // প্রাথমিক নোট লোড করার জন্য
  useEffect(() => {
    // Fetch notes only when authentication is confirmed and not loading
    if (!authLoading && isAuthenticated) {
      fetchMyNotes(currentPage);
    }
  }, [isAuthenticated, currentPage, authLoading]); // Add authLoading to dependencies

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ আপনার NoteCard গুলো is_liked_by_current_user এবং is_bookmarked_by_current_user ফিল্ড ব্যবহার করবে
  // NoteCard এ is_liked এবং is_bookmarked প্রপসগুলো `note.is_liked_by_current_user`
  // এবং `note.is_bookmarked_by_current_user` ব্যবহার করে আপডেট করতে হবে।
  // আপনার backend থেকে আসা Response এ is_liked_by_current_user এবং is_bookmarked_by_current_user আছে।

  const handleLike = async (noteId) => {
    if (!isAuthenticated) {
      setError('Please log in to like a note.');
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/api/notes/${noteId}/toggle_like/`);
      const { liked, likes_count } = response.data;
      
      // Update state for both approved and pending notes
      setApprovedNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, is_liked_by_current_user: liked, likes_count: likes_count } : note
        )
      );
      setPendingNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, is_liked_by_current_user: liked, likes_count: likes_count } : note
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
      const response = await api.post(`/api/notes/${noteId}/toggle_bookmark/`);
      const { bookmarked, bookmarks_count } = response.data;

      // Update state for both approved and pending notes
      setApprovedNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, is_bookmarked_by_current_user: bookmarked, bookmarks_count: bookmarks_count } : note
        )
      );
      setPendingNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, is_bookmarked_by_current_user: bookmarked, bookmarks_count: bookmarks_count } : note
        )
      );
    } catch (err) {
      console.error('Failed to toggle bookmark:', err.response ? err.response.data : err.message);
      setError('Could not bookmark note. Please try again.');
    }
  };

  const handleDownload = async (noteId) => {
    if (!isAuthenticated) {
      setError('Please log in to download this note.');
      navigate('/login');
      return;
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

        // Update download_count in state for both approved and pending notes
        setApprovedNotes(prevNotes =>
            prevNotes.map(note =>
              note.id === noteId ? { ...note, download_count: (note.download_count || 0) + 1 } : note
            )
        );
        setPendingNotes(prevNotes =>
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
    <div>
      <div className="container p-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Uploaded Notes</h1>
          <Link
            to="/upload-note"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md transition-colors duration-200 hover:bg-blue-700"
          >
            <FaUpload className="mr-2" />
            Upload New Note
          </Link>
        </div>

        {error && (
          <Message
            type="error"
            message={error}
            onClose={() => setError(null)}
            duration={5000}
            className="mb-6"
          />
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center space-y-4 h-64">
            <Spinner size="w-12 h-12" />
            <p className="text-gray-600">Loading your notes...</p>
          </div>
        ) : (
          <>
            {/* Pending Notes Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Notes Awaiting Approval ({pendingNotes.length})
              </h2>
              {pendingNotes.length === 0 ? (
                <Message type="info" message="You have no notes pending approval currently." />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onDownload={handleDownload}
                      className="transition-all duration-200 hover:shadow-md"
                      showApprovalStatus={true} // ✅ স্ট্যাটাস দেখানোর জন্য
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Approved Notes Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Approved Notes ({approvedNotes.length})
              </h2>
              {approvedNotes.length === 0 ? (
                <Message type="info" message="You have no notes approved yet." />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {approvedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onDownload={handleDownload}
                      className="transition-all duration-200 hover:shadow-md"
                      showApprovalStatus={true} // ✅ স্ট্যাটাস দেখানোর জন্য
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Overall Pagination for all notes */}
            {totalNotes > 0 && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* If both sections are empty */}
            {pendingNotes.length === 0 && approvedNotes.length === 0 && !loading && (
              <div className="flex flex-col justify-center items-center p-8 h-64 text-center bg-white rounded-lg shadow-sm">
                <p className="text-gray-600">You have not uploaded any notes yet.</p>
                <Link
                  to="/upload-note"
                  className="mt-4 text-blue-600 transition-colors duration-200 hover:text-blue-800"
                >
                  Upload your first note!
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default MyNotesPage;