// START OF FILE AuthContext.jsx
// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // নিশ্চিত করুন এই Axios instanceটি সঠিকভাবে JWT এর জন্য কনফিগার করা হয়েছে

// AuthContext তৈরি করুন
const AuthContext = createContext(null);

// AuthProvider কম্পোনেন্ট তৈরি করুন
export const AuthProvider = ({ children }) => {
  // Authentication স্থিতি এবং ব্যবহারকারীর ডেটা পরিচালনার জন্য একটি একক স্টেট ব্যবহার করুন
  const [authState, setAuthState] = useState({
    user: null, // ব্যাকএন্ড থেকে পুরো ব্যবহারকারী প্রোফাইল অবজেক্ট
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true, // প্রাথমিক অথেন্টিকেশন চেকের জন্য লোডিং স্থিতি
  });

  const navigate = useNavigate();

  // localStorage এবং স্টেটে টোকেন আপডেট করার জন্য হেল্পার
  const setTokens = useCallback((access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setAuthState((prev) => ({ ...prev, accessToken: access, refreshToken: refresh, isAuthenticated: !!access }));
  }, []);

  // localStorage এবং স্টেট থেকে টোকেন পরিষ্কার করার জন্য হেল্পার
  const clearTokens = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthState((prev) => ({
      ...prev,
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }));
  }, []);

  // ব্যাকএন্ড থেকে ব্যবহারকারী প্রোফাইল ডেটা ফেচ করুন
  const fetchUserProfile = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await api.get("/api/users/profile/"); // ✅ প্রকৃত API কল
      console.log("AuthContext: Fetched user profile data:", response.data);
      setAuthState((prev) => ({
        ...prev,
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error.response?.data || error.message);
      clearTokens(); // প্রোফাইল ফেচ ব্যর্থ হলে সেশন পরিষ্কার করুন (যেমন, টোকেন মেয়াদোত্তীর্ণ, অবৈধ)
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      navigate("/login");
      return Promise.reject(error);
    }
  }, [clearTokens, navigate]);

  // লগইন ফাংশন
  const login = useCallback(
    async (username, password) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await api.post("/api/users/login/", { username, password }); // ✅ প্রকৃত API কল
        const { access, refresh } = response.data;
        setTokens(access, refresh); // টোকেন সংরক্ষণ এবং স্টেট আপডেট করুন

        // সফল লগইনের পর, অবিলম্বে পুরো ব্যবহারকারী প্রোফাইল ফেচ করুন
        await fetchUserProfile();

        navigate("/dashboard"); // সফল লগইন, ড্যাশবোর্ডে নেভিগেট করুন (প্রয়োজন অনুযায়ী অ্যাডজাস্ট করুন)
        return response.data;
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.response?.data?.detail || "Login failed!",
          isAuthenticated: false,
        }));
        clearTokens(); // লগইন ব্যর্থ হলে টোকেন পরিষ্কার করুন
        return Promise.reject(error);
      }
    },
    [setTokens, fetchUserProfile, navigate, clearTokens],
  );

  // লগআউট ফাংশন
  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const currentRefreshToken = localStorage.getItem("refreshToken"); // লগআউট API এর জন্য বর্তমান রিফ্রেশ টোকেন নিন
    if (currentRefreshToken) {
      try {
        await api.post("/api/users/logout/", { refresh: currentRefreshToken }); // ঐচ্ছিকভাবে লগআউট API কল করুন
      } catch (e) {
        console.warn("Logout API call failed, but clearing tokens anyway:", e);
      }
    }
    clearTokens(); // টোকেন এবং স্টেট পরিষ্কার করুন
    setAuthState((prev) => ({ ...prev, isLoading: false }));
    navigate("/login"); // লগআউটের পর লগইন পেজে নেভিগেট করুন
  }, [clearTokens, navigate]);

  // কম্পোনেন্ট মাউন্ট হওয়ার সময় প্রাথমিক অথেন্টিকেশন চেক
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedAccessToken && storedRefreshToken) {
        // যদি টোকেন থাকে, তাহলে স্টেটে সেট করুন এবং প্রোফাইল ফেচ করার চেষ্টা করুন
        setAuthState(prev => ({ ...prev, accessToken: storedAccessToken, refreshToken: storedRefreshToken, isAuthenticated: true }));
        await fetchUserProfile(); // প্রাথমিক লোডে প্রোফাইল ডেটা ফেচ করুন
      } else {
        // কোনো টোকেন নেই, তাই অথেন্টিকেটেড নয়
        clearTokens(); // সবকিছু পরিষ্কার আছে তা নিশ্চিত করুন
        setAuthState(prev => ({ ...prev, isLoading: false })); // লোডিং শেষ করুন
      }
    };

    checkAuthAndLoadProfile();

    // Axios ইন্টারসেপ্টর টোকেন রিফ্রেশ করার জন্য `api.js` এ একবার সেট করা উচিত,
    // React কম্পোনেন্টের মধ্যে নয় যাতে বারবার রেজিস্ট্রিং সমস্যা এড়ানো যায়।
  }, [fetchUserProfile, clearTokens]);

  const authContextData = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    fetchUserProfile, // ✅ fetchUserProfile কে এখানে এক্সপোজ করা হলো
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {authState.isLoading ? ( // প্রাথমিক অথেন্টিকেশন চেকের সময় একটি লোডিং স্পিনার দেখান
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br via-blue-50 to-indigo-50 from-slate-50">
          <p className="text-xl font-semibold text-slate-700">Loading Authentication...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// AuthContext কে ডিফল্ট এক্সপোর্ট করুন
export default AuthContext;

// AuthContext ব্যবহার করার জন্য কাস্টম হুক
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// END OF FILE AuthContext.jsx