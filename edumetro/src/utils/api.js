// src/utils/api.js (Updated - Response Interceptor Removed)

import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000, // Add a timeout to prevent hanging requests
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    
    // If token exists, add it to the Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    console.error('API Response Error:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

export default api;