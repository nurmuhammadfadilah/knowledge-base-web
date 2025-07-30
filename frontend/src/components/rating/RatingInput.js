// File: frontend/src/components/rating/RatingInput.js - TAMBAHKAN ERROR HANDLING
import React, { useState } from "react";

const RatingInput = ({ onSubmit, initialRating = 0, initialFeedback = "" }) => {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ rating, feedback });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredStar || rating);
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredStar(i)}
          onMouseLeave={() => setHoveredStar(0)}
          style={{
            background: "none",
            border: "none",
            fontSize: "2rem",
            color: isFilled ? "#FFD700" : "#ddd",
            cursor: "pointer",
            padding: "0",
            transition: "color 0.2s ease",
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
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-gray-200)",
      }}
    >
      <h3
        style={{
          margin: "0 0 1rem",
          color: "var(--color-secondary)",
          fontSize: "1.125rem",
        }}
      >
        Rate this article
      </h3>

      {/* Success Message */}
      {success && (
        <div
          style={{
            backgroundColor: "var(--color-success)",
            color: "white",
            padding: "0.75rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
            fontSize: "0.875rem",
          }}
        >
          ✅ Rating submitted successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
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
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "var(--color-gray-700)",
            }}
          >
            Your Rating:
          </label>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem" }}>{renderStars()}</div>
          {rating > 0 && (
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--color-gray-600)",
                marginLeft: "0.5rem",
              }}
            >
              {rating} star{rating !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Feedback */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "var(--color-gray-700)",
            }}
          >
            Feedback (Optional):
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts about this solution..."
            rows="3"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--color-gray-300)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: rating === 0 ? "var(--color-gray-300)" : "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: rating === 0 ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "0.875rem",
          }}
        >
          {isSubmitting ? "Submitting..." : initialRating > 0 ? "Update Rating" : "Submit Rating"}
        </button>
      </form>
    </div>
  );
};

export default RatingInput;
