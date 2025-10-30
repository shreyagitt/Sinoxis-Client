import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  HelpCircle,
  Settings,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    
    { to: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { to: "/help", label: "Help", icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 shadow-sm overflow-y-auto transition-all duration-300 flex flex-col",
        collapsed ? "w-[5rem]" : "w-[16rem]"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 border-b">
        {collapsed ? (
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        ) : (
          <NavLink to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Lakshya IAS Logo" className="w-12 h-12" />
            
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
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
  to={item.to}
  className={({ isActive }) =>
    clsx(
      "flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors group relative",
      isActive
        ? "bg-green-600 text-white font-semibold"
        : "text-gray-800 hover:bg-gray-100"
    )
  }
>
  {/* Icon — now turns white when active */}
  <span
    className={clsx(
      "transition-colors",
      "group-hover:text-green-600",
      "text-green-600",
      {
        "text-white": window.location.pathname === item.to, // make icon white on active
      }
    )}
  >
    {item.icon}
  </span>

  {/* Label */}
  {!collapsed && <span>{item.label}</span>}

  {/* Tooltip when collapsed */}
  {collapsed && (
    <span className="absolute left-20 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {item.label}
    </span>
  )}
</NavLink>

            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
