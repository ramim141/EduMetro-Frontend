// src/pages/LoginPage.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import AuthContext from '../context/AuthContext';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Trigger the entry animation when the component mounts
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      // If login is successful, AuthContext will handle navigation
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full max-w-sm mx-auto">
        {/* Floating Avatar Icon */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className={`transition-all duration-700 ease-out transform ${
            animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'
          }`}>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* Main Login Card */}
        <div className={`bg-white rounded-3xl  p-8 pt-16 transition-all duration-700 ease-out transform ${
          animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 animate-shake">
              <Message 
                type="error" 
                message={error} 
                onClose={() => setError(null)} 
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaUser className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 transition-all duration-200"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 transition-all duration-200"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm mt-6">
              <label className="flex items-center cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-gray-600 focus:ring-0 border-gray-400 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 italic"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
  <button
    type="submit"
    disabled={loading} // loading true হলে বাটন disabled হবে
    className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full font-medium text-lg tracking-wide transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none uppercase"
  >
    {loading ? ( // যখন loading true, তখন স্পিনার এবং "LOGGING IN..." দেখাবে
      <div className="flex items-center justify-center">
        <Spinner size="small" className="mr-2" />
        <span>LOGGING IN...</span>
      </div>
    ) : ( // অন্যথায়, "LOGIN" দেখাবে
      'LOGIN'
    )}
  </button>
</div>
          </form>

          {/* Register Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;