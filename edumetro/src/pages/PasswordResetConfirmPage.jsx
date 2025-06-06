// src/pages/PasswordResetConfirmPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Heading from '../components/Heading';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import api from '../utils/api';
import Logo from '../assets/images/image.png';

const PasswordResetConfirmPage = () => {
  const { uid64, token } = useParams(); // Get uid64 and token from URL parameters
  const navigate = useNavigate();
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (newPassword1 !== newPassword2) {
      setError("নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মেলেনি।");
      setLoading(false);
      return;
    }

    try {
      // API call for password reset confirmation (1.10 Password Reset Confirm)
      const response = await api.post(`/api/users/password-reset-confirm/${uid64}/${token}/`, {
        new_password1: newPassword1,
        new_password2: newPassword2,
      });
      setMessage(response.data.detail || "পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে।");
      setNewPassword1('');
      setNewPassword2('');
      // Redirect to login page after a short delay to show success message
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      console.error("Password reset confirm failed:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "রিসেট লিঙ্কটি অবৈধ বা মেয়াদোত্তীর্ণ। অনুগ্রহ করে একটি নতুন লিঙ্কের অনুরোধ করুন।");
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
          <Heading level="2" className="mt-6 mb-2 text-2xl font-semibold text-gray-800">
            পাসওয়ার্ড রিসেট করুন
          </Heading>
          <p className="text-gray-500 text-sm">
            আপনার নতুন পাসওয়ার্ড দিন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input
              icon="lock"
              type="password"
              placeholder="নতুন পাসওয়ার্ড"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required
            />
          </div>

          <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus-within:scale-[1.01]">
            <Input
              icon="lock"
              type="password"
              placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              className="shadow-sm border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
              required
            />
          </div>

          {message && <Message type="success" message={message} onClose={() => setMessage(null)} />}
          {error && <Message type="error" message={error} onClose={() => setError(null)} />}

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-2.5 text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:translate-y-0"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="small" className="mr-2" /> রিসেট করা হচ্ছে...
                </div>
              ) : (
                'পাসওয়ার্ড রিসেট করুন'
              )}
            </Button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">লগইন পেজে ফিরে যান</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default PasswordResetConfirmPage;