// src/components/NoteCard.jsx

"use client"

import React from "react" // ✅ React ইম্পোর্ট করুন
import { Link } from "react-router-dom"
import RatingStars from "./RatingStars"
import {
  FaComment,
  FaHeart,
  FaDownload,
  FaBookmark,
  FaUniversity,
  FaFileAlt,
  FaUser, // ✅ FaUser ইম্পোর্ট করুন
  FaUserGraduate, // ✅ FaUserGraduate ইম্পোর্ট করুন
  FaCheckCircle,  // ✅ নতুন আইকন
  FaHourglassHalf, // ✅ নতুন আইকন
  FaRegBookmark // Import outlined bookmark icon
} from "react-icons/fa"

import noteThumbnail from "../assets/images/note_thum.jpg" // ✅ সঠিক পাথ

const NoteCard = ({
  note,
  onDownload,
  onLike,
  onBookmark,
  showApprovalStatus = false, // ✅ নতুন প্রপ যোগ করুন
  isBookmarkPage = false, // New prop
}) => {
  // ✅ isLiked এবং isBookmarked স্টেটগুলো সরানো হয়েছে।
  // এগুলি এখন সরাসরি note অবজেক্ট থেকে আসবে এবং Parent component (MyNotesPage) দ্বারা আপডেটেড হবে।

  const handleLikeClick = (e) => { // ✅ নাম পরিবর্তন করা হয়েছে যাতে `onLike` এর সাথে কনফ্লিক্ট না হয়
    e.preventDefault();
    e.stopPropagation();
    if (onLike) onLike(note.id);
  };

  const handleBookmarkClick = (e) => { // ✅ নাম পরিবর্তন করা হয়েছে
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) onBookmark(note.id);
  };

  const handleDownloadClick = (e) => { // ✅ নাম পরিবর্তন করা হয়েছে
    e.preventDefault();
    e.stopPropagation();
    if (onDownload) onDownload(note.id);
  };

  // ✅ অ্যাপ্রুভাল স্ট্যাটাস ডিসপ্লে লজিক
  const renderApprovalStatus = () => {
    if (!showApprovalStatus) return null;

    if (note.is_approved) {
      return (
        <div className="flex items-center mt-2 text-sm font-medium text-green-600">
          <FaCheckCircle className="mr-1" /> Approved
        </div>
      );
    } else {
      return (
        <div className="flex items-center mt-2 text-sm font-medium text-yellow-600">
          <FaHourglassHalf className="mr-1" /> Pending Approval
        </div>
      );
    }
  };


  return (
    <div
      className="flex overflow-hidden relative flex-col w-full bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl md:flex-row group"
    >
      {/* Link to Note Details Page */}
      <Link to={`/notes/${note.id}`} className="flex flex-grow">
        {/* Image Section */}
        <div className="flex object-cover overflow-hidden relative justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-50 md:w-1/3">
          <img
            src={note.noteThumbnail || noteThumbnail} // Note Thumbnail যদি API থেকে আসে, নাহলে default
            alt={note.title}
            className="w-full h-64 transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-black/20 group-hover:opacity-100"></div>

          {/* Subject Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              {note.course_name || "General"} {/* ✅ note.subject এর পরিবর্তে note.course_name */}
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
              <span className="text-lg font-semibold text-gray-700">{note.uploader_first_name || "N/A"} {note.uploader_last_name || ""}</span> {/* ✅ Default text "N/A" */}
            </div>

            <div className="flex items-center mt-2 text-sm text-gray-600">
              <FaUserGraduate className="mr-2 text-xl text-indigo-400" />
              <span className="text-lg font-semibold text-gray-700">{note.department_name || "N/A"}</span> {/* ✅ Default text "N/A" */}
            </div>

            <div className="flex items-center mt-4">
              <RatingStars rating={note.average_rating || 0} size="xl" />
              {/* ✅ note.rating_count এর পরিবর্তে note.star_ratings.length ব্যবহার করুন */}
              <span className="ml-2 text-sm text-gray-500">({note.star_ratings?.length || 0} reviews)</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Icons Section */}
      <div className="flex justify-around items-center p-4 mt-auto w-full text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-indigo-50 md:w-auto md:p-6 md:justify-end md:mt-0 md:border-l md:border-gray-100">
        <button
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-indigo-50 group"
        >
          <FaComment className="text-xl text-indigo-500 transition-colors duration-200 group-hover:text-indigo-700" />
          {/* ✅ note.comment_count এর পরিবর্তে note.comments.length ব্যবহার করুন */}
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-indigo-700">
            {note.comments?.length || 0}
          </span>
        </button>

        <button
          onClick={handleLikeClick} // ✅ ফাংশনের নাম পরিবর্তন করা হয়েছে
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-red-50 group"
        >
          <FaHeart
            className={`text-xl ${note.is_liked_by_current_user ? "text-red-500" : "text-gray-400"} transition-colors duration-200 group-hover:text-red-600`}
          />
          {/* ✅ likes_count সরাসরি ব্যবহার করুন, isLiked স্টেট আর প্রয়োজন নেই */}
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-red-600">
            {note.likes_count || 0}
          </span>
        </button>

        <button
          onClick={handleBookmarkClick} // ✅ ফাংশনের নাম পরিবর্তন করা হয়েছে
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50 group"
        >
          {isBookmarkPage && note.is_bookmarked_by_current_user ? (
            <FaRegBookmark // Use outlined icon for remove on bookmarks page
              className={`text-xl text-blue-500 transition-colors duration-200 hover:text-blue-700 hover:scale-110`}
            />
          ) : (
            <FaBookmark
              className={`text-xl ${note.is_bookmarked_by_current_user ? "text-blue-500" : "text-gray-400"} transition-colors duration-200 group-hover:text-blue-600`}
            />
          )}
          {/* ✅ bookmarks_count সরাসরি ব্যবহার করুন, isBookmarked স্টেট আর প্রয়োজন নেই */}
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-blue-600">
            {note.bookmarks_count || 0}
          </span>
        </button>

        <button
          onClick={handleDownloadClick} // ✅ ফাংশনের নাম পরিবর্তন করা হয়েছে
          className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-green-50 group"
        >
          <FaDownload className="text-xl text-green-500 transition-colors duration-200 group-hover:text-green-600" />
          <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-green-600">
            {note.download_count || 0}
          </span>
        </button>
      </div>
      {/* ✅ Approval Status Display */}
      {renderApprovalStatus()}
    </div>
  )
}

export default NoteCard;