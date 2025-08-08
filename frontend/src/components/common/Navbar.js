import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
        color: "var(--color-white)",
        padding: "1rem 0",
        boxShadow: "var(--shadow-md)",
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
        <button
          onClick={() => navigate("/")}
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

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
      </div>
    </nav>
  );
};

export default Navbar;
