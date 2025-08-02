import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles } from "../../services/articleService";
import { getCategories } from "../../services/categoryService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    recentArticles: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articles, categories] = await Promise.all([getArticles(), getCategories()]);

        setStats({
          totalArticles: articles.length,
          totalCategories: categories.length,
          recentArticles: articles.slice(0, 5), // Get 5 most recent articles
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: color,
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          color: "white",
          fontSize: "1.5rem",
        }}
      >
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-gray-600)" }}>{title}</h3>
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "1.5rem", fontWeight: "600" }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard title="Total Articles" value={stats.totalArticles} icon="📄" color="var(--color-primary)" />
        <StatCard title="Total Categories" value={stats.totalCategories} icon="📁" color="var(--color-secondary)" />
      </div>

      {/* Recent Articles */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
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
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Recent Articles</h2>
          <button
            onClick={() => navigate("/admin/articles")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
            }}
          >
            View All
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {stats.recentArticles.map((article) => (
            <div
              key={article._id}
              style={{
                padding: "1rem",
                backgroundColor: "var(--color-gray-50)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/admin/articles/edit/${article._id}`)}
            >
              <h3 style={{ margin: 0, fontSize: "1rem" }}>{article.title}</h3>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--color-gray-600)" }}>{new Date(article.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
