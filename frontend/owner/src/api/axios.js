import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api',
  timeout: 15000,
});

// Add a request interceptor to include the auth token and implement AbortController timeout
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  // Create AbortController for global timeout protection
  if (!req.signal) {
    const controller = new AbortController();
    req.signal = controller.signal;
    
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn(`⚠️ Request to ${req.url || 'unknown'} timed out and was aborted.`);
    }, 15000); // 15 seconds

    req.timeoutId = timeoutId;
  }

  return req;
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
