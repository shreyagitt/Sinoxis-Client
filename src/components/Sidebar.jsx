import React from "react";
import "./sidebar.css";
import {
  FaHome,
  FaMusic,
  FaUsers,
  FaDollarSign,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ collapsed }) => {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo Section */}
      <div className="logo-section">
        <img src="/image/logo.webp" alt="Sinoxis Logo" className="logo" />
      </div>

      {/* Menu */}
      <ul className="menu">
        <li className="menu-item active">
          <Link to="/dashboard" className="menu-link">
            <FaHome className="icon" />
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/releases" className="menu-link">
            <FaMusic className="icon" />
            {!collapsed && <span>Releases</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/artists" className="menu-link">
            <FaUsers className="icon" />
            {!collapsed && <span>Artists / Labels</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/revenue" className="menu-link">
            <FaDollarSign className="icon" />
            {!collapsed && <span>Revenue Reports</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/services" className="menu-link">
            <FaChartBar className="icon" />
            {!collapsed && <span>Services</span>}
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/settings" className="menu-link">
            <FaCog className="icon" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
