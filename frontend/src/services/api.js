import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:9090';
const AI_SERVICE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) config.headers['X-User-Id'] = user.id;
        if (user.role) config.headers['X-User-Role'] = user.role;
      } catch (e) {
        console.error('Failed to parse stored user info', e);
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
});

export { GATEWAY_URL, AI_SERVICE_URL };
