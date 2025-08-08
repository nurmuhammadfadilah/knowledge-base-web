import api from "./api";

export const articleService = {
  // Get semua artikel
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/articles${queryString ? `?${queryString}` : ""}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get artikel berdasarkan ID
  getById: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create artikel baru (hanya admin)
  create: async (articleData) => {
    try {
      const response = await api.post("/articles", articleData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update artikel (hanya admin)
  update: async (id, articleData) => {
    try {
      const response = await api.put(`/articles/${id}`, articleData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete artikel (hanya admin)
  delete: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Rate artikel
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
  // Get semua kategori
  getAll: async () => {
    try {
      const response = await api.get("/categories");
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get kategori berdasarkan ID
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create kategori (hanya admin)
  create: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update kategori (hanya admin)
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete kategori (hanya admin)
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Upload image
export const uploadService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await api.post("/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteImage: async (filename) => {
    try {
      const response = await api.delete(`/upload/image/${filename}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getImageUrl: (filename) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}/uploads/images/${filename}`;
  },

  validateImage: (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.");
    }

    if (file.size > maxSize) {
      throw new Error("File too large. Maximum size is 5MB.");
    }

    return true;
  },

  validateImages: (files) => {
    const maxFiles = 5;

    if (files.length > maxFiles) {
      throw new Error(`Too many files. Maximum ${maxFiles} images allowed.`);
    }

    files.forEach((file, index) => {
      try {
        uploadService.validateImage(file);
      } catch (error) {
        throw new Error(`File ${index + 1}: ${error.message}`);
      }
    });

    return true;
  },
};
