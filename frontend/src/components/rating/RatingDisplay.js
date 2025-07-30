// File: frontend/src/components/rating/RatingDisplay.js
import React from "react";

const RatingDisplay = ({ rating, totalRatings, size = "medium", showText = true }) => {
  const sizes = {
    small: "1rem",
    medium: "1.25rem",
    large: "1.5rem",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span
            key={i}
            style={{
              color: "#FFD700",
              fontSize: sizes[size],
            }}
          >
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span
            key={i}
            style={{
              position: "relative",
              fontSize: sizes[size],
            }}
          >
            <span style={{ color: "#ddd" }}>★</span>
            <span
              style={{
                position: "absolute",
                left: 0,
                color: "#FFD700",
                overflow: "hidden",
                width: "50%",
              }}
            >
              ★
            </span>
          </span>
        );
      } else {
        stars.push(
          <span
            key={i}
            style={{
              color: "#ddd",
              fontSize: sizes[size],
            }}
          >
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex" }}>{renderStars()}</div>
      {showText && (
        <span
          style={{
            fontSize: size === "small" ? "0.875rem" : "1rem",
            color: "var(--color-gray-600)",
          }}
        >
          {rating.toFixed(1)} ({totalRatings} rating{totalRatings !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
