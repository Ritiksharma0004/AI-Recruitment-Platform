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
    const isColdStart = error.response && [502, 503, 504].includes(error.response.status);
    const isNetworkDrop = !error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error'));

    if ((isColdStart || isNetworkDrop) && config.__retryCount < 3) {
      config.__retryCount += 1;
      const backoff = Math.min(2500 * config.__retryCount, 7500);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

export const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 75000,
});

aiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

aiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    const isColdStart = error.response && [502, 503, 504].includes(error.response.status);

    if (isColdStart && config.__retryCount < 3) {
      config.__retryCount += 1;
      const backoff = Math.min(2500 * config.__retryCount, 7500);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return aiClient(config);
    }

    return Promise.reject(error);
  }
);

export { GATEWAY_URL, AI_SERVICE_URL };
