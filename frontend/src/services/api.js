import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://hirenova-gateway.onrender.com';
const AI_SERVICE_URL = import.meta.env.VITE_AI_URL || 'https://hirenova-ai-service.onrender.com';

export const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 75000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Do not attach token for public auth routes to avoid backend crashing on expired jwt
    const isAuthRoute = config.url.includes('/auth/login') || 
                        config.url.includes('/auth/register') || 
                        config.url.includes('/auth/send-registration-otp') || 
                        config.url.includes('/auth/forgot-password') || 
                        config.url.includes('/auth/reset-password');
                        
    if (token && !isAuthRoute) {
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

    // Never enforce application/json on multipart FormData; allow browser to attach boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatic retry for Render free-tier cold starts (502, 503, 504, or Network Drops)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    
    const isNetworkError = error.message === 'Network Error';
    const is502 = error.response && error.response.status === 502;
    const is503 = error.response && error.response.status === 503;
    const is504 = error.response && error.response.status === 504;

    if ((isNetworkError || is502 || is503 || is504) && config.__retryCount < 2) {
      config.__retryCount += 1;
      
      const delay = Math.pow(2, config.__retryCount) * 1500;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return apiClient(config);
    }
    
    return Promise.reject(error);
  }
);
