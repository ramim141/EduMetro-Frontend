"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa"
import DashboardStats from "./features/DashboardStats"
import ActivityChart from "./features/ActivityChart"
import QuickActions from "./features/QuickActions"
import UserProfileCard from "./features/UserProfileCard"
import RecentActivity from "./features/RecentActivity"
import Message from "./Message"

const DashboardPage = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    notes: 0,
    comments: 0,
    downloads: 0,
    rating: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Mock user data - replace with actual API call
      const mockUser = {
        username: "johndoe",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@university.edu",
        student_id: "STU123456",
        department: "Computer Science",
        location: "New York, USA",
        bio: "Passionate computer science student sharing knowledge and learning from the community.",
        date_joined: "2023-01-15",
      }

      // Mock stats data - replace with actual API calls
      const mockStats = {
        notes: 24,
        comments: 156,
        downloads: 1247,
        rating: 4.7,
      }

      setUser(mockUser)
      setStats(mockStats)
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
      setError("Failed to load dashboard data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/note?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br via-blue-50 to-indigo-50 from-slate-50">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 border-b border-gray-200 backdrop-blur-lg bg-white/80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
   
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {error && <Message type="error" message={error} onClose={() => setError(null)} duration={5000} />}

        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome back, {user?.first_name || "Student"}! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your notes and community activity.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="mb-8">
          <DashboardStats stats={stats} loading={loading} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Activity Chart */}
            <ActivityChart />

            {/* Quick Actions */}
            <QuickActions />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* User Profile */}
            <UserProfileCard user={user} />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
