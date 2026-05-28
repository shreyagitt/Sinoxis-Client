import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ImagePlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";

// Updated Artist type to match new backend model
type Artist = {
  _id: string;
  name: string;
  mobile?: string;
  email?: string;
  spotify?: string;
  apple?: string;
  youtube?: string;
  avatar?: string;
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
    mobile: "",
    email: "",
    spotify: "",
    apple: "",
    youtube: "",
  });

  // ----------------------------------------------------
  // FETCH ARTISTS
  // ----------------------------------------------------
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

  useEffect(() => {
    if (token) fetchArtists();
  }, [token]);

  // ----------------------------------------------------
  // OPEN ADD
  // ----------------------------------------------------
  const openAdd = () => {
    setEditing(false);

    setForm({
      _id: "",
      name: "",
      mobile: "",
      email: "",
      spotify: "",
      apple: "",
      youtube: "",
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
      mobile: artist.mobile || "",
      email: artist.email || "",
      spotify: artist.spotify || "",
      apple: artist.apple || "",
      youtube: artist.youtube || "",
    });

    setImagePreview(artist.avatar || null);
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

    if (imageFile) fd.append("avatar", imageFile);

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
    <div className="min-h-screen bg-white dark:bg-[#020726] p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#020726] dark:text-white">
            Artists
          </h1>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0288D1] hover:bg-[#29B6F6] text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={16} /> Add Artist
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white dark:bg-[#0B1029] rounded-lg p-4 shadow border border-gray-200 dark:border-[#1A2347] mb-4 flex items-center gap-2">
          <Search size={16} className="text-gray-400 dark:text-gray-300" />
          <input
            placeholder="Search artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border dark:border-[#1A2347] rounded px-3 py-2 text-sm w-64 bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-[#0B1029] rounded-lg shadow p-6 overflow-x-auto border border-gray-200 dark:border-[#1A2347]">
          <table className="w-full text-sm text-[#020726] dark:text-gray-200">
            <thead className="border-b border-gray-300 dark:border-[#1A2347] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-3 text-left">Image</th>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Mobile</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Spotify</th>
                <th className="py-3 text-left">Apple</th>
                <th className="py-3 text-left">YouTube</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-400 dark:text-gray-500"
                  >
                    No artists found
                  </td>
                </tr>
              ) : (
                filtered.map((artist) => (
                  <tr
                    key={artist._id}
                    className="border-b border-gray-200 dark:border-[#1A2347] hover:bg-gray-50 dark:hover:bg-[#111A3A] transition-colors"
                  >
                    <td className="py-3">
                      <img
                        src={artist.avatar || "https://via.placeholder.com/50"}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>

                    <td className="py-3">{artist.name}</td>
                    <td className="py-3">{artist.mobile || "—"}</td>
                    <td className="py-3">{artist.email || "—"}</td>

                    <td className="py-3">
                      {artist.spotify ? (
                        <a
                          href={artist.spotify}
                          className="text-[#0288D1] dark:text-[#29B6F6] underline"
                          target="_blank"
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3">
                      {artist.apple ? (
                        <a
                          href={artist.apple}
                          className="text-[#0288D1] dark:text-[#29B6F6] underline"
                          target="_blank"
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3">
                      {artist.youtube ? (
                        <a
                          href={artist.youtube}
                          className="text-[#0288D1] dark:text-[#29B6F6] underline"
                          target="_blank"
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(artist)}
                          className="p-2 bg-blue-50 dark:bg-[#111A3A] rounded hover:bg-blue-100 dark:hover:bg-[#1A2347] transition-colors"
                        >
                          <Edit size={16} className="text-[#0288D1] dark:text-[#29B6F6]" />
                        </button>

                        <button
                          onClick={() => deleteArtist(artist._id)}
                          className="p-2 bg-red-50 dark:bg-[#111A3A] rounded hover:bg-red-100 dark:hover:bg-[#1A2347] transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ---------------- MODAL ---------------- */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex justify-center items-center p-4 z-50 transition-colors">
            <form
              onSubmit={saveArtist}
              className="bg-white dark:bg-[#0B1029] p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-[#1A2347]"
            >
              <h2 className="text-lg font-semibold mb-4 text-[#020726] dark:text-white">
                {editing ? "Edit Artist" : "Add Artist"}
              </h2>

              <div className="space-y-3">
                <input
                  required
                  placeholder="Artist Name"
                  className="border dark:border-[#1A2347] rounded px-3 py-2 w-full bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  placeholder="Mobile Number"
                  className="border dark:border-[#1A2347] rounded px-3 py-2 w-full bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />

                <input
                  placeholder="Email"
                  className="border dark:border-[#1A2347] rounded px-3 py-2 w-full bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                  placeholder="Spotify URL"
                  className="border dark:border-[#1A2347] rounded px-3 py-2 w-full bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
                  value={form.spotify}
                  onChange={(e) =>
                    setForm({ ...form, spotify: e.target.value })
                  }
                />

                <input
                  placeholder="Apple Music URL"
                  className="border dark:border-[#1A2347] rounded px-3 py-2 w-full bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
                  value={form.apple}
                  onChange={(e) => setForm({ ...form, apple: e.target.value })}
                />

                <input
                  placeholder="YouTube URL"
                  className="border dark:border-[#1A2347] rounded px-3 py-2 w-full bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
                  value={form.youtube}
                  onChange={(e) =>
                    setForm({ ...form, youtube: e.target.value })
                  }
                />

                {/* Image Upload */}
                <label className="flex items-center gap-2 cursor-pointer text-[#020726] dark:text-white">
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
                  className="px-4 py-2 border dark:border-[#1A2347] rounded text-[#020726] dark:text-white bg-white dark:bg-[#111A3A]"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button className="px-4 py-2 bg-[#0288D1] hover:bg-[#29B6F6] text-white rounded transition-colors">
                  Save Artist
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
