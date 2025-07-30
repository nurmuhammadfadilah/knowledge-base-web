// File: frontend/src/components/admin/AdminLayout.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/articles", label: "Articles", icon: "📄" },
    { path: "/admin/categories", label: "Categories", icon: "📁" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "var(--color-secondary)",
          color: "white",
          padding: "1rem 0",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Admin Header */}
        <div
          style={{
            padding: "0 1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "1rem",
          }}
        >
          <h2 style={{ margin: "0", fontSize: "1.25rem" }}>🔧 Admin Panel</h2>
          <p
            style={{
              margin: "0.5rem 0 0",
              fontSize: "0.875rem",
              opacity: "0.8",
            }}
          >
            Welcome, {user?.username}
          </p>
        </div>

        {/* Menu Items */}
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: "100%",
                padding: "1rem 1.5rem",
                border: "none",
                backgroundColor: location.pathname === item.path ? "rgba(255,255,255,0.1)" : "transparent",
                color: "white",
                textAlign: "left",
                cursor: "pointer",
                borderLeft: location.pathname === item.path ? "3px solid var(--color-primary)" : "3px solid transparent",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ marginRight: "0.75rem", fontSize: "1.25rem" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "0",
            right: "0",
            padding: "0 1rem",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "var(--color-error)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "250px",
          flex: "1",
          backgroundColor: "var(--color-gray-50)",
          minHeight: "100vh",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1rem 2rem",
            borderBottom: "1px solid var(--color-gray-200)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                margin: "0",
                color: "var(--color-secondary)",
                fontSize: "1.5rem",
              }}
            >
              {menuItems.find((item) => item.path === location.pathname)?.label || "Admin"}
            </h1>

            <button
              onClick={() => navigate("/")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              👁 View Site
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "0 2rem 2rem" }}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
