// src/components/Notifications.jsx
import React from "react";
import { X } from "lucide-react";

const Notifications = ({ notificationsList, removeNotification, markAllAsRead }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>

        {notificationsList.length > 0 && (
          <button
            className="text-xs text-red-600 hover:text-blue-800"
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
              className="px-4 py-3 border-b hover:bg-gray-50 transition flex justify-between gap-4"
            >
              <div>
                <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
              </div>

              <X
                size={14}
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => removeNotification(index)}
              />
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500 text-sm">
            No new notifications
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
