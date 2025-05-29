// src/pages/LoginPage.jsx (Updated)

import React, { useState, useContext, useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Heading from '../components/Heading';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import AuthContext from '../context/AuthContext';
import Logo from '../assets/images/image.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  const { login } = useContext(AuthContext);

  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={`transition-all duration-500 ease-in-out transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center">
            <img src={Logo} alt="EduMetro Logo" className="h-[100px] mb-4" />
          
          </div>
          <p className="text-gray-500 mt-2 text-2xl uppercase font-bold">Note Bank</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input
              icon="user"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required
            />
          </div>
          
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input
              icon="lock"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required
            />
          </div>
          
          {error && <Message type="error" message={error} onClose={() => setError(null)} />}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full py-2.5 text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:translate-y-0" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="small" className="mr-2" /> Logging in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
          
          {/* <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors duration-200">
                Remember me
              </label>
            </div>
            <div>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium">Forgot password?</a>
            </div>
          </div> */}
          
          {/* <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500">Or continue with</span>
            </div>
          </div>
           */}
          {/* <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <svg className="h-5 w-5 mr-2" fill="#4285F4" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              Google
            </button>
            <button type="button" className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div> */}
          
          <p className="mt-6 text-center text-gray-600">
            Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">Register now</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;