// src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import AuthLayout from '../layouts/AuthLayout';
import Heading from '../components/Heading';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../assets/images/image.png';
import { registerUser } from '../utils/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // ✅ উন্নত handleSubmit ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---- ১. পাসওয়ার্ড ম্যাচ না করলে মেসেজ ----
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      
      // ---- ২. সফলভাবে রেজিস্টার হলে মেসেজ ----
      toast.success(
        'Registration successful! Please check your email to verify your account.', 
        { duration: 6000 } // এই মেসেজটি ৬ সেকেন্ড থাকবে
      );
      
      setTimeout(() => {
        navigate('/login');
      }, 6000);

    } catch (err) {
      // ---- ৩. ব্যাকএন্ড থেকে আসা সব ধরনের এরর মেসেজ ----
      if (err.response && err.response.data) {
        console.error("API Error Response:", err.response.data);
        const errors = err.response.data;

        if (typeof errors === 'object' && errors !== null) {
          // সাধারণ ফিল্ড এরর (username, email, password)
          Object.keys(errors).forEach(key => {
            // যেমন: "username already exists", "password is too common"
            const userFriendlyKey = key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
            const errorMessage = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
            toast.error(`${userFriendlyKey}: ${errorMessage}`);
          });
        } else {
          // অন্যান্য এরর
          toast.error('An unexpected error occurred. Please try again.');
        }
      } else {
        // নেটওয়ার্ক বা অন্য কোনো এরর
        toast.error('Registration failed. Please check your network and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
     <div className="w-full max-w-2xl p-8 mx-auto my-12 bg-white border shadow-lg rounded-2xl shadow-emerald-500/10">
       <div className={`transition-all duration-500 ease-in-out transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="mb-6 text-center">
          <div className="flex flex-col items-center mt-6">
            <img src={Logo} alt="Logo" className="h-[100px] mb-4 animate-pulse" />
          </div>
          <Heading gradient>Create An Account</Heading>
          <p className="mt-2 text-gray-500">Join our community and start learning</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2"> 
            <div>
              <Input 
                icon="user" type="text" placeholder="First name"
                name="firstName" value={formData.firstName} onChange={handleInputChange} required 
              />
            </div>
            <div>
              <Input 
                icon="user" type="text" placeholder="Last name"
                name="lastName" value={formData.lastName} onChange={handleInputChange} required 
              />
            </div>
          </div>
          
          <div>
            <Input 
              icon="user" type="text" placeholder="Username"
              name="username" value={formData.username} onChange={handleInputChange} required 
            />
          </div>
          
          <div>
            <Input 
              icon="envelope" type="email" placeholder="Email address"
              name="email" value={formData.email} onChange={handleInputChange} required 
            />
          </div>
          
          <div>
            <Input 
              icon="idcard" type="text" placeholder="Student ID (e.g., 222-115-141)"
              name="studentId" value={formData.studentId} onChange={handleInputChange} required 
            />
          </div>
          
          <div>
            <Input 
              icon="lock" type="password" placeholder="Password"
              name="password" value={formData.password} onChange={handleInputChange} required 
            />
          </div>
          
          <div>
            <Input 
              icon="lock" type="password" placeholder="Confirm Password"
              name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required 
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" variant="success" disabled={loading}
              className="w-full py-3 text-sm font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-3 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
  
          <p className="mt-6 text-center text-gray-600">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-800">Login</Link>
          </p>
        </form>
      </div>
     </div>
    </AuthLayout>
  );
};

export default RegisterPage;