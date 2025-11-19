import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-10 p-8">
      <div className="bg-white rounded-xl shadow-md max-w-md w-full text-center p-8">
        <img
          src="/image/logo.webp"
          alt="Sinoxis Logo"
          className="mx-auto w-24 h-24 object-contain mb-4"
        />
        <h2 className="text-2xl font-semibold mb-3">Sinoxis Music Group</h2>
        <p className="text-gray-500 mb-6">
          Welcome! Please select an option to continue.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/apply")}
            className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
