import React, { useState } from "react";
import {
  FaHome,
  FaMusic,
  FaUsers,
  FaDollarSign,
  FaChartBar,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      path: "/",
      label: "Home",
      icon: <FaHome />,
      subItems: [{ label: "Dashboard", path: "/dashboard" }],
    },
    {
      path: "/releases",
      label: "Releases",
      icon: <FaMusic />,
      subItems: [{ label: "My Release", path: "/releases/myRelease" }],
    },
    {
      path: "/artists",
      label: "Artists / Labels",
      icon: <FaUsers />,
      subItems: [
        { label: "List Of Artists", path: "/artists/list" },
        { label: "List Of Labels", path: "/artists/labels" },
      ],
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
      path: "/settings",
      label: "Settings",
      icon: <FaCog />,
      subItems: [
        { label: "Password Change", path: "/settings/password" },
        { label: "Bank Details", path: "/settings/bank-details" },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col bg-white border-r border-gray-200 font-[Poppins] z-20 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-[70px] flex items-center justify-center border-b border-gray-200 px-4">
        <img
          src="/image/logo.webp"
          alt="Logo"
          className={`object-contain transition-all duration-300 ${
            collapsed ? "h-[70px] w-[70px]" : "h-[100px] w-[100px]"
          }`}
        />
      </div>

      {/* Menu */}
      <ul className="flex-1 mt-4 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            item.subItems?.some((sub) => sub.path === location.pathname);
          const isOpen = openMenu === item.path;

          return (
            <li key={item.path}>
              {item.subItems ? (
                <div
                  onClick={() => handleToggle(item.path)}
                  className={`flex items-center cursor-pointer rounded-md transition text-[16px]
                  ${collapsed ? "justify-center py-3" : "px-5 py-3 gap-3"}
                  ${
                    isActive
                      ? "bg-red-500 text-white"
                      : "text-gray-700 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <span className="text-[20px]">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      <FaChevronDown
                        className={`text-[14px] transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-white" : "text-gray-300"
                        }`}
                      />
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center rounded-md transition text-[16px]
                  ${collapsed ? "justify-center py-3" : "px-5 py-3 gap-3"}
                  ${
                    isActive
                      ? "bg-red-500 text-white"
                      : "text-gray-700 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <span className="text-[20px]">{item.icon}</span>
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                </Link>
              )}

              {/* Submenu */}
              {!collapsed && item.subItems && isOpen && (
                <ul className="ml-10 mt-1 space-y-1">
                  {item.subItems.map((sub) => {
                    const isSubActive = location.pathname === sub.path;
                    return (
                      <li key={sub.path}>
                        <Link
                          to={sub.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-[15px]
                            ${
                              isSubActive
                                ? "bg-red-500 text-white font-semibold"
                                : "text-gray-700 hover:bg-red-500 hover:text-white"
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSubActive ? "bg-white" : "bg-gray-400"
                            }`}
                          ></span>
                          {sub.label}
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

      <div className="h-6 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

export default Sidebar;


