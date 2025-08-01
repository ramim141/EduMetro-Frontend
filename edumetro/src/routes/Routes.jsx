// src/routes/Routes.jsx (Updated)

import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Import all page components
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NoteListPage from '../pages/NoteListPage'; 
import AboutPage from '../pages/AboutPage';
import DashboardPage from '../pages/DashboardPage';
import MyNotesPage from '../pages/MyNotesPage';
import BookmarksPage from '../pages/BookmarksPage';
import NotificationsPage from '../pages/NotificationsPage';
import ProfilePage from '../pages/ProfilePage';
import EditProfilePage from '../pages/EditProfilePage';
import PasswordChangePage from '../pages/PasswordChangePage';
import UploadNotePage from '../pages/UploadNotePage'; 
import NoteDetailsPage from '../pages/NoteDetailsPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import PasswordResetConfirmPage from '../pages/PasswordResetConfirmPage';
import ContributorsPage from '../pages/ContributorsPage';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-700">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 404 Page Component
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
    <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
    <div className="flex mt-6 space-x-4">
      <Link 
        to="/" 
        className="px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Go to Home
      </Link>
      <Link 
        to="/note" 
        className="px-4 py-2 text-blue-600 transition-colors duration-200 border border-blue-600 rounded-md hover:bg-blue-50"
      >
        Browse Notes
      </Link>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/" element={<HomePage />} />
      {/* New Public Routes for Password Management */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
      <Route path="/reset-password/:uid64/:token/" element={<PasswordResetConfirmPage />} /> 
      <Route path="/contributors" element={<ContributorsPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/my-notes" element={<ProtectedRoute><MyNotesPage /></ProtectedRoute>} />
      <Route path="/note" element={<NoteListPage />} />
      <Route path="/notes/:id" element={<NoteDetailsPage />} />
      <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      
      {/* Profile Related Routes */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><PasswordChangePage /></ProtectedRoute>} />
      <Route path="/upload-note" element={<ProtectedRoute><UploadNotePage /></ProtectedRoute>} />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;