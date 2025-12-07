import React from "react";
import { Trash2 } from "lucide-react";

const NotificationCard = ({ notification, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded-lg border flex justify-between">
      <div>
        <p className="font-semibold">{notification.title}</p>
        <p className="text-sm text-gray-600">{notification.desc}</p>
        <p className="text-xs text-gray-400 mt-1">
          Target: {notification.roleTarget} | {notification.time}
        </p>
      </div>

      <button onClick={onDelete} className="text-red-500">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default NotificationCard;
