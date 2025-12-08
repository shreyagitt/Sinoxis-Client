import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Send } from "lucide-react";
import { useAppSelector } from "../store/hook"; // ✅ REDUX TOKEN

export default function AdminNotifications() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // ✅ TOKEN FROM REDUX
  const { token } = useAppSelector((s) => s.auth);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [userId, setUserId] = useState("");

  // ============================
  // ✅ FETCH ALL NOTIFICATIONS (ADMIN)
  // ============================
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

  // ============================
  // ✅ SEND NOTIFICATION
  // ============================
  const sendNotification = async (e) => {
  e.preventDefault();

  if (!title || !desc) {
    return toast.error("Title and description required");
  }

  // ✅ SAFE PAYLOAD (NEVER SEND EMPTY userId)
  const payload = { title, desc };

  if (userId && userId.trim() !== "") {
    payload.userId = userId.trim();
  }

  try {
    await axios.post(
      `${baseUrl}/notifications/send`, // ✅ keeping your same route
      payload,                         // ✅ SAFE PAYLOAD
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Notification sent");
    setTitle("");
    setDesc("");
    setUserId("");
    fetchNotifications();
  } catch (err) {
    toast.error("Failed to send notification");
  }
};


  // ============================
  // ✅ DELETE NOTIFICATION
  // ============================
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

  // ============================
  // ✅ UI (GREEN ADMIN THEME)
  // ============================
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="bg-green-600 text-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold">Admin Notifications Panel</h2>
        <p className="text-sm text-white/80">
          Send, view and manage notifications
        </p>
      </div>

      {/* SEND FORM */}
      <form
        onSubmit={sendNotification}
        className="bg-white border rounded-xl p-5 mb-6 shadow"
      >
        <h3 className="font-semibold text-gray-700 mb-3">
          Send New Notification
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full text-sm"
          />

          <input
            type="text"
            placeholder="User ID (optional)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 rounded w-full text-sm"
          />
        </div>

        <textarea
          placeholder="Notification Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border p-2 rounded w-full text-sm mt-3 min-h-[90px]"
        />

        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded flex items-center gap-2 text-sm hover:bg-green-700 transition"
        >
          <Send size={16} /> Send Notification
        </button>
      </form>

      {/* LIST */}
      <div className="bg-white border rounded-xl shadow">
        <div className="border-b p-4">
          <h3 className="font-semibold text-gray-700">All Notifications</h3>
        </div>

        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : notifications.length > 0 ? (
          <ul className="divide-y">
            {notifications.map((item) => (
              <li
                key={item._id}
                className="p-4 flex justify-between items-start gap-4"
              >
                <div>
                  <h4 className="font-medium text-sm text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <Trash2
                  size={18}
                  className="text-red-600 cursor-pointer hover:text-red-700"
                  onClick={() => deleteNotification(item._id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
}

