// --- START OF FILE components/dashboard/EnhancedLoadingDashboard.jsx ---
import { motion } from "framer-motion"

const EnhancedLoadingDashboard = () => ( 
  <div className="flex overflow-hidden relative justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"> 
    {Array.from({ length: 6 }).map((_, i) => ( 
      <motion.div 
        key={i} 
        className="absolute bg-gradient-to-r rounded-full blur-xl from-blue-400/20 to-purple-400/20" 
        style={{ 
          width: Math.random() * 300 + 100, 
          height: Math.random() * 300 + 100, 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`, 
        }} 
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.3, 0.6, 0.3], 
          x: [0, Math.random() * 100 - 50], 
          y: [0, Math.random() * 100 - 50], 
        }} 
        transition={{ 
          duration: Math.random() * 4 + 3, 
          repeat: Number.POSITIVE_INFINITY, 
          delay: Math.random() * 2, 
        }} 
      /> 
    ))} 
    <div className="z-10 text-center"> 
      <motion.div 
        className="relative mb-8" 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      > 
        <div className="mx-auto w-20 h-20 rounded-full border-4 border-transparent border-t-white border-r-white"></div> 
        
      </motion.div> 
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}> 
        <motion.h2 
          className="mb-4 text-2xl font-bold text-white" 
          animate={{ opacity: [0.7, 1, 0.7] }} 
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        > 
          Crafting Your Amazing Dashboard 
        </motion.h2> 
        <motion.p 
          className="font-medium text-blue-200" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1 }}
        > 
          Preparing something extraordinary... 
        </motion.p> 
      </motion.div> 
    </div> 
  </div> 
)

export default EnhancedLoadingDashboard;
// --- END OF FILE components/dashboard/EnhancedLoadingDashboard.jsx ---