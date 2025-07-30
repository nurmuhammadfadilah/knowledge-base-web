// File: frontend/src/services/articleService.js
import api from "./api";

export const articleService = {
  // Get all articles with filters
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/articles${queryString ? `?${queryString}` : ""}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get article by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new article (Admin only)
  create: async (articleData) => {
    try {
      const response = await api.post("/articles", articleData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update article (Admin only)
  update: async (id, articleData) => {
    try {
      const response = await api.put(`/articles/${id}`, articleData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete article (Admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Rate article
  rate: async (articleId, rating) => {
    try {
      const response = await api.post("/ratings", {
        article_id: articleId,
        rating: rating,
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const categoryService = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await api.get("/categories");
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new category (Admin only)
  create: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update category (Admin only)
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete category (Admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
