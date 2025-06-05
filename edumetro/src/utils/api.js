// src/utils/api.js

import axios from "axios";
import { toast } from 'react-hot-toast';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
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

// ✅ আপনার API ফাংশনগুলো এখানে এক্সপোর্ট করুন, যাতে অন্য কম্পোনেন্টগুলো তাদের ব্যবহার করতে পারে।
export const loginUser = async (credentials) => {
  return api.post('/api/users/login/', credentials);
};

export const getUserProfile = async () => {
  return api.get('/api/users/profile/');
};

// ✅ নতুন ফাংশন: ডিপার্টমেন্ট তালিকা ফেচ করার জন্য
export const getDepartments = async () => {
  return api.get('/api/notes/departments/'); // নিশ্চিত করুন এই API এন্ডপয়েন্টটি ঠিক আছে
};

// ✅ নতুন ফাংশন: কোর্স তালিকা ফেচ করার জন্য
// আপনি চাইলে একটি `departmentId` প্যারামিটার যোগ করতে পারেন যদি backend এ ফিল্টার সাপোর্ট করে
// ✅ ফাংশন: কোর্স তালিকা ফেচ করার জন্য
export const getCourses = async (departmentId = null) => { // departmentId এখন ঐচ্ছিক
  let url = '/api/notes/courses/';
  if (departmentId) {
    url += `?department=${departmentId}`; // ✅ backend filter support
  }
  return api.get(url);
};






// ✅ ফাংশন: বুকমার্ক করা নোটগুলো ফেচ করার জন্য
export const getBookmarkedNotes = async (page = 1) => {
  // আপনার backend এ /api/users/user-activity/bookmarked-notes/ endpoint টি ব্যবহার করুন
  // এটি Authentication Headers প্রয়োজন হবে।
  try {
    const response = await api.get(`/api/users/user-activity/bookmarked-notes/?page=${page}`);
    return response; // Return the full response object
  } catch (error) {
    console.error("Failed to fetch bookmarked notes:", error);
    throw error; // Re-throw the error
  }
};













export default api; // `api` instance টি default export হিসেবে রাখুন