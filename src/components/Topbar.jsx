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
import Notifications from "./Notifications";

/* 🌗 Theme Context */
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/* ======================================================
     🔵  TOPBAR — PURE TAILWIND VERSION
====================================================== */
const Topbar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser
    ? `${storedUser.firstName} ${storedUser.lastName}`
    : "User";

  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const [notificationsList, setNotificationsList] = useState([
    { title: "Desktop notification turned on", desc: "Now you will receive notifications", time: "1 min ago" },
    { title: "Admin settings", desc: "Setup complete", time: "8 min ago" },
    { title: "Mailbox", desc: "15 unread mails", time: "9 min ago" },
    { title: "Order received", desc: "New order received", time: "10 min ago" },
  ]);

  const removeNotification = (index) =>
    setNotificationsList((prev) => prev.filter((_, i) => i !== index));

  const markAllAsRead = () => setNotificationsList([]);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* Tailwind theme-based classes */
  const topbarBg =
    theme === "dark"
      ? "bg-[#020726] border-b border-white/10"
      : "bg-white border-b border-gray-200";

  const textColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const iconColor = theme === "dark" ? "text-white" : "text-[#020726]";

  const searchStyles =
    theme === "dark"
      ? "bg-[#1f233d] placeholder-white text-white"
      : "bg-gray-100 placeholder-black text-black";

  const dropdownBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10"
      : "bg-white border border-gray-300";

  return (
    <div
      className={`fixed top-0 z-50 h-[70px] flex items-center justify-between px-4 transition-all duration-300 
      ${isCollapsed ? "md:left-[80px] md:w-[calc(100%-80px)]" : "md:left-[240px] md:w-[calc(100%-240px)]"} 
      left-0 w-full ${topbarBg}`}
    >

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 w-[60%]">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 border border-blue-400/30 rounded-md hover:bg-gray-200/30 dark:hover:bg-white/10"
        >
          <FaBars size={20} className={iconColor} />
        </button>

        {/* SEARCH BOX */}
        <div
          className={`flex items-center rounded-lg px-3 py-2 border gap-2 transition-all duration-300 
          w-full max-w-[150px] sm:max-w-[200px] md:max-w-[260px] lg:max-w-[320px] ${searchStyles}`}
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-sm "
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

       {/* Theme Toggle */}
<button
  onClick={toggleTheme}
  className={`p-2 rounded-full border transition ${
    theme === "dark"
      ? "border-white text-white hover:bg-white/10"  // ⭐ Match Home icon style
      : "border-gray-300 text-[#020726] hover:bg-gray-100"
  }`}
>
  {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
</button>


{/* Home Icon */}
<Link to="/">
  <Home size={24} className={iconColor} />
</Link>


        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell size={22} className={iconColor} />
          </button>

          {/* Badge */}
          {notificationsList.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {notificationsList.length}
            </span>
          )}

          {/* Dropdown */}
          {showNotifications && (
          

              <Notifications
                notificationsList={notificationsList}
                removeNotification={removeNotification}
                markAllAsRead={markAllAsRead}
              />
            
          )}
        </div>

        {/* USER DROPDOWN */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <UserCircle
              size={32}
              className="p-1.5 rounded-full bg-gradient-to-br from-[#29B6F6] to-[#0288D1] text-white"
            />

            {/* Username (hidden on mobile) */}
            <span className={`font-medium hidden sm:inline ${textColor}`}>
              {userName}
            </span>

            <ChevronDown
              size={18}
              className={`hidden sm:inline transition-transform ${open ? "rotate-180" : ""} ${iconColor}`}
            />
          </button>

          {/* Dropdown menu */}
          {open && (
            <div
              className={`absolute right-0 mt-3 w-44 rounded-lg shadow-xl p-3 animate-fadeIn ${dropdownBg}`}
            >
              <Link className="flex items-center gap-2 py-2" to="/profile">
                <UserCircle size={16} className={iconColor} />
                <span className={textColor}>Profile</span>
              </Link>

              <Link className="flex items-center gap-2 py-2" to="/settings">
                <Settings size={16} className={iconColor} />
                <span className={textColor}>Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 w-full"
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

