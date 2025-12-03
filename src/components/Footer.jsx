import React from "react";
import { useTheme } from "./Topbar";

const Footer = () => {
  const { theme } = useTheme();

  // Background & border for light/dark mode
  const bg = theme === "dark" ? "bg-[#020726]" : "bg-white";
  const border = theme === "dark" ? "border-white/10" : "border-gray-300";

  // Text color
  const textColor = theme === "dark" ? "text-white" : "text-[#020726]";

  return (
    <footer className={`${bg} ${border} border-t py-4 sm:py-5 md:py-6 mt-10 w-full`}>
      <div className="w-full px-3 sm:px-6 md:px-10">
        <div className="flex items-center justify-center text-center">
          <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${textColor}`}>
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
