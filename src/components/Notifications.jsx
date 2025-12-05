// src/components/Notifications.jsx
import React from "react";
import { X } from "lucide-react";
import { useTheme } from "./Topbar"; // THEME SUPPORT

const Notifications = ({
  notificationsList,
  removeNotification,
  markAllAsRead,
}) => {
  const { theme } = useTheme();

  // THEME COLORS
  const cardBg =
    theme === "dark"
      ? "bg-[#0d133e] border-white/10 text-white"
      : "bg-white border-gray-300 text-[#020726] shadow-lg";

  const headerBg =
    theme === "dark"
      ? "bg-white/5 border-white/10"
      : "bg-gray-100 border-gray-300";

  const itemBorder = theme === "dark" ? "border-white/10" : "border-gray-200";
  const descText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const timeText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const hoverBg = theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100";

  const closeIconColor =
    theme === "dark"
      ? "text-red-500 hover:text-red-300"
      : "text-red-600 hover:text-red-500";

  return (
    <div
      className={`
        absolute right-2 sm:right-0 top-12 
        w-72 sm:w-80 
        max-h-[70vh]
        rounded-xl z-50 overflow-hidden border transition-all duration-200 
        ${cardBg}
        animate-fadeIn
      `}
    >
      {/* HEADER */}
      <div
        className={`px-4 py-3 flex justify-between items-center border-b ${headerBg}`}
      >
        <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>

        {notificationsList.length > 0 && (
          <button
            className={`text-xs transition ${
              theme === "dark"
                ? "text-[#29B6F6] hover:text-[#0288D1]"
                : "text-[#0288D1] hover:text-[#0269b0]"
            }`}
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* LIST */}
      <ul className="max-h-[55vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400/40 scrollbar-track-transparent">
        {notificationsList.length > 0 ? (
          notificationsList.map((item, index) => (
            <li
              key={index}
              className={`px-4 py-3 flex justify-between gap-4 border-b text-sm transition ${itemBorder} ${hoverBg}`}
            >
              {/* LEFT SIDE */}
              <div className="flex-1">
                <h4 className="font-medium text-[14px] leading-tight">
                  {item.title}
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${descText}`}>
                  {item.desc}
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col items-end justify-between gap-1">
                <span className={`text-[10px] whitespace-nowrap ${timeText}`}>
                  {item.time}
                </span>

                <X
                  size={16}
                  className={`cursor-pointer transition ${closeIconColor}`}
                  onClick={() => removeNotification(index)}
                />
              </div>
            </li>
          ))
        ) : (
          <li
            className={`p-4 text-center text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            No new notifications
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;

