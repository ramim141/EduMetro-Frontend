// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // টোকেন লোকাল স্টোরেজ থেকে আনার ফাংশন
  const getTokens = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  }, []);

  // টোকেন লোকাল স্টোরেজে সেভ করার ফাংশন
  const setTokens = useCallback((access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }, []);

  // টোকেন লোকাল স্টোরেজ থেকে সরানোর ফাংশন (লগআউট)
  const clearTokens = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  // JWT ডিকোড করার সহজ ফাংশন (প্রোডাকশন অ্যাপ্লিকেশনে 'jwt-decode' লাইব্রেরি ব্যবহার করা ভালো)
  const decodeJwt = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding JWT:", e);
      return null;
    }
  }, []);

  // টোকেন মেয়াদোত্তীর্ণ হয়েছে কিনা চেক করার ফাংশন
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true; // যদি ডিকোড না হয় বা exp ফিল্ড না থাকে
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }, [decodeJwt]);

  // টোকেন রিফ্রেশ করার ফাংশন
  const refreshAuthToken = useCallback(async () => {
    const { refreshToken } = getTokens();
    if (!refreshToken || isTokenExpired(refreshToken)) {
      clearTokens();
      setLoading(false); // লোডিং শেষ
      return false; // বৈধ রিফ্রেশ টোকেন নেই
    }

    try {
      const response = await api.post('/api/users/token/refresh/', {
        refresh: refreshToken,
      });
      const { access } = response.data;
      setTokens(access, refreshToken); // নতুন এক্সেস টোকেন সেভ করো
      
      const decodedUser = decodeJwt(access); // নতুন টোকেন থেকে ইউজার তথ্য ডিকোড করো
      setUser(decodedUser); // ইউজার স্টেট আপডেট করো
      return true; // টোকেন সফলভাবে রিফ্রেশ হয়েছে
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens(); // ব্যর্থ হলে সব টোকেন সাফ করো
      setLoading(false); // লোডিং শেষ
      return false; // রিফ্রেশ ব্যর্থ হয়েছে
    }
  }, [getTokens, setTokens, clearTokens, isTokenExpired, decodeJwt]);

  // অ্যাপ লোড হওয়ার সময় প্রাথমিক অথেন্টিকেশন চেক
  useEffect(() => {
    const checkAuth = async () => {
      const { accessToken } = getTokens();
      if (accessToken && !isTokenExpired(accessToken)) {
        // এক্সেস টোকেন বৈধ, ইউজার সেট করো
        const decodedUser = decodeJwt(accessToken);
        setUser(decodedUser);
        setIsAuthenticated(true);
        setLoading(false);
      } else if (accessToken && isTokenExpired(accessToken)) {
        // এক্সেস টোকেন মেয়াদোত্তীর্ণ, রিফ্রেশ করার চেষ্টা করো
        const refreshed = await refreshAuthToken();
        if (!refreshed) {
          // রিফ্রেশও ব্যর্থ হলে, নিশ্চিত করো ইউজার লগআউট হয়েছে
          clearTokens();
          setLoading(false);
        } else {
          setLoading(false); // লোডিং শেষ
        }
      } else {
        setLoading(false); // কোনো টোকেন নেই, লোডিং শেষ
      }
    };
    checkAuth();

    // Axios Interceptor সেটআপ: টোকেন ম্যানেজমেন্ট এবং 401 এরর হ্যান্ডেলিং এর জন্য
    // এই ইন্টারসেপ্টরটি নিশ্চিত করে যে API রিকোয়েস্টগুলো লেটেস্ট টোকেন ব্যবহার করে
    // এবং 401 পেলে রিফ্রেশ টোকেন দিয়ে পুনরায় চেষ্টা করে।
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // যদি 401 Unauthorized হয়, এবং এটি রিফ্রেশ টোকেন রিকোয়েস্ট না হয়, এবং এটি একবার রিট্রাই হয়নি
        if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/users/token/refresh/') {
          originalRequest._retry = true; // রিট্রাই ফ্ল্যাগ সেট করো

          const { refreshToken } = getTokens(); // রিফ্রেশ টোকেন নাও

          if (refreshToken && !isTokenExpired(refreshToken)) {
            try {
              const res = await api.post('/api/users/token/refresh/', { refresh: refreshToken });
              const newAccessToken = res.data.access;
              setTokens(newAccessToken, refreshToken); // নতুন এক্সেস টোকেন সেভ করো

              const decodedUser = decodeJwt(newAccessToken);
              setUser(decodedUser); // ইউজার স্টেট আপডেট করো

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // পুরনো রিক্যারস্টে নতুন টোকেন যোগ করো
              return api(originalRequest); // পুরনো রিক্যারস্টটি আবার পাঠাও
            } catch (err) {
              console.error('Refresh token failed in interceptor:', err);
              clearTokens(); // রিফ্রেশ ব্যর্থ হলে সব টোকেন সাফ করো
              navigate('/login'); // লগইন পেজে রিডাইরেক্ট করো
              return Promise.reject(err);
            }
          } else {
            // রিফ্রেশ টোকেন না থাকলে বা মেয়াদোত্তীর্ণ হলে সরাসরি লগইন পেজে
            clearTokens();
            navigate('/login');
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    // কম্পোনেন্ট আনমাউন্ট হলে ইন্টারসেপ্টর সাফ করো (গুরুত্বপূর্ণ, যাতে ডুপ্লিকেট ইন্টারসেপ্টর তৈরি না হয়)
    return () => {
      api.interceptors.response.eject(interceptor);
    };

  }, [getTokens, setTokens, clearTokens, isTokenExpired, refreshAuthToken, decodeJwt, navigate]); // useEffect ডিপেন্ডেন্সি

  // লগইন ফাংশন
  const login = useCallback(async (username, password) => {
    const response = await api.post('/api/users/login/', { username, password });
    const { access, refresh } = response.data;
    setTokens(access, refresh); // টোকেন সেভ করো
    setIsAuthenticated(true); // প্রমাণীকরণ সফল
    
    // Fetch user profile data
    try {
      const profileResponse = await api.get('/api/users/profile/');
      setUser(profileResponse.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      const decodedUser = decodeJwt(access);
      setUser(decodedUser);
    }
    
    navigate('/'); // সফল লগইনের পর হোমপেজে রিডাইরেক্ট
  }, [setTokens, decodeJwt, navigate]);

  // লগআউট ফাংশন
  const logout = useCallback(async () => {
    const { refreshToken } = getTokens();
    if (refreshToken) {
      try {
        // ব্যাকএন্ডে লগআউট API কল করো যাতে রিফ্রেশ টোকেন ব্ল্যাকলিস্ট হয়
        await api.post('/api/users/logout/', { refresh: refreshToken });
      } catch (e) {
        console.warn('Logout API call failed, but clearing tokens anyway:', e);
      }
    }
    clearTokens(); // টোকেন সাফ করো
    setIsAuthenticated(false); // প্রমাণীকরণ ব্যর্থ
    navigate('/login'); // লগইন পেজে রিডাইরেক্ট করো
  }, [clearTokens, navigate, getTokens]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setIsAuthenticated(true);
        try {
          const profileResponse = await api.get('/api/users/profile/');
          console.log('AuthContext: Fetched user profile data on mount:', profileResponse.data); // Log fetched data on mount
          setUser(profileResponse.data);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setUser({ username: 'user' }); // Fallback for development
        }
      }
      setLoading(false);
    };
    
    checkAuthAndFetchProfile();
  }, []);

  // Function to fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    try {
      const profileResponse = await api.get('/api/users/profile/');
      console.log('AuthContext: Fetched user profile data:', profileResponse.data); // Log fetched data
      setUser(profileResponse.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile during refresh:', error);
      // If fetching profile fails, clear tokens and set user to null
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [clearTokens, setUser, setIsAuthenticated]);

  const authContextData = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    fetchUserProfile, // Expose the new function
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context as default
export default AuthContext;