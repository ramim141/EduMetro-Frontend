"use client"

import { motion } from "framer-motion"
import { FaChartLine, FaCalendarAlt } from "react-icons/fa"

const ActivityChart = ({ data = [] }) => {
  // Mock data for demonstration
  const mockData = [
    { day: "Mon", uploads: 3, downloads: 12 },
    { day: "Tue", uploads: 5, downloads: 18 },
    { day: "Wed", uploads: 2, downloads: 8 },
    { day: "Thu", uploads: 7, downloads: 25 },
    { day: "Fri", uploads: 4, downloads: 15 },
    { day: "Sat", uploads: 1, downloads: 5 },
    { day: "Sun", uploads: 2, downloads: 9 },
  ]

  const chartData = data.length > 0 ? data : mockData
  const maxValue = Math.max(...chartData.map((item) => Math.max(item.uploads, item.downloads)))

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <FaChartLine className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
            <p className="text-sm text-gray-600">Uploads and downloads this week</p>
          </div>
        </div>
        <button className="flex items-center px-3 py-2 space-x-2 text-sm text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-50">
          <FaCalendarAlt className="w-4 h-4" />
          <span>This Week</span>
        </button>
      </div>

      <div className="space-y-4">
        {chartData.map((item, index) => (
          <motion.div
            key={item.day}
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="w-8 text-sm font-medium text-gray-600">{item.day}</div>
            <div className="flex-1 space-y-2">
              {/* Uploads bar */}
              <div className="flex items-center space-x-2">
                <div className="w-16 text-xs text-gray-500">Uploads</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.uploads / maxValue) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                  />
                </div>
                <div className="w-6 text-xs text-right text-gray-600">{item.uploads}</div>
              </div>
              {/* Downloads bar */}
              <div className="flex items-center space-x-2">
                <div className="w-16 text-xs text-gray-500">Downloads</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.downloads / maxValue) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                  />
                </div>
                <div className="w-6 text-xs text-right text-gray-600">{item.downloads}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center pt-4 mt-6 space-x-6 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          <span className="text-sm text-gray-600">Uploads</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
          <span className="text-sm text-gray-600">Downloads</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ActivityChart
