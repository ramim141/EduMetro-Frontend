import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaSearch, FaSortAmountDown, FaSortAmountUp, FaSpinner, FaDownload, FaStar } from 'react-icons/fa';
import api from '../utils/api';

const NoteCard = ({ title, excerpt, date, category, rating, downloads }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1 border-l-4 border-primary-500 overflow-hidden group relative">
      <div className="absolute top-0 right-0 bg-gradient-to-l from-primary-500 to-primary-600 text-white px-4 py-1 text-xs font-medium rounded-bl-lg">
        {category}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4 group-hover:text-primary-600 transition-colors duration-300">{title}</h3>
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
        </div>
      </div>
      <span className="text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 inline-block">Read more →</span>
    </div>
  );
};

const MyNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [animate, setAnimate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Entrance animation
    setAnimate(true);
    
    // Fetch notes from the API
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/notes/', {
          params: {
            search: searchTerm,
            ordering: sortOrder === 'asc' ? 'created_at' : '-created_at',
            category: selectedCategory !== 'All' ? selectedCategory : '',
            page: currentPage
          }
        });
        
        setNotes(response.data.results || response.data);
        
        // If pagination info is available
        if (response.data.count) {
          const pageSize = 10; // Adjust based on your API's page size
          setTotalPages(Math.ceil(response.data.count / pageSize));
        }
        
        // Extract unique categories from notes
        if (response.data.results || response.data) {
          const notesData = response.data.results || response.data;
          const uniqueCategories = [...new Set(notesData.map(note => note.category))];
          setCategories(['All', ...uniqueCategories]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load notes:', err);
        if (err.message === 'Network Error') {
          setError('Cannot connect to the server. Please make sure the backend server is running.');
        } else {
          setError('Failed to load notes: ' + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
        
        // Set some mock data for development when backend is not available
        if (import.meta.env.DEV) {
          setNotes([
            { id: 1, title: 'Sample Note 1', content: 'This is a sample note for development', category: 'Sample', created_at: new Date().toISOString(), rating: 4.5, downloads: 120 },
            { id: 2, title: 'Sample Note 2', content: 'Another sample note for testing', category: 'Test', created_at: new Date().toISOString(), rating: 3.8, downloads: 85 },
          ]);
          setCategories(['All', 'Sample', 'Test']);
        }
      }
    };
    
    fetchNotes();
  }, [searchTerm, sortOrder, selectedCategory, currentPage]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // For client-side filtering if needed
  const filteredNotes = notes;

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <FaSpinner className="animate-spin text-4xl text-primary-500 mb-4" />
        <p className="text-gray-600">Loading notes...</p>
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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">My Notes</h1>
            <p className="text-gray-600 mt-2">Manage and organize your personal notes</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/note/new"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FaPlus className="mr-2" />
              New Note
            </Link>
          </div>
        </div>

        {/* Search and filter controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all duration-300"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1); // Reset to first page on category change
                  }}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
              </div>
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

        {/* Notes grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Link to={`/note/${note.id}`} key={note.id} className="block">
                <NoteCard 
                  title={note.title} 
                  excerpt={note.excerpt || note.content?.substring(0, 150) || 'No description available'} 
                  date={new Date(note.created_at).toLocaleDateString()} 
                  category={note.category} 
                  rating={note.average_rating} 
                  downloads={note.download_count} 
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No notes found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first note to get started'}
            </p>
            {(!searchTerm && selectedCategory === 'All') && (
              <Link
                to="/note/new"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300"
              >
                Create Note
              </Link>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">Previous</span>
                &laquo;
              </button>
              
              {[...Array(totalPages).keys()].map(page => (
                <button
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page + 1 ? 'bg-primary-50 text-primary-600 border-primary-500 z-10' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {page + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">Next</span>
                &raquo;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNotesPage;