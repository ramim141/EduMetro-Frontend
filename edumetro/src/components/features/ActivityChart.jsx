"use client"

import { motion } from "framer-motion"
import { FaChartLine } from "react-icons/fa"

const ActivityChart = () => {
  // Mock data for the chart
  const chartData = [
    { day: "Mon", value: 30 },
    { day: "Tue", value: 45 },
    { day: "Wed", value: 35 },
    { day: "Thu", value: 50 },
    { day: "Fri", value: 40 },
    { day: "Sat", value: 25 },
    { day: "Sun", value: 20 },
  ]

  const maxValue = Math.max(...chartData.map((item) => item.value))

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
          <p className="text-sm text-gray-600">Your weekly activity summary</p>
        </div>
        <div className="p-2 text-indigo-600 bg-indigo-50 rounded-lg">
          <FaChartLine className="w-5 h-5" />
        </div>
      </div>

      <div className="h-64">
        <div className="flex items-end justify-between h-full space-x-2">
          {chartData.map((item, index) => (
            <motion.div
              key={item.day}
              className="flex flex-col items-center flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div
                className="w-full bg-indigo-100 rounded-t-lg transition-all duration-300 hover:bg-indigo-200"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                }}
              />
              <span className="mt-2 text-xs font-medium text-gray-600">{item.day}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Activity</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {chartData.reduce((sum, item) => sum + item.value, 0)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Average</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {Math.round(
              chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length
            )}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ActivityChart 