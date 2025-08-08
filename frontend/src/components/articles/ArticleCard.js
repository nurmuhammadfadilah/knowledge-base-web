import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} style={{ color: "var(--color-warning)" }}>
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: "var(--color-warning)" }}>
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: "var(--color-gray-300)" }}>
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div
      className="article-card"
      onClick={handleClick}
      style={{
        backgroundColor: "var(--color-white)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        padding: "1.5rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid var(--color-gray-200)",
        height: "fit-content",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-4px)";
        e.target.style.boxShadow = "var(--shadow-xl)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "var(--shadow-md)";
      }}
    >
      {/* Category Badge */}
      <div
        style={{
          display: "inline-block",
          backgroundColor: "var(--color-primary)",
          color: "white",
          padding: "0.25rem 0.75rem",
          borderRadius: "var(--radius-xl)",
          fontSize: "0.75rem",
          fontWeight: "600",
          marginBottom: "1rem",
        }}
      >
        {article.categories?.name || "Uncategorized"}
      </div>
      {/* Title */}
      <h3
        style={{
          color: "var(--color-secondary)",
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "0.75rem",
          lineHeight: "1.4",
        }}
      >
        {article.title}
      </h3>

      {/* Image Display */}
      {article.image_url && (
        <div style={{ margin: "1.5rem 0" }}>
          {(() => {
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
            const firstImage = filteredUrls[0];

            return firstImage ? (
              <img
                src={firstImage.trim()}
                alt="Article thumbnail"
                onError={(e) => {
                  console.error(`Failed to load image: ${firstImage}`);
                  e.target.style.display = "none";
                }}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-gray-200)",
                  cursor: "pointer",
                }}
                onClick={handleClick}
              />
            ) : null;
          })()}
        </div>
      )}

      {/* Content Preview */}
      <p
        style={{
          color: "var(--color-gray-600)",
          lineHeight: "1.5",
          marginBottom: "1rem",
        }}
      >
        {truncateContent(article.content)}
      </p>
      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          {article.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                backgroundColor: "var(--color-gray-100)",
                color: "var(--color-gray-700)",
                padding: "0.25rem 0.5rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.75rem",
                marginRight: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-gray-100)",
        }}
      >
        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>{renderStars(article.average_rating || 0)}</div>
          <span style={{ color: "var(--color-gray-600)", fontSize: "0.875rem" }}>({article.average_rating?.toFixed(1) || "0.0"})</span>
        </div>

        {/* View Count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--color-gray-500)",
            fontSize: "0.875rem",
          }}
        >
          <span>👁</span>
          <span>{article.view_count || 0} views</span>
        </div>
      </div>
      {/* Date */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--color-gray-500)",
          marginTop: "0.5rem",
        }}
      >
        Updated: {formatDate(article.updated_at || article.created_at)}
      </div>
    </div>
  );
};

export default ArticleCard;
