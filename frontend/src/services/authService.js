import { apiClient } from './api';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  registerRecruiter: async (recruiterData) => {
    const response = await apiClient.post('/auth/register/recruiter', recruiterData);
    return response.data;
  },
  
  registerAdmin: async (adminData) => {
    const response = await apiClient.post('/auth/register/admin', adminData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await apiClient.post('/auth/change-password', passwordData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async ({ email, resetCode, newPassword }) => {
    const response = await apiClient.post('/auth/reset-password', { email, resetCode, newPassword });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
  
  getAdminStats: async () => {
    const response = await apiClient.get('/auth/stats');
    return response.data;
  }
};
