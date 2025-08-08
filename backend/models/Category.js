// File: backend/models/Category.js - ENHANCED VERSION
const { supabase } = require("../config/database");

class Category {
  static async getAll() {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });

      if (error) {
        console.error("Category.getAll error:", error);
        throw error;
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Category.getAll catch:", error);
      return { success: false, error: error.message };
    }
  }

  static async getById(id) {
    try {
      if (!id) {
        throw new Error("Category ID is required");
      }

      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();

      if (error) {
        console.error("Category.getById error:", error);
        if (error.code === "PGRST116") {
          throw new Error("Category not found");
        }
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Category.getById catch:", error);
      return { success: false, error: error.message };
    }
  }

  static async create(categoryData) {
    try {
      if (!categoryData || !categoryData.name) {
        throw new Error("Category name is required");
      }

      const insertData = {
        name: categoryData.name,
        description: categoryData.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("categories").insert([insertData]).select().single();

      if (error) {
        console.error("Category.create error:", error);

        // Handle unique constraint violation
        if (error.code === "23505") {
          throw new Error("Category name already exists");
        }

        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Category.create catch:", error);
      return { success: false, error: error.message };
    }
  }

  static async update(id, categoryData) {
    try {
      if (!id) {
        throw new Error("Category ID is required");
      }

      if (!categoryData || !categoryData.name) {
        throw new Error("Category name is required");
      }

      // First check if category exists
      const existingCategory = await this.getById(id);
      if (!existingCategory.success) {
        throw new Error("Category not found");
      }

      const updateData = {
        name: categoryData.name,
        description: categoryData.description || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("categories").update(updateData).eq("id", id).select().single();

      if (error) {
        console.error("Category.update error:", error);

        // Handle unique constraint violation
        if (error.code === "23505") {
          throw new Error("Category name already exists");
        }

        // Handle not found
        if (error.code === "PGRST116") {
          throw new Error("Category not found");
        }

        throw error;
      }

      if (!data) {
        throw new Error("Category not found or update failed");
      }

      return { success: true, data };
    } catch (error) {
      console.error("Category.update catch:", error);
      return { success: false, error: error.message };
    }
  }

  static async delete(id) {
    try {
      if (!id) {
        throw new Error("Category ID is required");
      }

      // First check if category exists
      const existingCategory = await this.getById(id);
      if (!existingCategory.success) {
        throw new Error("Category not found");
      }

      // Optional: Check if category is being used by articles
      // Uncomment this if you want to prevent deletion of categories in use
      /*
      const { data: articlesUsingCategory, error: checkError } = await supabase
        .from("articles")
        .select("id")
        .eq("category_id", id)
        .limit(1);

      if (checkError) {
        console.error("Category.delete check error:", checkError);
      } else if (articlesUsingCategory && articlesUsingCategory.length > 0) {
        throw new Error("Cannot delete category that is being used by articles");
      }
      */

      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) {
        console.error("Category.delete error:", error);

        // Handle foreign key constraint violation
        if (error.code === "23503") {
          throw new Error("Cannot delete category that is being used by articles");
        }

        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Category.delete catch:", error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to check if category name exists
  static async nameExists(name, excludeId = null) {
    try {
      let query = supabase.from("categories").select("id").ilike("name", name);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data, error } = await query.limit(1);

      if (error) throw error;

      return { success: true, exists: data && data.length > 0 };
    } catch (error) {
      console.error("Category.nameExists catch:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = Category;
