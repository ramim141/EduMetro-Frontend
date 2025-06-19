import { useState } from "react"
import { motion } from "framer-motion"
import { FloatingParticles, TrendingUpIcon } from "./DashboardIcons"

const StatCard = ({ icon: Icon, value, label, gradientFrom, gradientTo, trend, delay = 0 }) => { 
  const [isHovered, setIsHovered] = useState(false); 
  return ( 
    <motion.div 
      initial={{ opacity: 0, y: 30, rotateX: -15 }} 
      animate={{ opacity: 1, y: 0, rotateX: 0 }} 
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }} 
      whileHover={{ 
        y: -8, 
        rotateY: 5, 
        scale: 1.05, 
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3, type: "spring", stiffness: 300 } 
      }} 
      onHoverStart={() => setIsHovered(true)} 
      onHoverEnd={() => setIsHovered(false)} 
      className="overflow-hidden relative group perspective-1000"
    > 
      <div className="relative p-6 bg-white rounded-xl border-2 border-gray-100 shadow-lg transition-all duration-500 cursor-pointer group-hover:shadow-2xl group-hover:border-transparent"> 
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 ${gradientFrom} ${gradientTo} group-hover:opacity-20`} 
          animate={isHovered ? {
            background: [
              `linear-gradient(45deg, ${gradientFrom.replace("from-", "#")}, ${gradientTo.replace("to-", "#")})`,
              `linear-gradient(135deg, ${gradientTo.replace("to-", "#")}, ${gradientFrom.replace("from-", "#")})`,
            ],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        /> 
        {isHovered && <FloatingParticles />} 
        <div className="flex relative justify-between items-center"> 
          <div className="space-y-3"> 
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
            > 
              <motion.p 
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900" 
                animate={isHovered ? { scale: [1, 1.05, 1] } : {}} 
                transition={{ duration: 0.5 }}
              > 
                {value.toLocaleString()} 
              </motion.p> 
            </motion.div> 
            <p className="text-sm font-semibold tracking-wide text-gray-600 uppercase">{label}</p> 
            {trend && ( 
              <motion.div 
                className="flex items-center text-xs font-semibold text-emerald-600" 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: delay + 0.4 }}
              > 
                <TrendingUpIcon size={14} className="mr-1" /> 
                <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}> 
                  +{trend}% this week 
                </motion.span> 
              </motion.div> 
            )} 
          </div> 
          <motion.div 
            className={`p-4 bg-gradient-to-br rounded-2xl shadow-xl ${gradientFrom} ${gradientTo}`} 
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0], boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }} 
            transition={{ type: "spring", stiffness: 300 }}
          > 
            <Icon size={28} className="text-white" animated={isHovered} /> 
          </motion.div> 
        </div> 
      </div> 
    </motion.div> 
  ) 
}

export default StatCard;