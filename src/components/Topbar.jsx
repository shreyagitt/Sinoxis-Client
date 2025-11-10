import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { ChevronDown, UserCircle, Settings, LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import './topbar.css'
import Notifications from "./Notifications"; // 👈 Import component

const Topbar = ({ isCollapsed, toggleSidebar }) => {
  const [open, setOpen] = useState(false); // user dropdown
  const [showNotifications, setShowNotifications] = useState(false); // notification popup

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // ✅ Notification Data State
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

  // ✅ Remove Notification
  const removeNotification = (index) => {
    setNotificationsList((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Mark All as Read
  const markAllAsRead = () => {
    setNotificationsList([]);
  };

  // ✅ Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`topbar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="left-section">
        {/* Sidebar toggle button */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars size={20} />
        </button>

        <div className="search-box">
          <input type="text" placeholder="Search for results..." />
        </div>
      </div>

      <div className="topbar-right flex items-center gap-6">

        {/* Home */}
        <Link to="/" className="text-red-700 hover:text-red-800 transition">
          <Home size={18} />
        </Link>

        {/* 🔔 Notification Bell + Badge + Dropdown */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
            <FaBell className="cursor-pointer text-red-600  transition" size={20} />

            {notificationsList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
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

        {/* User Menu */}
        <div className="user-dropdown" ref={dropdownRef}>
          <button className="user-info flex items-center gap-2" onClick={() => setOpen((prev) => !prev)}>
            <UserCircle className="user-icon " />
            <div className="user-text">
              <span className="user-name">Alex Mora</span>
              <span className="user-role">Admin</span>
            </div>
            <ChevronDown className={`chevron ${open ? "rotate" : ""}`} size={16} />
          </button>

          {open && (
            <div className="dropdown-menu animate-fadeIn">
              <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                <UserCircle size={16} className="dropdown-icon" /> Profile
              </Link>

              <Link to="/settings" className="dropdown-item" onClick={() => setOpen(false)}>
                <Settings size={16} className="dropdown-icon" /> Settings
              </Link>

              <button className="dropdown-item logout" onClick={() => alert("Logged out!")}>
                <LogOut size={16} className="dropdown-icon" /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Topbar;

