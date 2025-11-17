import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Search, ImagePlus } from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

interface Label {
  _id: string;
  name: string;
  genre: string;
  followers: string;
  status: "Active" | "Inactive";
  labelImage?: string;
}

const LabelPage: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [records, setRecords] = useState<Label[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Label | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    followers: "",
    status: "Active",
    labelImage: null as File | null,
  });

  // ================================
  // FETCH LABELS
  // ================================
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${baseUrl}/labels`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setRecords(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching labels:", err);
        toast.error("Failed to fetch labels");
      });
  }, [token]);

  // ================================
  // CREATE / UPDATE LABEL
  // ================================
  const saveLabel = async () => {
    if (!token) return toast.error("Unauthorized");

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("genre", formData.genre);
    fd.append("followers", formData.followers);
    fd.append("status", formData.status);
    if (formData.labelImage) fd.append("labelImage", formData.labelImage);

    try {
      if (editing) {
        await axios.put(`${baseUrl}/labels/${editing._id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Label updated successfully");
      } else {
        await axios.post(`${baseUrl}/labels`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Label created successfully");
      }

      // refresh
      const res = await axios.get(`${baseUrl}/labels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data.data);

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save label");
    }
  };

  // ================================
  // DELETE LABEL
  // ================================
  const deleteLabel = async (id: string) => {
    if (!window.confirm("Delete this label?")) return;

    try {
      await axios.delete(`${baseUrl}/labels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords((prev) => prev.filter((r) => r._id !== id));
      toast.success("Label deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete label");
    }
  };

  // ================================
  // OPEN MODAL
  // ================================
  const openModal = (label?: Label) => {
    if (label) {
      setEditing(label);
      setFormData({
        name: label.name,
        genre: label.genre,
        followers: label.followers,
        status: label.status,
        labelImage: null,
      });
    } else {
      setEditing(null);
      setFormData({
        name: "",
        genre: "",
        followers: "",
        status: "Active",
        labelImage: null,
      });
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  // ================================
  // SEARCH
  // ================================
  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Label Management</h1>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add Label
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center border border-green-400 rounded-lg p-2 w-72 mb-6">
          <Search className="text-green-600 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by name or genre..."
            className="bg-transparent w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Genre</th>
                <th className="py-3 px-4 text-left">Followers</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((label) => (
                <tr key={label._id} className="border-b hover:bg-green-100">
                  <td className="py-3 px-4">
                    <img
                      src={label.labelImage || "https://via.placeholder.com/50"}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>

                  <td className="py-3 px-4">{label.name}</td>
                  <td className="py-3 px-4">{label.genre}</td>
                  <td className="py-3 px-4">{label.followers}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        label.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {label.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => openModal(label)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => deleteLabel(label._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No labels found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editing ? "Edit Label" : "Add New Label"}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Label Name"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Genre (Pop, Hip-Hop...)"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Followers (ex: 12K)"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.followers}
                  onChange={(e) =>
                    setFormData({ ...formData, followers: e.target.value })
                  }
                />

                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <ImagePlus size={18} /> Upload Label Image
                  </label>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        labelImage: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  onClick={saveLabel}
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LabelPage;


