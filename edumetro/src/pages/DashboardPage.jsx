// src/pages/DashboardPage.jsx (Slightly modified for correct links)

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBookmark, FaBell, FaSearch, FaChartLine, FaEdit, FaUpload, FaEye, FaStar, FaChartBar, FaFileAlt, FaUserCircle, FaEnvelope, FaIdCard } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Spinner from '../components/Spinner';

// eslint-disable-next-line no-unused-vars
const DashboardCard = ({ icon: Icon, title, count, link, color }) => (
  <Link
    to={link}
    className={`overflow-hidden relative p-6 bg-white rounded-xl border-l-4 shadow-md transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 ${color} group`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-white opacity-0 transition-opacity duration-500 group-hover:opacity-10"></div>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-primary-600">{count}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')} bg-opacity%20 text-primary-600`}>
        <Icon className="text-2xl" />
      </div>
    </div>
  </Link>
);

const DashboardPage = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [animate, setAnimate] = useState(false);
  const [stats, setStats] = useState({
    notes: 0,
    comments: 0,
    downloads: 0,
    rating: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAnimate(true);
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user?.user_id) return;
    
    try {
      setLoadingStats(true);
      // Fetch user's notes count
      const notesResponse = await api.get(`/api/notes/?uploaded_by=${user.user_id}`);
      const notesCount = notesResponse.data.count || 0;

      // Fetch user's comments count
      const commentsResponse = await api.get(`/api/comments/?user=${user.user_id}`);
      const commentsCount = commentsResponse.data.count || 0;

      // Fetch user's total downloads
      const downloadsResponse = await api.get(`/api/notes/?uploaded_by=${user.user_id}`);
      const totalDownloads = downloadsResponse.data.results.reduce((sum, note) => sum + (note.download_count || 0), 0);

      // Fetch user's average rating
      const ratingResponse = await api.get(`/api/notes/?uploaded_by=${user.user_id}`);
      const notesWithRatings = ratingResponse.data.results.filter(note => note.rating_count > 0);
      const averageRating = notesWithRatings.length > 0
        ? notesWithRatings.reduce((sum, note) => sum + (note.rating || 0), 0) / notesWithRatings.length
        : 0;

      setStats({
        notes: notesCount,
        comments: commentsCount,
        downloads: totalDownloads,
        rating: parseFloat(averageRating.toFixed(1))
      });
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
      setError('Failed to load user statistics. Please try again later.');
    } finally {
      setLoadingStats(false);
    }
  };

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'P';
  const studentName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user?.username || 'Student Name';

  return (
    <div className={`flex min-h-screen bg-gray-100 transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <span className="text-2xl font-bold text-yellow-500">Note</span><span className="text-2xl font-bold text-gray-800">Share</span>
        </div>
        <nav className="mt-5">
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 border-l-4 border-blue-600">
            <FaChartBar className="mr-2" />
            Dashboard
          </Link>
          <Link to="/my-notes" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <FaFileAlt className="mr-2" />
            My Notes
          </Link>
          <Link to="/note" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <FaSearch className="mr-2" />
            Browse Notes
          </Link>
          <Link to="/bookmarks" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <FaBookmark className="mr-2" />
            Bookmarks
          </Link>
          <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <FaUserCircle className="mr-2" />
            Profile
          </Link>
        </nav>

        <div className="p-4 mt-8 border-t">
          <h4 className="text-sm font-semibold text-gray-600">Quick Access</h4>
          <Link 
            to="/upload-note" 
            className="flex items-center px-4 py-2 mt-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
          >
            <FaUpload className="mr-2" />
            Upload New Note
          </Link>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Search bar and Notification */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-64">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: '#f3e8ff', borderColor: '#d8b4fe'}}
            />
          </div>
          <div className="flex items-center space-x-4">
             <button 
                  className="relative p-2 text-gray-700 rounded-full transition-all duration-300 hover:bg-gray-200 focus:outline-none"
                  aria-label="Notifications"
                  style={{ backgroundColor: '#fcd34d' }}
                >
                  <FaBell className="text-xl" />
                </button>
          </div>
        </div>

        {/* Dashboard Title */}
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mb-8 text-gray-600">This is your dashboard and important information center</p>
        
        {/* Welcome card with trend */}
        <div className="flex overflow-hidden relative justify-between items-center p-6 mb-8 bg-gray-200 rounded-xl shadow-md"
             style={{ backgroundColor: '#e0e0e0' }}
        >
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {studentName}!</h2>
          <div className="flex items-center text-gray-600">
            <FaChartLine className="ml-2 text-xl" />
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {loadingStats ? (
            // Loading state for stats
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border-l-4 border-gray-200 shadow-md animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Notes Posted */}
              <div className="p-6 bg-white rounded-xl border-l-4 border-green-400 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Notes Posted</p>
                    <p className="mt-2 text-3xl font-bold text-green-700">{stats.notes}</p>
                  </div>
                  <div className="p-3 text-green-600 bg-white rounded-full">
                    <FaBook className="text-2xl" />
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="p-6 bg-white rounded-xl border-l-4 border-yellow-400 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Comments</p>
                    <p className="mt-2 text-3xl font-bold text-yellow-700">{stats.comments}</p>
                  </div>
                  <div className="p-3 text-yellow-600 bg-white rounded-full">
                    <FaBell className="text-2xl" />
                  </div>
                </div>
              </div>

              {/* Downloads */}
              <div className="p-6 bg-white rounded-xl border-l-4 border-blue-400 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Downloads</p>
                    <p className="mt-2 text-3xl font-bold text-blue-700">{stats.downloads}</p>
                  </div>
                  <div className="p-3 text-blue-600 bg-white rounded-full">
                    <FaBookmark className="text-2xl" />
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="p-6 bg-white rounded-xl border-l-4 border-purple-400 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Average Rating</p>
                    <p className="mt-2 text-3xl font-bold text-purple-700">{stats.rating}</p>
                  </div>
                  <div className="p-3 text-purple-600 bg-white rounded-full">
                    <FaStar className="text-2xl" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* User profile and quick actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {/* User profile card */}
          <div className="p-6 bg-white rounded-xl shadow-md lg:col-span-1">
            <div className="flex flex-col items-center mb-4">
              <div className="flex overflow-hidden justify-center items-center mb-4 w-24 h-24 text-4xl font-bold text-gray-600 bg-gray-200 rounded-full border-4 border-gray-300">
                 {userInitial}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{studentName}</h3>
              <p className="text-gray-600">{user?.department || 'Department'}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="w-8 text-center"><FaEnvelope className="inline-block"/></span>
                <span>{user?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="w-8 text-center"><FaIdCard className="inline-block"/></span>
                <span>Student ID: {user?.student_id || '(Student ID)'}</span>
              </div>
            </div>
            
            <div className="p-4 mt-4 rounded-lg"
                 style={{ backgroundColor: '#e9f5ee'}}
            >
              <h4 className="mb-2 text-sm font-medium text-gray-700">Bio</h4>
              <p className="text-sm italic text-gray-600">{user?.bio || 'No bio added yet.'}</p>
            </div>
            
            <Link to="/profile" className="flex justify-center items-center py-2 mt-4 w-full text-white bg-green-600 rounded-lg transition-colors duration-300 hover:bg-green-700">
              <FaEdit className="mr-2" />
              Edit Profile
            </Link>
          </div>
          
          {/* Quick actions */}
          <div className="p-6 bg-white rounded-xl shadow-md lg:col-span-2">
            <h3 className="mb-4 text-xl font-bold text-red-600">Quick Actions</h3>
            <p className="mb-4 text-gray-600">Frequently used actions to manage notes and profile</p>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link 
                to="/upload-note" 
                className="flex flex-col justify-center items-center p-4 text-white bg-blue-600 rounded-lg transition-colors duration-300 hover:bg-blue-700"
              >
                <FaUpload className="mb-2 text-2xl" />
                <span>Upload New Note</span>
              </Link>
              
              <Link to="/note" className="flex flex-col justify-center items-center p-4 text-blue-600 bg-white rounded-lg border border-blue-600 transition-colors duration-300 hover:bg-blue-50">
                <FaSearch className="mb-2 text-2xl" />
                <span>Browse Notes</span>
              </Link>
              
              <Link to="/my-notes" className="flex flex-col justify-center items-center p-4 text-blue-600 bg-white rounded-lg border border-blue-600 transition-colors duration-300 hover:bg-blue-50">
                <FaEye className="mb-2 text-2xl" />
                <span>See Your Notes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;