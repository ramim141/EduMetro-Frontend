// START OF FILE Navbar.jsx

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import navLogo from '../assets/images/nav-logo.png'; // Adjust the path as necessary
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

// Avatar components import করুন
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false)
  
 // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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



  // user অবজেক্ট থেকে ডেটা নিন, যদি user থাকে
  const userInitial = user?.first_name ? user.first_name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'P');
  const studentName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user?.username || 'Student Name';
  const studentId = user?.student_id || 'Student ID';

  // Add console log for debugging
  console.log('User data from Navbar:', user); // এখানে user অবজেক্টের profile_picture_url দেখবেন

  return (
    <nav 
       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-gradient-to-r from-[#EEAECA] via-purple-600 to-[#94BBE9]"
      }`}
     >
      <div className="px-4 py-3 mx-auto md:px-8 lg:px-8 max-w-7xl"> 
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center text-2xl font-extrabold tracking-wider text-white uppercase transition-all duration-300 hover:scale-105 hover:text-primary-500"
          >
            <span>
              <img src={navLogo} alt="" className="w-6 h-6 mr-2 lg:h-8 lg:w-8" />
            </span>
            <span className={`lg:text-3xl font-bold transition-colors duration-300 font-nav sm:text-xl ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}>Note <span className="text-yellow-400">Bank</span> </span>
          </Link>

          {/* Navigation Links */}
          <div className="items-center justify-center flex-grow hidden space-x-8 md:flex">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}>
              <FaHome className="mr-1" /> Home
            </Link>
            <Link 
              to="/note" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
            >
              <FaStickyNote className="mr-1" /> Notes
            </Link>
            <Link 
              to="/about" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
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
                  className={`relative p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                  }`}
                  aria-label="Notifications"
                >
                  <FaBell className="text-xl" />
                  <span className="absolute top-0 right-0 flex w-3 h-3">
                    <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                    <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full  items-center justify-center text-[8px] text-white font-bold">
                      3
                    </span>
                  </span>
                </button>

                {/* Profile Button (Top Right) */}
                <button
                  onClick={handleProfileClick}
                  // Remove current styling classes from button as Avatar component will handle them
                  className="relative w-10 h-10 overflow-hidden transition-all duration-300 rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500" // Keep essential button styles
                  aria-label="Open user menu"
                >
                  {/* Avatar component ব্যবহার করে প্রোফাইল ছবি বা আদ্যক্ষর দেখান */}
                  <Avatar className="w-full h-full bg-purple-600 border-2 border-white/30 hover:border-white hover:bg-purple-700">
                    <AvatarImage src={user?.profile_picture_url} alt={user?.username} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 z-10 mt-2 overflow-hidden transition-all duration-300 ease-out origin-top-right bg-white shadow-2xl top-full w-72 rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-5"
                    style={{ transformOrigin: 'top right' }}
                  >
                    {/* User Profile Section */}
                    <div className="relative flex flex-col items-center p-6 text-center border-b border-gray-200 bg-gradient-to-b to-white from-primary-50">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute w-24 h-24 rounded-full -top-4 -left-4 blur-xl bg-primary-300"></div>
                        <div className="absolute w-24 h-24 rounded-full -right-4 -bottom-4 blur-xl bg-primary-300"></div>
                      </div>
                      
                      {/* Dropdown Avatar (larger) */}
                      {/* Avatar component ব্যবহার করে প্রোফাইল ছবি বা আদ্যক্ষর দেখান */}
                      <Avatar className="w-24 h-24 mb-3 text-xl font-bold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-br ring-4 ring-white from-purple-500 to-purple-700 hover:scale-105">
                        <AvatarImage src={user?.profile_picture_url} alt={user?.username} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                      </Avatar>                     
                      {/* User Info */}
                      <p className="text-lg font-bold text-gray-800">{studentName}</p>
                      <p className="text-sm font-medium text-purple-600">{studentId}</p> {/* primary-600 to purple-600 */}
                      
                 
                    
                    </div>
                    
                    {/* Menu Items */}
                    <nav className="py-2 bg-white">
                        {/* Profile Link */}
                        <Link 
                          to="/profile"
                          className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50" // primary-50 to blue-50
                          onClick={handleDropdownItemClick}
                        >
                          <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-purple-500 rounded-lg shadow-sm">
                            <FaUserCircle />
                          </div>
                          <div>
                            <p className="font-medium">Profile</p>
                            <p className="text-xs text-gray-500">View your profile</p>
              
                          </div>
                        </Link>

                        


                      {/* Dashboard Link */}
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50" // primary-50 to blue-50
                        onClick={handleDropdownItemClick}
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
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50" // primary-50 to blue-50
                        onClick={handleDropdownItemClick}
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
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50" // primary-50 to blue-50
                        onClick={handleDropdownItemClick}
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-red-500 rounded-lg shadow-sm">
                          <FaBookmark />
                        </div>
                        <div>
                          <p className="font-medium">Bookmarks</p>
                          <p className="text-xs text-gray-500">Your saved items</p>
                        </div>
                      </Link>
                      
                    
                      
                      {/* Upload New Note Link */}
                      <Link 
                        to="/upload-note" 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50" // primary-50 to blue-50
                        onClick={handleDropdownItemClick}
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-green-500 rounded-lg shadow-sm">
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
                        className="flex items-center w-full px-4 py-3 mt-1 text-left text-gray-700 transition-all duration-200 border-t border-gray-100 hover:bg-red-50"
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
                  className={
                    `px-4 py-2 text-white transition-all duration-300 rounded-md shadow-md ${
                      isScrolled
                        ? "bg-gray-800 hover:bg-gray-700 hover:scale-105 hover:shadow-lg"
                        : "bg-purple-600 hover:bg-purple-700 hover:scale-105 hover:shadow-lg" // primary-600 to purple-600
                    }`
                  }>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-white transition-all duration-300 bg-purple-600 rounded-md shadow-md hover:bg-purple-700 hover:scale-105 hover:shadow-lg" // primary-600 to purple-600
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
// END OF FILE Navbar.jsx