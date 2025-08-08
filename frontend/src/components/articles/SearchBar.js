import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

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

      {/* Popular searches hint */}
      {!searchTerm && (
        <div
          style={{
            marginTop: "0.75rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-gray-500)",
          }}
        >
          <span>Popular: </span>
          {["wifi connection", "slow computer", "printer issues", "email setup"].map((term, index) => (
            <React.Fragment key={term}>
              <button
                type="button"
                onClick={() => setSearchTerm(term)}
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
              {index < 3 && <span>, </span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
