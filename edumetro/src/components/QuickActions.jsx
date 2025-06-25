// QuickActions.jsx (Updated & Corrected)

"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"; // ✅ Link ইম্পোর্ট করা হয়েছে
import { FaUpload, FaSearch, FaEye, FaBookmark, FaUsers, FaCog } from "react-icons/fa"

const QuickActions = () => {
  const actions = [
    {
      title: "Upload Note",
      description: "Share your study materials",
      icon: FaUpload,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/upload-note",
      primary: true,
    },
    {
      title: "Browse Notes",
      description: "Find study materials",
      icon: FaSearch,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      link: "/note",
    },
    {
      title: "My Notes",
      description: "Manage your uploads",
      icon: FaEye,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/my-notes",
    },
    {
      title: "Bookmarks",
      description: "Saved for later",
      icon: FaBookmark,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      link: "/bookmarks",
    },
    {
      title: "Community",
      description: "Connect with peers",
      icon: FaUsers,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      link: "/community",
    },
    {
      title: "Settings",
      description: "Account preferences",
      icon: FaCog,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
      link: "/settings",
    },
  ]

  return (
    <motion.div
      className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600">Frequently used features and tools</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          const MotionLink = motion(Link); // ✅ motion এবং Link একসাথে ব্যবহারের জন্য
          
          return (
            <MotionLink
              key={action.title}
              to={action.link} // ✅ href এর পরিবর্তে to ব্যবহার করা হচ্ছে
              className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${
                action.primary
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-2 rounded-lg mb-3 ${action.primary ? "bg-white/20" : action.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${action.primary ? "text-white" : action.textColor}`} />
                </div>
                <h4 className={`font-semibold text-sm mb-1 ${action.primary ? "text-white" : "text-gray-900"}`}>
                  {action.title}
                </h4>
                <p className={`text-xs ${action.primary ? "text-blue-100" : "text-gray-600"}`}>{action.description}</p>
              </div>
              {action.primary && (
                <div className="absolute inset-0 transition-transform duration-700 transform -translate-x-full -skew-x-12 bg-gradient-to-r from-white/0 via-white/10 to-white/0 group-hover:translate-x-full" />
              )}
            </MotionLink>
          )
        })}
      </div>
    </motion.div>
  )
}

export default QuickActions