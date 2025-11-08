import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer"; // ✅ Import existing Footer

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="layout-container min-h-screen flex flex-col bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Topbar */}
      <Topbar toggleSidebar={toggleSidebar} isCollapsed={collapsed} />

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300 p-6"
        style={{
          marginLeft: collapsed ? "80px" : "240px",
          marginTop: "70px",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <div
        style={{
          marginLeft: collapsed ? "80px" : "240px",
          transition: "all 0.3s ease",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;


