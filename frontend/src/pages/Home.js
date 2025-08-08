import React, { useState, useEffect, useCallback } from "react";
import { articleService, categoryService } from "../services/articleService";
import ArticleCard from "../components/articles/ArticleCard";
import SearchBar from "../components/articles/SearchBar";
import CategoryFilter from "../components/articles/CategoryFilter";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);

  const filterArticles = useCallback(async () => {
    try {
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory) filters.category_id = selectedCategory;

      const response = await articleService.getAll(filters);
      setArticles(response.data || []);
    } catch (err) {
      console.error("Error filtering articles:", err);
      setError("Failed to filter articles. Please try again.");
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      filterArticles();
    }
  }, [filterArticles, categories.length]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [articlesResponse, categoriesResponse] = await Promise.all([articleService.getAll({ limit: 20 }), categoryService.getAll()]);

      setArticles(articlesResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid var(--color-gray-200)",
            borderRadius: "50%",
            borderTopColor: "var(--color-primary)",
            animation: "spin 1s ease-in-out infinite",
          }}
        ></div>
        <p style={{ marginTop: "1rem", color: "var(--color-gray-600)" }}>Loading articles...</p>

        {/* Add keyframes for spinner */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            color: "var(--color-error)",
            marginBottom: "1rem",
            fontSize: "1.2rem",
          }}
        >
          ⚠️ {error}
        </div>
        <button
          onClick={loadData}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
          color: "white",
          padding: "3rem 0",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "700" }}>🔧 Troubleshooting Knowledge Base</h1>
          <p style={{ fontSize: "1.2rem", opacity: "0.9" }}>Find solutions to common IT problems quickly and easily</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--color-primary)" }}>{articles.length}</div>
            <div style={{ color: "var(--color-gray-600)" }}>Articles</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--color-primary)" }}>{categories.length}</div>
            <div style={{ color: "var(--color-gray-600)" }}>Categories</div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--color-gray-600)",
              backgroundColor: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>No articles found</h3>
            <p>Try adjusting your search terms or category filter</p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
