import React from "react";
import { useTheme } from "./Topbar"; // ⬅️ Get theme from context

const Footer = () => {
  const { theme } = useTheme();

  // Background & border for light/dark mode
  const bg = theme === "dark" ? "bg-[#020726]" : "bg-white";
  const border = theme === "dark" ? "border-white/10" : "border-gray-300";

  // Text color
  const textColor = theme === "dark" ? "text-white" : "text-[#020726]";

  return (
    <footer className={`${bg} ${border} border-t py-4 mt-10 w-full`}>
      <div className="w-full px-4">
        <div className="flex items-center justify-center text-center">
          <p className={`text-sm ${textColor}`}>
            Copyright © {new Date().getFullYear()}{" "}
            <span className="font-semibold bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-transparent bg-clip-text">
              Sinoxis Digital
            </span>{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


