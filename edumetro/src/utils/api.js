// src/utils/api.js (Corrected)

import axios from "axios";
import { toast } from 'react-hot-toast';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || "https://edumetro.onrender.com";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Create a centralized function to handle forced logout
const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Redirect to login page to force a clean state
  window.location.href = '/login'; 
  toast.error("Your session has expired. Please log in again.");
};

// ✅ Simplified the refresh function. It just tries to get a token or fails.
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    // If there's no refresh token, we can't refresh. Reject immediately.
    return Promise.reject(new Error("No refresh token available."));
  }

  const response = await api.post("/api/users/token/refresh/", {
    refresh: refreshToken,
  });

  const { access } = response.data;
  localStorage.setItem("accessToken", access);
  return access;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401, ensure it's not a retry, and not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        // ✅ This is the crucial part. If refreshAccessToken fails, logout.
        processQueue(refreshError, null);
        logoutUser(); // Force logout and redirect
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("API Response Error:", error.message);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);


// --- The rest of your API functions remain the same ---

export const loginUser = async (credentials) => {
  return api.post('/api/users/login/', credentials);
};

export const getUserProfile = async () => {
  return api.get('/api/users/profile/');
};

export const getDepartments = async () => {
  return api.get('/api/notes/departments/');
};

export const getCourses = async (departmentId = null) => {
  let url = '/api/notes/courses/';
  if (departmentId) {
    url += `?department=${departmentId}`;
  }
  return api.get(url);
};

export const getNoteCategories = async () => {
  return api.get('/api/notes/categories/');
};

export const getMyNotes = async (params = {}) => {
  return api.get('/api/notes/my-notes/', { params });
}

export const getBookmarkedNotes = async (params = {}) => {
  return api.get('/api/users/user-activity/bookmarked-notes/', { params });
};

export const registerUser = async (userData) => {
  const formattedData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    username: userData.username,
    email: userData.email,
    student_id: userData.studentId,
    password: userData.password,
    password2: userData.confirmPassword,
    batch: userData.batch,
    section: userData.section, 
  };
  return api.post('/api/users/register/', formattedData);
};


export const getSiteStats = async () => {
  return api.get('/api/users/site-stats/'); 
};

export const createNoteRequest = async (requestData) => {
  return api.post('/api/notes/note-requests/', requestData);
};

export default api;