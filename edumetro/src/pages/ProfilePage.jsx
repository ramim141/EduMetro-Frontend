import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaEdit, FaUniversity, FaCalendarAlt, FaVenusMars, FaGlobe, FaMobileAlt, FaStar, FaBookmark, FaFileAlt } from 'react-icons/fa';
import api from '../utils/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Animation entrance effect
    setAnimate(true);
    
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/users/profile/');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Sample profile data for development/testing
  const sampleProfile = {
    name: "Ramim Ahmed",
    email: "ahramu584@gmail.com",
    studentId: "222-115-141",
    department: "Computer Science",
    university: "University Name",
    mobile: "01768628911",
    website: "www.portfolio.com",
    gender: "Male",
    birthday: "22-02-2005",
    joinedDate: "January 2024",
    noteCount: 47,
    bookmarkCount: 12,
    contributionCount: 156,
    rating: 5.0
  };

  // Use sample data if API call is loading or failed
  const userProfile = profile || sampleProfile;

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          {/* Header/Banner with gradient */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
            </div>
            
            {/* Bookmarks button */}
            <div className="absolute top-4 right-4">
              <Link to="/bookmarks" className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-white/30 transition-all duration-300 shadow-md">
                <FaBookmark />
                <span>Bookmarks</span>
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
              <div className="-mt-16 mb-4 flex items-end">
                <div className="bg-white p-1.5 rounded-full inline-block shadow-lg ring-4 ring-white">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-4 transform transition-transform duration-300 hover:scale-105">
                    <FaUser className="w-16 h-16 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">{userProfile.name}</h1>
                  <p className="text-gray-600 flex items-center gap-1"><FaIdCard className="text-primary-400" /> {userProfile.studentId}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end mb-4 md:mb-0">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  <span className="font-semibold">Note Rating</span>
                  <FaStar className="text-amber-500" />
                  <span className="text-xl font-bold">{userProfile.rating}</span>
                </div>
                <Link to="/profile/edit" className="mt-2 flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  <FaEdit className="mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* About section with icon */}
            <div className="mt-8 border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-primary-500" /> About
              </h2>
              
              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-primary-700 mb-3 uppercase tracking-wider">CONTACT INFORMATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                      <FaMobileAlt />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="text-gray-800 font-medium">{userProfile.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800 font-medium">{userProfile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                      <FaGlobe />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="text-gray-800 font-medium">{userProfile.website}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3 uppercase tracking-wider">BASIC INFORMATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                      <FaVenusMars />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-gray-800 font-medium">{userProfile.gender}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Birthday</p>
                      <p className="text-gray-800 font-medium">{userProfile.birthday}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                      <FaUniversity />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">University</p>
                      <p className="text-gray-800 font-medium">{userProfile.university}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                      <FaIdCard />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-800 font-medium">{userProfile.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
                <p className="text-3xl font-bold text-primary-600 mt-2">{userProfile.noteCount}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full text-primary-600">
                <FaFileAlt className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/notes" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                View all notes
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Bookmarks</h3>
                <p className="text-3xl font-bold text-amber-500 mt-2">{userProfile.bookmarkCount}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full text-amber-500">
                <FaBookmark className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/bookmarks" className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center">
                View all bookmarks
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Contributions</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{userProfile.contributionCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/contributions" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                View activity
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;