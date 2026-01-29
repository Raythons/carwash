// Auth API endpoints
import api from './index';

const authRoute = "/auth";

export const authApi = {
  // Login
  login: async (email, password) => {
    try {
      console.log('Auth API: Making login request to:', `${authRoute}/login`);
      const response = await api.post(`${authRoute}/login`, { email, password });
      console.log('Auth API: Login response:', response);
      return response.data;
    } catch (error) {
      console.error('Auth API: Login error:', error);
      // Re-throw the error so it can be handled by the calling component
      throw error;
    }
  },

  // Register
  register: async (data) => {
    const response = await api.post(`${authRoute}/register`, data);
    return response.data;
  },

  // Refresh token
  refresh: async (refreshToken) => {
    const response = await api.post(`${authRoute}/refresh`, { refreshToken });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post(`${authRoute}/logout`);
    return response.data;
  },
};

export default authApi;
