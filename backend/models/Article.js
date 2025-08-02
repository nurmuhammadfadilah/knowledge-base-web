// File: backend/models/Article.js
const { supabase } = require("../config/database");

class Article {
  static async getAll(filters = {}) {
    try {
      let query = supabase
        .from("articles")
        .select(
          `
          *,
          categories (
            id,
            name
          )
        `
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(
          `
          *,
          categories (
            id,
            name
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      // Update view count
      await supabase
        .from("articles")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", id);

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async create(articleData) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .insert([
          {
            title: articleData.title,
            content: articleData.content,
            category_id: articleData.category_id,
            tags: articleData.tags || [],
            image_url: articleData.image_url || null, // ✅ Menambahkan image_url
            view_count: 0,
            average_rating: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async update(id, articleData) {
    try {
      const updateData = {
        title: articleData.title,
        content: articleData.content,
        category_id: articleData.category_id,
        tags: articleData.tags,
        updated_at: new Date().toISOString(),
      };

      if (articleData.image_url !== undefined) {
        updateData.image_url = articleData.image_url; // ✅ Update jika image_url ada
      }

      const { data, error } = await supabase.from("articles").update(updateData).eq("id", id).select().single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = Article;
