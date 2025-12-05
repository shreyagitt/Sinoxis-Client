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
  genre: string;
  label: string;
  followers: number;
  bio?: string;
  spotify?: string;
  instagram?: string;
  status: "Active" | "Inactive";
  artistImage?: string;
};

export default function ArtistsPage() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ----------------------- FORM STATE -----------------------
  const [form, setForm] = useState({
    _id: "",
    name: "",
    genre: "",
    label: "",
    followers: "0",
    bio: "",
    spotify: "",
    instagram: "",
    status: "Active" as "Active" | "Inactive",
  });

  // ----------------------------------------------------
  // FETCH ARTISTS
  // ----------------------------------------------------
  useEffect(() => {
    if (token) fetchArtists();
  }, [token]);

  const fetchArtists = async () => {
    try {
      const res = await axios.get(`${baseUrl}/artist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setArtists(res.data.data);
    } catch {
      toast.error("Failed to load artists");
    }
  };

  // ----------------------------------------------------
  // OPEN ADD
  // ----------------------------------------------------
  const openAdd = () => {
    setEditing(false);

    setForm({
      _id: "",
      name: "",
      genre: "",
      label: "",
      followers: "0",
      bio: "",
      spotify: "",
      instagram: "",
      status: "Active",
    });

    setImagePreview(null);
    setImageFile(null);
    setModalOpen(true);
  };

  // ----------------------------------------------------
  // OPEN EDIT
  // ----------------------------------------------------
  const openEdit = (artist: Artist) => {
    setEditing(true);

    setForm({
      _id: artist._id,
      name: artist.name,
      genre: artist.genre || "",
      label: artist.label || "",
      followers: String(artist.followers),
      bio: artist.bio || "",
      spotify: artist.spotify || "",
      instagram: artist.instagram || "",
      status: artist.status,
    });

    setImagePreview(artist.artistImage || null);
    setImageFile(null);

    setModalOpen(true);
  };

  // ----------------------------------------------------
  // SAVE ARTIST
  // ----------------------------------------------------
  const saveArtist = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "_id") fd.append(key, value);
    });

    if (imageFile) fd.append("artistImage", imageFile);

    try {
      if (editing) {
        await axios.put(`${baseUrl}/artist/${form._id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Artist updated successfully");
      } else {
        await axios.post(`${baseUrl}/artist`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Artist created successfully");
      }

      fetchArtists();
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  // ----------------------------------------------------
  // DELETE ARTIST
  // ----------------------------------------------------
  const deleteArtist = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(`${baseUrl}/artist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArtists((prev) => prev.filter((a) => a._id !== id));
      toast.success("Artist deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ----------------------------------------------------
  // TOGGLE STATUS
  // ----------------------------------------------------
  const toggleStatus = async (artist: Artist) => {
    const updatedStatus = artist.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(
        `${baseUrl}/artist/${artist._id}`,
        { status: updatedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setArtists((prev) =>
        prev.map((a) =>
          a._id === artist._id ? { ...a, status: updatedStatus } : a
        )
      );

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ----------------------------------------------------
  // IMAGE PREVIEW
  // ----------------------------------------------------
  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ----------------------------------------------------
  // SEARCH FILTER
  // ----------------------------------------------------
  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  // ----------------------------------------------------
  // UI RENDER
  // ----------------------------------------------------
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

          {/* SEARCH */}
          <div className="flex items-center gap-2 mb-4">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search artist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-64"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-600 border-b bg-gray-50">
                <tr>
                  <th className="py-4 px-3 text-left">Image</th>
                  <th className="py-4 px-3 text-left">Name</th>
                  <th className="py-4 px-3 text-left">Genre</th>
                  <th className="py-4 px-3 text-left">Label</th>
                  <th className="py-4 px-3 text-left">Followers</th>
                  <th className="py-4 px-3 text-left">Status</th>
                  <th className="py-4 px-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      No artists found
                    </td>
                  </tr>
                ) : (
                  filtered.map((artist) => (
                    <tr
                      key={artist._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-3">
                        <img
                          src={artist.artistImage || "https://via.placeholder.com/50"}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </td>

                      <td className="py-4 px-3">{artist.name}</td>
                      <td className="py-4 px-3">{artist.genre || "—"}</td>
                      <td className="py-4 px-3">{artist.label || "—"}</td>
                      <td className="py-4 px-3">{artist.followers}</td>

                      <td className="py-4 px-3">
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

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(artist)}
                            className="p-2 bg-blue-50 rounded hover:bg-blue-100"
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ---------------- MODAL ---------------- */}
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
                placeholder="Genre"
                className="border rounded px-3 py-2 w-full"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />

              <input
                placeholder="Label"
                className="border rounded px-3 py-2 w-full"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />

              <input
                type="number"
                placeholder="Followers"
                className="border rounded px-3 py-2 w-full"
                value={form.followers}
                onChange={(e) => setForm({ ...form, followers: e.target.value })}
              />

              <textarea
                placeholder="Bio"
                className="border rounded px-3 py-2 w-full"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />

              <input
                placeholder="Spotify URL"
                className="border rounded px-3 py-2 w-full"
                value={form.spotify}
                onChange={(e) => setForm({ ...form, spotify: e.target.value })}
              />

              <input
                placeholder="Instagram URL"
                className="border rounded px-3 py-2 w-full"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />

              <select
                className="border rounded px-3 py-2 w-full"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Image Upload */}
              <label className="flex items-center gap-2 cursor-pointer">
                <ImagePlus size={18} />
                <span>Upload Artist Image</span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

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
