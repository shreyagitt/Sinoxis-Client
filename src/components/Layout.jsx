// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { useTheme } from "./Topbar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useTheme();

  /* -------------------------------------------
      APPLY DARK/LIGHT THEME TO <HTML>
  ------------------------------------------- */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  // Now scrollbar CSS will work globally 🎉

  /* -------------------------------------------
      RESPONSIVE WINDOW HANDLING
  ------------------------------------------- */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -------------------------------------------
      THEME COLORS
  ------------------------------------------- */
  const layoutBg = theme === "dark" ? "bg-[#020726]" : "bg-white";

  const separatorColor =
    theme === "dark" ? "rgba(255,255,255,0.10)" : "transparent";

  const topSeparatorColor =
    theme === "dark" ? "rgba(255,255,255,0.08)" : "transparent";

  /* -------------------------------------------
      RESPONSIVE LAYOUT LOGIC
  ------------------------------------------- */
  const sidebarWidth = collapsed ? 80 : 240;
  const mainOffset = isMobile ? 0 : sidebarWidth;

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-300 ${layoutBg}`}
    >
      <Sidebar collapsed={collapsed} isMobile={isMobile} />
      <Topbar
        toggleSidebar={() => setCollapsed((prev) => !prev)}
        isCollapsed={collapsed}
      />

      {!isMobile && (
        <div
          className="fixed top-0 bottom-0 pointer-events-none transition-all duration-300"
          style={{
            left: `${sidebarWidth}px`,
            width: "1px",
            background: separatorColor,
            boxShadow:
              theme === "dark"
                ? "2px 0 12px rgba(0,0,0,0.35)"
                : "none",
            zIndex: 25,
          }}
        />
      )}

      <div
        className="fixed left-0 right-0 z-20"
        style={{
          top: "70px",
          height: "1px",
          background: topSeparatorColor,
        }}
      />

      <main
        className="flex-1 transition-all duration-300 p-4 md:p-6"
        style={{
          marginLeft: `${mainOffset}px`,
          marginTop: "70px",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        {children}
      </main>

      <div
        className="transition-all duration-300"
        style={{
          marginLeft: `${mainOffset}px`,
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
