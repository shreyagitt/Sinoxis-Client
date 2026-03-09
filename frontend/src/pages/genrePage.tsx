import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ImagePlus, Power, Layers } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";
import SubGenreModal from "./SubGenreModal";

type Genre = {
  _id: string;
  name: string;
  icon: string;
  isActive: boolean;
  subGenreCount?: number;
};

export default function GenresPage() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [genres, setGenres] = useState<Genre[]>([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [subGenreModal, setSubGenreModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const [form, setForm] = useState({
    _id: "",
    name: "",
  });


 const openSubGenres = (genre: Genre) => {
  setSelectedGenre(genre);
  setSubGenreModal(true);
};

  /* ---------------- FETCH GENRES ---------------- */

  const fetchGenres = async () => {
    try {
      const res = await axios.get(`${baseUrl}/genre`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setGenres(res.data.data);
    } catch {
      toast.error("Failed to load genres");
    }
  };

  useEffect(() => {
    if (token) fetchGenres();
  }, [token]);

  /* ---------------- ADD GENRE ---------------- */

  const openAdd = () => {
    setEditing(false);
    setForm({ _id: "", name: "" });
    setImagePreview(null);
    setImageFile(null);
    setModalOpen(true);
  };

  /* ---------------- EDIT GENRE ---------------- */

  const openEdit = (genre: Genre) => {
    setEditing(true);

    setForm({
      _id: genre._id,
      name: genre.name,
    });

    setImagePreview(genre.icon);
    setModalOpen(true);
  };

  /* ---------------- SAVE GENRE ---------------- */

  const saveGenre = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);

    if (imageFile) fd.append("icon", imageFile);

    try {
      if (editing) {
        await axios.patch(`${baseUrl}/genre/${form._id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Genre updated");
      } else {
        await axios.post(`${baseUrl}/genre`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Genre created");
      }

      fetchGenres();
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Save failed");
    }
  };

  /* ---------------- DELETE GENRE ---------------- */

  const deleteGenre = async (id: string) => {
    if (!confirm("Delete this genre?")) return;

    try {
      await axios.delete(`${baseUrl}/genre/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGenres((prev) => prev.filter((g) => g._id !== id));

      toast.success("Genre deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- TOGGLE ACTIVE ---------------- */

  const toggleActive = async (id: string) => {
    try {
      await axios.patch(
        `${baseUrl}/genre/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated");
      fetchGenres();
    } catch {
      toast.error("Status update failed");
    }
  };

  /* ---------------- IMAGE PREVIEW ---------------- */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ---------------- SEARCH FILTER ---------------- */

  const filtered = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-white dark:bg-[#020726] p-6 transition-colors">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#020726] dark:text-white">
            Genres
          </h1>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0288D1] hover:bg-[#29B6F6] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} />
            Add Genre
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white dark:bg-[#0B1029] rounded-lg p-4 shadow border border-gray-200 dark:border-[#1A2347] mb-4 flex items-center gap-2">
          <Search size={16} className="text-gray-400" />

          <input
            placeholder="Search genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-64 bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-[#0B1029] rounded-lg shadow p-6 overflow-x-auto border border-gray-200 dark:border-[#1A2347]">

          <table className="w-full text-sm text-[#020726] dark:text-gray-200">

            <thead className="border-b border-gray-300 dark:border-[#1A2347] text-gray-600 dark:text-gray-300">
              <tr>
                {/*<th className="py-3 text-left">Icon</th>*/}
                <th className="py-3 text-left">Genre</th>
                <th className="py-3 text-left">SubGenres</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No genres found
                  </td>
                </tr>
              ) : (
                filtered.map((genre) => (
                  <tr
                    key={genre._id}
                    className="border-b border-gray-200 dark:border-[#1A2347] hover:bg-gray-50 dark:hover:bg-[#111A3A]"
                  >
                   {/* <td className="py-3">
                      <img
                        src={genre.icon}
                        className="w-10 h-10 rounded object-contain bg-white"
                      />
                    </td>*/}

                    <td className="py-3 font-medium">{genre.name}</td>

                   <td className="py-3">
  <button
    onClick={() => openSubGenres(genre)}
    className="flex items-center gap-1 px-3 py-1 rounded bg-purple-100 text-purple-700 text-xs hover:bg-purple-200"
  >
    <Layers size={14} />
    {genre.subGenreCount || 0}
  </button>
</td>

                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          genre.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {genre.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() => toggleActive(genre._id)}
                          className="p-2 bg-yellow-50 rounded hover:bg-yellow-100"
                        >
                          <Power size={16} className="text-yellow-600" />
                        </button>

                        <button
                          onClick={() => openEdit(genre)}
                          className="p-2 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          <Edit size={16} className="text-blue-600" />
                        </button>

                        <button
                          onClick={() => deleteGenre(genre._id)}
                          className="p-2 bg-red-50 rounded hover:bg-red-100"
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

        {/* MODAL */}

        {subGenreModal && selectedGenre && (
  <SubGenreModal
    genreId={selectedGenre._id}
    genreName={selectedGenre.name}
    onClose={() => {
      setSubGenreModal(false);
      setSelectedGenre(null);
    }}
  />
)}

        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">

            <form
              onSubmit={saveGenre}
              className="bg-white dark:bg-[#0B1029] p-6 rounded-xl shadow-xl w-full max-w-md border"
            >

              <h2 className="text-lg font-semibold mb-4">
                {editing ? "Edit Genre" : "Add Genre"}
              </h2>

              <div className="space-y-3">

                <input
                  required
                  placeholder="Genre Name"
                  className="border rounded px-3 py-2 w-full"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <ImagePlus size={18} />
                  Upload Icon
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
                    className="w-20 h-20 rounded object-contain mt-2 bg-white"
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

                <button className="px-4 py-2 bg-[#0288D1] text-white rounded">
                  Save Genre
                </button>

              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}