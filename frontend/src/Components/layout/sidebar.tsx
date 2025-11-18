import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Music,
  BarChart3,
  User,
  BadgeDollarSign,
  Settings,
  Bell,
  FolderCog,
  ShieldCheck,
  FileText,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { to: "/releases", label: "Releases", icon: <Music className="w-5 h-5" /> },
    {
      to: "/revenue",
      label: "Revenue Reports",
      icon: <BarChart3 className="w-5 h-5" />,
      subItems: [
        { label: "Revenue Reports List", to: "/revenue/reports" },
        { label: "Total Revenue", to: "/revenue/total" },
        { label: "Request Payment", to: "/revenue/request" },
      ],
    },
    { to: "/artists", label: "Artists", icon: <User className="w-5 h-5" /> },
    { to: "/labels", label: "Labels", icon: <BadgeDollarSign className="w-5 h-5" /> },
    {
      to: "/services",
      label: "Services",
      icon: <ShieldCheck className="w-5 h-5" />,
      subItems: [
        { label: "YouTube OAC Request", to: "/services/youtube-oac" },
        { label: "Youtube Claim Release", to: "/services/claim" },
        { label: "Social Media Links", to: "/services/facebook-insta-profile" },
        { label: "Facebook Claim Release", to: "/services/facebook-claim" },
        { label: "Metadata Update Request", to: "/services/metadata-update" },
      ],
    },

    { to: "/notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { to: "/banksettings", label: "Bank Settings", icon: <FolderCog className="w-5 h-5" /> },
    { to: "/form", label: "Apply Form Management", icon: <FileText className="w-5 h-5" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 shadow-sm overflow-y-auto transition-all duration-300 flex flex-col",
        collapsed ? "w-[5rem]" : "w-[16rem]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b">
        {collapsed ? (
          <img src="/image/logo.webp" alt="Sinoxis Logo" className="w-10 h-10" />
        ) : (
          <NavLink to="/" className="flex items-center gap-3">
            <img src="/image/logo.webp" alt="Sinoxis Logo" className="w-12 h-12" />
          </NavLink>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-6 px-2 pb-8">
        {!collapsed && (
          <div className="px-4 pt-2 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main Menu
          </div>
        )}

        <ul className="space-y-1 relative">
          {menuItems.map((item, index) => {
            const isActiveMain = location.pathname.startsWith(item.to);

            const hasSub = item.subItems && item.subItems.length > 0;
            const isOpen = openMenu === item.label || isActiveMain;

            return (
              <li key={index}>
                {/* Main item */}
                <div
                  onClick={() => hasSub && !collapsed && toggleMenu(item.label)}
                  className={clsx(
                    "flex items-center justify-between px-4 py-3 text-sm rounded-md cursor-pointer transition-colors group relative",
                    isActiveMain
                      ? "bg-green-600 text-white font-semibold"
                      : "text-gray-800 hover:bg-gray-100"
                  )}
                >
                  <NavLink
                    to={item.to}
                    className="flex items-center gap-3 flex-grow"
                  >
                    {/* Icon */}
                    <span
                      className={clsx(
                        "transition-colors",
                        "group-hover:text-green-600",
                        isActiveMain ? "text-white" : "text-green-600"
                      )}
                    >
                      {item.icon}
                    </span>

                    {/* Label */}
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>

                  {/* Arrow for submenus */}
                  {hasSub && !collapsed && (
                    <span
                      className={clsx(
                        "transition-colors",
                        "group-hover:text-green-600",
                        isActiveMain ? "text-white" : "text-green-600"
                      )}
                    >
                      {isOpen ? "▲" : "▼"}
                    </span>
                  )}

                  {/* Tooltip (when collapsed) */}
                  {collapsed && (
                    <span className="absolute left-20 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Submenu */}
                {hasSub && isOpen && !collapsed && (
                  <ul className="ml-10 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {item.subItems!.map((sub, idx) => {
                      const isActiveSub = location.pathname === sub.to;

                      return (
                        <li key={idx}>
                          <NavLink
                            to={sub.to}
                            className={clsx(
                              "block text-sm px-2 py-2 rounded-md",
                              isActiveSub
                                ? "text-green-600 font-semibold"
                                : "text-gray-600 hover:text-green-600"
                            )}
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
