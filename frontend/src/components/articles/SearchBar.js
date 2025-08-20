import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const popularRef = useRef(null);

  const popularSearches = ["wifi connection", "slow computer", "printer issues", "email setup"];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && popularRef.current && !popularRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isDropdownOpen, isMobile]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handlePopularClick = (term) => {
    setSearchTerm(term);
    if (isMobile) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (isMobile) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto 2rem",
        position: "relative",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search for solutions, keywords, or problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 3rem 1rem 1rem",
              border: "2px solid var(--color-gray-200)",
              borderRadius: "var(--radius-xl)",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-primary)";
              e.target.style.boxShadow = "0 0 0 3px rgba(215, 38, 56, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-gray-200)";
              e.target.style.boxShadow = "none";
            }}
          />

          {/* Search Icon */}
          <button
            type="submit"
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--color-gray-500)",
              cursor: "pointer",
              fontSize: "1.25rem",
              padding: "0.5rem",
            }}
          >
            🔍
          </button>
        </div>
      </form>

      {/* Popular searches - Mobile Dropdown / Desktop Inline */}
      {!searchTerm && (
        <div
          style={{
            marginTop: "0.75rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-gray-500)",
            position: "relative",
          }}
        >
          {/* Desktop View - Original Style */}
          {!isMobile && (
            <>
              <span>Popular: </span>
              {popularSearches.map((term, index) => (
                <React.Fragment key={term}>
                  <button
                    type="button"
                    onClick={() => handlePopularClick(term)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {term}
                  </button>
                  {index < popularSearches.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </>
          )}

          {/* Mobile View - Dropdown Trigger */}
          {isMobile && (
            <div ref={popularRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                style={{
                  background: "none",
                  border: "1px solid var(--color-gray-300)",
                  borderRadius: "var(--radius-lg)",
                  color: "var(--color-gray-600)",
                  cursor: "pointer",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  margin: "0 auto",
                  transition: "all 0.3s ease",
                  minWidth: "140px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--color-gray-300)";
                  e.target.style.color = "var(--color-gray-600)";
                }}
              >
                <span>Popular searches</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Mobile Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "0.5rem",
                    backgroundColor: "var(--color-white)",
                    border: "1px solid var(--color-gray-200)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    zIndex: 1000,
                    minWidth: "280px",
                    maxWidth: "90vw",
                    animation: "slideDown 0.3s ease-out",
                  }}
                >
                  {/* Dropdown Header */}
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid var(--color-gray-100)",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      color: "var(--color-gray-700)",
                      textAlign: "left",
                    }}
                  >
                    📊 Popular Searches
                  </div>

                  {/* Dropdown Items */}
                  <div style={{ padding: "0.5rem 0" }}>
                    {popularSearches.map((term, index) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handlePopularClick(term)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          border: "none",
                          backgroundColor: "transparent",
                          color: "var(--color-gray-700)",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "var(--color-gray-50)";
                          e.target.style.color = "var(--color-primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "var(--color-gray-700)";
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>🔍</span>
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dropdown Footer */}
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      borderTop: "1px solid var(--color-gray-100)",
                      fontSize: "0.75rem",
                      color: "var(--color-gray-500)",
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    Tap any search to get started
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SearchBar;
