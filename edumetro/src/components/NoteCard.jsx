import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { 
  FaComment, 
  FaHeart, 
  FaDownload, 
  FaBookmark,
  FaUniversity,
  FaFileAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import noteThum from '../assets/images/note_thum.jpg';
const NoteCard = ({ note, onDownload, onLike, onBookmark }) => {

  const downloadLink = note.file_url || '#';

  return (
    <motion.div 
      className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-2xl md:flex-row group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Link to Note Details Page */}
      <Link to={`/notes/${note.id}`} className="flex flex-grow">
        {/* Image Section */}
        <div className="relative flex items-center justify-center w-full p-4 overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 md:w-1/3">
          <motion.img
            src={noteThum}
            alt={note.title}
            className="object-cover w-full h-48 transition-all duration-500 rounded-lg group-hover:scale-105"
            whileHover={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100"></div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between w-full p-6 md:w-2/3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600">
              {note.title || 'Title of notes'}
            </h3>
            
            
            
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <FaFileAlt className="mr-1 text-blue-400" />
              <span>{note.course_name || 'Course Name'}</span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <FaUniversity className="mr-1 text-indigo-400" />
              <span>{note.department_name || 'University'}</span>
            </div>

            <p className="mt-3 text-gray-600 line-clamp-2">
              {note.description || 'No description available'}
            </p>

            <div className="flex items-center mt-4">
              <RatingStars rating={note.average_rating || 0} />
              <span className="ml-2 text-sm text-gray-500">({note.rating_count || 0} reviews)</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Icons Section */}
      <div className="flex items-center justify-around w-full p-4 mt-auto text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-indigo-50 md:w-auto md:p-6 md:justify-end md:mt-0 md:border-l md:border-gray-100">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-indigo-50 group"
        >
          <FaComment className="text-xl text-indigo-500 transition-colors duration-200 group-hover:text-indigo-700" />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-indigo-700">
            {note.comment_count || 0}
          </span>
        </motion.button>
        
        <motion.button
          onClick={() => onLike(note.id)}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-red-50 group"
        >
          <FaHeart
            className={`text-xl ${note.is_liked ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200 group-hover:text-red-600`}
          />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-red-600">
            {note.likes_count || 0}
          </span>
        </motion.button>
        
        <motion.button
          onClick={() => onBookmark(note.id)}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-blue-50 group"
        >
          <FaBookmark
            className={`text-xl ${note.is_bookmarked ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-200 group-hover:text-blue-600`}
          />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-blue-600">
            {note.bookmark_count || 0}
          </span>
        </motion.button>
        
        <motion.button
          onClick={() => onDownload(note.id)}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-green-50 group"
        >
          <FaDownload
            className="text-xl text-green-500 transition-colors duration-200 group-hover:text-green-600"
          />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-green-600">
            {note.download_count || 0}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoteCard;
