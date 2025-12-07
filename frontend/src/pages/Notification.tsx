import React, { useState, useEffect } from "react";
import NotificationCard from "../Components/Notification/NotificationCard";
import NotificationForm from "../Components/Notification/NotificationForm";
import NotificationFilter from "../Components/Notification/NotificationFilter";
import { Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [editNotification, setEditNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH ALL NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ SEND NOTIFICATION
  const handleAdd = async (newNotif) => {
    try {
      const payload = {
        userId: newNotif.userId,
        title: newNotif.title,
        desc: newNotif.desc,
      };

      await axios.post(`${baseUrl}/notifications/send`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Notification sent!");
      fetchNotifications();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Send failed");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;

    try {
      await axios.delete(`${baseUrl}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Notification deleted");
      fetchNotifications();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ FILTER
  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          (n) => n.roleTarget === filter.toLowerCase()
        );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notifications Management</h1>

        <button
          onClick={() => {
            setEditNotification(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md"
        >
          <Plus size={18} /> Send Notification
        </button>
      </div>

      <NotificationFilter filter={filter} setFilter={setFilter} />

      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif._id}
              notification={notif}
              onDelete={() => handleDelete(notif._id)}
            />
          ))}

          {!loading && filteredNotifications.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No notifications found
            </p>
          )}
        </div>
      )}

      {showForm && (
        <NotificationForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
};

export default NotificationsPage;

