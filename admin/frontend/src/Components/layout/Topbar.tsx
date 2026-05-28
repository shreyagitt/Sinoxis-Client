import React, { useState, useEffect } from "react";
import {
  Search,
  Grid,
  Moon,
  Sun,
  Maximize,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  /* ------------------------------------------------------
     Load Theme + User
  -------------------------------------------------------*/
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
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
    <header
      className="
        sticky top-0 left-0 w-full z-[100] 
        bg-white dark:bg-[#020726]
        border-b border-gray-200 dark:border-[#1A2347]
        shadow-sm transition-all duration-300
      "
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">

        {/* LEFT SIDE */}
        <div className="flex items-center space-x-3 w-full md:w-[40%]">

          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg 
              hover:bg-gray-100 dark:hover:bg-[#111A3A]
              border border-gray-200 dark:border-[#1A2347]
              transition"
          >
            <Grid className="w-5 h-5 text-[#0288D1]" />
          </button>

          {/* Search */}
          <div
            className="
              flex items-center w-full
              border border-[#29B6F6]
              rounded-full px-3 py-1.5 
              focus-within:ring-2 focus-within:ring-[#0288D1]
              bg-white dark:bg-[#0B1029]
              transition
            "
          >
            <Search className="text-[#0288D1] w-4 h-4" />
            <input
              placeholder="Search for results..."
              className="
                w-full px-2 text-sm 
                bg-transparent outline-none
                text-[#020726] dark:text-white
              "
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">

          {/* Country Flag */}
          <img
            src="https://flagcdn.com/w40/in.png"
            alt="India"
            className="w-6 h-6 rounded-full border border-[#0288D1]"
          />

          {/* Fullscreen */}
          <Maximize
            onClick={handleFullscreenClick}
            className="w-5 h-5 cursor-pointer text-[#0288D1] hover:text-black dark:hover:text-white"
          />

          {/* THEME SWITCH */}
          <button
            onClick={toggleTheme}
            className="
              p-2 rounded-lg border
              border-gray-300 dark:border-[#1A2347]
              hover:bg-gray-100 dark:hover:bg-[#111A3A]
              transition
            "
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-[#29B6F6]" />
            ) : (
              <Moon className="w-5 h-5 text-[#0288D1]" />
            )}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="
                flex items-center gap-3 px-3 py-2 rounded-full
                bg-gray-50 dark:bg-[#0B1029]
                hover:bg-[#E0F3FF] dark:hover:bg-[#111A3A]
                border border-gray-200 dark:border-[#1A2347]
                shadow-sm transition-all
              "
            >
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-[#E0F3FF] dark:bg-[#111A3A] flex items-center justify-center border border-[#0288D1]">
                <User className="h-4 w-4 text-[#0288D1]" />
              </div>

              {/* User Info */}
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-[#020726] dark:text-white">
                  {user?.firstName || "Super"} {user?.lastName || "Admin"}
                </span>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-gray-500 dark:text-gray-300 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="
                  absolute right-0 mt-2 w-48 
                  bg-white dark:bg-[#0B1029]
                  rounded-lg shadow-xl
                  border border-gray-100 dark:border-[#1A2347]
                  py-2 z-50
                "
              >
                <button
                  onClick={handleLogout}
                  className="
                    w-full text-left flex items-center px-4 py-2 text-sm
                    text-gray-700 dark:text-white 
                    hover:bg-gray-100 dark:hover:bg-[#111A3A]
                    transition
                  "
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
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
