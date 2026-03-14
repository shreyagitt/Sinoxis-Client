import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Power } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";

type Language = {
  _id: string;
  name: string;
  isActive: boolean;
};

export default function LanguagesPage() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [languages, setLanguages] = useState<Language[]>([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    _id: "",
    name: "",
  });

  /* ---------------- FETCH LANGUAGES ---------------- */

  const fetchLanguages = async () => {
    try {
      const res = await axios.get(`${baseUrl}/language`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setLanguages(res.data.data);
    } catch {
      toast.error("Failed to load languages");
    }
  };

  useEffect(() => {
    if (token) fetchLanguages();
  }, [token]);

  /* ---------------- ADD ---------------- */

  const openAdd = () => {
    setEditing(false);
    setForm({ _id: "", name: "" });
    setModalOpen(true);
  };

  /* ---------------- EDIT ---------------- */

  const openEdit = (language: Language) => {
    setEditing(true);
    setForm({
      _id: language._id,
      name: language.name,
    });
    setModalOpen(true);
  };

  /* ---------------- SAVE ---------------- */

  const saveLanguage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing) {
        await axios.patch(`${baseUrl}/language/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Language updated");
      } else {
        await axios.post(`${baseUrl}/language`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Language created");
      }

      fetchLanguages();
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Save failed");
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteLanguage = async (id: string) => {
    if (!confirm("Delete this language?")) return;

    try {
      await axios.delete(`${baseUrl}/language/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLanguages((prev) => prev.filter((l) => l._id !== id));
      toast.success("Language deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- TOGGLE ---------------- */

  const toggleActive = async (id: string) => {
    try {
      await axios.patch(
        `${baseUrl}/language/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchLanguages();
      toast.success("Status updated");
    } catch {
      toast.error("Status update failed");
    }
  };

  /* ---------------- SEARCH ---------------- */

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-white dark:bg-[#020726] p-6 transition-colors">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#020726] dark:text-white">
            Languages
          </h1>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0288D1] hover:bg-[#29B6F6] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} />
            Add Language
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white dark:bg-[#0B1029] rounded-lg p-4 shadow border border-gray-200 dark:border-[#1A2347] mb-4 flex items-center gap-2">
          <Search size={16} className="text-gray-400" />

          <input
            placeholder="Search language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-64 bg-white dark:bg-[#111A3A] text-[#020726] dark:text-white"
          />
        </div>

        {/* TABLE */}

        <div className="bg-white dark:bg-[#0B1029] rounded-lg shadow p-6 border border-gray-200 dark:border-[#1A2347] overflow-x-auto">

          <table className="w-full text-sm text-[#020726] dark:text-gray-200">

            <thead className="border-b border-gray-300 dark:border-[#1A2347] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-3 text-left">Language</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-400">
                    No languages found
                  </td>
                </tr>
              ) : (
                filtered.map((language) => (
                  <tr
                    key={language._id}
                    className="border-b border-gray-200 dark:border-[#1A2347] hover:bg-gray-50 dark:hover:bg-[#111A3A]"
                  >

                    <td className="py-3 font-medium">{language.name}</td>

                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          language.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {language.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() => toggleActive(language._id)}
                          className="p-2 bg-yellow-50 rounded hover:bg-yellow-100"
                        >
                          <Power size={16} className="text-yellow-600" />
                        </button>

                        <button
                          onClick={() => openEdit(language)}
                          className="p-2 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          <Edit size={16} className="text-blue-600" />
                        </button>

                        <button
                          onClick={() => deleteLanguage(language._id)}
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

        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">

            <form
              onSubmit={saveLanguage}
              className="bg-white dark:bg-[#0B1029] p-6 rounded-xl shadow-xl w-full max-w-md border"
            >

              <h2 className="text-lg font-semibold mb-4">
                {editing ? "Edit Language" : "Add Language"}
              </h2>

              <input
                required
                placeholder="Language name"
                className="border rounded px-3 py-2 w-full"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button className="px-4 py-2 bg-[#0288D1] text-white rounded">
                  Save
                </button>

              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}