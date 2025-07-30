// File: frontend/src/services/authService.js
import api from "./api";

export const authService = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      const response = await api.post(
        "/auth/verify",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
