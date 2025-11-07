import React from "react";

const Topbar = () => {
  const headerStyle = {
    marginBottom: "-70.4px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
  };

  const logoStyle = {
    height: "40px",
    marginRight: "10px",
  };

  const searchContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    maxWidth: "400px",
    marginLeft: "20px",
  };

  const searchInputStyle = {
    flex: 1,
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "8px 12px",
  };

  const iconButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  };

  const profileSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const profileImageStyle = {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const userTextStyle = {
    display: "flex",
    flexDirection: "column",
    lineHeight: "1.1",
  };

  return (
    <div className="app-header header sticky" style={headerStyle}>
      <div className="container-fluid main-container" style={containerStyle}>
        {/* Sidebar Toggle */}
        <a
          href="#"
          style={{ color: "#333", textDecoration: "none" }}
          aria-label="Hide Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </a>

        {/* Logo */}
        <a href="/">
          <img
            src="../assets/images/brand/logo.webp"
            alt="logo"
            style={logoStyle}
          />
        </a>

        {/* Search Bar */}
        <div className="main-header-center" style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Search for results..."
            style={searchInputStyle}
          />
          <button style={iconButtonStyle}>
            <i className="fe fe-search"></i>
          </button>
        </div>

        {/* Right Section */}
        <div className="d-flex" style={profileSectionStyle}>
          {/* Notification Icon */}
          <a href="#" style={{ fontSize: "20px", color: "#555" }}>
            <i className="fe fe-bell"></i>
          </a>

          {/* Profile Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="../assets/images/profiles/5.jpg"
              alt="profile"
              style={profileImageStyle}
            />
            <div style={userTextStyle}>
              <p style={{ margin: 0, fontWeight: "600" }}>Alex Mora</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#777" }}>Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
