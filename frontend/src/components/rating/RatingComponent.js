// File: frontend/src/components/rating/RatingComponent.js
import React, { useState } from "react";

const RatingComponent = ({ articleId, currentRating = 0 }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = async (rating) => {
    if (hasRated) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit rating
      // await ratingService.submitRating(articleId, rating);

      setUserRating(rating);
      setHasRated(true);

      // Simulate API delay
      setTimeout(() => {
        setIsSubmitting(false);
        alert(`Thank you for rating this article ${rating} stars!`);
      }, 500);
    } catch (error) {
      console.error("Error submitting rating:", error);
      setIsSubmitting(false);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || userRating);
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => !hasRated && setHoverRating(i)}
          onMouseLeave={() => !hasRated && setHoverRating(0)}
          disabled={hasRated || isSubmitting}
          style={{
            background: "none",
            border: "none",
            fontSize: "2rem",
            cursor: hasRated ? "default" : "pointer",
            color: isFilled ? "var(--color-warning)" : "var(--color-gray-300)",
            transition: "all 0.2s ease",
            padding: "0.25rem",
            opacity: hasRated ? 0.7 : 1,
          }}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-white)",
        padding: "2rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          color: "var(--color-secondary)",
          marginBottom: "1rem",
          fontSize: "1.5rem",
        }}
      >
        Rate This Solution
      </h3>

      <p
        style={{
          color: "var(--color-gray-600)",
          marginBottom: "1.5rem",
        }}
      >
        {hasRated ? "Thank you for your feedback!" : "Did this solution help you? Please rate it to help others."}
      </p>

      {/* Current Rating Display */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: "1.5rem",
                color: star <= Math.floor(currentRating) ? "var(--color-warning)" : "var(--color-gray-300)",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <p
          style={{
            color: "var(--color-gray-600)",
            fontSize: "0.875rem",
          }}
        >
          Current average: {currentRating.toFixed(1)} out of 5
        </p>
      </div>

      {/* User Rating Input */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {renderStars()}
        </div>

        {isSubmitting && (
          <p
            style={{
              color: "var(--color-info)",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
            }}
          >
            Submitting your rating...
          </p>
        )}
      </div>

      {/* Feedback Text */}
      {!hasRated && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "var(--color-gray-50)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-gray-200)",
          }}
        >
          <textarea
            placeholder="Optional: Leave additional feedback about this solution..."
            rows="3"
            style={{
              width: "100%",
              border: "1px solid var(--color-gray-300)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem",
              fontSize: "0.875rem",
              resize: "vertical",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-primary)";
              e.target.style.boxShadow = "0 0 0 2px rgba(215, 38, 56, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-gray-300)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
