import React, { useState } from "react";
import {
  FaHome,
  FaMusic,
  FaUsers,
  FaDollarSign,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaPaperPlane
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../components/Topbar";

const Sidebar = ({ collapsed, isMobile, toggleSidebar }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const [openMenu, setOpenMenu] = useState(null);

  /* -----------------------------
      FIXED COLLAPSE LOGIC
  ------------------------------ */
  const isCollapsedState = isMobile ? false : collapsed;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      path: "/",
      label: "Home",
      icon: <FaHome />,
      subItems: [
        { label: "Dashboard", path: "/dashboard" },
        
      ],
    },
    {
      path: "/releases",
      label: "Releases",
      icon: <FaMusic />,
      subItems: [{ label: "My Release", path: "/releases/myRelease" }],
    },
    {
      path: "/artists",
      label: "Artists",
      icon: <FaUsers />,
      subItems: [{ label: "List Of Artists", path: "/artists/list" }],
    },
    {
      path: "/lables",
      label: "Lables",
      icon: <FaUsers />,
      subItems: [{ label: "List Of Lables", path: "/lables/list" }],
    },
    {
      path: "/revenue",
      label: "Revenue Reports",
      icon: <FaDollarSign />,
      subItems: [
        { label: "Revenue Reports List", path: "/revenue/reports" },
        { label: "Total Revenue", path: "/revenue/total" },
        { label: "Request Payment", path: "/revenue/request" },
      ],
    },
    {
      path: "/services",
      label: "Services",
      icon: <FaChartBar />,
      subItems: [
        { label: "YouTube OAC Request", path: "/services/youtube-oac" },
        { label: "Youtube Claim Release", path: "/services/claim" },
        { label: "Social Media Links", path: "/services/facebook-insta-profile" },
        { label: "Facebook Claim Release", path: "/services/facebook-claim" },
        { label: "Metadata Update Request", path: "/services/metadata-update" },
      ],
    },
    {
      path: "/requests",
      label: "Request",
      icon: <FaPaperPlane />,
      subItems: [
        { label: "Copyright Claim", path: "/requests/claim" },
        { label: "Official Artist Channel", path: "/requests/artist" },
      ],
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <FaCog />,
      subItems: [
        { label: "Password Change", path: "/settings/password" },
        { label: "Bank Details", path: "/settings/bank-details" },
      ],
    },
  ];

  /* -----------------------------
        THEME COLORS
  ------------------------------ */
  const bgColor =
    theme === "dark"
      ? "bg-[#020726]"
      : "bg-white border-gray-200"; // fixed light mode

  const menuText = theme === "dark" ? "text-[#DDE7FF]" : "text-[#020726]";
  const subText = theme === "dark" ? "text-gray-300" : "text-[#020726]";

  const hoverBg = theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#E8F4FF]";
  const subHoverBg =
    theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#E8F4FF]";

  /* -----------------------------
      SIDEBAR WIDTH (RESPONSIVE)
  ------------------------------ */
  const sidebarWidth = isMobile
    ? collapsed
      ? "translate-x-0 w-60"
      : "-translate-x-full w-60"
    : isCollapsedState
    ? "w-16"
    : "w-60";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && collapsed && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-screen pb-10 flex flex-col overflow-y-auto
          shadow-xl transition-all duration-300 z-50
          ${bgColor}
          ${sidebarWidth}
        `}
      >
        {/* LOGO */}
        <div
          className={`h-[70px] flex items-center justify-center border-b 
            ${theme === "dark" ? "border-white/10" : "border-gray-300"}
          `}
        >
          <img
            src="/image/logo.webp"
            alt="Logo"
            className={`object-contain transition-all ${
              isCollapsedState ? "h-[50px]" : "h-[65px]"
            }`}
          />
        </div>

        {/* MENU LIST */}
        <ul className="mt-3 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              item.subItems?.some((s) => s.path === location.pathname);

            const isOpen = openMenu === item.path;

            return (
              <li key={item.path}>
                {/* MAIN MENU BUTTON */}
                <div
                  onClick={() => toggleMenu(item.path)}
                  className={`flex items-center rounded-md cursor-pointer transition 
                    ${isCollapsedState ? "justify-center py-3" : "px-4 py-3 gap-3"}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white"
                        : `${hoverBg} ${menuText}`
                    }
                  `}
                >
                  <span className="text-[18px]">{item.icon}</span>

                  {!isCollapsedState && (
                    <>
                      <span className="flex-1 text-[15px]">{item.label}</span>
                      <FaChevronDown
                        className={`transition-transform ${
                          isOpen ? "rotate-180 text-white" : "text-gray-400"
                        }`}
                      />
                    </>
                  )}
                </div>

                {/* SUBMENUS */}
                {!isCollapsedState && isOpen && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.subItems?.map((sub) => {
                      const activeSub = location.pathname === sub.path;

                      return (
                        <li key={sub.path}>
                          <Link
                            to={sub.path}
                            className={`block px-3 py-2 rounded-md text-[14px] transition
                              ${
                                activeSub
                                  ? "bg-[#0288D1] text-white"
                                  : `${subText} ${subHoverBg}`
                              }
                            `}
                          >
                            • {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* FADE */}
        <div
          className={`h-6 ${
            theme === "dark"
              ? "bg-gradient-to-t from-[#020726]"
              : "bg-gradient-to-t from-white"
          }`}
        />
      </div>
    </>
  );
};

export default Sidebar;








