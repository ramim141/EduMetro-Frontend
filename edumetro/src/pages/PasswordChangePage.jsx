// src/pages/PasswordChangePage.jsx

import React, { useState, useContext } from 'react';
import AuthLayout from '../layouts/AuthLayout'; // Layout এর জন্য
import Input from '../components/Input';
import Button from '../components/Button';
import Heading from '../components/Heading';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import api from '../utils/api'; // API কল করার জন্য
import AuthContext from '../context/AuthContext'; // লগআউট এর জন্য (যদি পাসওয়ার্ড চেঞ্জের পর লগআউট করতে চাও)

const PasswordChangePage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { logout } = useContext(AuthContext); // লগআউট ফাংশন, পাসওয়ার্ড চেঞ্জের পর ব্যবহার করতে পারো

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm new password do not match.');
      return;
    }

    if (newPassword.length < 8) { // পাসওয়ার্ডের ন্যূনতম দৈর্ঘ্য, তোমার ব্যাকএন্ড অনুযায়ী পরিবর্তন করতে পারো
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/users/set_password/', {
        current_password: currentPassword,
        new_password: newPassword,
        re_new_password: confirmNewPassword, // অথবা re_new_password_confirm, তোমার ব্যাকএন্ড অনুযায়ী
      });

      console.log('Password change successful:', response.data);
      setSuccessMessage('Password changed successfully! You will be logged out.');
      
      // পাসওয়ার্ড পরিবর্তনের পর ইউজারকে লগআউট করা একটি ভালো সিকিউরিটি প্র্যাকটিস
      setTimeout(() => {
        logout(); // AuthContext এর logout ফাংশন কল করো
      }, 2000); // 2 সেকেন্ড পর লগআউট

    } catch (err) {
      console.error('Password change error:', err.response ? err.response.data : err.message);
      let errorMessage = 'Failed to change password. Please check your current password.';

      if (err.response && err.response.data) {
        // DRF-এর এরর প্যাটার্ন (সাধারণত 'current_password' বা 'new_password' এর জন্য এরর)
        if (err.response.data.current_password) {
          errorMessage = `Current password: ${err.response.data.current_password.join(' ')}`;
        } else if (err.response.data.new_password) {
          errorMessage = `New password: ${err.response.data.new_password.join(' ')}`;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else {
          errorMessage = Object.values(err.response.data).flat().join(' '); // অন্যান্য এরর একত্রিত করা
        }
      }
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Heading>Change Password</Heading>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <Input
          icon="lock"
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          icon="lock"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          icon="lock"
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />        {error && <Message type="error" message={error} onClose={() => setError(null)} duration={5000} />}
        {successMessage && <Message type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner className="mr-2" /> Changing Password...
            </div>
          ) : (
            'Change Password'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default PasswordChangePage;