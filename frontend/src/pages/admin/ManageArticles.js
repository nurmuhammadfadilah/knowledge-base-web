// File: frontend/src/pages/admin/ManageArticles.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { articleService, categoryService } from "../../services/articleService";
import AdminLayout from "../../components/admin/AdminLayout";
import Loading from "../../components/common/Loading";

const ManageArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, article: null });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesResponse, categoriesResponse] = await Promise.all([articleService.getAll({ limit: 50 }), categoryService.getAll()]);

      setArticles(articlesResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = async () => {
    try {
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory) filters.category_id = selectedCategory;

      const response = await articleService.getAll(filters);
      setArticles(response.data || []);
    } catch (error) {
      console.error("Error filtering articles:", error);
    }
  };

  const handleDelete = async (article) => {
    try {
      await articleService.delete(article.id);
      setArticles(articles.filter((a) => a.id !== article.id));
      setDeleteModal({ show: false, article: null });
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading-spinner"></div>
          <p>Loading articles...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header Actions */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ margin: "0", color: "var(--color-secondary)" }}>Article Management</h2>
          <button
            onClick={() => navigate("/admin/articles/create")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ➕ New Article
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: "1",
              minWidth: "250px",
              padding: "0.75rem",
              border: "2px solid var(--color-gray-200)",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "0.75rem",
              border: "2px solid var(--color-gray-200)",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              minWidth: "150px",
            }}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden",
        }}
      >
        {articles.length > 0 ? (
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "var(--color-gray-50)" }}>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "1rem",
                      fontWeight: "600",
                      color: "var(--color-gray-700)",
                      borderBottom: "2px solid var(--color-gray-200)",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "1rem",
                      fontWeight: "600",
                      color: "var(--color-gray-700)",
                      borderBottom: "2px solid var(--color-gray-200)",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      fontWeight: "600",
                      color: "var(--color-gray-700)",
                      borderBottom: "2px solid var(--color-gray-200)",
                    }}
                  >
                    Views
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      fontWeight: "600",
                      color: "var(--color-gray-700)",
                      borderBottom: "2px solid var(--color-gray-200)",
                    }}
                  >
                    Rating
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      fontWeight: "600",
                      color: "var(--color-gray-700)",
                      borderBottom: "2px solid var(--color-gray-200)",
                    }}
                  >
                    Updated
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      fontWeight: "600",
                      color: "var(--color-gray-700)",
                      borderBottom: "2px solid var(--color-gray-200)",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} style={{ borderBottom: "1px solid var(--color-gray-100)" }}>
                    <td
                      style={{
                        padding: "1rem",
                        maxWidth: "300px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          color: "var(--color-secondary)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {article.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-gray-600)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {article.content.substring(0, 100)}...
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "white",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "var(--radius-xl)",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                        }}
                      >
                        {article.categories?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        color: "var(--color-gray-600)",
                      }}
                    >
                      {article.view_count || 0}
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
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <span style={{ color: "var(--color-warning)" }}>⭐</span>
                        <span style={{ color: "var(--color-gray-600)" }}>{(article.average_rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        color: "var(--color-gray-600)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {formatDate(article.updated_at || article.created_at)}
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
                          onClick={() => window.open(`/article/${article.id}`, "_blank")}
                          style={{
                            padding: "0.5rem",
                            backgroundColor: "var(--color-success)",
                            color: "white",
                            border: "none",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                          title="View Article"
                        >
                          👁
                        </button>
                        <button
                          onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                          style={{
                            padding: "0.5rem",
                            backgroundColor: "var(--color-secondary)",
                            color: "white",
                            border: "none",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                          title="Edit Article"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, article })}
                          style={{
                            padding: "0.5rem",
                            backgroundColor: "var(--color-error)",
                            color: "white",
                            border: "none",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                          title="Delete Article"
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
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
            <h3>No articles found</h3>
            <p>Create your first article to get started</p>
            <button
              onClick={() => navigate("/admin/articles/create")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Create Article
            </button>
          </div>
        )}
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
              ⚠️ Delete Article
            </h3>
            <p style={{ marginBottom: "1.5rem", color: "var(--color-gray-700)" }}>
              Are you sure you want to delete "<strong>{deleteModal.article?.title}</strong>"? This action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setDeleteModal({ show: false, article: null })}
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
                onClick={() => handleDelete(deleteModal.article)}
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

export default ManageArticles;
