import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, RefreshCcw } from "lucide-react";

type Artist = {
  id: string;
  name: string;
  city?: string;
  email?: string;
  phone?: string;
  label?: string;
  status: "Active" | "Blocked";
};

const sampleArtists: Artist[] = [
  { id: "a1", name: "Rhea Beats", city: "Jaipur", email: "rhea@music.com", phone: "+91 70144 73622", label: "Sinoxis Records", status: "Active" },
  { id: "a2", name: "Arjun Flow", city: "Delhi", email: "arjun@flow.com", phone: "+91 70144 73623", label: "Flowhouse", status: "Blocked" },
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(sampleArtists);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Artist>({ id: "", name: "", city: "", email: "", phone: "", label: "", status: "Active" });
  const [editing, setEditing] = useState(false);

  const filtered = artists.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / perPage);
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  const openAdd = () => {
    setEditing(false);
    setForm({ id: `a${Date.now()}`, name: "", city: "", email: "", phone: "", label: "", status: "Active" });
    setModalOpen(true);
  };

  const openEdit = (a: Artist) => {
    setEditing(true);
    setForm(a);
    setModalOpen(true);
  };

  const saveArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name required");
    if (editing) setArtists((prev) => prev.map((p) => (p.id === form.id ? form : p)));
    else setArtists((prev) => [form, ...prev]);
    setModalOpen(false);
  };

  const deleteArtist = (id: string) => {
    if (!confirm("Delete this artist?")) return;
    setArtists((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleStatus = (id: string) => {
    setArtists((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === "Active" ? "Blocked" : "Active" } : a))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Artists</h1>
            <p className="text-gray-500 text-sm">Manage all artists registered under Sinoxis Music Group.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> Add Artist
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show</label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search artist..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-3">S.No</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">City</th>
                  <th className="py-3">Label</th>
                  <th className="py-3">Phone</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {shown.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-400">
                      No artists found.
                    </td>
                  </tr>
                ) : (
                  shown.map((a, i) => (
                    <tr key={a.id} className="border-b last:border-none">
                      <td className="py-3">{(page - 1) * perPage + i + 1}</td>
                      <td className="py-3">{a.name}</td>
                      <td className="py-3">{a.city}</td>
                      <td className="py-3">{a.label || "—"}</td>
                      <td className="py-3">{a.phone}</td>
                      <td className="py-3">{a.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            a.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 flex gap-2">
                        <button onClick={() => openEdit(a)} className="p-2 rounded bg-emerald-50 hover:bg-emerald-100">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => toggleStatus(a.id)} className="p-2 rounded bg-gray-50 hover:bg-gray-100">
                          <RefreshCcw size={16} />
                        </button>
                        <button onClick={() => deleteArtist(a.id)} className="p-2 rounded bg-red-50 hover:bg-red-100">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <div className="px-3 py-1 border rounded bg-white">{page}</div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={saveArtist}
            className="bg-white rounded-lg shadow p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Artist" : "Add Artist"}
            </h2>
            <div className="space-y-3">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                placeholder="Label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Blocked" })}
                className="w-full border rounded px-3 py-2"
              >
                <option>Active</option>
                <option>Blocked</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
