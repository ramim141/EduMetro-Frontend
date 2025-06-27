// src/context/AuthContext.jsx (Corrected)

import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Spinner from '../components/ui/Spinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Helper to set tokens and user state
  const setTokensAndUser = useCallback((access, refresh, userData) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`; // ✅ Set default header for future requests
    setUser(userData);
    setIsAuthenticated(!!access);
  }, []);

  // Helper to clear all auth data
  const clearAuth = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common['Authorization']; // ✅ Clear default header
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Login function
  const login = useCallback(
    async (username, password) => {
      try {
        const response = await api.post("/api/users/login/", { username, password });
        const { access, refresh, user: userData } = response.data;
        setTokensAndUser(access, refresh, userData);
        navigate("/");
        return response.data;
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        clearAuth();
        throw error;
      }
    },
    [setTokensAndUser, clearAuth, navigate]
  );

  // Logout function
  const logout = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    if (currentRefreshToken) {
      try {
        // We don't care about the response, just try to invalidate the token on the server
        await api.post("/api/users/logout/", { refresh: currentRefreshToken });
      } catch (e) {
        console.warn("Server logout failed, clearing tokens locally anyway.", e);
      }
    }
    clearAuth();
    navigate("/login");
  }, [clearAuth, navigate]);

  // Function to manually refresh profile info
  const fetchUserProfile = useCallback(async () => {
    try {
        const response = await api.get("/api/users/profile/");
        setUser(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to refresh user profile.", error);
        // Let the interceptor handle logout if it's a 401
        throw error;
    }
  }, []);


  // This effect runs only once on app load to check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsLoading(false);
        return; // No token, definitely not logged in.
      }

      try {
        // If a token exists, try to fetch the user's profile.
        // The api.js interceptor will automatically handle token refreshing if needed.
        const response = await api.get("/api/users/profile/");
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // If fetching the profile fails (even after a refresh attempt),
        // the interceptor will have already initiated a logout.
        // We just clear the state here as a final cleanup.
        console.error("Initial auth check failed, state is being cleared.", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // This should only run once. clearAuth is stable due to useCallback.

  // Show a loading screen while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
        <div className="text-center">
            <Spinner size="xl" color="indigo" />
            <p className="mt-4 text-lg font-semibold text-gray-700">Authenticating...</p>
        </div>
      </div>
    );
  }

  const authContextValue = {
    user,
    isAuthenticated,
    isLoading: isLoading, // Expose loading state
    login,
    logout,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};