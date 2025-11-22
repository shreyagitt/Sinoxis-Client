import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#020726] border-t border-white/10 py-4 mt-10 w-full">
      <div className="w-full px-4">
        <div className="flex items-center justify-center text-center">
          <p className="text-sm text-white">
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

