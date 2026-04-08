import axios from 'axios';

// Use same-origin base URL so Vite can proxy /api/* to Flask in development.
const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// The Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from secure local storage
    const token = localStorage.getItem('erp_token');
    
    // If a token exists, inject it into the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// The Response Interceptor (Handles Expired Tokens)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the backend rejects the token (expired or invalid), force a logout
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
