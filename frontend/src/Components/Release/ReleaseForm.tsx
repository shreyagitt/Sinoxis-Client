// src/components/Release/ReleaseForm.tsx
import React, { useState, useEffect } from "react";
import { Release } from "../../pages/Release";

type Props = {
  initial: Release | null;
  onCancel: () => void;
  onCreate: (payload: Omit<Release, "id">) => void;
  onUpdate: (payload: Release) => void;
};

const ReleaseForm: React.FC<Props> = ({ initial, onCancel, onCreate, onUpdate }) => {
  const [form, setForm] = useState<Omit<Release, "id">>({
    title: "",
    artist: "",
    label: "",
    releaseDate: "",
    status: "Pending",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        artist: initial.artist,
        label: initial.label,
        releaseDate: initial.releaseDate || "",
        status: initial.status,
      });
    } else {
      setForm({
        title: "",
        artist: "",
        label: "",
        releaseDate: "",
        status: "Pending",
      });
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.artist.trim()) {
      alert("Title and Artist are required");
      return;
    }
    if (initial) {
      onUpdate({ id: initial.id, ...form });
    } else {
      onCreate({ ...form });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{initial ? "Edit Release" : "Create New Release"}</h3>
          <button type="button" onClick={onCancel} className="text-gray-500">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Title" className="border rounded px-3 py-2" />
          <input value={form.artist} onChange={(e) => setForm((s) => ({ ...s, artist: e.target.value }))} placeholder="Artist" className="border rounded px-3 py-2" />
          <input value={form.label} onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))} placeholder="Label" className="border rounded px-3 py-2" />
          <input type="date" value={form.releaseDate} onChange={(e) => setForm((s) => ({ ...s, releaseDate: e.target.value }))} className="border rounded px-3 py-2" />
          <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as Release["status"] }))} className="border rounded px-3 py-2 md:col-span-2">
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Unfinished</option>
            <option>Action Required</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {initial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReleaseForm;
