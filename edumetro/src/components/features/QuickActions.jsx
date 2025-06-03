"use client"

import { motion } from "framer-motion"
import { FaUpload, FaSearch, FaEye, FaBookmark } from "react-icons/fa"
import { Link } from "react-router-dom"

const QuickActions = () => {
  const actions = [
    {
      title: "Upload Note",
      description: "Share your study materials with the community",
      icon: FaUpload,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/upload-note",
    },
    {
      title: "Browse Notes",
      description: "Find study materials from other students",
      icon: FaSearch,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/note",
    },
    {
      title: "My Notes",
      description: "View and manage your uploaded notes",
      icon: FaEye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/my-notes",
    },
    {
      title: "Bookmarks",
      description: "Access your saved notes and resources",
      icon: FaBookmark,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/bookmarks",
    },
  ]

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.a
              key={action.title}
              href={action.link}
              className="flex items-start p-4 space-x-4 rounded-lg transition-colors hover:bg-gray-50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className={`p-3 rounded-lg ${action.bgColor}`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{action.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{action.description}</p>
              </div>
            </motion.a>
          )
        })}
      </div>
    </motion.div>
  )
}

export default QuickActions 