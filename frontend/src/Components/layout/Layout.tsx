import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
  hideChrome?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideChrome }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  if (hideChrome) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 transition-all duration-300">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main section — shifts dynamically based on sidebar width */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "ml-[5rem]" : "ml-[16rem]"
        }`}
      >
        <Topbar onToggleSidebar={() => setCollapsed((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
