import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  hideChrome?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideChrome }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  /* =============================
      LOGIN / REGISTER PAGES
     ============================= */
  if (hideChrome) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors duration-300">
        {children}
      </div>
    );
  }

  /* =============================
      ADMIN LAYOUT
     ============================= */
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#020726] transition-all duration-300">

      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} />

      {/* MAIN CONTENT AREA */}
      <div
        className={`
          flex flex-col flex-1 
          transition-all duration-300 
          ${collapsed ? "ml-[5rem]" : "ml-[16rem]"}
        `}
      >
        {/* TOPBAR — stays perfectly aligned because it lives inside the wrapper */}
        <Topbar onToggleSidebar={() => setCollapsed((prev) => !prev)} />

        {/* PAGE CONTENT */}
        <main
          className="
            flex-1 
            overflow-y-auto 
            p-5 md:p-6

            bg-[#F8FAFC] 
            text-[#020726]

            dark:bg-[#0B1029] 
            dark:text-white

            transition-colors duration-300
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
