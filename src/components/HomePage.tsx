// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar"; // ⭐ THEME ENABLED

const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // ⭐ GET THEME

  // 🌗 THEME ADAPTIVE VALUES
  const pageBg =
    theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";

  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-300 shadow-xl";

  const subText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`min-h-screen flex justify-center items-center p-8 transition-all duration-300 ${pageBg}`}
    >
      <div
        className={`rounded-2xl max-w-md w-full text-center p-10 border transition-all duration-300 ${cardBg}`}
      >
        {/* LOGO */}
        <img
          src="/image/logo.webp"
          alt="Sinoxis Logo"
          className="mx-auto w-28 h-28 object-contain mb-5"
        />

        {/* TITLE */}
        <h2 className="text-3xl font-semibold mb-2">Sinoxis Digital</h2>

        <p className={`mb-8 ${subText}`}>
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

          {/* APPLY */}
          <button
            onClick={() => navigate("/apply")}
            className="px-6 py-2 rounded-xl text-white font-semibold shadow-lg transition hover:opacity-90"
            style={{
              background: "linear-gradient(90deg,#00AEEF,#007BFF)",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
