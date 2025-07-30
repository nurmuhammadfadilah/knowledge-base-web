// File: frontend/src/pages/ArticleDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { articleService } from "../services/articleService";
// ✅ 1. TAMBAHKAN IMPORT BARU DI SINI:
import RatingDisplay from "../components/rating/RatingDisplay";
import RatingInput from "../components/rating/RatingInput";
import { ratingService } from "../services/ratingService";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 2. TAMBAHKAN STATE RATING BARU DI SINI:
  const [userRating, setUserRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  // ✅ 3. TAMBAHKAN useEffect BARU DI SINI:
  useEffect(() => {
    if (article) {
      loadUserRating();
      loadRatings();
    }
  }, [article]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getById(id);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      console.error("Error loading article:", err);
      setError("Article not found or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4. TAMBAHKAN FUNGSI RATING BARU DI SINI:
  const loadUserRating = async () => {
    try {
      const response = await ratingService.getUserRating(id);
      setUserRating(response.data);
    } catch (error) {
      console.error("Error loading user rating:", error);
    }
  };

  const loadRatings = async () => {
    try {
      const response = await ratingService.getArticleRatings(id, { limit: 10 });
      setRatings(response.data.ratings);
      setRatingStats(response.data);
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      await ratingService.submitRating(id, ratingData);
      // Reload data after submission
      await loadUserRating();
      await loadRatings();
      // Refresh article to get updated average rating
      await loadArticle();
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatContent = (content) => {
    return content.split("\n").map((paragraph, index) => (
      <p key={index} style={{ marginBottom: "1rem" }}>
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <div className="loading-spinner" style={{ display: "inline-block" }}></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div
        className="container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <div style={{ color: "var(--color-error)", marginBottom: "1rem" }}>⚠️ {error}</div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail">
      {/* Breadcrumb */}
      <div
        style={{
          backgroundColor: "var(--color-gray-50)",
          padding: "1rem 0",
          borderBottom: "1px solid var(--color-gray-200)",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <nav style={{ fontSize: "0.875rem", color: "var(--color-gray-600)" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-primary)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Home
            </button>
            <span> / </span>
            <span>{article.categories?.name}</span>
            <span> / </span>
            <span>{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <div
        className="container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        {/* Article Header */}
        <header style={{ marginBottom: "2rem" }}>
          {/* Category Badge */}
          <div
            style={{
              display: "inline-block",
              backgroundColor: "var(--color-primary)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-xl)",
              fontSize: "0.875rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            {article.categories?.name || "Uncategorized"}
          </div>

          {/* Title */}
          <h1
            style={{
              color: "var(--color-secondary)",
              fontSize: "2.5rem",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "1rem",
            }}
          >
            {article.title}
          </h1>

          {/* Meta Info */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              color: "var(--color-gray-600)",
              fontSize: "0.875rem",
              paddingBottom: "1rem",
              borderBottom: "2px solid var(--color-gray-100)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>📅</span>
              <span>Updated: {formatDate(article.updated_at || article.created_at)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>👁</span>
              <span>{article.view_count || 0} views</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>⭐</span>
              <span>{article.average_rating?.toFixed(1) || "0.0"} rating</span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div
          className="article-body"
          style={{
            backgroundColor: "var(--color-white)",
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              lineHeight: "1.7",
              fontSize: "1.1rem",
              color: "var(--color-gray-800)",
            }}
          >
            {formatContent(article.content)}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--color-gray-200)",
              }}
            >
              <h4
                style={{
                  color: "var(--color-secondary)",
                  marginBottom: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                Tags
              </h4>
              <div>
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      backgroundColor: "var(--color-gray-100)",
                      color: "var(--color-gray-700)",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-xl)",
                      fontSize: "0.875rem",
                      marginRight: "0.5rem",
                      marginBottom: "0.5rem",
                      fontWeight: "500",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ✅ 5. GANTI BAGIAN INI - HAPUS RatingComponent LAMA DAN GANTI DENGAN RATING SYSTEM BARU: */}
        {/* Rating Section */}
        <div style={{ marginTop: "2rem" }}>
          {/* Article Rating Display */}
          {article.average_rating > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <RatingDisplay rating={article.average_rating} totalRatings={article.total_ratings || 0} size="large" />
            </div>
          )}

          {/* Rating Input */}
          <RatingInput onSubmit={handleRatingSubmit} initialRating={userRating?.rating || 0} initialFeedback={userRating?.feedback || ""} />

          {/* Ratings List */}
          {ratings.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "var(--color-secondary)",
                }}
              >
                User Reviews ({ratingStats?.total || 0})
              </h3>

              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  style={{
                    backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-gray-200)",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <RatingDisplay rating={rating.rating} totalRatings={0} showText={false} size="small" />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-gray-500)",
                      }}
                    >
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.feedback && (
                    <p
                      style={{
                        margin: "0",
                        color: "var(--color-gray-700)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {rating.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "var(--color-secondary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
            }}
          >
            ← Back to Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
