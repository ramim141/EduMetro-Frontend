import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBookmark, FaBell, FaUser, FaSearch, FaChartLine, FaEdit, FaUpload, FaEye, FaStar, FaHome, FaStickyNote, FaInfoCircle, FaChartBar, FaFileAlt, FaUserCircle, FaSignOutAlt, FaEnvelope, FaIdCard } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

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
  console.log('Rendering DashboardPage...');
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [animate, setAnimate] = useState(false);
  const [stats] = useState({
    notes: 47,
    comments: 60,
    downloads: 100,
    rating: 4.5
  });

  console.log('DashboardPage Auth State: isAuthenticated=', isAuthenticated, ', loading=', loading, ', user=', user);

  useEffect(() => {
    console.log('DashboardPage useEffect triggered.');
    // Entrance animation
    setAnimate(true);
    
    // In a real app, you would fetch dashboard data from the API
    // Example:
    // const fetchDashboardData = async () => {
    //   try {
    //     const response = await axios.get('http://127.0.0.1:8000/api/dashboard/');
    //     setStats(response.data.stats);
    //   } catch (err) {
    //     console.error('Failed to load dashboard data:', err);
    //   }
    // };
    // fetchDashboardData();
  }, []);

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'P';
  const studentName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user?.username || 'Student Name';

  console.log('DashboardPage: Preparing to render JSX');

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
          <Link to="/notes" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <FaFileAlt className="mr-2" />
            My Notes
          </Link>
           <Link to="/browse" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
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
           <Link to="/note/new" className="flex items-center px-4 py-2 mt-2 text-gray-700 hover:bg-gray-200">
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
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {user?.first_name || user?.username || 'Student'}!</h2>
          <div className="flex items-center text-gray-600">
            <FaChartLine className="ml-2 text-xl" />
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Adjusted DashboardCard usage for better styling control */}
          <div className="p-6 bg-white rounded-xl border-l-4 border-green-400 shadow-md" style={{ backgroundColor: '#d4edda' }}>
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

           <div className="p-6 bg-white rounded-xl border-l-4 border-yellow-400 shadow-md" style={{ backgroundColor: '#fff3cd' }}>
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

           <div className="p-6 bg-white rounded-xl border-l-4 border-blue-400 shadow-md" style={{ backgroundColor: '#cce5ff' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">Download</p>
                <p className="mt-2 text-3xl font-bold text-blue-700">{stats.downloads}</p>
              </div>
              <div className="p-3 text-blue-600 bg-white rounded-full">
                <FaBookmark className="text-2xl" />
              </div>
            </div>
          </div>

           <div className="p-6 bg-white rounded-xl border-l-4 border-purple-400 shadow-md" style={{ backgroundColor: '#e2d9f3' }}>
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
            
            <Link to="/profile/edit" className="flex justify-center items-center py-2 mt-4 w-full text-white bg-green-600 rounded-lg transition-colors duration-300 hover:bg-green-700">
              <FaEdit className="mr-2" />
              Edit Profile
            </Link>
          </div>
          
          {/* Quick actions */}
          <div className="p-6 bg-white rounded-xl shadow-md lg:col-span-2">
            <h3 className="mb-4 text-xl font-bold text-red-600">Quick Actions</h3>
            <p className="mb-4 text-gray-600">Frequently used actions to manage notes and profile</p>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link to="/note/new" className="flex flex-col justify-center items-center p-4 text-white bg-blue-600 rounded-lg transition-colors duration-300 hover:bg-blue-700">
                <FaUpload className="mb-2 text-2xl" />
                <span>Upload New Note</span>
              </Link>
              
              <Link to="/browse" className="flex flex-col justify-center items-center p-4 text-blue-600 bg-white rounded-lg border border-blue-600 transition-colors duration-300 hover:bg-blue-50">
                <FaSearch className="mb-2 text-2xl" />
                <span>Browse Notes</span>
              </Link>
              
              <Link to="/notes" className="flex flex-col justify-center items-center p-4 text-blue-600 bg-white rounded-lg border border-blue-600 transition-colors duration-300 hover:bg-blue-50">
                <FaEye className="mb-2 text-2xl" />
                <span>See Your Notes</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent activity - Removed as per design */}
        {/* <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
            <span className="inline-block flex justify-center items-center mr-2 w-8 h-8 rounded-full bg-primary-100 text-primary-600">📊</span>
            Recent Activity
          </h2>
          <div className="space-y-4">
            
            <div className="p-4 rounded-lg border border-gray-200 transition-colors duration-300 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex justify-center items-center mr-3 w-10 h-10 rounded-full bg-primary-100 text-primary-600">
                    <FaBook />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">You uploaded a new note</p>
                    <p className="text-sm text-gray-500">Introduction to React</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-200 transition-colors duration-300 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex justify-center items-center mr-3 w-10 h-10 text-yellow-600 bg-yellow-100 rounded-full">
                    <FaBell />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">New comment on your note</p>
                    <p className="text-sm text-gray-500">Data Structures in JavaScript</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">3 days ago</span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-200 transition-colors duration-300 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex justify-center items-center mr-3 w-10 h-10 text-green-600 bg-green-100 rounded-full">
                    <FaBookmark />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">You bookmarked a note</p>
                    <p className="text-sm text-gray-500">CSS Grid Layout Mastery</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">5 days ago</span>
              </div>
            </div>
          </div>
        </div> */}


      </div>
    </div>
  );
};

export default DashboardPage;