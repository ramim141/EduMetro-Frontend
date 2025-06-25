// UserProfileCard.jsx (Updated & Corrected)

"use client"

import { motion } from "framer-motion"
import { FaEdit, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa"
import Button from "./Button"
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate ইম্পোর্ট করা হয়েছে

const UserProfileCard = ({ user }) => {
  const navigate = useNavigate(); // ✅ useNavigate হুক ব্যবহার করা হয়েছে

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U"
  const studentName =
    user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || "Student Name"

  return (
    <motion.div
      className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Profile Header */}
      <div className="mb-6 text-center">
        <motion.div
          className="relative inline-block mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white rounded-full shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            {userInitial}
          </div>
          <div className="absolute w-6 h-6 bg-green-500 border-2 border-white rounded-full -right-1 -bottom-1"></div>
        </motion.div>
        <h3 className="mb-1 text-xl font-bold text-gray-900">{studentName}</h3>
        <p className="text-sm text-gray-600">{user?.department || "Department"}</p>
      </div>

      {/* Profile Details */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            <FaEnvelope className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-gray-700">{user?.email || "email@example.com"}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            <FaIdCard className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-gray-700">ID: {user?.student_id || "Student ID"}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            <FaMapMarkerAlt className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-gray-700">{user?.location || "Location"}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            <FaCalendarAlt className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-gray-700">
            Joined {user?.date_joined ? new Date(user.date_joined).getFullYear() : "2024"}
          </span>
        </div>
      </div>

      {/* Bio Section */}
      <div className="p-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">About</h4>
        <p className="text-sm leading-relaxed text-gray-600">
          {user?.bio ||
            "Passionate student sharing knowledge and learning from the community. Always eager to help fellow students succeed."}
        </p>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => navigate('/profile/edit')} // ✅ useNavigate দিয়ে পেজ পরিবর্তন করা হচ্ছে
        variant="outline"
        size="md"
        className="w-full"
      >
        <FaEdit className="mr-2" />
        Edit Profile
      </Button>
    </motion.div>
  )
}

export default UserProfileCard