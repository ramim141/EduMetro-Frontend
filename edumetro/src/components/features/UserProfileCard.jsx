"use client"

import { motion } from "framer-motion"
import { FaEnvelope, FaIdCard, FaEdit } from "react-icons/fa"
import { Link } from "react-router-dom"

const UserProfileCard = ({ user }) => {
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U"
  const studentName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.username || "Student Name"

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="flex justify-center items-center w-20 h-20 mb-4 text-2xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
          {userInitial}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{studentName}</h3>
        <p className="text-gray-600">{user?.department || "Department"}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <FaEnvelope className="w-4 h-4 mr-3" />
          <span>{user?.email || "email@example.com"}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaIdCard className="w-4 h-4 mr-3" />
          <span>Student ID: {user?.student_id || "STU123456"}</span>
        </div>
      </div>

      <div className="p-4 mt-6 bg-gray-50 rounded-lg">
        <h4 className="mb-2 text-sm font-medium text-gray-700">Bio</h4>
        <p className="text-sm italic text-gray-600">
          {user?.bio || "No bio added yet."}
        </p>
      </div>

      <Link
        to="/profile"
        className="flex justify-center items-center w-full py-2 mt-6 text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700"
      >
        <FaEdit className="mr-2" />
        Edit Profile
      </Link>
    </motion.div>
  )
}

export default UserProfileCard 