import React, { useState, useEffect } from "react";
import NotificationCard from "../Components/Notification/NotificationCard";
import NotificationForm from "../Components/Notification/NotificationForm";
import NotificationFilter from "../Components/Notification/NotificationFilter";
import { Plus } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [editNotification, setEditNotification] = useState(null);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: "Automatic",
        sender: "System",
        title: "Song Reject Notification",
        message:
          "Song reject notification when admin selects reject button (Automatic)",
        date: "Jul 1, 2025",
      },
      {
        id: 2,
        type: "Manual",
        sender: "Admin",
        title: "Platform Update",
        message: "Scheduled maintenance on Nov 5th from 12 AM - 2 AM.",
        date: "Nov 1, 2025",
      },
    ]);
  }, []);

  const handleAdd = (newNotif) => {
    if (editNotification && editNotification.id) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === editNotification.id ? { ...newNotif, id: n.id } : n))
      );
      setEditNotification(null);
    } else {
      setNotifications([...notifications, { ...newNotif, id: Date.now() }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleEdit = (notif) => {
    setEditNotification(notif);
    setShowForm(true);
  };

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Notifications Management
        </h1>
        <button
          onClick={() => {
            setEditNotification(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus size={18} /> Add Manual Notification
        </button>
      </div>

      <NotificationFilter filter={filter} setFilter={setFilter} />

      <div className="grid gap-4 mt-4">
        {filteredNotifications.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            onEdit={() => handleEdit(n)}
            onDelete={() => handleDelete(n.id)}
          />
        ))}
      </div>

      {showForm && (
        <NotificationForm
          onClose={() => {
            setShowForm(false);
            setEditNotification(null);
          }}
          onSubmit={handleAdd}
          editData={editNotification}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
