// src/pages/NoteDetailsPage.jsx (Updated to handle unique review per user per note)

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Message from '../components/Message';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import InteractiveRatingStars from '../components/InteractiveRatingStars';
import ReviewCard from '../components/ReviewCard';
import { FaDownload, FaUserCircle, FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

import { format } from 'date-fns';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const NoteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false); // **নতুন স্টেট**

  // PDF Viewer States (no change)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  // Review Form States
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // নোট এবং রিভিউ ফেচ করার ফাংশন
  const fetchNoteAndReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const noteRes = await api.get(`/api/notes/${id}/`);
      setNote(noteRes.data);
      
      const reviewsRes = await api.get(`/api/notes/star-ratings/?note=${id}`); // ধরে নিচ্ছি এটি নোট আইডি দিয়ে ফিল্টার করে
      const fetchedReviews = reviewsRes.data.results;
      setReviews(fetchedReviews);
      
      // **এখানে পরিবর্তন:** ইউজার কি এই নোটে রিভিউ দিয়েছে কিনা, তা চেক করা
      if (isAuthenticated && user && user.user_id) {
        const userReviewExists = fetchedReviews.some(review => review.user === user.user_id); // **review.user এ ইউজার আইডি আছে কিনা চেক করো**
        setHasUserReviewed(userReviewExists);
      }

    } catch (err) {
      console.error('Failed to fetch note details or reviews:', err.response ? err.response.data : err.message);
      setError('Failed to load note details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user]); // isAuthenticated এবং user কে ডিপেন্ডেন্সি হিসেবে যোগ করা

  useEffect(() => {
    fetchNoteAndReviews();
  }, [fetchNoteAndReviews]);

  // রিভিউ ডেটা থেকে গড় রেটিং এবং রিভিউ সংখ্যা হিসাব করা
  const calculateReviewStats = (reviewsArray) => {
    const totalStars = reviewsArray.reduce((sum, review) => sum + (review.stars || 0), 0);
    const count = reviewsArray.length;
    const avgRating = count > 0 ? (totalStars / count).toFixed(1) : 0;
    return { average_rating: parseFloat(avgRating), review_count: count };
  };

  const { average_rating, review_count } = calculateReviewStats(reviews);


  // PDF Viewer Handlers (no change)
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  const changePage = (offset) => { setPageNumber(prevPageNumber => prevPageNumber + offset); };
  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);
  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));

  // Download Handler (no change)
  const handleDownload = async () => {
    if (!isAuthenticated) {
      setError('Please log in to download this note.');
      navigate('/login');
      return;
    }
    try {
      const response = await api.get(`/api/notes/${note.id}/download/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'downloaded_note.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download note:', err.response ? err.response.data : err.message);
      setError('Failed to download note. Please try again.');
    }
  };

  // Review Submission Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    if (authLoading) {
      setReviewError('Authentication is still loading. Please wait a moment.');
      return;
    }

    if (!isAuthenticated) {
      setReviewError('Please log in to submit a review.');
      navigate('/login');
      return;
    }

    if (!user || !user.user_id) {
        setReviewError('User information not available. Please try logging in again.');
        console.error('User object or user_id is missing from AuthContext:', user);
        return;
    }
    // এখানে অতিরিক্ত চেক: যদি ইউজার ইতিমধ্যেই রিভিউ দিয়ে থাকে
    if (hasUserReviewed) {
      setReviewError('You have already submitted a review for this note. You can only submit one review per note.');
      return;
    }


    if (userRating === 0 || !userComment.trim()) {
      setReviewError('Please provide a rating and a comment.');
      return;
    }

    setReviewLoading(true);
    try {
      // স্টার রেটিং API তে পোস্ট করা
      await api.post('/api/notes/star-ratings/', { // নতুন API endpoint
        note: note.id,
        stars: userRating,
        user: user.user_id,
      });

      // কমেন্ট API তে পোস্ট করা
      await api.post('/api/notes/comments/', { // নতুন API endpoint
        note: note.id,
        comment: userComment,
        user: user.user_id,
      });

      console.log('Review and rating submitted successfully.');
      setReviewSuccess('Review and rating submitted successfully!');
      
      setUserRating(0); // ফর্ম রিসেট
      setUserComment(''); // ফর্ম রিসেট
      
      // নতুন রিভিউ সাবমিট হওয়ার পর সব রিভিউ আবার ফেচ করা
      await fetchNoteAndReviews(); // এটি `hasUserReviewed` স্টেটও আপডেট করবে

    } catch (err) {
      console.error('Error submitting review:', err.response ? err.response.data : err.message);
      let errMsg = 'Failed to submit review.';
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (errors.non_field_errors) { // যদি ব্যাকএন্ড `non_field_errors` পাঠায়
            errMsg = errors.non_field_errors.join(' ');
        } else if (errors.stars) {
            errMsg = `Rating error: ${errors.stars.join(' ')}`;
        } else if (errors.comment) {
            errMsg = `Comment error: ${errors.comment.join(' ')}`;
        } else if (errors.note) {
            errMsg = `Note ID error: ${errors.note.join(' ')}`;
        } else if (errors.user) {
            errMsg = `User error: ${errors.user.join(' ')}`;
        } else if (errors.detail) {
            errMsg = errors.detail;
        } else if (typeof errors === 'object') {
            errMsg = Object.values(errors).flat().join(' ') || errMsg;
        } else if (typeof errors === 'string') {
            errMsg = errors;
        }
      }
      setReviewError(errMsg);

    } finally {
      setReviewLoading(false);
    }
  };

  // লোডিং এবং এরর কন্ডিশনাল রেন্ডারিং
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="w-12 h-12" />
        <p className="ml-4 text-gray-700">Loading note details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Message type="error" message={error} onClose={() => setError(null)} duration={5000} />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Note not found.
      </div>
    );
  }

  const uploadedDate = note.created_at ? format(new Date(note.created_at), 'MMMM d, yyyy') : 'Date N/A';

  return (
    <div className="container max-w-4xl p-4 mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <FaChevronLeft className="mr-2" />
          Back to Notes
        </button>
      </div>

      {/* Author and Note Info */}
      <div className="flex items-center p-6 bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 mr-4 text-xl font-semibold text-gray-700 bg-gray-100 rounded-full transition-colors duration-200 hover:bg-gray-200">
          {note.uploaded_by_username?.charAt(0).toUpperCase() || <FaUserCircle />}
        </div>
        <div>
          <p className="font-semibold text-gray-800">Uploaded by {note.uploaded_by_username || 'Unknown Author'}</p>
          <p className="text-sm text-gray-500">{uploadedDate}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">{note.title}</h1>
        <Button 
          onClick={handleDownload} 
          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <FaDownload className="text-2xl" />
        </Button>
      </div>

      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
        <RatingStars rating={average_rating} />
        <span className="ml-2 text-sm text-gray-600">{review_count} reviews</span>
      </div>

      {/* PDF Viewer */}
      <div className="mb-8 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-700">PDF Viewer</span>
          <div className="flex items-center space-x-3">
            <button 
              onClick={zoomOut} 
              disabled={scale <= 0.5} 
              className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
            >
              <FaSearchMinus />
            </button>
            <button 
              onClick={zoomIn} 
              disabled={scale >= 3.0} 
              className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
            >
              <FaSearchPlus />
            </button>
            <span className="text-sm text-gray-600">Scale: {Math.round(scale * 100)}%</span>
          </div>
        </div>
        <div className="relative overflow-auto h-[600px] flex justify-center items-center bg-gray-50">
            {note.file_url ? (
                <Document
                    file={note.file_url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={console.error}
                    className="flex justify-center"
                >
                    <Page 
                        pageNumber={pageNumber} 
                        scale={scale} 
                        renderTextLayer={true} 
                        renderAnnotationLayer={true}
                    />
                </Document>
            ) : (
                <div className="text-gray-500">No PDF file available for this note.</div>
            )}
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200">
          <button 
            onClick={previousPage} 
            disabled={pageNumber <= 1} 
            className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm text-gray-700">
            Page {pageNumber} of {numPages || 'Loading...'}
          </span>
          <button 
            onClick={nextPage} 
            disabled={pageNumber >= numPages} 
            className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Write a Review */}
      <div className="p-6 bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Write a review</h2>
        {reviewError && (
          <Message 
            type="error" 
            message={reviewError} 
            onClose={() => setReviewError(null)} 
            duration={5000} 
            className="mb-4"
          />
        )}
        {reviewSuccess && (
          <Message 
            type="success" 
            message={reviewSuccess} 
            onClose={() => setReviewSuccess(null)} 
            className="mb-4"
          />
        )}
        {isAuthenticated && !hasUserReviewed ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <InteractiveRatingStars 
              initialRating={userRating} 
              onRatingChange={setUserRating} 
              className="mb-4"
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              rows="4"
              placeholder="Share your thoughts about this note..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              required
            ></textarea>
            <Button 
              type="submit" 
              disabled={reviewLoading}
              className="w-full transition-all duration-200"
            >
              {reviewLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner className="mr-2" /> Submitting...
                </div>
              ) : (
                'Submit Review'
              )}
            </Button>
          </form>
        ) : isAuthenticated && hasUserReviewed ? (
          <p className="text-center text-gray-600 py-4">
            You have already submitted a review for this note.
          </p>
        ) : (
          <p className="text-center text-gray-600 py-4">
            Please log in to write a review.
          </p>
        )}
      </div>

      {/* Reviews/Comments List */}
      <div className="p-6 bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Reviews & Comments ({review_count})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 py-4">
            No reviews yet. Be the first to leave one!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                className="transition-all duration-200 hover:shadow-sm"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetailsPage;