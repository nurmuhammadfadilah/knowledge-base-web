import React, { useState, useEffect } from "react";
import { categoryService } from "../../services/articleService";
import AdminLayout from "../../components/admin/AdminLayout";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, category: null });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingCategory) {
        const response = await categoryService.update(editingCategory.id, formData);
        if (response.success) {
          setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...formData } : cat)));
          setEditingCategory(null);
          setFormData({ name: "", description: "" });
        } else {
          setErrors({ general: response.message || "Failed to update category" });
        }
      } else {
        const response = await categoryService.create(formData);
        if (response.success) {
          setCategories([...categories, response.data]);
          setFormData({ name: "", description: "" });
        } else {
          setErrors({ general: response.message || "Failed to create category" });
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setErrors({ general: "Failed to save category. Please try again." });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setErrors({});
  };

  const handleDelete = async (category) => {
    try {
      const response = await categoryService.delete(category.id);
      if (response.success) {
        setCategories(categories.filter((cat) => cat.id !== category.id));
        setDeleteModal({ show: false, category: null });
      } else {
        alert(response.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Category Form */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            height: "fit-content",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem",
              color: "var(--color-secondary)",
              fontSize: "1.25rem",
            }}
          >
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>

          {errors.general && (
            <div
              style={{
                backgroundColor: "var(--color-error)",
                color: "white",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--color-gray-700)",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `2px solid ${errors.name ? "var(--color-error)" : "var(--color-gray-200)"}`,
                  borderRadius: "var(--radius-md)",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
              {errors.name && (
                <div
                  style={{
                    color: "var(--color-error)",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.name}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--color-gray-700)",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                rows="3"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid var(--color-gray-200)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    flex: "1",
                    padding: "0.75rem",
                    backgroundColor: "var(--color-gray-200)",
                    color: "var(--color-gray-700)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                style={{
                  flex: "1",
                  padding: "0.75rem",
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {editingCategory ? "💾 Update" : "➕ Add Category"}
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--color-gray-200)",
              backgroundColor: "var(--color-gray-50)",
            }}
          >
            <h3
              style={{
                margin: "0",
                color: "var(--color-secondary)",
                fontSize: "1.25rem",
              }}
            >
              Categories ({categories.length})
            </h3>
          </div>

          {categories.length > 0 ? (
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-gray-50)" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "1rem",
                        fontWeight: "600",
                        color: "var(--color-gray-700)",
                        borderBottom: "1px solid var(--color-gray-200)",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "1rem",
                        fontWeight: "600",
                        color: "var(--color-gray-700)",
                        borderBottom: "1px solid var(--color-gray-200)",
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "1rem",
                        fontWeight: "600",
                        color: "var(--color-gray-700)",
                        borderBottom: "1px solid var(--color-gray-200)",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      style={{
                        borderBottom: "1px solid var(--color-gray-100)",
                        backgroundColor: editingCategory?.id === category.id ? "var(--color-primary-light)" : "white",
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem",
                          fontWeight: "500",
                          color: "var(--color-secondary)",
                        }}
                      >
                        {category.name}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "var(--color-gray-600)",
                          maxWidth: "200px",
                        }}
                      >
                        {category.description || <em style={{ color: "var(--color-gray-400)" }}>No description</em>}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleEdit(category)}
                            style={{
                              padding: "0.5rem",
                              backgroundColor: "var(--color-secondary)",
                              color: "white",
                              border: "none",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                            }}
                            title="Edit Category"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, category })}
                            style={{
                              padding: "0.5rem",
                              backgroundColor: "var(--color-error)",
                              color: "white",
                              border: "none",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                            }}
                            title="Delete Category"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--color-gray-500)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📁</div>
              <h3>No categories found</h3>
              <p>Create your first category to organize articles</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-xl)",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem",
                color: "var(--color-error)",
                fontSize: "1.25rem",
              }}
            >
              ⚠️ Delete Category
            </h3>
            <p style={{ marginBottom: "1.5rem", color: "var(--color-gray-700)" }}>
              Are you sure you want to delete the category "<strong>{deleteModal.category?.name}</strong>"? This action cannot be undone and may affect articles in this category.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setDeleteModal({ show: false, category: null })}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--color-gray-200)",
                  color: "var(--color-gray-700)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.category)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--color-error)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageCategories;
