// src/pages/DashboardPage.jsx (Corrected Version)

"use client"

import React, { useState, useEffect, useContext } from "react"; // ✅ Import useContext
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // ✅ Import AuthContext
import { getUserProfile, getMyNotes, getBookmarkedNotes, getSiteStats } from "./../utils/api";

import StatCard from "./dashboard/StatCard"
import RechartsPieChart from "./dashboard/Enhanced3DPieChart";
import EnhancedLoadingDashboard from "./dashboard/EnhancedLoadingDashboard"
import { 
  BookIcon, DownloadIcon, HeartIcon, BookmarkIcon, PlusIcon, 
  ArrowRightIcon, SparklesIcon, AwardIcon, StarIcon, UserIcon, 
  ActivityIcon, TargetIcon, UsersIcon, PieChartIcon, MessageSquareIcon
} from "./dashboard/DashboardIcons"

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // ✅ Get user, auth status, and authLoading from AuthContext
  const { user, isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  
  // Dashboard এর নিজস্ব state
  const [loading, setLoading] = useState(true); // Dashboard data loading state
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ uploads: 0, downloads: 0, totalReviews: 0, avgRating: "0.0" });
  const [myNotes, setMyNotes] = useState([]);
  const [recentBookmarks, setRecentBookmarks] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // --- THE CRUCIAL GUARD ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null); // Reset error on new fetch attempt

        // Fetching data using API calls
        // Note: getUserProfile() is now implicitly handled by AuthContext's initial load.
        const [myNotesRes, bookmarksRes] = await Promise.all([
          getMyNotes({ page_size: 1000 }), // Fetching all notes for calculations
          getBookmarkedNotes({ page_size: 5 }), // Fetching recent 5 bookmarks
        ]);

        const allMyNotes = myNotesRes.data.results || [];
        const bookmarksData = bookmarksRes.data.results || [];

        setMyNotes(allMyNotes);
        setRecentBookmarks(bookmarksData);

        // Perform calculations based on fetched data
        const totalDownloads = allMyNotes.reduce((sum, note) => sum + (note.download_count || 0), 0);
        const totalReviews = allMyNotes.reduce((sum, note) => sum + (note.star_ratings?.length || 0), 0);
        
        const notesWithRatings = allMyNotes.filter(note => note.average_rating > 0);
        const totalRatingSum = notesWithRatings.reduce((sum, note) => sum + note.average_rating, 0);
        const averageRating = notesWithRatings.length > 0 
          ? (totalRatingSum / notesWithRatings.length).toFixed(1) 
          : "0.0";

        setStats({
          uploads: myNotesRes.data.count || 0,
          downloads: totalDownloads,
          totalReviews: totalReviews,
          avgRating: averageRating,
        });

        // Generate chart data
        const categoryCounts = allMyNotes.reduce((acc, note) => {
          const category = note.category_name || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        const COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#8B5CF6"];
        const chartData = Object.entries(categoryCounts).map(([name, value], index) => ({ 
            name, 
            value, 
            color: COLORS[index % COLORS.length] 
        }));
        setPerformanceData(chartData);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load your dashboard. Please try again.");
      } finally {
        setLoading(false); // Dashboard data loading is finished
      }
    };

    // --- THE CRUCIAL GUARD ---
    // Only proceed if AuthContext has finished loading AND the user IS authenticated.
    if (!authLoading && isAuthenticated) {
      fetchDashboardData();
    } else if (!authLoading && !isAuthenticated) {
      // If AuthContext is loaded but the user is NOT authenticated, redirect to login.
      // This also handles cases where the initial auth check might fail.
      navigate('/login');
      setLoading(false); // Stop dashboard loading as we are redirecting
    }
    // If authLoading is still true, we do nothing here and wait for it to finish.
    // The loading state from AuthContext will be shown first.

  // Dependencies: This effect should re-run if authLoading or isAuthenticated changes.
  // It also depends on `navigate` which is stable, and `fetchDashboardData` which is stable.
  }, [authLoading, isAuthenticated, navigate]); 


  const handleNavigation = (path) => {
    navigate(path);
  };

  // --- Conditional Rendering ---

  // If AuthContext is still loading, let it handle the initial loading display.
  // This component will re-render when AuthContext finishes loading.
  if (authLoading) {
    return null; // AuthProvider will show its own loading spinner.
  }

  // If dashboard data is loading (and Auth is done), show the dashboard loading screen.
  if (loading) {
    return <EnhancedLoadingDashboard />;
  }
  
  // If there was an error fetching data, show the error message.
  if (error) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-red-50">
              <p className="text-xl font-semibold text-red-600">{error}</p>
          </div>
      );
  }

  // If user is not authenticated after authLoading is false, redirect to login.
  // This check is a safeguard, the useEffect should ideally handle redirection earlier.
  if (!isAuthenticated) {
    navigate('/login');
    return null; 
  }

  // If we reach here, it means auth is loaded, user is authenticated, and dashboard data is ready.
  return (
    <div className="relative min-h-screen pt-12 overflow-hidden bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute rounded-full top-10 left-10 w-72 h-72 bg-gradient-to-r blur-3xl from-blue-400/10 to-purple-400/10" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], }} transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }} />
        <motion.div className="absolute rounded-full right-10 bottom-10 w-96 h-96 bg-gradient-to-r blur-3xl from-pink-400/10 to-indigo-400/10" animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4], }} transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }} />
      </div>
      
      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring", stiffness: 100 }} className="flex flex-col items-start justify-between mb-12 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <motion.h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], }} transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }} style={{ backgroundSize: "200% 200%" }}> Welcome back, {user.first_name}! 🚀 </motion.h1>
            <motion.p className="text-xl font-medium text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}> Ready to create something amazing today? </motion.p>
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)", }} whileTap={{ scale: 0.95 }} className="relative px-8 py-4 mt-6 overflow-hidden text-lg font-bold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:mt-0 group" onClick={() => handleNavigation('/upload-note')}>
            <motion.div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 group-hover:opacity-100" />
            <div className="relative flex items-center gap-3"> <PlusIcon size={24} /> <span>Upload Note</span> </div>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={BookIcon} value={stats.uploads} label="Notes Uploaded" gradientFrom="from-indigo-500" gradientTo="to-blue-600" trend={12} delay={0} />
          <StatCard icon={DownloadIcon} value={stats.downloads} label="Total Downloads" gradientFrom="from-emerald-500" gradientTo="to-green-600" trend={18} delay={0.1} />
          <StatCard icon={MessageSquareIcon} value={stats.totalReviews} label="Total Reviews" gradientFrom="from-cyan-500" gradientTo="to-teal-600" trend={5} delay={0.2} />
          <StatCard icon={StarIcon} value={stats.avgRating} label="Average Rating" gradientFrom="from-amber-500" gradientTo="to-orange-600" trend={null} delay={0.3} />
        </div>
        
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="relative p-8 overflow-hidden border shadow-2xl bg-gradient-to-br rounded-3xl backdrop-blur-sm from-white/80 to-blue-50/50 border-white/20">
              <div className="absolute inset-0 opacity-5"> <svg width="100%" height="100%"> <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"> <circle cx="10" cy="10" r="1" fill="currentColor"/> </pattern> <rect width="100%" height="100%" fill="url(#dots)"/> </svg> </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <motion.h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}> <BookIcon size={24} className="text-indigo-600" animated /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Recent Masterpieces </span> </motion.h3>
                  <motion.button onClick={() => handleNavigation('/my-notes')} className="flex items-center gap-2 font-bold text-indigo-600 transition-colors duration-300 group hover:text-purple-600" whileHover={{ x: 5 }}> View All <ArrowRightIcon size={16} /> </motion.button>
                </div>
                <AnimatePresence>
                  {myNotes.length > 0 ? (
                    <div className="space-y-4">
                      {myNotes.slice(0, 5).map((note, index) => (
                        <motion.div key={note.id} initial={{ opacity: 0, x: -50, rotateY: -15 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: 50, rotateY: 15 }} transition={{ duration: 0.5, delay: index * 0.1 + 0.7, type: "spring", stiffness: 100 }} whileHover={{ x: 10, rotateY: 5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", transition: { duration: 0.3 } }} className="relative p-6 border cursor-pointer bg-gradient-to-r rounded-2xl backdrop-blur-sm group from-white/90 to-gray-50/90 border-gray-200/50" onClick={() => handleNavigation(`/notes/${note.id}`)}>
                          <motion.div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r rounded-2xl from-indigo-500/10 to-purple-500/10 group-hover:opacity-100" />
                          <div className="relative flex items-center justify-between">
                            <div className="flex-1">
                              <motion.h4 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600" whileHover={{ scale: 1.02 }}> {note.title} </motion.h4>
                              <p className="text-sm font-medium text-gray-600">{note.course_name}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <motion.span className={`px-4 py-2 rounded-full text-xs font-bold ${ note.is_approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700" }`} whileHover={{ scale: 1.1 }}> {note.is_approved ? "✨ Approved" : "⏳ Pending"} </motion.span>
                              <div className="flex items-center gap-4 text-sm">
                                <motion.span className="flex items-center gap-2 font-semibold text-rose-600" whileHover={{ scale: 1.1 }}> <HeartIcon size={16} /> {note.likes_count} </motion.span>
                                <motion.span className="flex items-center gap-2 font-semibold text-emerald-600" whileHover={{ scale: 1.1 }}> <DownloadIcon size={16} /> {note.download_count} </motion.span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div className="py-16 text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                      <SparklesIcon size={80} className="mx-auto mb-6 text-gray-300" />
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">Your Journey Begins Here!</h3>
                      <p className="mb-8 text-lg text-gray-600">Share your first masterpiece with the world</p>
                      <motion.button onClick={() => handleNavigation('/upload-note')} className="px-8 py-4 font-bold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-2xl" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                        <div className="flex items-center gap-3"> <PlusIcon size={20} /> Create Your First Note </div>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="relative p-8 overflow-hidden border shadow-2xl bg-gradient-to-br rounded-3xl backdrop-blur-sm from-white/80 to-amber-50/50 border-white/20">
              <div className="relative">
                <motion.h3 className="flex items-center gap-3 mb-8 text-2xl font-bold text-gray-800" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}> <BookmarkIcon size={24} className="text-amber-600" animated /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Saved Treasures </span> </motion.h3>
                {recentBookmarks.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookmarks.map((note, index) => (
                      <motion.div key={note.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 + 1.1 }} whileHover={{ x: 8, backgroundColor: "rgba(251, 191, 36, 0.1)", transition: { duration: 0.2 } }} className="flex items-center gap-4 p-4 transition-all duration-300 border border-transparent cursor-pointer rounded-xl hover:border-amber-200" onClick={() => handleNavigation(`/notes/${note.id}`)}>
                        <motion.div whileHover={{ rotate: 10, scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}> <BookmarkIcon size={20} className="text-amber-500" /> </motion.div>
                        <div className="flex-1">
                          <motion.p className="font-bold text-gray-900 transition-colors hover:text-amber-600" whileHover={{ x: 5 }}> {note.title} </motion.p>
                          <p className="text-sm text-gray-600">by {note.uploader_username}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center"> <BookmarkIcon size={64} className="mx-auto mb-4 text-gray-300" /> <p className="text-lg text-gray-600">No bookmarks yet - discover amazing content!</p> </div>
                )}
              </div>
            </motion.div>
          </div>
          <div className="space-y-10">
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="relative overflow-hidden border shadow-2xl bg-gradient-to-br rounded-3xl backdrop-blur-sm from-white/90 to-indigo-50/50 border-white/20">
              <motion.div className="relative h-32 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" animate={{ background: [ "linear-gradient(45deg, #6366F1, #8B5CF6, #EC4899)", "linear-gradient(135deg, #EC4899, #8B5CF6, #6366F1)", "linear-gradient(225deg, #6366F1, #EC4899, #8B5CF6)" ] }} transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}> {Array.from({ length: 3 }).map((_, i) => ( <motion.div key={i} className="absolute w-20 h-20 rounded-full blur-xl bg-white/20" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ x: [0, Math.random() * 100 - 50], y: [0, Math.random() * 50 - 25], scale: [1, 1.2, 1] }} transition={{ duration: Math.random() * 3 + 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 }} /> ))} </motion.div>
              <div className="relative px-8 pb-8">
                <motion.div className="relative mb-6 -mt-16" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.7, type: "spring" }}>
                  {user.profile_picture_url ? (
                    <motion.img src={user.profile_picture_url} alt="Profile" className="object-cover w-32 h-32 mx-auto border-4 border-white rounded-full shadow-2xl" whileHover={{ scale: 1.1, rotate: 5 }} />
                  ) : (
                    <motion.div className="flex items-center justify-center w-32 h-32 mx-auto text-4xl font-bold text-white border-4 border-white rounded-full shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600" whileHover={{ scale: 1.1, rotate: 5 }}>
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </motion.div>
                  )}
                </motion.div>
                <div className="space-y-4 text-center">
                  <motion.h3 className="text-2xl font-bold text-gray-900" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}> {user.first_name} {user.last_name} </motion.h3>
                  <div className="space-y-2">
                    <motion.p className="font-bold text-indigo-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}> {user.student_id} </motion.p>
                    <motion.p className="font-medium text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}> {user.department_name || user.department} </motion.p>
                  </div>
                  <motion.div className="flex justify-center gap-3 pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                    <motion.div className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100" whileHover={{ scale: 1.1, y: -2 }}> <AwardIcon size={14} /> Top Contributor </motion.div>
                    <motion.div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-700 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100" whileHover={{ scale: 1.1, y: -2 }}> <StarIcon size={14} /> Rising Star </motion.div>
                  </motion.div>
                  <motion.button onClick={() => handleNavigation('/profile')} className="w-full px-6 py-4 mt-8 font-bold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-2xl group" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
                    <div className="flex items-center justify-center gap-3"> <UserIcon size={20} /> <span>Manage Profile</span> </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
         
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="relative p-8 overflow-hidden border shadow-2xl rounded-3xl backdrop-blur-sm bg-white/80 border-gray-200/50">
                  <div className="relative">
                    <motion.div 
                      className="flex items-center gap-3 mb-1" 
                      initial={{ y: -20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 0.8 }}
                    >
                      <PieChartIcon size={24} className="text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Category Distribution
                      </h3>
                    </motion.div>
                    <motion.p 
                      className="mb-4 text-gray-500 pl-9" 
                      initial={{ y: -20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 0.9 }}
                    >
                      Your notes across different categories
                    </motion.p>
                    <RechartsPieChart data={performanceData} />
                  </div>
                </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="relative p-8 overflow-hidden border shadow-2xl bg-gradient-to-br rounded-3xl backdrop-blur-sm from-white/90 to-green-50/50 border-white/20">
              <div className="relative">
                <motion.h3 className="flex items-center gap-3 mb-8 text-2xl font-bold text-gray-800" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}> <TargetIcon size={24} className="text-emerald-600" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Quick Actions </span> </motion.h3>
                <div className="space-y-4">
                  {[ { icon: UsersIcon, label: "Browse Community", path: "/notes", color: "from-blue-500 to-indigo-600" }, { icon: BookIcon, label: "Manage My Notes", path: "/my-notes", color: "from-purple-500 to-pink-600" }, { icon: ActivityIcon, label: "View Analytics", path: "/analytics", color: "from-emerald-500 to-teal-600" } ].map((action, index) => (
                    <motion.button key={index} onClick={() => handleNavigation(action.path)} className="flex items-center w-full gap-4 p-4 transition-all duration-300 border-2 rounded-2xl group bg-white/80 border-gray-200/50 hover:border-transparent hover:shadow-xl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 + 1 }} whileHover={{ scale: 1.02, x: 5, background: `linear-gradient(135deg, ${action.color.split(' ')[0].replace('from-', '')}1A, ${action.color.split(' ')[1].replace('to-', '')}1A)` }}>
                      <motion.div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl shadow-lg`} whileHover={{ rotate: 5, scale: 1.1 }}> <action.icon size={20} className="text-white" /> </motion.div>
                      <span className="font-bold text-gray-700 transition-colors group-hover:text-gray-900"> {action.label} </span>
                      <motion.div className="ml-auto transition-opacity opacity-0 group-hover:opacity-100" whileHover={{ x: 5 }}> <ArrowRightIcon size={16} className="text-gray-400" /> </motion.div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}