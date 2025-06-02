// import React from 'react';
// import { Link } from 'react-router-dom';
// import RatingStars from './RatingStars';
// import { 
//   FaComment, 
//   FaHeart, 
//   FaDownload, 
//   FaBookmark,
//   FaUniversity,
//   FaFileAlt
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import noteThum from '../assets/images/note_thum.jpg';
// import courseIcon from '../assets/images/open-book.png'
// const NoteCard = ({ note, onDownload, onLike, onBookmark }) => {

// const downloadLink = note.file_url || '#';

//   return (
//     <motion.div 
//       className="flex overflow-hidden relative flex-col bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl md:flex-row group"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ scale: 1.02 }}
//       transition={{ type: 'spring', stiffness: 300 }}
//     >
//       {/* Link to Note Details Page */}
//       <Link to={`/notes/${note.id}`} className="flex flex-grow">
//         {/* Image Section */}
//         <div className="flex overflow-hidden relative justify-center items-center p-4 w-full bg-gradient-to-br from-indigo-50 to-blue-50 md:w-1/3">
//           <motion.img
//             src={noteThum}
//             alt={note.title}
//             className="object-cover w-full h-48 rounded-lg transition-all duration-500 group-hover:scale-105"
//             whileHover={{ scale: 1.05 }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-black/20 group-hover:opacity-100"></div>
//         </div>

//         {/* Content Section */}
//         <div className="flex flex-col justify-between p-6 w-full md:w-2/3">
//           <div>
//             <h3 className="text-2xl font-bold text-blue-900 uppercase transition-colors duration-200 group-hover:text-indigo-600">
//               {note.title || 'Title of notes'}
//             </h3>
//             <p className="mt-3 text-lg text-gray-600 line-clamp-2">
//               {note.description || 'No description available'}
//             </p>
            
            
//             <div className="flex items-center mt-1 text-sm text-gray-600">
//               <img src={courseIcon} className="mr-2 w-6" alt="" />
//               <span className="text-xl font-bold text-gray-600">{note.course_name || 'Course Name'}</span>
//             </div>
//             <div className="flex items-center mt-2 text-sm text-gray-600">
//               <FaUniversity className="mr-2 text-2xl text-indigo-400" />
//               <span className="text-xl font-bold text-gray-600">{note.department_name || 'University'}</span>
//             </div>

            

//             <div className="flex items-center mt-4">
//               <RatingStars rating={note.average_rating || 0} />
//               <span className="ml-2 text-sm text-gray-500">({note.rating_count || 0} reviews)</span>
//             </div>
//           </div>
//         </div>
//       </Link>

//       {/* Action Icons Section */}
//       <div className="flex justify-around items-center p-4 mt-auto w-full text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-indigo-50 md:w-auto md:p-6 md:justify-end md:mt-0 md:border-l md:border-gray-100">
//         <motion.button 
//           whileTap={{ scale: 0.95 }}
//           className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-indigo-50 group"
//         >
//           <FaComment className="text-xl text-indigo-500 transition-colors duration-200 group-hover:text-indigo-700" />
//           <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-indigo-700">
//             {note.comment_count || 0}
//           </span>
//         </motion.button>
        
//         <motion.button
//           onClick={() => onLike(note.id)}
//           whileTap={{ scale: 0.95 }}
//           className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-red-50 group"
//         >
//           <FaHeart
//             className={`text-xl ${note.is_liked ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200 group-hover:text-red-600`}
//           />
//           <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-red-600">
//             {note.likes_count || 0}
//           </span>
//         </motion.button>
        
//         <motion.button
//           onClick={() => onBookmark(note.id)}
//           whileTap={{ scale: 0.95 }}
//           className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-blue-50 group"
//         >
//           <FaBookmark
//             className={`text-xl ${note.is_bookmarked ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-200 group-hover:text-blue-600`}
//           />
//           <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-blue-600">
//             {note.bookmark_count || 0}
//           </span>
//         </motion.button>
        
//         <motion.button
//           onClick={() => onDownload(note.id)}
//           whileTap={{ scale: 0.95 }}
//           className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-green-50 group"
//         >
//           <FaDownload
//             className="text-xl text-green-500 transition-colors duration-200 group-hover:text-green-600"
//           />
//           <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-green-600">
//             {note.download_count || 0}
//           </span>
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// export default NoteCard;


