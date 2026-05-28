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
//import { useTheme } from "../components/Topbar";

const Sidebar = ({ collapsed, isMobile, toggleSidebar }) => {
  const location = useLocation();
  //const { theme } = useTheme();
  const [openMenu, setOpenMenu] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
const permissions = user?.permissions || {};

  /* -----------------------------
      FIXED COLLAPSE LOGIC
  ------------------------------ */
  const isCollapsedState = isMobile ? false : collapsed;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      path: "/dashboard",
      label: "Home",
      icon: <FaHome />,
      permission: "dashboard",
     /* subItems: [
        { label: "Dashboard", path: "/dashboard" },
        
      ],*/
    },
   {
  path: "/releases/myRelease",
  label: "Releases",
  icon: <FaMusic />,
  roles: ["client"],              // who can ever see it
  permission: "release", // admin toggle
  //subItems: [{ label: "My Release", path: "/releases/myRelease" }],
},
    {
      path: "/artists/list",
      label: "Artists",
      icon: <FaUsers />,
      roles: ["client"],              // who can ever see it
  permission: "artists",
      //subItems: [{ label: "List Of Artists", path: "/artists/list" }],
    },
    {
      path: "/lables/list",
      label: "Lables",
      icon: <FaUsers />,
      permission:"labels",
      //subItems: [{ label: "List Of Lables", path: "/lables/list" }],
    },
    {
      path: "/revenue",
      label: "Revenue Reports",
      icon: <FaDollarSign />,
      permission:"revenueReports",
      subItems: [
        { label: "Revenue Reports List",permission:"revenueReportList", path: "/revenue/reports" },
        { label: "Total Revenue",permission:"totalRevenue", path: "/revenue/total" },
        { label: "Request Payment",permission:"requestPayment", path: "/revenue/request" },
      ],
    },
    {
      path: "/services",
      label: "Services",
      icon: <FaChartBar />,
      permission:"services",
      subItems: [
        { label: "YouTube OAC Request",permission:"youtubeOACRequest", path: "/services/youtube-oac" },
        { label: "Youtube Claim Release",permission:"youtubeClaimRelease", path: "/services/claim" },
        { label: "Social Media Links",permission:"socialMediaLinks", path: "/services/facebook-insta-profile" },
        { label: "Facebook Claim Release",permission:"facebookClaimRelease", path: "/services/facebook-claim" },
        { label: "Metadata Update Request",permission:"metadataUpdateRequest", path: "/services/metadata-update" },
      ],
    },
    {
      path: "/requests",
      label: "Request",
      icon: <FaPaperPlane />,
      permission:"requests",
      subItems: [
        { label: "Copyright Claim",permission:"copyrightClaim", path: "/requests/claim" },
        { label: "Official Artist Channel",permission:"officialArtistChannel", path: "/requests/artist" },
      ],
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <FaCog />,
      permission:"settings",
      subItems: [
        { label: "Password Change",permission:"passwordChange", path: "/settings/password" },
        { label: "Bank Details",permission:"bankDetails", path: "/settings/bank-details" },
      ],
    },
  ];

  /* -----------------------------
        THEME COLORS
  ------------------------------ */
  /*const bgColor =
    theme === "dark"
      ? "bg-[#020726]"
      : "bg-white border-gray-200"; // fixed light mode

  const menuText = theme === "dark" ? "text-[#DDE7FF]" : "text-[#020726]";
  const subText = theme === "dark" ? "text-gray-300" : "text-[#020726]";

  const hoverBg = theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#E8F4FF]";
  const subHoverBg =
    theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#E8F4FF]"; */

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
          bg-white dark:bg-[#020726] border-r border-gray-200 dark:border-white/10
          ${sidebarWidth}
        `}
      >
        {/* LOGO */}
        <div
          className={`h-[70px] flex items-center justify-center border-b 
            border-gray-300 dark:border-white/10
          `}
        >
        <img
  src="/logo3.png"
  className={`object-contain dark:hidden ${
    isCollapsedState ? "h-[50px]" : "h-[65px]"
  }`}
/>

<img
  src="/image/logo.webp"
  className={`object-contain hidden dark:block ${
    isCollapsedState ? "h-[50px]" : "h-[65px]"
  }`}
/>
        </div>

        {/* MENU LIST */}
       <ul className="mt-3 px-3 space-y-1">
  {menuItems
    .filter((item) => {
      // 1️⃣ Role-based visibility
      if (item.roles && !item.roles.includes(user.role)) {
        return false;
      }

      // 2️⃣ Parent permission
      if (item.permission && permissions[item.permission] === false) {
        return false;
      }

      // 3️⃣ If has submenus → at least ONE must be visible
      if (item.subItems?.length) {
        const hasVisibleSub = item.subItems.some(
          (sub) =>
            !sub.permission || permissions[sub.permission] === true
        );
        return hasVisibleSub;
      }

      return true;
    })
    .map((item) => {
      const isActive =
        location.pathname === item.path ||
        item.subItems?.some((s) => s.path === location.pathname);

      const isOpen = openMenu === item.path;

      return (
        <li key={item.path}>
  {item.subItems ? (
    /* MENU WITH DROPDOWN */
    <div
      onClick={() => toggleMenu(item.path)}
      className={`flex items-center rounded-md cursor-pointer transition 
        ${isCollapsedState ? "justify-center py-3" : "px-4 py-3 gap-3"}
        ${
          isActive
            ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white"
            : "text-[#020726] dark:text-[#DDE7FF] hover:bg-[#E8F4FF] dark:hover:bg-white/10"
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
  ) : (
    /* MENU WITHOUT DROPDOWN */
    <Link
      to={item.path}
      className={`flex items-center rounded-md transition 
        ${isCollapsedState ? "justify-center py-3" : "px-4 py-3 gap-3"}
        ${
          isActive
            ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white"
            : "text-[#020726] dark:text-[#DDE7FF] hover:bg-[#E8F4FF] dark:hover:bg-white/10"
        }
      `}
    >
      <span className="text-[18px]">{item.icon}</span>
      {!isCollapsedState && (
        <span className="text-[15px]">{item.label}</span>
      )}
    </Link>
  )}

  {/* SUBMENUS */}
  {!isCollapsedState && item.subItems && isOpen && (
    <ul className="ml-8 mt-1 space-y-1">
      {item.subItems
        ?.filter(
          (sub) =>
            !sub.permission || permissions[sub.permission] === true
        )
        .map((sub) => {
          const activeSub = location.pathname === sub.path;

          return (
            <li key={sub.path}>
              <Link
                to={sub.path}
                className={`block px-3 py-2 rounded-md text-[14px] transition
                  ${
                    activeSub
                      ? "bg-[#0288D1] text-white"
                      : "text-[#020726] dark:text-gray-300 hover:bg-[#E8F4FF] dark:hover:bg-white/10"
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
        <div className="h-6 bg-gradient-to-t from-white dark:from-[#020726]" />
      </div>
    </>
  );
};

export default Sidebar;








