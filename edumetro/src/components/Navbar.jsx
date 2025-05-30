// src/components/Navbar.jsx

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  // Navigation icons
  FaHome,
  FaStickyNote,
  FaInfoCircle,
  // Feature icons
  FaBell,
  FaChartBar,
  FaFileAlt,
  FaBookmark,
  FaUpload,
  // User actions
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false);
  };

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'P';
  const studentName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user?.username || 'Student Name';
  const studentId = user?.student_id || 'Student ID';

  // Add console log for debugging
  console.log('User data:', user);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#84AE92] to-[#6a9c7c] shadow-lg transition-all duration-300 ease-in-out">
      <div className="container px-4 py-3 mx-auto md:px-8 lg:px-20">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center text-2xl font-extrabold tracking-wider text-white uppercase transition-all duration-300 hover:scale-105 hover:text-primary-500"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-100">NoteBank</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center space-x-1 md:flex">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-white rounded-md transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <FaHome className="mr-1" /> Home
            </Link>
            <Link 
              to="/note" 
              className="flex items-center px-4 py-2 text-white rounded-md transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <FaStickyNote className="mr-1" /> Note
            </Link>
            <Link 
              to="/about" 
              className="flex items-center px-4 py-2 text-white rounded-md transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <FaInfoCircle className="mr-1" /> About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex relative items-center space-x-4" ref={dropdownRef}>
                {/* Notification Bell */}
                <button 
                  className="relative p-2 text-white rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-110 focus:outline-none"
                  aria-label="Notifications"
                >
                  <FaBell className="text-xl" />
                  <span className="flex absolute top-0 right-0 w-3 h-3">
                    <span className="inline-flex absolute w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                    <span className="inline-flex relative w-3 h-3 bg-red-500 rounded-full"></span>
                  </span>
                </button>
                
                {/* Profile Button */}
                <button
                  onClick={handleProfileClick}
                  className="flex overflow-hidden relative justify-center items-center w-10 h-10 font-semibold text-white rounded-full border-2 transition-all duration-300 bg-primary-600 border-white/30 hover:border-white hover:bg-primary-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500"
                  aria-label="Open user menu"
                >
                  {userInitial}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="overflow-hidden absolute right-0 top-full z-10 mt-2 w-72 bg-white rounded-xl ring-1 ring-black ring-opacity-5 shadow-2xl transition-all duration-300 ease-out origin-top-right focus:outline-none animate-in fade-in slide-in-from-top-5"
                    style={{ transformOrigin: 'top right' }}
                  >
                    {/* User Profile Section */}
                    <div className="flex relative flex-col items-center p-6 text-center bg-gradient-to-b to-white border-b border-gray-200 from-primary-50">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full blur-xl bg-primary-300"></div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-xl bg-primary-300"></div>
                      </div>
                      
                      {/* Avatar */}
                      <div className="flex relative justify-center items-center mb-3 w-24 h-24 text-xl font-bold text-white bg-gradient-to-br rounded-full ring-4 ring-white shadow-lg transition-all duration-300 transform from-primary-500 to-primary-700 hover:scale-105">
                        {userInitial}
                      </div>                      {/* User Info */}
                      <p className="text-lg font-bold text-gray-800">{studentName}</p>
                      <p className="text-sm font-medium text-primary-600">{studentId}</p>
                      
                      {/* View Profile Button */}
                      <Link
                        to="/profile"
                        onClick={handleDropdownItemClick}
                        className="px-5 py-2 mt-4 text-sm font-medium text-white bg-gradient-to-r rounded-full shadow-md transition-all duration-300 from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <FaUserCircle className="inline mr-1" /> View Profile
                      </Link>
                    </div>
                    
                    {/* Menu Items */}
                    <nav className="py-2 bg-white">
                      {/* Dashboard Link */}
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-primary-50" 
                        onClick={handleDropdownItemClick}
                      >
                        <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-blue-500 rounded-lg shadow-sm">
                          <FaChartBar />
                        </div>
                        <div>
                          <p className="font-medium">Dashboard</p>
                          <p className="text-xs text-gray-500">View your activity</p>
                        </div>
                      </Link>
                      
                      {/* My Notes Link */}
                      <Link 
                        to="/my-notes" 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-primary-50" 
                        onClick={handleDropdownItemClick}
                      >
                        <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-yellow-500 rounded-lg shadow-sm">
                          <FaFileAlt />
                        </div>
                        <div>
                          <p className="font-medium">My Notes</p>
                          <p className="text-xs text-gray-500">Manage your notes</p>
                        </div>
                      </Link>
                      
                      {/* Bookmarks Link */}
                      <Link 
                        to="/bookmarks" 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-primary-50" 
                        onClick={handleDropdownItemClick}
                      >
                        <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-red-500 rounded-lg shadow-sm">
                          <FaBookmark />
                        </div>
                        <div>
                          <p className="font-medium">Bookmarks</p>
                          <p className="text-xs text-gray-500">Your saved items</p>
                        </div>
                      </Link>
                      
                      {/* Notifications Link */}
                      <Link 
                        to="/notifications" 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-primary-50" 
                        onClick={handleDropdownItemClick}
                      >
                        <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-orange-500 rounded-lg shadow-sm">
                          <FaBell />
                        </div>
                        <div>
                          <p className="font-medium">Notifications</p>
                          <p className="text-xs text-gray-500">Your alerts and updates</p>
                        </div>
                      </Link>
                      
                      {/* Upload New Note Link */}
                      <Link 
                        to="/upload-note" 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-primary-50" 
                        onClick={handleDropdownItemClick}
                      >
                        <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-green-500 rounded-lg shadow-sm">
                          <FaUpload />
                        </div>
                        <div>
                          <p className="font-medium">Upload New Note</p>
                          <p className="text-xs text-gray-500">Share your notes</p>
                        </div>
                      </Link>
                      
                      {/* Logout Button */}
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center px-4 py-3 mt-1 w-full text-left text-gray-700 border-t border-gray-100 transition-all duration-200 hover:bg-red-50"
                      >
                        <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-gray-500 rounded-lg shadow-sm">
                          <FaSignOutAlt />
                        </div>
                        <div>
                          <p className="font-medium">Logout</p>
                          <p className="text-xs text-gray-500">Sign out of your account</p>
                        </div>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-white rounded-md transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-white rounded-md shadow-md transition-all duration-300 bg-primary-600 hover:bg-primary-700 hover:scale-105 hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;