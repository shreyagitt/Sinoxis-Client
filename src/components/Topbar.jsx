// src/components/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { ChevronDown, UserCircle, Settings, LogOut, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";
import Notifications from "./Notifications";

const Topbar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

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

  return (
    <div className={`topbar ${isCollapsed ? "collapsed" : ""}` }>
      <div className="left-section">
        {/* Sidebar Toggle */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars size={20} className="text-white" />
        </button>

        {/* Search Box */}
        <div className="search-box">
          <input type="text" placeholder="Search for results..." />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="topbar-right flex items-center gap-6">
        
        {/* HOME ICON - WHITE */}
        <Link to="/" className="transition">
          <Home size={20} strokeWidth={2.4} className="text-white hover:text-white" />
        </Link>

        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <FaBell
              size={20}
              className="text-white hover:text-white transition"
            />

            {notificationsList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00FF66] text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-md">
                {notificationsList.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <Notifications
              notificationsList={notificationsList}
              removeNotification={removeNotification}
              markAllAsRead={markAllAsRead}
            />
          )}
        </div>

        {/* USER DROPDOWN */}
        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="user-info flex items-center gap-2"
            onClick={() => setOpen((prev) => !prev)}
          >
            {/* USER ICON WITH GRADIENT */}
            <UserCircle 
              size={32}
              strokeWidth={2.2}
              className="text-white p-1.5 rounded-full bg-gradient-to-br from-[#29B6F6] to-[#0288D1]"
            />

            <div className="user-text">
              <span className="user-name">John Doe</span>
            </div>

            <ChevronDown
              size={18}
              strokeWidth={2.2}
              className={`text-white transition ${open ? "rotate-180" : ""}`}
            />
          </button>

        {open && (
  <div className="dropdown-menu animate-fadeIn">
    <Link
      to="/profile"
      className="dropdown-item"
      onClick={() => setOpen(false)}
    >
      <UserCircle
  size={16}
  className="dropdown-icon stroke-current"
  strokeWidth={2}
  stroke="currentColor"
/>
      <span className="text-white">Profile</span>
    </Link>

    <Link
      to="/settings"
      className="dropdown-item"
      onClick={() => setOpen(false)}
    >
      <Settings
  size={16}
  className="dropdown-icon stroke-current"
  strokeWidth={2}
  stroke="currentColor"
/>
      <span className="text-white">Settings</span>
    </Link>

    <button 
      className="dropdown-item logout" 
      onClick={handleLogout}
    >
      <LogOut
  size={16}
  className="dropdown-icon stroke-current"
  strokeWidth={2}
  stroke="currentColor"
/>
      <span className="text-white">Logout</span>
    </button>
  </div>
)}


        </div>

      </div>
    </div>
  );
};

export default Topbar;
