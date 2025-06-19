// src/utils/api.js

import axios from "axios";
import { toast } from 'react-hot-toast';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
});

// ... আপনার সম্পূর্ণ ইন্টারসেপ্টর এবং টোকেন রিফ্রেশ কোড এখানে অপরিবর্তিত থাকবে ...
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

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found.");
    }
    const response = await axios.post(`${BASE_API_URL}/api/users/token/refresh/`, {
      refresh: refreshToken,
    });
    const { access } = response.data;
    localStorage.setItem("accessToken", access);
    return access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.error("Your session has expired. Please log in again.");
    return Promise.reject(error);
  }
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

    if (
      error.response?.status === 401 &&
      originalRequest.url !== `${BASE_API_URL}/api/users/token/refresh/` &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
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
// --- ইন্টারসেপ্টর কোড শেষ ---

// =======================================================
//                API Function Exports
// =======================================================

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


// ✅ নতুন ফাংশন: ইউজারের আপলোড করা নোটগুলো পাওয়ার জন্য
// ড্যাশবোর্ডে stat গণনার জন্য এটি প্রয়োজন
export const getMyNotes = async (params = {}) => {
  return api.get('/api/notes/my-notes/', { params });
}


// ✅ আপডেট করা ফাংশন: বুকমার্ক করা নোটগুলো ফেচ করার জন্য
// এটি এখন পেজিনেশন প্যারামিটার (যেমন, page, page_size) আরও সহজে নিতে পারবে
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
    password2: userData.confirmPassword, // ✅ এই লাইনটি যোগ করুন
  };
  return api.post('/api/users/register/', formattedData);
};

export default api;