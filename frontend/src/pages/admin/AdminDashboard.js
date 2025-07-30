// File: frontend/src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { articleService, categoryService } from "../../services/articleService";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    totalViews: 0,
    averageRating: 0,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [articlesResponse, categoriesResponse] = await Promise.all([articleService.getAll({ limit: 5 }), categoryService.getAll()]);

      const articles = articlesResponse.data || [];
      const categories = categoriesResponse.data || [];

      // Calculate stats
      const totalViews = articles.reduce((sum, article) => sum + (article.view_count || 0), 0);
      const averageRating = articles.length > 0 ? articles.reduce((sum, article) => sum + (article.average_rating || 0), 0) / articles.length : 0;

      setStats({
        totalArticles: articles.length,
        totalCategories: categories.length,
        totalViews,
        averageRating,
      });

      setRecentArticles(articles.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.3s ease",
        border: `3px solid ${color}20`,
      }}
      onMouseEnter={(e) => {
        if (onClick) e.target.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.target.style.transform = "translateY(0)";
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
        <div
          style={{
            fontSize: "2rem",
            backgroundColor: `${color}20`,
            padding: "0.5rem",
            borderRadius: "var(--radius-md)",
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: color,
          }}
        >
          {value}
        </div>
      </div>
      <h3
        style={{
          margin: "0",
          color: "var(--color-gray-600)",
          fontSize: "1rem",
          fontWeight: "600",
        }}
      >
        {title}
      </h3>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading-spinner" style={{ display: "inline-block" }}></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard title="Total Articles" value={stats.totalArticles} icon="📄" color="var(--color-primary)" onClick={() => navigate("/admin/articles")} />
        <StatCard title="Categories" value={stats.totalCategories} icon="📁" color="var(--color-secondary)" onClick={() => navigate("/admin/categories")} />
        <StatCard title="Total Views" value={stats.totalViews.toLocaleString()} icon="👁" color="var(--color-success)" />
        <StatCard title="Avg Rating" value={stats.averageRating.toFixed(1)} icon="⭐" color="var(--color-warning)" />
      </div>

      {/* Quick Actions */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            margin: "0 0 1rem",
            color: "var(--color-secondary)",
            fontSize: "1.25rem",
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
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
          <button
            onClick={() => navigate("/admin/categories")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--color-secondary)",
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
            📁 Manage Categories
          </button>
        </div>
      </div>

      {/* Recent Articles */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
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
          <h2
            style={{
              margin: "0",
              color: "var(--color-secondary)",
              fontSize: "1.25rem",
            }}
          >
            Recent Articles
          </h2>
          <button
            onClick={() => navigate("/admin/articles")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--color-gray-100)",
              color: "var(--color-gray-700)",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            View All
          </button>
        </div>

        {recentArticles.length > 0 ? (
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-gray-200)" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.75rem",
                      color: "var(--color-gray-600)",
                      fontWeight: "600",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.75rem",
                      color: "var(--color-gray-600)",
                      fontWeight: "600",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "0.75rem",
                      color: "var(--color-gray-600)",
                      fontWeight: "600",
                    }}
                  >
                    Views
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "0.75rem",
                      color: "var(--color-gray-600)",
                      fontWeight: "600",
                    }}
                  >
                    Rating
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "0.75rem",
                      color: "var(--color-gray-600)",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr key={article.id} style={{ borderBottom: "1px solid var(--color-gray-100)" }}>
                    <td
                      style={{
                        padding: "0.75rem",
                        fontWeight: "500",
                        color: "var(--color-secondary)",
                      }}
                    >
                      {article.title}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                        }}
                      >
                        {article.categories?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        textAlign: "center",
                        color: "var(--color-gray-600)",
                      }}
                    >
                      {article.view_count || 0}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        textAlign: "center",
                        color: "var(--color-warning)",
                      }}
                    >
                      ⭐ {(article.average_rating || 0).toFixed(1)}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "var(--color-secondary)",
                          color: "white",
                          border: "none",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                        }}
                      >
                        Edit
                      </button>
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
              padding: "2rem",
              color: "var(--color-gray-500)",
            }}
          >
            <p>No articles found</p>
            <button
              onClick={() => navigate("/admin/articles/create")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              Create First Article
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
