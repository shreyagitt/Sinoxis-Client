import React, { useState } from "react";

const NotificationForm = ({ onCancel, onSubmit }) => {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId || !title || !desc) {
      alert("All fields required");
      return;
    }

    onSubmit({ userId, title, desc });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-[400px]"
      >
        <h2 className="text-lg font-semibold mb-4">Send Notification</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Client User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-4"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="bg-green-600 text-white px-4 py-1 rounded">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;
