// src/components/ReviewCard.jsx (Updated for correct author name and rating field)

import React from 'react';
import RatingStars from './RatingStars';
import { formatDistanceToNow } from 'date-fns';

const ReviewCard = ({ review }) => {
  // **এখানে পরিবর্তন করা হয়েছে:**
  // API রেসপন্স থেকে user_username এবং stars ফিল্ড ব্যবহার করা হচ্ছে
  const authorName = review.user_username || 'Anonymous User'; // API response field for username
  const displayRating = review.stars || 0; // API response field for stars
  const comment = review.comment || 'No comment provided.';
  // created_at তারিখকে formatDistanceToNow দিয়ে ফরম্যাট করা হচ্ছে
  const timeAgo = review.created_at ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) : 'just now';

  return (
    <div className="flex items-start p-4 space-x-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* প্রোফাইল পিকচার প্লেসহোল্ডার */}
      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg font-semibold text-gray-700 bg-gray-300 rounded-full">
        {authorName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <p className="font-semibold text-gray-800">{authorName}</p>
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
        <RatingStars rating={displayRating} className="mb-2" />
        <p className="text-gray-700">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;