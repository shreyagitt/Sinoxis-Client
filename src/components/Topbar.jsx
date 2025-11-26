// src/components/Topbar.jsx
import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { FaBell, FaBars } from "react-icons/fa";
import {
  ChevronDown,
  UserCircle,
  Settings,
  LogOut,
  Home,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";
import Notifications from "./Notifications";

/* ============================================================
    🌗 THEME CONTEXT
   ============================================================ */
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Provider for global theme
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Apply Tailwind's dark class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/* ============================================================
    🔵 TOPBAR COMPONENT
   ============================================================ */
const Topbar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const [notificationsList, setNotificationsList] = useState([
    {
      title: "Desktop notification turned on",
      desc: "Now you will receive desktop notifications",
      time: "1 min ago",
    },
    {
      title: "Admin settings",
      desc: "Setup complete",
      time: "8 min ago",
    },
    {
      title: "Mailbox",
      desc: "You have 15 unread mails.",
      time: "9 min ago",
    },
    {
      title: "Order received",
      desc: "New order received.",
      time: "10 min ago",
    },
  ]);

  const removeNotification = (index) => {
    setNotificationsList((prev) => prev.filter((_, i) => i !== index));
  };

  const markAllAsRead = () => {
    setNotificationsList([]);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---------------------------------------------
      🌗 THEME-ADAPTIVE STYLES
     --------------------------------------------- */
  const topbarBg =
    theme === "dark"
      ? "bg-[#020726] border-b border-white/10"
      : "bg-white border-b border-gray-200";

  const textColor = theme === "dark" ? "text-white" : "text-[#020726]";

  const iconColor = theme === "dark" ? "text-white" : "text-[#020726]";

  const searchBg =
    theme === "dark"
      ? "bg-[#1f233d] text-white placeholder-gray-400"
      : "bg-gray-100 text-[#020726] placeholder-gray-500";

  const dropdownBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border border-gray-300 text-[#020726]";

  return (
    <div className={`topbar flex justify-between items-center px-4 h-[70px] ${topbarBg}`}>
      
      {/* LEFT SECTION */}
      <div className="left-section flex items-center gap-4">

        {/* Sidebar Toggle */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars size={20} className={iconColor} />
        </button>

        {/* Search box */}
        <div className={`search-box`}>
          <input
            type="text"
            placeholder="Search for results..."
            className={`rounded-md px-3 py-2 outline-none ${searchBg}`}
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="topbar-right flex items-center gap-6">

        {/* 🌗 THEME TOGGLE BUTTON */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full border transition ${
            theme === "dark"
              ? "border-white/20 hover:bg-white/10"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-white" />
          ) : (
            <Moon size={20} className="text-[#020726]" />
          )}
        </button>

        {/* HOME ICON */}
        <Link to="/" className="transition">
          <Home size={20} strokeWidth={2.4} className={iconColor} />
        </Link>

        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell size={20} className={iconColor} />
          </button>

          {notificationsList.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#00FF66] text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-md">
              {notificationsList.length}
            </span>
          )}

          {showNotifications && (
            <div className={`absolute right-0 mt-3 shadow-xl rounded-lg ${dropdownBg}`}>
              <Notifications
                notificationsList={notificationsList}
                removeNotification={removeNotification}
                markAllAsRead={markAllAsRead}
              />
            </div>
          )}
        </div>

        {/* USER DROPDOWN */}
        <div className="user-dropdown relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2"
            onClick={() => setOpen((prev) => !prev)}
          >
            {/* USER ICON */}
            <UserCircle
              size={32}
              strokeWidth={2.2}
              className="p-1.5 rounded-full bg-gradient-to-br from-[#29B6F6] to-[#0288D1] text-white"
            />

            <span className={`${textColor} font-medium`}>John Doe</span>

            <ChevronDown
              size={18}
              strokeWidth={2.2}
              className={`${iconColor} transition ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              className={`dropdown-menu absolute right-0 mt-3 rounded-lg shadow-xl p-3 w-44 animate-fadeIn ${dropdownBg}`}
            >
              <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                <UserCircle size={16} className={iconColor} />
                <span className={textColor}>Profile</span>
              </Link>

              <Link to="/settings" className="dropdown-item" onClick={() => setOpen(false)}>
                <Settings size={16} className={iconColor} />
                <span className={textColor}>Settings</span>
              </Link>

              <button
                className="dropdown-item flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} className={iconColor} />
                <span className={textColor}>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Topbar;

