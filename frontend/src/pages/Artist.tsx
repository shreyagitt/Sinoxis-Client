import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCcw,
  ImagePlus,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";

type Artist = {
  _id: string;
  name: string;
  city?: string;
  email?: string;
  phone?: string;
  label?: string;
  status: "Active" | "Blocked";
  artistImage?: string;
};

export default function ArtistsPage() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    city: "",
    email: "",
    phone: "",
    label: "",
    status: "Active" as "Active" | "Blocked",
  });

  // ======================================================
  // FETCH ARTISTS
  // ======================================================
  useEffect(() => {
    if (!token) return;
    fetchArtists();
  }, [token]);

  const fetchArtists = async () => {
    try {
      const res = await axios.get(`${baseUrl}/artist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setArtists(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load artists");
    }
  };

  // ======================================================
  // OPEN MODALS
  // ======================================================
  const openAdd = () => {
    setEditing(false);
    setForm({
      id: "",
      name: "",
      city: "",
      email: "",
      phone: "",
      label: "",
      status: "Active",
    });

    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (artist: Artist) => {
    setEditing(true);
    setForm({
      id: artist._id,
      name: artist.name,
      city: artist.city ?? "",
      email: artist.email ?? "",
      phone: artist.phone ?? "",
      label: artist.label ?? "",
      status: artist.status,
    });

    setImagePreview(artist.artistImage || null);
    setImageFile(null);
    setModalOpen(true);
  };

  // ======================================================
  // SAVE / UPDATE ARTIST
  // ======================================================
  const saveArtist = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("city", form.city);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("label", form.label);
    fd.append("status", form.status);

    if (imageFile) fd.append("artistImage", imageFile);

    try {
      if (editing) {
        await axios.put(`${baseUrl}/artist/${form.id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Artist updated");
      } else {
        await axios.post(`${baseUrl}/artist`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Artist added");
      }

      fetchArtists();
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save artist");
    }
  };

  // ======================================================
  // DELETE ARTIST
  // ======================================================
  const deleteArtist = async (id: string) => {
    if (!confirm("Delete this artist?")) return;

    try {
      await axios.delete(`${baseUrl}/artist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArtists((prev) => prev.filter((a) => a._id !== id));
      toast.success("Artist deleted");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete");
    }
  };

  // ======================================================
  // TOGGLE STATUS
  // ======================================================
  const toggleStatus = async (artist: Artist) => {
    const newStatus = artist.status === "Active" ? "Blocked" : "Active";

    try {
      await axios.put(
        `${baseUrl}/artist/${artist._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setArtists((prev) =>
        prev.map((a) =>
          a._id === artist._id ? { ...a, status: newStatus } : a
        )
      );

      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change status");
    }
  };

  // ======================================================
  // IMAGE UPLOAD PREVIEW
  // ======================================================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ======================================================
  // PAGINATION + SEARCH
  // ======================================================
  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Artists</h1>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> Add Artist
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-lg shadow p-6">

          {/* TOP FILTER BAR */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            
            {/* SHOW ENTRIES */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search artist..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="border rounded px-3 py-2 text-sm w-64"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-3">Image</th>
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
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      No artists found.
                    </td>
                  </tr>
                ) : (
                  shown.map((artist) => (
                    <tr key={artist._id} className="border-b">
                      <td className="py-3">
                        <img
                          src={
                            artist.artistImage ||
                            "https://via.placeholder.com/50"
                          }
                          className="w-12 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="py-3">{artist.name}</td>
                      <td className="py-3">{artist.city || "—"}</td>
                      <td className="py-3">{artist.label || "—"}</td>
                      <td className="py-3">{artist.phone || "—"}</td>
                      <td className="py-3">{artist.email || "—"}</td>

                      <td className="py-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            artist.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {artist.status}
                        </span>
                      </td>

                      <td className="py-3 flex gap-2">
                        <button
                          onClick={() => openEdit(artist)}
                          className="p-2 bg-emerald-50 rounded hover:bg-emerald-100"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => toggleStatus(artist)}
                          className="p-2 bg-gray-50 rounded hover:bg-gray-100"
                        >
                          <RefreshCcw size={16} />
                        </button>

                        <button
                          onClick={() => deleteArtist(artist._id)}
                          className="p-2 bg-red-50 rounded hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER: ENTRY COUNT + PAGINATION */}
          <div className="flex items-center justify-between mt-6">

            {/* ENTRY INFO */}
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * perPage + 1} to{" "}
              {Math.min(page * perPage, filtered.length)} of{" "}
              {filtered.length} entries
            </div>

            {/* PAGINATION BUTTONS */}
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

      {/* MODAL FORM */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            onSubmit={saveArtist}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Artist" : "Add Artist"}
            </h2>

            <div className="space-y-3">
              <input
                required
                placeholder="Artist Name"
                className="border rounded px-3 py-2 w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="City"
                className="border rounded px-3 py-2 w-full"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <input
                placeholder="Email"
                className="border rounded px-3 py-2 w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="Phone"
                className="border rounded px-3 py-2 w-full"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder="Label Name"
                className="border rounded px-3 py-2 w-full"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />

              <select
                className="border rounded px-3 py-2 w-full"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "Active" | "Blocked",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <ImagePlus size={18} />
                  Upload Artist Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="w-20 h-20 rounded object-cover mt-2"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save Artist
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
