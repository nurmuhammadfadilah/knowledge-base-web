// File: backend/models/Category.js
const { supabase } = require("../config/database");

class Category {
  static async getAll() {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async create(categoryData) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: categoryData.name,
            description: categoryData.description,
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

  static async update(id, categoryData) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update({
          name: categoryData.name,
          description: categoryData.description,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = Category;
