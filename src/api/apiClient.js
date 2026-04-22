import axios from 'axios';

const isDev = import.meta.env.DEV;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const productionFallbackBaseUrl = 'https://school-finance-system-backend.onrender.com';

// In development, keep same-origin so Vite proxy forwards /api/* to backend.
// In production, require explicit backend base URL via VITE_API_BASE_URL.
const resolvedBaseURL = isDev ? '' : (apiBaseUrl || productionFallbackBaseUrl);

if (!isDev && !apiBaseUrl) {
  console.warn('[apiClient] VITE_API_BASE_URL not set. Falling back to Render backend URL.');
}

const apiClient = axios.create({
  baseURL: resolvedBaseURL,
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
