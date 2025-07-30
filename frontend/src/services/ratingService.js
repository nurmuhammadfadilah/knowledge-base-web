// File: frontend/src/services/ratingService.js
import api from "./api";

export const ratingService = {
  // Submit rating
  submitRating: async (articleId, ratingData) => {
    try {
      console.log("Submitting rating:", { articleId, ratingData });
      const response = await api.post(`/articles/${articleId}/rating`, ratingData);
      return response.data;
    } catch (error) {
      console.error("Rating service error:", error);
      throw error;
    }
  },

  // Get article ratings
  getArticleRatings: async (articleId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/articles/${articleId}/ratings?${queryString}`);
      return response.data;
    } catch (error) {
      console.error("Get ratings error:", error);
      throw error;
    }
  },

  // Get user's rating
  getUserRating: async (articleId) => {
    try {
      const response = await api.get(`/articles/${articleId}/user-rating`);
      return response.data;
    } catch (error) {
      console.error("Get user rating error:", error);
      throw error;
    }
  },
};
