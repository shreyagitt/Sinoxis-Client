import React, { useState } from "react";
import { MessageSquare, CalendarDays, Edit2, Trash2 } from "lucide-react";

const NotificationCard = ({ notification, onEdit, onDelete }) => {
  const [reply, setReply] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            {notification.title}
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                notification.type === "Automatic"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {notification.type}
            </span>
          </h3>
          <p className="text-gray-600 mt-1">{notification.message}</p>
          <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
            <CalendarDays size={14} />
            {notification.date}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-gray-400 font-medium">
            From: {notification.sender}
          </span>
          <div className="flex gap-2 mt-1">
            <button
              onClick={onEdit}
              className="p-1 rounded hover:bg-gray-100 text-blue-600"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-gray-100 text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="mt-3 border-t pt-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-gray-500" />
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply..."
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
          />
          <button
            onClick={() => setReply("")}
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
