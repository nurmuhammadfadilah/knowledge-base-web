// File: frontend/src/pages/ArticleDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { articleService } from "../services/articleService";
import RatingDisplay from "../components/rating/RatingDisplay";
import RatingInput from "../components/rating/RatingInput";
import { ratingService } from "../services/ratingService";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadArticle();
  }, [id]);

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
      await loadArticle();
      // Refresh article to get updated average rating
      await loadArticle();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
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
                // textDecoration: "underline",
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

        {/* Image Display */}
        {article.image_url && (
          <div style={{ margin: "1.5rem 0" }}>
            {(() => {
              // Parse the image URL if it's a JSON string
              let imageUrls = article.image_url;
              if (typeof imageUrls === "string") {
                try {
                  const parsed = JSON.parse(imageUrls);
                  imageUrls = Array.isArray(parsed) ? parsed : [imageUrls];
                } catch (e) {
                  imageUrls = [imageUrls];
                }
              }

              const filteredUrls = (Array.isArray(imageUrls) ? imageUrls : [imageUrls]).filter((url) => url && typeof url === "string" && url.trim() !== "");

              const nextImage = () => {
                setCurrentImageIndex((prev) => (prev + 1) % filteredUrls.length);
              };

              const prevImage = () => {
                setCurrentImageIndex((prev) => (prev === 0 ? filteredUrls.length - 1 : prev - 1));
              };

              return filteredUrls.length > 0 ? (
                <div style={{ position: "relative", width: "100%", height: "400px" }}>
                  {/* Main Image */}
                  <img
                    src={filteredUrls[currentImageIndex].trim()}
                    alt={`Article image ${currentImageIndex + 1} of ${filteredUrls.length}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-gray-100)",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(filteredUrls[currentImageIndex].trim(), "_blank")}
                  />

                  {/* Navigation Arrows - Only show if there's more than one image */}
                  {filteredUrls.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          fontSize: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                        }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          fontSize: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                        }}
                      >
                        ›
                      </button>

                      {/* Image Counter */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "14px",
                        }}
                      >
                        {currentImageIndex + 1} / {filteredUrls.length}
                      </div>

                      {/* Thumbnail Navigation */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-60px",
                          left: "0",
                          right: "0",
                          display: "flex",
                          gap: "8px",
                          overflowX: "auto",
                          padding: "4px",
                        }}
                      >
                        {filteredUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url.trim()}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                              width: "60px",
                              height: "40px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border: index === currentImageIndex ? "2px solid var(--color-primary)" : "2px solid transparent",
                              borderRadius: "4px",
                              opacity: index === currentImageIndex ? 1 : 0.6,
                              transition: "all 0.2s",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        )}
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
