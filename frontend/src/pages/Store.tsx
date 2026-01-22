import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ImagePlus, Power } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";

type Store = {
  _id: string;
  name: string;
  platform: string;
  icon: string;
  isActive: boolean;
};

export default function StoresPage() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    _id: "",
    name: "",
    platform: "",
  });

  // ───────────────── FETCH STORES ─────────────────
  const fetchStores = async () => {
    try {
      const res = await axios.get(`${baseUrl}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setStores(res.data.data);
    } catch {
      toast.error("Failed to load stores");
    }
  };

  useEffect(() => {
    if (token) fetchStores();
  }, [token]);

  // ───────────────── OPEN ADD ─────────────────
  const openAdd = () => {
    setEditing(false);
    setForm({ _id: "", name: "", platform: "" });
    setImagePreview(null);
    setImageFile(null);
    setModalOpen(true);
  };

  // ───────────────── OPEN EDIT ─────────────────
  const openEdit = (store: Store) => {
    setEditing(true);

    setForm({
      _id: store._id,
      name: store.name,
      platform: store.platform,
    });

    setImagePreview(store.icon);
    setImageFile(null);
    setModalOpen(true);
  };

  // ───────────────── SAVE STORE ─────────────────
  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("platform", form.platform);

    if (imageFile) fd.append("icon", imageFile);

    try {
      if (editing) {
        await axios.patch(`${baseUrl}/store/${form._id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Store updated successfully");
      } else {
        await axios.post(`${baseUrl}/store`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Store created successfully");
      }

      fetchStores();
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save store");
    }
  };

  // ───────────────── DELETE STORE ─────────────────
  const deleteStore = async (id: string) => {
    if (!confirm("Delete this store permanently?")) return;

    try {
      await axios.delete(`${baseUrl}/store/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStores((prev) => prev.filter((s) => s._id !== id));
      toast.success("Store deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ───────────────── TOGGLE ACTIVE ─────────────────
  const toggleActive = async (id: string) => {
    try {
      await axios.patch(
        `${baseUrl}/store/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Store status updated");
      fetchStores();
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ───────────────── IMAGE PREVIEW ─────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ───────────────── SEARCH FILTER ─────────────────
  const filtered = stores.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // ───────────────── UI ─────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-[#020726] p-6 transition-colors">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#020726] dark:text-white">
            Stores
          </h1>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0288D1] hover:bg-[#29B6F6] text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Store
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white dark:bg-[#0B1029] rounded-lg p-4 shadow border border-gray-200 dark:border-[#1A2347] mb-4 flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search store..."
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
                <th className="py-3 text-left">Icon</th>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Platform</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No stores found
                  </td>
                </tr>
              ) : (
                filtered.map((store) => (
                  <tr
                    key={store._id}
                    className="border-b border-gray-200 dark:border-[#1A2347] hover:bg-gray-50 dark:hover:bg-[#111A3A]"
                  >
                    <td className="py-3">
                      <img
                        src={store.icon}
                        className="w-10 h-10 rounded object-contain bg-white"
                      />
                    </td>

                    <td className="py-3">{store.name}</td>
                    <td className="py-3">{store.platform}</td>

                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          store.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {store.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(store._id)}
                          className="p-2 bg-yellow-50 rounded hover:bg-yellow-100"
                        >
                          <Power size={16} className="text-yellow-600" />
                        </button>

                        <button
                          onClick={() => openEdit(store)}
                          className="p-2 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          <Edit size={16} className="text-blue-600" />
                        </button>

                        <button
                          onClick={() => deleteStore(store._id)}
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
              onSubmit={saveStore}
              className="bg-white dark:bg-[#0B1029] p-6 rounded-xl shadow-xl w-full max-w-md border"
            >
              <h2 className="text-lg font-semibold mb-4">
                {editing ? "Edit Store" : "Add Store"}
              </h2>

              <div className="space-y-3">
                <input
                  required
                  placeholder="Store Name"
                  className="border rounded px-3 py-2 w-full"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  required
                  placeholder="Platform (spotify, apple)"
                  className="border rounded px-3 py-2 w-full"
                  value={form.platform}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value.toLowerCase() })
                  }
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <ImagePlus size={18} />
                  <span>Upload Icon</span>
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
                  Save Store
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
