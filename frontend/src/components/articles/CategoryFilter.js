import React, { useState, useEffect } from "react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isMobile]);

  const buttonBaseStyle = {
    padding: "0.5rem 1rem",
    border: "2px solid var(--color-gray-200)",
    borderRadius: "var(--radius-xl)",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    fontSize: "0.875rem",
    letterSpacing: "0.025em",
    outline: "none",
    position: "relative",
    overflow: "hidden",
  };

  const getButtonStyle = (isSelected) => ({
    ...buttonBaseStyle,
    backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-white)",
    color: isSelected ? "white" : "var(--color-gray-700)",
    transform: isSelected ? "translateY(-1px)" : "translateY(0)",
    boxShadow: isSelected ? "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
  });

  const getMobileButtonStyle = (isSelected) => ({
    width: "100%",
    padding: "1rem 1.5rem",
    border: "none",
    borderBottom: "1px solid var(--color-gray-200)",
    borderRadius: "0",
    backgroundColor: isSelected ? "var(--color-primary)" : "transparent",
    color: isSelected ? "white" : "var(--color-gray-700)",
    cursor: "pointer",
    fontWeight: isSelected ? "600" : "500",
    fontSize: "1rem",
    textAlign: "left",
    transition: "all 0.3s ease",
    outline: "none",
  });

  const handleMouseEnter = (e, isSelected) => {
    if (isSelected || isMobile) return;
    e.target.style.borderColor = "var(--color-primary)";
    e.target.style.color = "var(--color-primary)";
    e.target.style.transform = "translateY(-1px)";
    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
  };

  const handleMouseLeave = (e, isSelected) => {
    if (isSelected || isMobile) return;
    e.target.style.borderColor = "var(--color-gray-200)";
    e.target.style.color = "var(--color-gray-700)";
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
  };

  const handleMobileHover = (e, isSelected) => {
    if (isSelected) return;
    e.target.style.backgroundColor = "var(--color-gray-50)";
  };

  const handleMobileLeave = (e, isSelected) => {
    if (isSelected) return;
    e.target.style.backgroundColor = "transparent";
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return "All Categories";
    const category = categories?.find((cat) => cat.id === selectedCategory);
    return category ? category.name : "All Categories";
  };

  // Mobile View
  if (isMobile) {
    return (
      <>
        {/* Mobile Trigger Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-gray-100)",
          }}
        >
          <button
            onClick={() => setIsMenuOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid var(--color-gray-200)",
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--color-white)",
              color: "var(--color-gray-700)",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "0.875rem",
              transition: "all 0.3s ease",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "0.5rem" }}>📂</span>
              {getSelectedCategoryName()}
            </span>
            <span style={{ fontSize: "1.2rem" }}>☰</span>
          </button>
        </div>

        {/* Full Screen Mobile Menu */}
        {isMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
              animation: "fadeIn 0.3s ease-out",
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "var(--color-white)",
                transform: isMenuOpen ? "translateY(0)" : "translateY(-100%)",
                transition: "transform 0.3s ease-out",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.5rem",
                  borderBottom: "2px solid var(--color-gray-100)",
                  backgroundColor: "var(--color-white)",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "var(--color-gray-900)",
                  }}
                >
                  📂 Select Category
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: "0.5rem",
                    border: "none",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--color-gray-100)",
                    color: "var(--color-gray-600)",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--color-gray-200)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "var(--color-gray-100)";
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Menu Items */}
              <div style={{ padding: "1rem 0" }}>
                {/* All Categories Button */}
                <button onClick={() => handleCategorySelect("")} style={getMobileButtonStyle(!selectedCategory)} onMouseEnter={(e) => handleMobileHover(e, !selectedCategory)} onMouseLeave={(e) => handleMobileLeave(e, !selectedCategory)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center" }}>All Categories</span>
                    {!selectedCategory && <span style={{ fontSize: "1.2rem", color: "white" }}>✓</span>}
                  </div>
                </button>

                {/* Category Buttons */}
                {categories &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      style={getMobileButtonStyle(selectedCategory === category.id)}
                      onMouseEnter={(e) => handleMobileHover(e, selectedCategory === category.id)}
                      onMouseLeave={(e) => handleMobileLeave(e, selectedCategory === category.id)}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", alignItems: "center" }}>
                          {category.icon && <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>{category.icon}</span>}
                          {category.name}
                          {category.count !== undefined && (
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                fontSize: "0.875rem",
                                opacity: 0.7,
                                fontWeight: "400",
                              }}
                            >
                              ({category.count})
                            </span>
                          )}
                        </span>
                        {selectedCategory === category.id && <span style={{ fontSize: "1.2rem", color: "white" }}>✓</span>}
                      </div>
                    </button>
                  ))}

                {/* Empty State */}
                {(!categories || categories.length === 0) && (
                  <div
                    style={{
                      padding: "2rem",
                      color: "var(--color-gray-500)",
                      fontSize: "1rem",
                      fontStyle: "italic",
                      textAlign: "center",
                    }}
                  >
                    No categories available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
      </>
    );
  }

  // Desktop View (Original)
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        justifyContent: "center",
        marginBottom: "2rem",
        padding: "1.25rem",
        backgroundColor: "var(--color-white)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--color-gray-100)",
      }}
    >
      {/* All Categories Button */}
      <button
        onClick={() => handleCategorySelect("")}
        style={getButtonStyle(!selectedCategory)}
        onMouseEnter={(e) => handleMouseEnter(e, !selectedCategory)}
        onMouseLeave={(e) => handleMouseLeave(e, !selectedCategory)}
        aria-pressed={!selectedCategory}
        role="tab"
      >
        <span style={{ position: "relative", zIndex: 1 }}>All Categories</span>
      </button>

      {/* Category Buttons */}
      {categories &&
        categories.length > 0 &&
        categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            style={getButtonStyle(selectedCategory === category.id)}
            onMouseEnter={(e) => handleMouseEnter(e, selectedCategory === category.id)}
            onMouseLeave={(e) => handleMouseLeave(e, selectedCategory === category.id)}
            aria-pressed={selectedCategory === category.id}
            role="tab"
            title={`Filter by ${category.name}`}
          >
            <span style={{ position: "relative", zIndex: 1 }}>
              {category.icon && <span style={{ marginRight: "0.5rem" }}>{category.icon}</span>}
              {category.name}
              {category.count !== undefined && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.75rem",
                    opacity: selectedCategory === category.id ? 0.9 : 0.6,
                    fontWeight: "400",
                  }}
                >
                  ({category.count})
                </span>
              )}
            </span>
          </button>
        ))}

      {/* Empty State */}
      {(!categories || categories.length === 0) && (
        <div
          style={{
            padding: "1rem",
            color: "var(--color-gray-500)",
            fontSize: "0.875rem",
            fontStyle: "italic",
            textAlign: "center",
            width: "100%",
          }}
        >
          No categories available
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
