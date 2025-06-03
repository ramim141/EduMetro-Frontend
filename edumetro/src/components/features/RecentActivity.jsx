"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaBook, FaDownload, FaStar, FaComment } from "react-icons/fa"
import { Message } from "../ui"

const RecentActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockActivities = [
        {
          id: 1,
          type: "download",
          note: "Introduction to React",
          user: "Alice Johnson",
          timestamp: "2024-03-15T10:30:00",
        },
        {
          id: 2,
          type: "rating",
          note: "Advanced JavaScript",
          user: "Bob Smith",
          rating: 5,
          timestamp: "2024-03-15T09:15:00",
        },
        {
          id: 3,
          type: "comment",
          note: "Data Structures",
          user: "Carol White",
          comment: "Great explanation!",
          timestamp: "2024-03-14T16:45:00",
        },
      ]

      setActivities(mockActivities)
    } catch (err) {
      console.error("Failed to fetch recent activity:", err)
      setError("Failed to load recent activity. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "download":
        return <FaDownload className="w-4 h-4 text-blue-500" />
      case "rating":
        return <FaStar className="w-4 h-4 text-yellow-500" />
      case "comment":
        return <FaComment className="w-4 h-4 text-green-500" />
      default:
        return <FaBook className="w-4 h-4 text-gray-500" />
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "download":
        return `${activity.user} downloaded ${activity.note}`
      case "rating":
        return `${activity.user} rated ${activity.note} ${activity.rating} stars`
      case "comment":
        return `${activity.user} commented on ${activity.note}`
      default:
        return "Unknown activity"
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
      {error && <Message type="error" message={error} onClose={() => setError(null)} duration={5000} />}

      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            ))
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{getActivityText(activity)}</p>
                <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
        )}
      </div>
    </motion.div>
  )
}

export default RecentActivity 