// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // আপনার Axios instance

// Create the AuthContext
const AuthContext = createContext(null);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // Use a single state for authentication status to manage loading and user data
  const [authState, setAuthState] = useState({
    user: null, // Full user profile object
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true, // Initial loading state for auth check
  });

  const navigate = useNavigate();

  // Helper to update tokens in localStorage and state
  const setTokens = useCallback((access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setAuthState((prev) => ({ ...prev, accessToken: access, refreshToken: refresh, isAuthenticated: !!access }));
  }, []);

  // Helper to clear tokens from localStorage and state
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

  // Fetch user profile data from backend
  const fetchUserProfile = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await api.get("/api/users/profile/"); // ✅ ব্যাকএন্ড থেকে পুরো প্রোফাইল ডেটা আনুন
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
      // If profile fetch fails, it means token is invalid or user doesn't exist
      clearTokens(); // Clear session
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      navigate("/login"); // Navigate to login only if profile fetch fails
      return Promise.reject(error);
    }
  }, [clearTokens, navigate]); // fetchUserProfile now depends on navigate

  // Login function
  const login = useCallback(
    async (username, password) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await api.post("/api/users/login/", { username, password });
        const { access, refresh } = response.data;
        setTokens(access, refresh); // Save tokens and update state

        // ✅ সফল লগইনের পর, পুরো প্রোফাইল ডেটা ফেচ করুন
        await fetchUserProfile(); // Profile will be fetched and state updated here

        navigate("/dashboard"); // Successful login, navigate to dashboard
        return response.data;
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.response?.data?.detail || "Login failed!",
          isAuthenticated: false,
        }));
        clearTokens(); // Clear tokens if login fails
        return Promise.reject(error);
      }
    },
    [setTokens, fetchUserProfile, navigate, clearTokens],
  );

  // Logout function
  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const currentRefreshToken = localStorage.getItem("refreshToken"); // Get current refresh token for logout API
    if (currentRefreshToken) {
      try {
        await api.post("/api/users/logout/", { refresh: currentRefreshToken });
      } catch (e) {
        console.warn("Logout API call failed, but clearing tokens anyway:", e);
      }
    }
    clearTokens(); // Clear tokens and state
    setAuthState((prev) => ({ ...prev, isLoading: false }));
    navigate("/login"); // Navigate to login page after logout
  }, [clearTokens, navigate]);

  // Initial authentication check on component mount (replaces duplicate useEffects)
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedAccessToken && storedRefreshToken) {
        // If tokens exist, set them in state and then try to fetch profile
        setAuthState(prev => ({ ...prev, accessToken: storedAccessToken, refreshToken: storedRefreshToken, isAuthenticated: true }));
        await fetchUserProfile(); // ✅ Fetch profile data on initial load
      } else {
        // No tokens, so not authenticated
        clearTokens(); // Ensure everything is clean
        setAuthState(prev => ({ ...prev, isLoading: false })); // End loading
      }
    };

    checkAuthAndLoadProfile();

    // ✅ IMPORTANT: Axios Interceptor এখানে সেট করবেন না। এটি api.js ফাইলের ভেতরেই রাখুন।
    // ইন্টারসেপ্টর শুধুমাত্র একবার সেট করা উচিত, কম্পোনেন্ট মাউন্ট/আনমাউন্ট হওয়ার সাথে সাথে নয়।
    // api.js ফাইলটি নিজেই ইন্টারসেপ্টর সেট করবে।
  }, [fetchUserProfile, clearTokens]); // useEffect dependencies

  const authContextData = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    // fetchUserProfile is now called internally within login and initial check
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {authState.isLoading ? ( // Show a loading spinner during initial authentication check
        <div className="flex items-center justify-center min-h-screen">
          {/* Replace with your actual LoadingSpinner component */}
          <p>Loading Authentication...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Export the context as default (if you consume it via default import)
export default AuthContext;

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};