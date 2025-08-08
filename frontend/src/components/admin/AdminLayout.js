import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar />

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
        <AdminHeader />

        {/* Page Content */}
        <div style={{ padding: "0 2rem 2rem" }}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
