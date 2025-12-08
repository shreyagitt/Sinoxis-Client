import React, { useState, useEffect } from "react";
import {
  Bell,
  ShoppingCart,
  Search,
  Grid,
  Moon,
  Sun,
  MessageCircle,
  Settings,
  Maximize,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface TopbarProps {
  onToggleSidebar: () => void;
}

interface UserType {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/login");
  };

  const handleFullscreenClick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <header className="sticky top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* LEFT SIDE: Logo + Toggle + Search */}
        <div className="flex items-center space-x-3 w-full md:w-[40%]">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            <Grid className="w-5 h-5 text-green-600" />
          </button>

          

          {/* Search Bar */}
          <div className="flex items-center w-full border border-green-600 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-green-300 transition">
            <Search className="text-green-600 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for results..."
              className="w-full px-2 text-sm focus:outline-none bg-transparent text-gray-800"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">
          <img
            src="https://flagcdn.com/w40/in.png"
            alt="India Flag"
            className="w-6 h-6 rounded-full border border-green-600"
          />

          <div className="flex items-center space-x-4 text-green-600">
            <Maximize onClick={handleFullscreenClick} className="w-5 h-5 cursor-pointer hover:text-black" />
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-3 py-2 rounded-full bg-gray-50 hover:bg-green-50 border border-gray-200 transition-all duration-200 shadow-sm"
            >
              <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                <User className="h-4 w-4 text-green-600" />
              </div>

              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-semibold text-gray-800">
                  {user?.firstName || "Super"} {user?.lastName || "Admin"}
                </span>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <LogOut className="h-4 w-4 mr-2 text-gray-600" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
