import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/articles", label: "Articles", icon: "📄" },
    { path: "/admin/categories", label: "Categories", icon: "📁" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
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
  );
};

export default AdminHeader;
