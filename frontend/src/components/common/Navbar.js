import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
    setIsMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate("/admin/dashboard");
    setIsMobileMenuOpen(false);
  };

  const handleHome = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
        color: "var(--color-white)",
        padding: "1rem 0",
        boxShadow: "var(--shadow-md)",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo/Brand */}
        <button
          onClick={handleHome}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-white)",
            fontSize: "1.5rem",
            fontWeight: "700",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          🔧 Troubleshooting KB
        </button>

        {/* Desktop Menu */}
        <div
          className="desktop-menu"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {isAuthenticated && (
            <>
              <span style={{ fontSize: "0.875rem", opacity: "0.9" }}>Welcome, {user?.username}</span>
              <button
                onClick={handleDashboard}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "var(--color-white)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                }}
              >
                Dashboard
              </button>
            </>
          )}

          <button
            onClick={handleAuthAction}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "var(--color-white)",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            {isAuthenticated ? "Logout" : "Admin Login"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--color-white)",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.25rem",
          }}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            background: "var(--color-primary-dark)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {isAuthenticated && (
              <>
                <div
                  style={{
                    fontSize: "0.875rem",
                    opacity: "0.9",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Welcome, {user?.username}
                </div>
                <button
                  onClick={handleDashboard}
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "var(--color-white)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  📊 Dashboard
                </button>
              </>
            )}

            <button
              onClick={handleAuthAction}
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "var(--color-white)",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.875rem",
                textAlign: "left",
                width: "100%",
              }}
            >
              {isAuthenticated ? "🚪 Logout" : "🔑 Admin Login"}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navbar Responsive Styles */}
      <style>{`
        /* Mobile phones (up to 768px) */
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          
          .mobile-menu-button {
            display: block !important;
          }
          
          /* Adjust logo font size on very small screens */
          @media (max-width: 480px) {
            nav button[style*="fontSize: 1.5rem"] {
              font-size: 1.2rem !important;
            }
          }
        }
        
        /* Tablets and up (769px+) */
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
        
        /* Ensure mobile menu is above other content */
        .mobile-menu {
          animation: slideDown 0.2s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Make mobile menu buttons more touch-friendly */
        @media (max-width: 768px) {
          .mobile-menu button {
            min-height: 48px;
          }
        }

        /* Hover effects for desktop */
        @media (min-width: 769px) {
          .desktop-menu button:hover {
            background-color: rgba(255, 255, 255, 0.3) !important;
            transition: background-color 0.2s ease;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
