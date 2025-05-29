import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaSearch, FaSortAmountDown, FaSortAmountUp, FaStar, FaDownload } from 'react-icons/fa';
import api from '../utils/api';

const BookmarkCard = ({ id, title, excerpt, date, category, rating, downloads, onRemove }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1 border-l-4 border-yellow-500 overflow-hidden group relative">
      <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-yellow-600 text-white px-4 py-1 text-xs font-medium rounded-bl-lg">
        {category}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4 group-hover:text-yellow-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{date}</span>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-yellow-500">
            <FaStar className="mr-1" />
            <span>{rating || '0.0'}</span>
          </div>
          <div className="flex items-center text-primary-600">
            <FaDownload className="mr-1" />
            <span>{downloads || 0}</span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onRemove(id);
            }}
            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
            title="Remove Bookmark"
          >
            <FaBookmark />
          </button>
        </div>
      </div>
      <span className="text-yellow-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 inline-block">Read more →</span>
    </div>
  );
};

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Entrance animation
    setAnimate(true);
    
    // Fetch bookmarks from the API
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/users/user-activity/bookmarked-notes/');
        setBookmarks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
        if (err.message === 'Network Error') {
          setError('Cannot connect to the server. Please make sure the backend server is running.');
        } else {
          setError('Failed to load bookmarks: ' + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
        
        // Set mock data for development when backend is not available
        if (import.meta.env.DEV) {
          setBookmarks([
            { id: 1, title: 'Sample Bookmark 1', content: 'This is a sample bookmark for development', category: 'Sample', created_at: new Date().toISOString(), rating: 4.5, downloads: 120 },
            { id: 2, title: 'Sample Bookmark 2', content: 'Another sample bookmark for testing', category: 'Test', created_at: new Date().toISOString(), rating: 3.8, downloads: 85 },
          ]);
        }
      }
    };
    
    fetchBookmarks();
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleRemoveBookmark = async (noteId) => {
    try {
      // Find the bookmark entry for this note
      const bookmark = bookmarks.find(b => b.id === noteId);
      if (bookmark) {
        await api.delete(`/api/users/user-activity/bookmarked-notes/${bookmark.id}/`);
        // Update the UI by removing the bookmark
        setBookmarks(bookmarks.filter(b => b.id !== noteId));
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
      setError('Failed to remove bookmark');
    }
  };

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter(bookmark => 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.date);
      const dateB = new Date(b.created_at || b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mb-4" />
        <p className="text-gray-600">Loading bookmarks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Try Again
            </button>
            {error.includes('backend server') && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-yellow-700">
                  <strong>Developer Note:</strong> Make sure the backend server is running on http://127.0.0.1:8000
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">My Bookmarks</h1>
            <p className="text-gray-600 mt-2">Your collection of saved notes</p>
          </div>
        </div>

        {/* Search controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookmarks..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleSortOrder}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              >
                {sortOrder === 'asc' ? <FaSortAmountUp className="text-gray-600" /> : <FaSortAmountDown className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bookmarks grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <Link to={`/note/${bookmark.id}`} key={bookmark.id} className="block">
                <BookmarkCard 
                  id={bookmark.id}
                  title={bookmark.title} 
                  excerpt={bookmark.excerpt || bookmark.content?.substring(0, 150) || 'No description available'} 
                  date={new Date(bookmark.created_at || bookmark.date).toLocaleDateString()} 
                  category={bookmark.category} 
                  rating={bookmark.average_rating} 
                  downloads={bookmark.download_count} 
                  onRemove={handleRemoveBookmark}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-yellow-400 text-5xl mb-4">🔖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookmarks found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Start bookmarking notes to build your collection'}
            </p>
            {!searchTerm && (
              <Link
                to="/my-notes"
                className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-300"
              >
                Browse Notes
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;