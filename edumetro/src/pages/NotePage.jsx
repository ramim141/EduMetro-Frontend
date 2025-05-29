import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaBookmark, FaRegBookmark, FaShare, FaDownload, FaStar, FaSpinner } from 'react-icons/fa';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const NotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    // Entrance animation
    setAnimate(true);
    
    // Fetch note data
    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/notes/${id}/`);
        setNote(response.data);
        
        // Check if note is bookmarked
        try {
          const bookmarksResponse = await api.get('/api/users/user-activity/bookmarked-notes/');
          const isBookmarked = bookmarksResponse.data.some(bookmark => bookmark.id === parseInt(id));
          setIsBookmarked(isBookmarked);
        } catch (err) {
          console.error('Failed to check bookmark status:', err);
        }
        
        // Check if user has rated this note
        try {
          const ratingsResponse = await api.get('/api/notes/ratings/', {
            params: { note: id }
          });
          const userRating = ratingsResponse.data.find(rating => rating.user === user?.id);
          if (userRating) {
            setUserRating(userRating.rating);
          }
        } catch (err) {
          console.error('Failed to check rating status:', err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load note:', err);
        if (err.message === 'Network Error') {
          setError('Cannot connect to the server. Please make sure the backend server is running.');
        } else {
          setError('Failed to load note: ' + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
        
        // Set mock data for development when backend is not available
        if (process.env.NODE_ENV === 'development') {
          setNote({
            id: parseInt(id) || 1,
            title: 'Sample Note Title',
            content: '<p>This is a sample note content for development. The backend server appears to be unavailable.</p>',
            author: 'Sample Author',
            created_at: new Date().toISOString(),
            category: 'Sample Category',
            rating: 4.5,
            downloads: 120
          });
        }
      }
    };
    
    fetchNote();
  }, [id, user]);

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      await api.delete(`/api/notes/${id}/`);
      navigate('/my-notes', { replace: true });
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/notes/${id}/download/`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note.title}.pdf`); // Adjust file extension as needed
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download note:', err);
      setError('Failed to download note');
    }
  };

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        // Find the bookmark ID and delete it
        const bookmarksResponse = await api.get('/api/users/user-activity/bookmarked-notes/');
        const bookmark = bookmarksResponse.data.find(b => b.id === parseInt(id));
        if (bookmark) {
          await api.delete(`/api/users/user-activity/bookmarked-notes/${bookmark.id}/`);
        }
      } else {
        // Add bookmark
        await api.post('/api/users/user-activity/bookmarked-notes/', {
          note: id
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Failed to update bookmark:', err);
      setError('Failed to update bookmark status');
    }
  };

  const handleRating = async (rating) => {
    try {
      if (userRating) {
        // Update existing rating
        await api.patch(`/api/notes/ratings/${userRating.id}/`, {
          rating: rating
        });
      } else {
        // Create new rating
        await api.post('/api/notes/ratings/', {
          note: id,
          rating: rating
        });
      }
      setUserRating(rating);
      
      // Refresh note to get updated average rating
      const response = await api.get(`/api/notes/${id}/`);
      setNote(response.data);
    } catch (err) {
      console.error('Failed to rate note:', err);
      setError('Failed to rate note');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <FaSpinner className="animate-spin text-4xl text-primary-500 mb-4" />
        <p className="text-gray-600">Loading note...</p>
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
              onClick={() => navigate(-1)} 
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
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

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-yellow-500 text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Note Not Found</h2>
          <p className="text-gray-600 mb-6">The note you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/my-notes" 
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300"
          >
            Back to My Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Notes
          </button>
        </div>

        {/* Note header */}
        <div className="bg-white rounded-t-xl shadow-md p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">{note.title}</h1>
            <div className="flex items-center space-x-2">
              {note.user === user?.id && (
                <>
                  <Link 
                    to={`/note/edit/${id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-300"
                    title="Edit Note"
                  >
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={handleDelete}
                    className={`p-2 ${deleteConfirm ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'} rounded-full transition-colors duration-300`}
                    title={deleteConfirm ? 'Confirm Delete' : 'Delete Note'}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
              <button 
                onClick={toggleBookmark}
                className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors duration-300"
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-300"
                title="Download Note"
              >
                <FaDownload />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors duration-300"
                title="Share Note"
              >
                <FaShare />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
            <span className="mr-4">By {note.author_name || 'Unknown'}</span>
            <span className="mr-4">Created {new Date(note.created_at).toLocaleDateString()}</span>
            <span className="mr-4 px-2 py-1 bg-primary-100 text-primary-800 rounded-full">{note.category}</span>
            <div className="flex items-center ml-auto mt-2 sm:mt-0">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => handleRating(star)}
                    className={`text-xl ${star <= (userRating || note.average_rating || 0) ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition-colors duration-150`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              <span className="ml-2 text-sm">
                ({note.average_rating?.toFixed(1) || '0.0'}) • {note.rating_count || 0} ratings
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">
              <FaDownload className="inline mr-1" /> {note.download_count || 0} downloads
            </span>
          </div>
        </div>

        {/* Note content */}
        <div className="bg-white rounded-b-xl shadow-md p-6 prose prose-primary max-w-none">
          <div dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>

        {/* Comments section - placeholder for future implementation */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <textarea 
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              rows="3"
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300">
                Post Comment
              </button>
            </div>
          </div>
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePage;