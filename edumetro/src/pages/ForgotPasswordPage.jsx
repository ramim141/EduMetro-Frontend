// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Heading from '../components/Heading';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import api from '../utils/api';
import { FaEnvelope, FaArrowLeft, FaKey } from 'react-icons/fa';
import Logo from '../assets/images/image.png';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [iconAnimate, setIconAnimate] = useState(false);

  useEffect(() => {
    // Stagger animations for better visual effect
    const timer1 = setTimeout(() => setAnimate(true), 100);
    const timer2 = setTimeout(() => setIconAnimate(true), 300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await api.post('/api/users/password-reset/', { email });
      setMessage(
        response.data.detail ||
          "If an account with that email exists, a password reset email has been sent. Please check your inbox."
      );
      setEmail('');
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative max-w-md mx-auto">
        {/* Floating Key Icon */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className={`transition-all duration-700 ease-out transform ${
            iconAnimate ? 'translate-y-0 opacity-100 scale-100 rotate-0' : 'translate-y-4 opacity-0 scale-90 rotate-12'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <FaKey className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-700 ease-out transform ${
          animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
        }`}>
          
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 pt-16 pb-8">
            <div className="text-center text-white">
             
              
              {/* Brand Name */}
              <div className={`mb-6 transition-all duration-500 delay-300 ${
                animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <p className="text-white/90 text-lg font-bold tracking-widest uppercase">
                  Note Bank
                </p>
              </div>

              {/* Title & Description */}
              <div className={`transition-all duration-500 delay-400 ${
                animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <h2 className="text-2xl font-bold mb-3">Reset Password</h2>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Enter your email address and we'll send you a secure link to reset your password
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className={`space-y-2 transition-all duration-500 delay-500 ${
                animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <label className="text-sm font-medium text-gray-700 block">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your registered email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Success/Error Messages */}
              <div className={`transition-all duration-300 ${
                (message || error) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                {message && (
                  <div className="animate-fadeIn">
                    <Message 
                      type="success" 
                      message={message} 
                      onClose={() => setMessage(null)} 
                    />
                  </div>
                )}
                {error && (
                  <div className="animate-shake">
                    <Message 
                      type="error" 
                      message={error} 
                      onClose={() => setError(null)} 
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className={`pt-2 transition-all duration-500 delay-600 ${
                animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-lg font-semibold tracking-wide transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <span className="relative z-10">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        <span>Sending reset link...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaEnvelope className="mr-2 text-sm" />
                        Send Reset Link
                      </div>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className={`text-center transition-all duration-500 delay-700 ${
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200 group"
              >
                <FaArrowLeft className="mr-2 text-xs group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Login
              </Link>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-300 rounded-full opacity-15 blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Animated Particles */}
        <div className="absolute top-1/4 right-8 w-2 h-2 bg-indigo-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-3/4 right-16 w-1 h-1 bg-indigo-300 rounded-full opacity-50 animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;