// src/context/AuthContext.jsx (Updated & Corrected)

import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Spinner from '../components/ui/Spinner'; // একটি সুন্দর লোডিং স্পিনারের জন্য

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ শুধুমাত্র প্রাথমিক লোডিং এর জন্য

  const navigate = useNavigate();

  // টোকেন সেট করার ফাংশন
  const setTokensAndUser = useCallback((access, refresh, userData) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setUser(userData);
    setIsAuthenticated(!!access);
  }, []);

  // টোকেন এবং ইউজার স্টেট ক্লিয়ার করার ফাংশন
  const clearAuth = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ✅ লগইন ফাংশন (আপডেট করা হয়েছে)
  const login = useCallback(
    async (username, password) => {
      try {
        const response = await api.post("/api/users/login/", { username, password });
        const { access, refresh, user: userData } = response.data; // ব্যাকএন্ড থেকে user ডেটা নিন
        setTokensAndUser(access, refresh, userData);
        navigate("/dashboard"); // বা যেখানে পাঠাতে চান
        return response.data;
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        clearAuth();
        throw error; // এররটি LoginPage-এ হ্যান্ডেল করার জন্য re-throw করুন
      }
    },
    [setTokensAndUser, clearAuth, navigate]
  );

  // ✅ লগআউট ফাংশন (আপডেট করা হয়েছে)
  const logout = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    if (currentRefreshToken) {
      try {
        await api.post("/api/users/logout/", { refresh: currentRefreshToken });
      } catch (e) {
        console.warn("Logout API call failed, but clearing tokens locally:", e);
      }
    }
    clearAuth();
    navigate("/login");
  }, [clearAuth, navigate]);

  // ✅ প্রোফাইল রিফ্রেশ করার জন্য আলাদা ফাংশন (ঐচ্ছিক কিন্তু কাজের)
  const fetchUserProfile = useCallback(async () => {
    try {
        const response = await api.get("/api/users/profile/");
        setUser(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to refresh user profile, logging out.", error);
        logout(); // প্রোফাইল ফেচ ব্যর্থ হলে লগআউট
    }
  }, [logout]);


  // ✅ শুধুমাত্র একবার চলবে, অ্যাপ লোড হওয়ার সময়
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        // টোকেন থাকলে, প্রোফাইল ফেচ করার চেষ্টা করা হবে
        const response = await api.get("/api/users/profile/");
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // টোকেন অবৈধ হলে বা অন্য কোনো সমস্যা হলে
        console.error("Initial auth check failed:", error);
        clearAuth();
      } finally {
        // সবশেষে প্রাথমিক লোডিং শেষ হবে
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [clearAuth]); // clearAuth এখানে থাকা নিরাপদ

  // প্রাথমিক লোডিং স্ক্রিন
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
        <div className="text-center">
            <Spinner size="xl" color="indigo" />
            <p className="mt-4 text-lg font-semibold text-gray-700">Loading Authentication...</p>
        </div>
      </div>
    );
  }

  const authContextValue = {
    user,
    isAuthenticated,
    isLoading, // যদিও এটি এখন false থাকবে, তাও এক্সপোজ করা ভালো
    login,
    logout,
    fetchUserProfile, // প্রোফাইল ম্যানুয়ালি রিফ্রেশ করার জন্য
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// AuthContext ব্যবহার করার জন্য কাস্টম হুক
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};