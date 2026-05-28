// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
//import { useTheme } from "../components/Topbar"; // ⭐ THEME ENABLED

const HomePage = () => {
  const navigate = useNavigate();
  //const { theme } = useTheme(); // ⭐ GET THEME

  // 🌗 THEME ADAPTIVE VALUES
  /*const pageBg =
    theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";

  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-300 shadow-xl";

  const subText = theme === "dark" ? "text-gray-400" : "text-gray-600";*/

const handleLiveDemo = () => {
  navigate("/login", {
    state: {
      demoEmail: "tim@gmail.com",
      demoPassword: "Tim1234",
    },
  });
};

  return (
    <div className="min-h-screen flex justify-center items-center p-8 transition-all duration-300 bg-white dark:bg-[#020726] text-[#020726] dark:text-white">
      <div className="rounded-2xl max-w-md w-full text-center p-10 border transition-all duration-300 bg-white dark:bg-[#0a1039] border-gray-300 dark:border-white/10 shadow-xl">
       {/* LOGO */}
<div className="flex justify-center mb-6">

  {/* Light Mode Logo */}
  <img
    src="/logo3.png"
    alt="Sinoxis Logo"
    className="w-24 sm:w-28 md:w-32 object-contain dark:hidden"
  />

  {/* Dark Mode Logo */}
  <img
    src="/image/logo.webp"
    alt="Sinoxis Logo"
    className="w-24 sm:w-28 md:w-32 object-contain hidden dark:block"
  />

</div>

        {/* TITLE */}
        <h2 className="text-3xl font-semibold mb-2">Sinoxis Digital</h2>

        <p className={`mb-8 text-gray-600 dark:text-gray-400`}>
          Welcome! Please select an option to continue.
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">
          {/* LOGIN */}
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-xl text-white font-semibold shadow-lg transition hover:opacity-90"
            style={{
              background: "linear-gradient(90deg,#00AEEF,#007BFF)",
            }}
          >
            Login
          </button>

          {/* LIVE DEMO */}
<button
  onClick={handleLiveDemo}
  className="px-6 py-2 rounded-xl text-white font-semibold shadow-lg transition hover:opacity-90"
  style={{
    background: "linear-gradient(90deg,#00AEEF,#007BFF)",
  }}
>
  Live Demo
</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
