// File: frontend/src/components/articles/CategoryFilter.js
import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        justifyContent: "center",
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "var(--color-white)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <button
        onClick={() => onCategoryChange("")}
        style={{
          padding: "0.5rem 1rem",
          border: "2px solid var(--color-gray-200)",
          borderRadius: "var(--radius-xl)",
          backgroundColor: !selectedCategory ? "var(--color-primary)" : "var(--color-white)",
          color: !selectedCategory ? "white" : "var(--color-gray-700)",
          cursor: "pointer",
          fontWeight: "500",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          if (!selectedCategory) return;
          e.target.style.borderColor = "var(--color-primary)";
          e.target.style.color = "var(--color-primary)";
        }}
        onMouseLeave={(e) => {
          if (!selectedCategory) return;
          e.target.style.borderColor = "var(--color-gray-200)";
          e.target.style.color = "var(--color-gray-700)";
        }}
      >
        All Categories
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          style={{
            padding: "0.5rem 1rem",
            border: "2px solid var(--color-gray-200)",
            borderRadius: "var(--radius-xl)",
            backgroundColor: selectedCategory === category.id ? "var(--color-primary)" : "var(--color-white)",
            color: selectedCategory === category.id ? "white" : "var(--color-gray-700)",
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (selectedCategory === category.id) return;
            e.target.style.borderColor = "var(--color-primary)";
            e.target.style.color = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            if (selectedCategory === category.id) return;
            e.target.style.borderColor = "var(--color-gray-200)";
            e.target.style.color = "var(--color-gray-700)";
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
