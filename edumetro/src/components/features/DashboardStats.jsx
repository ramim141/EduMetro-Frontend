"use client"

import { motion } from "framer-motion"
import { FaChartLine, FaBook, FaComment, FaDownload, FaStar } from "react-icons/fa"

const DashboardStats = ({ stats, loading }) => {
  const statItems = [
    {
      title: "Notes Posted",
      value: stats.notes,
      icon: FaBook,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Comments",
      value: stats.comments,
      icon: FaComment,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Downloads",
      value: stats.downloads,
      icon: FaDownload,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Average Rating",
      value: stats.rating,
      icon: FaStar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {loading ? (
        // Loading skeleton
        Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-sm animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="mt-4 h-8 bg-gray-200 rounded"></div>
            </div>
          ))
      ) : (
        statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              className="p-6 bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.title}</p>
                  <p className={`mt-2 text-3xl font-bold ${item.color}`}>
                    {typeof item.value === "number" && item.value % 1 !== 0
                      ? item.value.toFixed(1)
                      : item.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${item.bgColor}`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })
      )}
    </div>
  )
}

export default DashboardStats 