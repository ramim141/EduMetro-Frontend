// src/components/Navbar.jsx

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  FaBell,
  FaChartBar,
  FaFileAlt,
  FaBookmark,
  FaSignOutAlt,
  FaHome,
  FaStickyNote,
  FaInfoCircle,
  FaUserCircle,
  FaGoogle,
  FaFacebook
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

  const userInitial = user && user.username ? user.username.charAt(0).toUpperCase() : 'P';
  const studentName = user && user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user?.username || 'Student Name';
  const studentId = user && user.student_id ? user.student_id : 'Student ID';

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#84AE92] to-[#6a9c7c] shadow-lg transition-all duration-300 ease-in-out">
      <div className="container px-4 md:px-8 lg:px-20 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-extrabold text-white uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:text-primary-500 flex items-center"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100">NoteBank</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-white rounded-md hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <FaHome className="mr-1" /> Home
            </Link>
            <Link 
              to="/note" 
              className="flex items-center px-4 py-2 text-white rounded-md hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <FaStickyNote className="mr-1" /> Note
            </Link>
            <Link 
              to="/about" 
              className="flex items-center px-4 py-2 text-white rounded-md hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <FaInfoCircle className="mr-1" /> About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative flex items-center space-x-4" ref={dropdownRef}>
                {/* Notification Bell */}
                <button 
                  className="relative p-2 text-white rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 focus:outline-none"
                  aria-label="Notifications"
                >
                  <FaBell className="text-xl" />
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </button>
                
                {/* Profile Button */}
                <button
                  onClick={handleProfileClick}
                  className="relative flex items-center justify-center w-10 h-10 overflow-hidden font-semibold text-white transition-all duration-300 bg-primary-600 border-2 border-white/30 rounded-full hover:border-white hover:bg-primary-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500"
                  aria-label="Open user menu"
                >
                  {userInitial}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 z-10 w-72 mt-2 origin-top-right bg-white rounded-xl shadow-2xl top-full ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-5"
                    style={{ transformOrigin: 'top right' }}
                  >
                    {/* User Profile Section */}
                    <div className="relative flex flex-col items-center p-6 text-center border-b border-gray-200 bg-gradient-to-b from-primary-50 to-white">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary-300 blur-xl"></div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary-300 blur-xl"></div>
                      </div>
                      
                      {/* Avatar */}
                      <div className="relative flex items-center justify-center w-24 h-24 mb-3 text-xl font-bold text-white bg-gradient-to-br from-primary-500 to-primary-700 rounded-full ring-4 ring-white shadow-lg transform transition-all duration-300 hover:scale-105">
                        {userInitial}
                      </div>
                      
                      {/* User Info */}
                      <p className="text-lg font-bold text-gray-800">{studentName}</p>
                      <p className="text-sm font-medium text-primary-600">{studentId}</p>
                      
                      {/* View Profile Button */}
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-5 py-2 mt-4 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-md hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <FaUserCircle className="inline mr-1" /> View Profile
                      </Link>
                    </div>
                    
                    {/* Menu Items */}
                    <nav className="py-2 bg-white">
                      {/* Dashboard Link */}
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 transition-all duration-200" 
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-blue-500 rounded-lg shadow-sm">
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
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 transition-all duration-200" 
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-yellow-500 rounded-lg shadow-sm">
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
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 transition-all duration-200" 
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-red-500 rounded-lg shadow-sm">
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
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 transition-all duration-200" 
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-orange-500 rounded-lg shadow-sm">
                          <FaBell />
                        </div>
                        <div>
                          <p className="font-medium">Notifications</p>
                          <p className="text-xs text-gray-500">Your alerts and updates</p>
                        </div>
                      </Link>
                      
                      {/* Logout Button */}
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center w-full px-4 py-3 mt-1 text-left text-gray-700 border-t border-gray-100 hover:bg-red-50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-gray-500 rounded-lg shadow-sm">
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
                  className="px-4 py-2 text-white rounded-md hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-white bg-primary-600 rounded-md shadow-md hover:bg-primary-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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