// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link ইম্পোর্ট করা হয়েছে
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { loginUser } from '../utils/api';
import AuthLayout from '../layouts/AuthLayout';

const LoginPage = () => {
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // UI Animation states
  const [animate, setAnimate] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    // Initial animation
    const timer = setTimeout(() => setAnimate(true), 200);

    // Check for remembered credentials
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const { username: savedUsername } = JSON.parse(rememberedUser);
        setUsername(savedUsername);
        setRememberMe(true);
      } catch (e) {
        localStorage.removeItem('rememberedUser');
      }
    }
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }
    setLoading(true);

    try {
      const response = await loginUser({ username, password });
      
      const { access, refresh } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Handle "Remember Me" functionality
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      toast.success('Login successful! Redirecting...');

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/'); // অথবা অন্য কোনো প্রোটেক্টেড রুটে
      }, 1000);

    } catch (err) {
      // API থেকে আসা এরর মেসেজ দেখানো হচ্ছে
      const errorMessage = err.response?.data?.detail || 
                           (err.response?.data?.non_field_errors?.[0]) ||
                           'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
  );

  return (
    <AuthLayout>
      <div className="relative w-full mt-20 rounded-4xl">
        {/* Floating Avatar Icon */}
        <div className="absolute z-20 transform -translate-x-1/2 -top-8 left-1/2">
          <div className={`transition-all duration-700 ease-out transform ${
            animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'
          }`}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full opacity-75 bg-gradient-to-r from-blue-400 to-purple-500 animate-ping"></div>
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Login Card */}
        <div className={`bg-[#d4e6f1] rounded-3xl px-16 pt-12 pb-12 shadow-2xl border border-white/20 transition-all duration-700 ease-out transform ${
          animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}>
          
          {/* Welcome Text */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">NOTEBANK</h1>
            <p className="text-gray-600">Sign in to your account</p>
           
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 pointer-events-none">
                <User className={`w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'username' ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                className={`w-full py-4 pl-12 pr-4 text-gray-700 placeholder-gray-400 transition-all duration-300 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transform ${
                  focusedField === 'username' ? 'scale-[1.02]' : ''
                }`}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`w-full py-4 pl-12 pr-12 text-gray-700 placeholder-gray-400 transition-all duration-300 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transform ${
                  focusedField === 'password' ? 'scale-[1.02]' : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

         
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-600 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm transition-colors duration-200 group-hover:text-gray-800">
                  Remember me
                </span>
              </label>
   
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold text-lg tracking-wide transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                  <span className="ml-3">SIGNING IN...</span>
                </div>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
        
              <Link to="/register" className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

