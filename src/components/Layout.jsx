// src/components/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { useTheme } from "./Topbar"; // ⭐ Import theme hook

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // ⭐ Get current theme (dark / light)
  const { theme } = useTheme();

  /* -------------------------------------------
      THEME-AWARE STYLES
  ------------------------------------------- */
  const layoutBg =
    theme === "dark" ? "bg-[#020726]" : "bg-white";

  const separatorColor =
    theme === "dark"
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.08)";

  const topSeparatorColor =
    theme === "dark"
      ? "rgba(255,255,255,0.10)"
      : "rgba(0,0,0,0.06)";

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${layoutBg}`}>
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} />

      {/* TOPBAR */}
      <Topbar
        toggleSidebar={() => setCollapsed(!collapsed)}
        isCollapsed={collapsed}
      />

      {/* ─── VERTICAL SEPARATOR LINE ─── */}
      <div
        className="fixed top-0 bottom-0 pointer-events-none transition-all duration-300"
        style={{
          left: collapsed ? "80px" : "240px",
          width: "1px",
          background: separatorColor,
          boxShadow:
            theme === "dark"
              ? "2px 0 12px rgba(0,0,0,0.5)"
              : "2px 0 8px rgba(0,0,0,0.08)",
          zIndex: 50,
        }}
      />

      {/* ─── HORIZONTAL UNDER TOPBAR LINE ─── */}
      <div
        className="fixed left-0 right-0 z-10 transition-all duration-300"
        style={{
          top: "70px",
          height: "1px",
          background: topSeparatorColor,
        }}
      />

      {/* ─── MAIN CONTENT ─── */}
      <main
        className="flex-1 transition-all duration-300 p-6"
        style={{
          marginLeft: collapsed ? "80px" : "240px",
          marginTop: "70px",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        {children}
      </main>

      {/* ─── FOOTER ─── */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: collapsed ? "80px" : "240px",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
