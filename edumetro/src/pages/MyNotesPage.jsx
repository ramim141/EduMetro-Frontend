// src/pages/MyNotesPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import Pagination from '../components/Pagination';
import AuthContext from '../context/AuthContext'; // AuthContext ইম্পোর্ট করো
import { useNavigate, Link } from 'react-router-dom'; // useNavigate ইম্পোর্ট করো
import { FaUpload } from 'react-icons/fa';
import Footer from '@/components/footer';

const MyNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const { isAuthenticated, user } = useContext(AuthContext); // AuthContext থেকে user এবং isAuthenticated নাও
  const navigate = useNavigate();

  // যেহেতু My Notes পেজ শুধু লগইন করা ইউজারের জন্য,
  // যদি user অবজেক্ট না থাকে বা লোডিং শেষ না হয়, তাহলে রিডাইরেক্ট করো।
  useEffect(() => {
    if (!isAuthenticated && !loading) { // AuthContext এর লোডিং শেষ হলে এবং অথেন্টিকেটেড না হলে
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // নোট ফেচ করার ফাংশন
  const fetchMyNotes = async (page = 1) => {
    if (!isAuthenticated) { // Check authentication before fetching
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch user's notes using the dedicated endpoint
      const response = await api.get(`/api/notes/my-notes/?page=${page}`);
      console.log('My Notes API response:', response.data);
      setNotes(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
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
    if (isAuthenticated) { // Only fetch if authenticated
      fetchMyNotes(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Like, Bookmark, Download ফাংশনগুলো NoteListPage থেকে কপি করা যেতে পারে
  // যদি এগুলো My Notes থেকেও করা যায়।
  // সাধারণত, নিজের নোট লাইক বা বুকমার্ক করার প্রয়োজন হয় না,
  // তবে ডাউনলোড এবং ডিলিট করার অপশন থাকতে পারে।
  // আপাতত, এই ফাংশনগুলো এখানেও রাখছি।
  const handleLike = async (noteId) => {
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
      ) : notes.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-8 h-64 text-center bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">You have not uploaded any notes yet.</p>
          <Link 
            to="/upload-note" 
            className="mt-4 text-blue-600 transition-colors duration-200 hover:text-blue-800"
          >
            Upload your first note!
          </Link>
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
    <Footer/>
    </div>
  );
};

export default MyNotesPage;