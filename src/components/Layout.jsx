import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Topbar */}
      <Topbar toggleSidebar={toggleSidebar} isCollapsed={collapsed} />

      {/* Main content area */}
      <main
        className="main-content"
        style={{
          marginLeft: collapsed ? "80px" : "240px",
          marginTop: "70px",
          transition: "all 0.3s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;

