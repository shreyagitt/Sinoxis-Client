import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#020726]">
      <Sidebar collapsed={collapsed} />
      <Topbar toggleSidebar={() => setCollapsed(!collapsed)} isCollapsed={collapsed} />

      {/* ─── VERTICAL SEPARATOR LINE ─── */}
     <div
  className="fixed top-0 bottom-0 pointer-events-none"
  style={{
    left: collapsed ? "80px" : "240px",
    width: "1px",
    background: "rgba(255,255,255,0.12)",
    boxShadow: "2px 0 12px rgba(0,0,0,0.4)",
    transition: "left 0.3s ease",
    zIndex: 50   // ⬅️ IMPORTANT
  }}
/>


      {/* ─── HORIZONTAL UNDER TOPBAR LINE ─── */}
      <div
        className="fixed left-0 right-0 z-10"
        style={{
          top: "70px",
          height: "1px",
          background: "rgba(255,255,255,0.1)"
        }}
      />

      {/* MAIN CONTENT */}
      <main
        className="flex-1 transition-all duration-300 p-6"
        style={{
          marginLeft: collapsed ? "80px" : "240px",
          marginTop: "70px",
          minHeight: "calc(100vh - 70px)"
        }}
      >
        {children}
      </main>

      <div
        style={{
          marginLeft: collapsed ? "80px" : "240px",
          transition: "all 0.3s ease"
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
