// src/components/NoteCard.jsx (Updated to link to NoteDetailsPage)

import React from 'react';
import { Link } from 'react-router-dom'; // Link ইম্পোর্ট করো
import RatingStars from './RatingStars';
import { FaComment, FaHeart, FaDownload, FaBookmark } from 'react-icons/fa';

const NoteCard = ({ note, onDownload, onLike, onBookmark }) => {
  const imageUrl = note.image || 'https://via.placeholder.com/150'; 
  const downloadLink = note.file_url || '#'; 

  return (
    // সম্পূর্ণ কার্ডটিকে Link কম্পোনেন্ট দিয়ে র‍্যাপ করা হয়েছে
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-200">
      {/* এই Link টি নোট ডিটেইলস পেজে নিয়ে যাবে */}
      <Link to={`/notes/${note.id}`} className="flex flex-grow"> {/* flex-grow যোগ করা যাতে লিংক পুরো কার্ডের ভেতরের অংশটুকু দখল করে */}
        {/* বাম পাশের ইমেজ */}
        <div className="md:w-1/3 w-full bg-gray-100 flex items-center justify-center p-4">
          <img src={imageUrl} alt={note.title} className="max-w-full max-h-40 object-contain" />
        </div>

        {/* ডান পাশের কন্টেন্ট */}
        <div className="md:w-2/3 w-full p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{note.title || 'Title of notes'}</h3>
            <p className="text-sm text-gray-600">Course name: {note.course_name || 'N/A'}</p>
            <p className="text-sm text-gray-600 mb-2">Description: {note.description || 'N/A'}</p>

            <div className="flex items-center text-sm mb-3">
              <RatingStars rating={note.average_rating || 0} />
              <span className="ml-2 text-gray-600">({note.rating_count || 0} reviews)</span>
            </div>
          </div>
        </div>
      </Link> {/* Link এর শেষ */}

      {/* আইকন এবং সংখ্যা - এগুলো লিংকের বাইরে থাকবে যাতে ক্লিক হ্যান্ডলার কাজ করে */}
      <div className="md:w-1/3 w-full md:w-auto p-4 md:p-0 flex items-center justify-around md:justify-end text-gray-500 text-sm mt-auto md:mt-0 md:border-l border-gray-200">
        <div className="flex items-center mr-4">
          <FaComment className="mr-1 text-gray-500" /> {note.comment_count || 0}
        </div>
        <button onClick={() => onLike(note.id)} className="flex items-center mr-4 hover:text-red-500">
          <FaHeart className={`mr-1 ${note.is_liked ? 'text-red-500' : 'text-gray-500'}`} /> {note.likes_count || 0}
        </button>
        <button onClick={() => onBookmark(note.id)} className="flex items-center mr-4 hover:text-blue-500">
          <FaBookmark className={`mr-1 ${note.is_bookmarked ? 'text-blue-500' : 'text-gray-500'}`} /> {note.bookmark_count || 0}
        </button>
        {/* ডাউনলোড বাটনকে সরাসরি Link এর বাইরে রেখে তার onClick হ্যান্ডলার ব্যবহার করা */}
        <button onClick={() => onDownload(note.id)} className="flex items-center hover:text-green-500">
          <FaDownload className="mr-1" /> {note.download_count || 0}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;