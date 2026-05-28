import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
//import { useTheme } from "./Topbar"; // THEME SUPPORT
import axios from "axios";
import toast from "react-hot-toast";

const Notifications = () => {
  //const { theme } = useTheme();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH MY NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/client/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificationsList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const loadNotifications = async () => {
    await fetchNotifications();
    await markAllAsRead();
  };

  loadNotifications();
}, []);

  // ✅ DELETE SINGLE FROM API
  const removeNotification = async (id) => {
    try {
      await axios.delete(`${baseUrl}/client/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotificationsList((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ MARK ALL AS READ (API)
  const markAllAsRead = async () => {
  try {
    await axios.patch(
      `${baseUrl}/client/notifications/mark-all-read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // update UI instantly
    setNotificationsList((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );

  } catch {
    toast.error("Action failed");
  }
};

  // THEME COLORS
 /* const cardBg =
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
      : "text-red-600 hover:text-red-500";*/

  return (
    <div
      className={`
        absolute right-2 sm:right-0 top-12 
        w-72 sm:w-80 
        max-h-[70vh]
        rounded-xl z-50 overflow-hidden border transition-all duration-200 
       bg-white dark:bg-[#0d133e] border-gray-300 dark:border-white/10 text-[#020726] dark:text-white shadow-lg
        animate-fadeIn
      `}
    >
      {/* HEADER */}
      <div
        className={`px-4 py-3 flex justify-between items-center border-b bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10`}
      >
        <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>

        {notificationsList.length > 0 && (
          <button
            className={`text-xs transition 
              text-[#0288D1] hover:text-[#0269b0] dark:text-[#29B6F6] dark:hover:text-[#0288D1]`}
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* LIST */}
      <ul className="max-h-[55vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400/40 scrollbar-track-transparent">
        {loading ? (
          <li className="p-4 text-center text-sm">Loading...</li>
        ) : notificationsList.length > 0 ? (
          notificationsList.map((item) => (
           <li
  key={item._id}
  className={`px-4 py-3 flex justify-between gap-4 border-b text-sm transition border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10`}
>
  {/* LEFT SIDE */}
  <div className="flex-1 flex gap-2">

    {/* 🔴 UNREAD DOT */}
    {!item.isRead && (
      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></span>
    )}

    <div>
      <h4 className="font-medium text-[14px] leading-tight">
        {item.title}
      </h4>

      <p className={`text-xs mt-1 leading-relaxed text-gray-600 dark:text-gray-300`}>
        {item.desc}
      </p>
    </div>

  </div>

  {/* RIGHT SIDE */}
  <div className="flex flex-col items-end justify-between gap-1">
    <span className={`text-[10px] whitespace-nowrap text-gray-500 dark:text-gray-400`}>
      {new Date(item.createdAt).toLocaleString()}
    </span>

    <X
      size={16}
      className={`cursor-pointer transition text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-300`}
      onClick={() => removeNotification(item._id)}
    />
  </div>
</li>
          ))
        ) : (
          <li
            className={`p-4 text-center text-sm 
              text-gray-600 dark:text-gray-300
            `}
          >
            No new notifications
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;


