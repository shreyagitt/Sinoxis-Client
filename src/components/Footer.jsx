import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center text-center text-gray-600">
          <p className="text-sm">
            Copyright © <span id="year">{new Date().getFullYear()}</span>{" "}
            <a
              href="javascript:void(0)"
              className="text-red-500 font-semibold hover:underline"
            >
              Sinoxis Music Group
            </a>{" "}
            — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
