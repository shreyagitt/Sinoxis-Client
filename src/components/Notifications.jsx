// src/components/Notifications.jsx
import React from "react";
import { X } from "lucide-react";

const Notifications = ({ notificationsList, removeNotification, markAllAsRead }) => {
  return (
    <div className="
      absolute right-0 mt-3 w-80 
      bg-[#0d133e] 
      text-white 
      rounded-xl 
      shadow-xl 
      border border-white/10 
      z-50 overflow-hidden
    ">
      {/* Header */}
      <div className="
        px-4 py-3 
        border-b border-white/10 
        bg-white/5 
        flex justify-between items-center
      ">
        <h3 className="font-semibold text-white">Notifications</h3>

        {notificationsList.length > 0 && (
          <button
            className="text-xs text-[#29B6F6] hover:text-[#0288D1] transition"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification Items */}
      <ul className="max-h-80 overflow-y-auto">
        {notificationsList.length > 0 ? (
          notificationsList.map((item, index) => (
            <li
              key={index}
              className="
                px-4 py-3 
                border-b border-white/10 
                hover:bg-white/5 
                transition 
                flex justify-between gap-4
              "
            >
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-300">{item.desc}</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {item.time}
                </span>

                <X
                  size={16}
                  className="text-red-500 cursor-pointer hover:text-red-400 transition"
                  onClick={() => removeNotification(index)}
                />
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-300 text-sm">
            No new notifications
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