"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import RatingStars from "./RatingStars"
import { FaComment, FaHeart, FaDownload, FaBookmark, FaUniversity, FaFileAlt } from "react-icons/fa"
import { motion } from "framer-motion"
import noteThumbnail from "../assets/images/note_thum.jpg"
import { FaUser } from "react-icons/fa"
import { FaUserGraduate } from "react-icons/fa6";

const NoteCard = ({ note, onDownload, onLike, onBookmark, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(note.is_liked || false)
  const [isBookmarked, setIsBookmarked] = useState(note.is_bookmarked || false)

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    if (onLike) onLike(note.id)
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    if (onBookmark) onBookmark(note.id)
  }

  const handleDownload = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDownload) onDownload(note.id)
  }

  return (
    <motion.div
      className="flex overflow-hidden relative flex-col w-full bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl md:flex-row group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 300,
        delay: index * 0.1,
      }}
    >
      {/* Link to Note Details Page */}
      <Link to={`/notes/${note.id}`} className="flex flex-grow">
        {/* Image Section */}
        <div className="flex object-cover overflow-hidden relative justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-50 md:w-1/3">
          <motion.img
            src={note.noteThumbnail || noteThumbnail}
            alt={note.title}
            className="w-full h-64 transition-all duration-500  group-hover:scale-105"
            whileHover={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-black/20 group-hover:opacity-100"></div>

          {/* Subject Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              {note.subject || note.course_name || "General"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between p-6 w-full md:w-2/3">
          <div>
            <h3 className="text-2xl font-bold text-blue-900 transition-colors duration-200 group-hover:text-indigo-600 line-clamp-2">
              {note.title || "Title of notes"}
            </h3>
            <p className="mt-3 text-lg text-gray-600 line-clamp-2">{note.description || "No description available"}</p>

            <div className="flex items-center mt-3 text-sm text-gray-600">
              <FaUser className="mr-2 w-5 h-5 text-indigo-400" />
              <span className="text-lg font-semibold text-gray-700">{note.uploader_first_name || "uploader_first_name Name"} {note.uploader_last_name || "uploader_last_name"}</span>
            </div>

            <div className="flex items-center mt-2 text-sm text-gray-600">
          
              <FaUserGraduate className="mr-2 text-xl text-indigo-400" />
              <span className="text-lg font-semibold text-gray-700">{note.department_name || "University"}</span>
            </div>

            <div className="flex items-center mt-4">
              <RatingStars rating={note.average_rating || 0} size="xl" />
              <span className="ml-2 text-sm text-gray-500">({note.rating_count || 0} reviews)</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Icons Section */}
      <div className="flex justify-around items-center p-4 mt-auto w-full text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-indigo-50 md:w-auto md:p-6 md:justify-end md:mt-0 md:border-l md:border-gray-100">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-indigo-50 group"
        >
          <FaComment className="text-xl text-indigo-500 transition-colors duration-200 group-hover:text-indigo-700" />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-indigo-700">
            {note.comment_count || 0}
          </span>
        </motion.button>

        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-red-50 group"
        >
          <FaHeart
            className={`text-xl ${isLiked ? "text-red-500" : "text-gray-400"} transition-colors duration-200 group-hover:text-red-600`}
          />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-red-600">
            {(note.likes_count || 0) + (isLiked && !note.is_liked ? 1 : 0)}
          </span>
        </motion.button>

        <motion.button
          onClick={handleBookmark}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50 group"
        >
          <FaBookmark
            className={`text-xl ${isBookmarked ? "text-blue-500" : "text-gray-400"} transition-colors duration-200 group-hover:text-blue-600`}
          />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-blue-600">
            {(note.bookmark_count || 0) + (isBookmarked && !note.is_bookmarked ? 1 : 0)}
          </span>
        </motion.button>

        <motion.button
          onClick={handleDownload}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-green-50 group"
        >
          <FaDownload className="text-xl text-green-500 transition-colors duration-200 group-hover:text-green-600" />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-green-600">
            {note.download_count || 0}
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default NoteCard
