// src/pages/RegisterPage.jsx (Updated)

import React, { useState, useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Heading from '../components/Heading';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/image.png';

const RegisterPage = () => {
  const [animate, setAnimate] = useState(false);
  
  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <AuthLayout>
      <div className={`transition-all duration-500 ease-in-out transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="mb-6 text-center">
          <div className="flex flex-col items-center">
            <img src={Logo} alt="EduMetro Logo" className="h-[100px] mb-4 animate-pulse" />
          </div>
          <Heading gradient>Create An Account</Heading>
          <p className="text-gray-500 mt-2">Join our community and start learning</p>
        </div>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
            <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
              <Input 
                icon="user" 
                type="text" 
                placeholder="First name" 
                className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
                required 
              />
            </div>
            <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
              <Input 
                icon="user" 
                type="text" 
                placeholder="Last name" 
                className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
                required 
              />
            </div>
          </div>
          
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input 
              icon="user" 
              type="text" 
              placeholder="Username" 
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required 
            />
          </div>
          
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input 
              icon="envelope" 
              type="email" 
              placeholder="Email address" 
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required 
            />
          </div>
          
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input 
              icon="idcard" 
              type="text" 
              placeholder="Student ID (222-115-141)" 
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required 
            />
          </div>
          
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input 
              icon="lock" 
              type="password" 
              placeholder="Password" 
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required 
            />
          </div>
          
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input 
              icon="lock" 
              type="password" 
              placeholder="Confirm Password" 
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required 
            />
          </div>
          
          <div className="pt-2">
            <Button 
              variant="success" 
              className="w-full py-2.5 text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:translate-y-0"
            >
              Create Account
            </Button>
          </div>
          
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500">Or sign up with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          
          <p className="mt-6 text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">Login</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
