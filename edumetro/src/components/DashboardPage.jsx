// --- START OF FILE DashboardPage.jsx ---
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { getUserProfile, getMyNotes, getBookmarkedNotes } from "../utils/api"

import StatCard from "./dashboard/StatCard"
import Enhanced3DPieChart from "./dashboard/Enhanced3DPieChart"
import EnhancedLoadingDashboard from "./dashboard/EnhancedLoadingDashboard"
import { 
  BookIcon, DownloadIcon, HeartIcon, BookmarkIcon, PlusIcon, 
  ArrowRightIcon, SparklesIcon, AwardIcon, StarIcon, UserIcon, 
  ActivityIcon, TargetIcon, UsersIcon, PieChartIcon 
} from "./dashboard/DashboardIcons"

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ uploads: 0, downloads: 0, likes: 0, bookmarks: 0 });
  const [myNotes, setMyNotes] = useState([]);
  const [recentBookmarks, setRecentBookmarks] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, myNotesRes, bookmarksRes] = await Promise.all([
          getUserProfile(),
          getMyNotes({ page_size: 1000 }),
          getBookmarkedNotes({ page_size: 5 }),
        ]);

        const profileData = profileRes.data;
        const allMyNotes = myNotesRes.data.results || [];
        const bookmarksData = bookmarksRes.data.results || [];

        setUser(profileData);
        setMyNotes(allMyNotes);
        setRecentBookmarks(bookmarksData);

        const totalDownloads = allMyNotes.reduce((sum, note) => sum + note.download_count, 0);
        const totalLikes = allMyNotes.reduce((sum, note) => sum + note.likes_count, 0);
        setStats({
          uploads: myNotesRes.data.count || 0,
          downloads: totalDownloads,
          likes: totalLikes,
          bookmarks: bookmarksRes.data.count || 0,
        });

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
        setError("Could not load your dashboard. Please check your connection and try again.");
      } finally {
        setTimeout(() => setLoading(false), 2500); // Ensure the beautiful loader is visible
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) return <EnhancedLoadingDashboard />;

  if (error) {
      return (
          <div className="flex justify-center items-center min-h-screen bg-red-50">
              <p className="text-xl font-semibold text-red-600">{error}</p>
          </div>
      );
  }

  return (
    <div className="overflow-hidden relative min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50">
      <div className="overflow-hidden absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r rounded-full blur-3xl from-blue-400/10 to-purple-400/10" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], }} transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }} />
        <motion.div className="absolute right-10 bottom-10 w-96 h-96 bg-gradient-to-r rounded-full blur-3xl from-pink-400/10 to-indigo-400/10" animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4], }} transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }} />
      </div>
      
      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring", stiffness: 100 }} className="flex flex-col justify-between items-start mb-12 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <motion.h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], }} transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }} style={{ backgroundSize: "200% 200%" }}> Welcome back, {user?.first_name}! 🚀 </motion.h1>
            <motion.p className="text-xl font-medium text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}> Ready to create something amazing today? </motion.p>
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)", }} whileTap={{ scale: 0.95 }} className="overflow-hidden relative px-8 py-4 mt-6 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl transition-all duration-300 sm:mt-0 group" onClick={() => handleNavigation('/upload-note')}>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex relative gap-3 items-center"> <PlusIcon size={24} /> <span>Upload Note</span> </div>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={BookIcon} value={stats.uploads} label="Notes Uploaded" gradientFrom="from-indigo-500" gradientTo="to-blue-600" trend={12} delay={0} />
          <StatCard icon={DownloadIcon} value={stats.downloads} label="Total Downloads" gradientFrom="from-emerald-500" gradientTo="to-green-600" trend={18} delay={0.1} />
          <StatCard icon={HeartIcon} value={stats.likes} label="Likes Received" gradientFrom="from-rose-500" gradientTo="to-pink-600" trend={25} delay={0.2} />
          <StatCard icon={BookmarkIcon} value={stats.bookmarks} label="My Bookmarks" gradientFrom="from-amber-500" gradientTo="to-orange-600" trend={8} delay={0.3} />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="overflow-hidden relative p-8 bg-gradient-to-br rounded-3xl border shadow-2xl backdrop-blur-sm from-white/80 to-blue-50/50 border-white/20">
              <div className="absolute inset-0 opacity-5"> <svg width="100%" height="100%"> <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"> <circle cx="10" cy="10" r="1" fill="currentColor"/> </pattern> <rect width="100%" height="100%" fill="url(#dots)"/> </svg> </div>
              <div className="relative">
                <div className="flex justify-between items-center mb-8">
                  <motion.h3 className="flex gap-3 items-center text-2xl font-bold text-gray-800" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}> <BookIcon size={24} className="text-indigo-600" animated /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Recent Masterpieces </span> </motion.h3>
                  <motion.button onClick={() => handleNavigation('/my-notes')} className="flex gap-2 items-center font-bold text-indigo-600 transition-colors duration-300 group hover:text-purple-600" whileHover={{ x: 5 }}> View All <ArrowRightIcon size={16} /> </motion.button>
                </div>
                <AnimatePresence>
                  {myNotes.length > 0 ? (
                    <div className="space-y-4">
                      {myNotes.slice(0, 5).map((note, index) => (
                        <motion.div key={note.id} initial={{ opacity: 0, x: -50, rotateY: -15 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: 50, rotateY: 15 }} transition={{ duration: 0.5, delay: index * 0.1 + 0.7, type: "spring", stiffness: 100 }} whileHover={{ x: 10, rotateY: 5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", transition: { duration: 0.3 } }} className="relative p-6 bg-gradient-to-r rounded-2xl border backdrop-blur-sm cursor-pointer group from-white/90 to-gray-50/90 border-gray-200/50" onClick={() => handleNavigation(`/notes/${note.id}`)}>
                          <motion.div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 transition-opacity duration-300 from-indigo-500/10 to-purple-500/10 group-hover:opacity-100" />
                          <div className="flex relative justify-between items-center">
                            <div className="flex-1">
                              <motion.h4 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600" whileHover={{ scale: 1.02 }}> {note.title} </motion.h4>
                              <p className="text-sm font-medium text-gray-600">{note.course_name}</p>
                            </div>
                            <div className="flex gap-6 items-center">
                              <motion.span className={`px-4 py-2 rounded-full text-xs font-bold ${ note.is_approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700" }`} whileHover={{ scale: 1.1 }}> {note.is_approved ? "✨ Approved" : "⏳ Pending"} </motion.span>
                              <div className="flex gap-4 items-center text-sm">
                                <motion.span className="flex gap-2 items-center font-semibold text-rose-600" whileHover={{ scale: 1.1 }}> <HeartIcon size={16} /> {note.likes_count} </motion.span>
                                <motion.span className="flex gap-2 items-center font-semibold text-emerald-600" whileHover={{ scale: 1.1 }}> <DownloadIcon size={16} /> {note.download_count} </motion.span>
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
                      <motion.button onClick={() => handleNavigation('/upload-note')} className="px-8 py-4 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                        <div className="flex gap-3 items-center"> <PlusIcon size={20} /> Create Your First Note </div>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="overflow-hidden relative p-8 bg-gradient-to-br rounded-3xl border shadow-2xl backdrop-blur-sm from-white/80 to-amber-50/50 border-white/20">
              <div className="relative">
                <motion.h3 className="flex gap-3 items-center mb-8 text-2xl font-bold text-gray-800" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}> <BookmarkIcon size={24} className="text-amber-600" animated /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Saved Treasures </span> </motion.h3>
                {recentBookmarks.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookmarks.map((note, index) => (
                      <motion.div key={note.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 + 1.1 }} whileHover={{ x: 8, backgroundColor: "rgba(251, 191, 36, 0.1)", transition: { duration: 0.2 } }} className="flex gap-4 items-center p-4 rounded-xl border border-transparent transition-all duration-300 cursor-pointer hover:border-amber-200" onClick={() => handleNavigation(`/notes/${note.id}`)}>
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
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="overflow-hidden relative bg-gradient-to-br rounded-3xl border shadow-2xl backdrop-blur-sm from-white/90 to-indigo-50/50 border-white/20">
              <motion.div className="overflow-hidden relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" animate={{ background: [ "linear-gradient(45deg, #6366F1, #8B5CF6, #EC4899)", "linear-gradient(135deg, #EC4899, #8B5CF6, #6366F1)", "linear-gradient(225deg, #6366F1, #EC4899, #8B5CF6)" ] }} transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}> {Array.from({ length: 3 }).map((_, i) => ( <motion.div key={i} className="absolute w-20 h-20 rounded-full blur-xl bg-white/20" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ x: [0, Math.random() * 100 - 50], y: [0, Math.random() * 50 - 25], scale: [1, 1.2, 1] }} transition={{ duration: Math.random() * 3 + 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 }} /> ))} </motion.div>
              <div className="relative px-8 pb-8">
                <motion.div className="relative -mt-16 mb-6" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.7, type: "spring" }}>
                  {user?.profile_picture_url ? (
                    <motion.img src={user.profile_picture_url} alt="Profile" className="object-cover mx-auto w-32 h-32 rounded-full border-4 border-white shadow-2xl" whileHover={{ scale: 1.1, rotate: 5 }} />
                  ) : (
                    <motion.div className="flex justify-center items-center mx-auto w-32 h-32 text-4xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-white shadow-2xl" whileHover={{ scale: 1.1, rotate: 5 }}>
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </motion.div>
                  )}
                </motion.div>
                <div className="space-y-4 text-center">
                  <motion.h3 className="text-2xl font-bold text-gray-900" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}> {user?.first_name} {user?.last_name} </motion.h3>
                  <div className="space-y-2">
                    <motion.p className="font-bold text-indigo-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}> {user?.student_id} </motion.p>
                    <motion.p className="font-medium text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}> {user?.department_name || user?.department} </motion.p>
                  </div>
                  <motion.div className="flex gap-3 justify-center pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                    <motion.div className="flex gap-2 items-center px-4 py-2 text-xs font-bold text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full" whileHover={{ scale: 1.1, y: -2 }}> <AwardIcon size={14} /> Top Contributor </motion.div>
                    <motion.div className="flex gap-2 items-center px-4 py-2 text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full" whileHover={{ scale: 1.1, y: -2 }}> <StarIcon size={14} /> Rising Star </motion.div>
                  </motion.div>
                  <motion.button onClick={() => handleNavigation('/profile')} className="px-6 py-4 mt-8 w-full font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl group" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
                    <div className="flex gap-3 justify-center items-center"> <UserIcon size={20} /> <span>Manage Profile</span> </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
         
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="overflow-hidden relative p-8 rounded-3xl border shadow-2xl backdrop-blur-sm bg-white/80 border-gray-200/50">
                  <div className="relative">
                    <motion.div 
                      className="flex gap-3 items-center mb-1" 
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
                      className="pl-9 mb-4 text-gray-500" 
                      initial={{ y: -20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 0.9 }}
                    >
                      Your notes across different categories
                    </motion.p>
                    {/* আমরা এখানে Enhanced3DPieChart.jsx ফাইলটিকেই ব্যবহার করছি, কিন্তু এর ভিতরের কোড পরিবর্তন করা হয়েছে */}
                    <Enhanced3DPieChart data={performanceData} />
                  </div>
                </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="overflow-hidden relative p-8 bg-gradient-to-br rounded-3xl border shadow-2xl backdrop-blur-sm from-white/90 to-green-50/50 border-white/20">
              <div className="relative">
                <motion.h3 className="flex gap-3 items-center mb-8 text-2xl font-bold text-gray-800" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}> <TargetIcon size={24} className="text-emerald-600" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Quick Actions </span> </motion.h3>
                <div className="space-y-4">
                  {[ { icon: UsersIcon, label: "Browse Community", path: "/notes", color: "from-blue-500 to-indigo-600" }, { icon: BookIcon, label: "Manage My Notes", path: "/my-notes", color: "from-purple-500 to-pink-600" }, { icon: ActivityIcon, label: "View Analytics", path: "/analytics", color: "from-emerald-500 to-teal-600" } ].map((action, index) => (
                    <motion.button key={index} onClick={() => handleNavigation(action.path)} className="flex gap-4 items-center p-4 w-full rounded-2xl border-2 transition-all duration-300 group bg-white/80 border-gray-200/50 hover:border-transparent hover:shadow-xl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 + 1 }} whileHover={{ scale: 1.02, x: 5, background: `linear-gradient(135deg, ${action.color.split(' ')[0].replace('from-', '')}1A, ${action.color.split(' ')[1].replace('to-', '')}1A)` }}>
                      <motion.div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl shadow-lg`} whileHover={{ rotate: 5, scale: 1.1 }}> <action.icon size={20} className="text-white" /> </motion.div>
                      <span className="font-bold text-gray-700 transition-colors group-hover:text-gray-900"> {action.label} </span>
                      <motion.div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" whileHover={{ x: 5 }}> <ArrowRightIcon size={16} className="text-gray-400" /> </motion.div>
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
// --- END OF FILE DashboardPage.jsx ---