import React, { useState, useRef, useEffect } from "react";
import "./topbar.css";
import { FaBell,FaBars } from "react-icons/fa";
import { ChevronDown, User, Settings, LogOut, UserCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Topbar = ({ isCollapsed, toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    alert("Logged out!"); // replace with your logic
    setOpen(false);
  };

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

      <div className="topbar-right flex items-center gap-4">
        {/* Home icon */}
        <Link
          to="/"
          className="home-icon flex items-center text-red-700 hover:text-[#d90429] transition"
        >
          <Home size={18} />
        </Link>

        {/* Notification bell */}
        <FaBell className="bell-icon" />

        {/* User dropdown */}
        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="user-info flex items-center gap-2"
            onClick={() => setOpen((prev) => !prev)}
          >
            <UserCircle className="user-icon" />
            <div className="user-text">
              <span className="user-name">Alex Mora</span>
              <span className="user-role">Admin</span>
            </div>
            <ChevronDown
              className={`chevron ${open ? "rotate" : ""}`}
              size={16}
            />
          </button>

          {open && (
            <div className="dropdown-menu animate-fadeIn">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setOpen(false)}
              >
                <User size={16} className="dropdown-icon" /> Profile
              </Link>

              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() => setOpen(false)}
              >
                <Settings size={16} className="dropdown-icon" /> Settings
              </Link>

              <button
                className="dropdown-item logout"
                onClick={handleLogout}
              >
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
