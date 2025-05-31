// src/pages/NoteDetailsPage.jsx (Updated to fix rendering issues and correct API endpoints)

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
import { FaDownload, FaUserCircle, FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

import { format } from 'date-fns';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const NoteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // PDF Viewer States
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  // Review Form States
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  const fetchNoteAndReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get note details
      const noteRes = await api.get(`/api/notes/${id}/`);
      setNote(noteRes.data);
      
      // Get ratings and comments
      const [ratingRes, commentRes] = await Promise.all([
        api.get(`/api/notes/star-ratings/`, {
          params: { note: id }
        }),
        api.get(`/api/notes/comments/`, {
          params: { note: id }
        })
      ]);

      const fetchedReviews = Array.isArray(ratingRes.data) ? ratingRes.data : (ratingRes.data.results || []);
      const fetchedComments = Array.isArray(commentRes.data) ? commentRes.data : (commentRes.data.results || []);
      
      setReviews(fetchedReviews);
      setComments(fetchedComments);
      
      if (isAuthenticated && user && user.user_id) {
        const userReviewExists = fetchedReviews.some(review => review.user === user.user_id);
        setHasUserReviewed(userReviewExists);
      }

    } catch (err) {
      console.error('Failed to fetch note details:', err);
      setError('Failed to load note details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user]);

  useEffect(() => {
    fetchNoteAndReviews();
  }, [fetchNoteAndReviews]);
  // No longer need calculateReviewStats as we're using note.average_rating directly


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
      setReviewError('You have already submitted a rating for this note. You can only submit one rating per note.');
      return;
    }

    if (userRating === 0 || !userComment.trim()) {
      setReviewError('Please provide both a rating and a comment.');
      return;
    }

    setReviewLoading(true);
    try {
      // Submit both rating and comment
      await Promise.all([
        api.post('/api/notes/star-ratings/', {
          note: note.id,
          stars: userRating,
          user: user.user_id,
        }),
        api.post('/api/notes/comments/', {
          note: note.id,
          text: userComment,
          user: user.user_id,
        })
      ]);

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
            className="flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-800"
          >
            <FaChevronLeft className="mr-2" />
            Back to Notes
          </button>
        </div>

        {/* Author Info */}
        <div className="flex items-center p-6 transition-all duration-200 bg-white rounded-lg shadow-sm hover:shadow-md">
          <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 mr-4 text-xl font-semibold text-gray-700 bg-gray-100 rounded-full">
            {note.uploader_username?.charAt(0).toUpperCase() || <FaUserCircle />}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
          {note.uploader_first_name && note.uploader_last_name 
            ? `${note.uploader_first_name} ${note.uploader_last_name}`
            : (note.uploader_username || 'Unknown Author')}
            </p>
            <div className="flex flex-col">
          {note.uploader_student_id && (
            <span className="text-sm text-gray-600">
              ID: {note.uploader_student_id}
            </span>
          )}
          {note.uploader_department && (
            <span className="text-sm text-gray-600">
              Department: {note.uploader_department}
            </span>
          )}
          <p className="text-sm text-gray-500">{uploadedDate}</p>
            </div>
          </div>
        </div>

        {/* Note Title and Download */}
      <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">{note.title}</h1>
        <Button onClick={handleDownload}>
          <FaDownload className="text-2xl" />
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
        <RatingStars rating={note.average_rating || 0} />
        <span className="ml-2 text-sm text-gray-600">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {/* PDF Viewer */}
      <div className="mb-8 overflow-hidden transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-semibold text-gray-700">PDF Viewer</span>
          <div className="flex items-center space-x-3">
            <button 
              onClick={zoomOut} 
              disabled={scale <= 0.5} 
              className="p-2 transition-colors duration-200 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <FaSearchMinus />
            </button>
            <button 
              onClick={zoomIn} 
              disabled={scale >= 3.0} 
              className="p-2 transition-colors duration-200 rounded-md hover:bg-gray-200 disabled:opacity-50"
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
        <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={previousPage} 
            disabled={pageNumber <= 1} 
            className="p-2 transition-colors duration-200 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm text-gray-700">
            Page {pageNumber} of {numPages || 'Loading...'}
          </span>
          <button 
            onClick={nextPage} 
            disabled={pageNumber >= numPages} 
            className="p-2 transition-colors duration-200 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Review Form */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Write a Review</h2>
        {reviewError && (
          <Message type="error" message={reviewError} onClose={() => setReviewError(null)} />
        )}
        {reviewSuccess && (
          <Message type="success" message={reviewSuccess} onClose={() => setReviewSuccess(null)} />
        )}
        {isAuthenticated ? (
          hasUserReviewed ? (
            <p className="py-4 text-center text-gray-600">
              You have already reviewed this note.
            </p>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Your Rating
                </label>
                <InteractiveRatingStars
                  initialRating={userRating}
                  onRatingChange={setUserRating}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Your Review
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts about this note..."
                />
              </div>
              <Button
                type="submit"
                disabled={reviewLoading}
                className="w-full"
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
          )
        ) : (
          <p className="py-4 text-center text-gray-600">
            Please <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">log in</button> to write a review.
          </p>
        )}
      </div>

      {/* Reviews List */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="py-4 text-center text-gray-600">
            No reviews yet. Be the first to review this note!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const matchingComment = comments.find(
                comment => comment.user === review.user
              );
              return (
                <div key={review.id} className="p-6 mb-4 rounded-lg shadow-md bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 font-semibold text-white bg-blue-500 rounded-full">
                        {review.user_first_name 
                          ? review.user_first_name.charAt(0).toUpperCase() 
                          : (review.user_username 
                            ? review.user_username.charAt(0).toUpperCase() 
                            : '?')}
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">
                          {review.user_first_name && review.user_last_name 
                            ? `${review.user_first_name} ${review.user_last_name}`
                            : (review.user_username || 'Anonymous')}
                        </p>
                        <div className="flex flex-col">
                          {review.user_student_id && (
                            <span className="py-1 text-xs text-gray-600 bg-gray-100 rounded">
                              ID: {review.user_student_id}
                            </span>
                          )}
                          <p className="text-sm text-gray-500">
                            {format(new Date(review.created_at), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <RatingStars rating={review.stars} />
                  </div>
                  {matchingComment && (
                    <p className="mt-3 text-lg font-medium text-gray-700" >
                      {matchingComment.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetailsPage;