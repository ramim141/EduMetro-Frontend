import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBookmark, FaBell, FaUser, FaSearch, FaChartLine, FaEdit, FaUpload, FaEye, FaStar } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const DashboardCard = ({ icon: Icon, title, count, link, color }) => (
  <Link
    to={link}
    className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${color} overflow-hidden group relative`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2 group-hover:text-primary-600 transition-colors duration-300">{count}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')} bg-opacity-20 text-primary-600`}>
        <Icon className="text-2xl" />
      </div>
    </div>
  </Link>
);

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [animate, setAnimate] = useState(false);
  const [stats, setStats] = useState({
    notes: 47,
    comments: 60,
    downloads: 100,
    rating: 4.5
  });

  useEffect(() => {
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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Dashboard</h1>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            />
          </div>
        </div>

        <p className="text-gray-600 mb-6">This is your dashboard and important information center</p>
        
        {/* Welcome card with trend */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex justify-between items-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {user?.username || 'Raimin'}!</h2>
          <div className="flex items-center text-primary-600">
            <FaChartLine className="mr-2" />
            <span className="font-medium">Trending</span>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={FaBook}
            title="Notes Posted"
            count={stats.notes}
            link="/notes"
            color="border-primary-500"
          />
          <DashboardCard
            icon={FaBell}
            title="Comments"
            count={stats.comments}
            link="/notifications"
            color="border-yellow-500"
          />
          <DashboardCard
            icon={FaBookmark}
            title="Download"
            count={stats.downloads}
            link="/bookmarks"
            color="border-green-500"
          />
          <DashboardCard
            icon={FaStar}
            title="Average Rating"
            count={stats.rating}
            link="/profile"
            color="border-purple-500"
          />
        </div>
        
        {/* User profile and quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User profile card */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1 transform transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-primary-100">
                <img src="https://via.placeholder.com/150" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Student Name</h3>
              <p className="text-gray-600">Department</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="w-8">📧</span>
                <span>{user?.email || 'abramus84@gmail.com'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="w-8">🆔</span>
                <span>Student ID: {user?.student_id || '(222-115-141)'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="w-8">📅</span>
                <span>Joined Date</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
              <p className="text-gray-600 text-sm italic">No bio added yet.</p>
            </div>
            
            <Link to="/profile/edit" className="mt-4 flex items-center justify-center w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300">
              <FaEdit className="mr-2" />
              Edit Profile
            </Link>
          </div>
          
          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <p className="text-gray-600 mb-4">Frequently used actions to manage notes and profile</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/note/new" className="flex flex-col items-center justify-center p-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300">
                <FaUpload className="text-2xl mb-2" />
                <span>Upload New Note</span>
              </Link>
              
              <Link to="/notes" className="flex flex-col items-center justify-center p-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <FaSearch className="text-2xl mb-2 text-primary-600" />
                <span>Browse Notes</span>
              </Link>
              
              <Link to="/notes" className="flex flex-col items-center justify-center p-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <FaEye className="text-2xl mb-2 text-primary-600" />
                <span>See Your Notes</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-2">📊</span>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Placeholder for recent activities */}
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
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
            
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
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
            
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;