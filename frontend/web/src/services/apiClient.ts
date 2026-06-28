import axios from 'axios';

// Create a global Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized: clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Custom In-Memory Caching ---
// Automatically caches GET requests in memory. 
// Clears cache when the page is reloaded, or when a POST/PUT/DELETE request occurs.
const cache = new Map();

const originalGet = apiClient.get;
apiClient.get = async (url: string, config?: any) => {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url));
  }
  const response = await originalGet(url, config);
  cache.set(url, response);
  return response;
};

const clearCacheMethods = ['post', 'put', 'delete', 'patch'] as const;
clearCacheMethods.forEach(method => {
  const originalMethod = apiClient[method];
  // @ts-ignore
  apiClient[method] = async (...args: any[]) => {
    cache.clear();
    // @ts-ignore
    return originalMethod.apply(apiClient, args);
  };
});

export default apiClient;
