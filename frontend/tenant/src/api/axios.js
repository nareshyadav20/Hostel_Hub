import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://livora-hostel-hub-1.onrender.com/api'),
  timeout: 15000,
});

// Add a request interceptor to include the token in headers and implement AbortController timeout
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Create AbortController for global timeout protection
  if (!config.signal) {
    const controller = new AbortController();
    config.signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn(`⚠️ Request to ${config.url || 'unknown'} timed out and was aborted.`);
    }, 15000); // 15 seconds

    config.timeoutId = timeoutId;
  }

  return config;
});

// Add a response interceptor to handle auth errors, stale tokens, and clear timeout
API.interceptors.response.use(
  (response) => {
    if (response.config && response.config.timeoutId) {
      clearTimeout(response.config.timeoutId);
    }
    return response;
  },
  (error) => {
    if (error.config && error.config.timeoutId) {
      clearTimeout(error.config.timeoutId);
    }
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('API Request timed out after 15 seconds. Please try again.'));
    }

    if (error.response && error.response.status === 401) {
      // Clear stale auth data on unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Force redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
