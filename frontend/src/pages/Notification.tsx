import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Send } from "lucide-react";
import { useAppSelector } from "../store/hook";

export default function AdminNotifications() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { token } = useAppSelector((s) => s.auth);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
const [desc, setDesc] = useState("");
const [userId, setUserId] = useState("");

  /* ============================
     FETCH NOTIFICATIONS
  ============================ */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data || []);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  /* ============================
      SEND NOTIFICATION
  ============================ */
  const sendNotification = async (e) => {
    e.preventDefault();

    if (!title || !desc)
      return toast.error("Title and description required");

    const payload: any = { title, desc };
    if (userId.trim() !== "") payload.userId = userId.trim();

    try {
      await axios.post(`${baseUrl}/notifications/send`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Notification sent");
      setTitle("");
      setDesc("");
      setUserId("");
      fetchNotifications();
    } catch {
      toast.error("Failed to send notification");
    }
  };

  /* ============================
        DELETE NOTIFICATION
  ============================ */
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${baseUrl}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ============================
              UI
  ============================ */
  return (
    <div className="p-6 min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors">

      {/* HEADER */}
      <div className="bg-[#0288D1] dark:bg-[#0B1029] text-white 
                      p-5 rounded-xl shadow mb-6 
                      border border-gray-300 dark:border-[#1A2347]">
        <h2 className="text-xl font-bold">Admin Notifications Panel</h2>
        <p className="text-sm text-white/80">
          Send, view and manage notifications
        </p>
      </div>

      {/* SEND FORM */}
      <form
        onSubmit={sendNotification}
        className="bg-white dark:bg-[#0B1029] 
                   border border-gray-300 dark:border-[#1A2347]
                   rounded-xl p-5 mb-6 shadow transition-colors"
      >
        <h3 className="font-semibold text-[#020726] dark:text-white mb-3">
          Send New Notification
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 dark:border-[#1A2347] 
                       p-2 rounded w-full text-sm
                       bg-white dark:bg-[#111A3A]
                       text-[#020726] dark:text-white"
          />

          <input
            type="text"
            placeholder="User ID (optional)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border border-gray-300 dark:border-[#1A2347] 
                       p-2 rounded w-full text-sm
                       bg-white dark:bg-[#111A3A]
                       text-[#020726] dark:text-white"
          />
        </div>

        <textarea
          placeholder="Notification Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border border-gray-300 dark:border-[#1A2347]
                     p-2 rounded w-full text-sm mt-3 min-h-[90px]
                     bg-white dark:bg-[#111A3A]
                     text-[#020726] dark:text-white"
        />

        <button
          type="submit"
          className="mt-4 bg-[#0288D1] hover:bg-[#0275B5]
                     text-white px-5 py-2 rounded
                     flex items-center gap-2 text-sm transition"
        >
          <Send size={16} /> Send Notification
        </button>
      </form>

      {/* LIST */}
      <div className="bg-white dark:bg-[#0B1029]
                      border border-gray-300 dark:border-[#1A2347]
                      rounded-xl shadow transition-colors">
        
        <div className="border-b border-gray-300 dark:border-[#1A2347] p-4">
          <h3 className="font-semibold text-[#020726] dark:text-white">
            All Notifications
          </h3>
        </div>

        {loading ? (
          <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        ) : notifications.length > 0 ? (
          <ul className="divide-y divide-gray-300 dark:divide-[#1A2347]">
            {notifications.map((item) => (
              <li
                key={item._id}
                className="p-4 flex justify-between items-start gap-4 
                           hover:bg-gray-100 dark:hover:bg-[#111A3A] 
                           transition-colors"
              >
                <div>
                  <h4 className="font-medium text-sm text-[#020726] dark:text-white">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                    {item.desc}
                  </p>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <Trash2
                  size={18}
                  className="text-red-600 dark:text-red-400 cursor-pointer 
                             hover:text-red-800 dark:hover:text-red-300 transition"
                  onClick={() => deleteNotification(item._id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
}
