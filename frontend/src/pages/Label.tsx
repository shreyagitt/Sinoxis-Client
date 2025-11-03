import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import axios from "axios";

interface Label {
  id: number;
  name: string;
  country: string;
  founded: string;
  status: "active" | "inactive";
}

const LabelsPage: React.FC = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLabel, setEditLabel] = useState<Label | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    founded: "",
    status: "active",
  });

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const response = await axios.get("/api/labels");
      setLabels(Array.isArray(response.data) ? response.data : response.data.data || []);

    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  };

  const handleAddLabel = async () => {
    try {
      if (editLabel) {
        await axios.put(`/api/labels/${editLabel.id}`, formData);
      } else {
        await axios.post("/api/labels", formData);
      }
      fetchLabels();
      closeModal();
    } catch (error) {
      console.error("Error saving label:", error);
    }
  };

  const handleDeleteLabel = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this label?")) {
      try {
        await axios.delete(`/api/labels/${id}`);
        fetchLabels();
      } catch (error) {
        console.error("Error deleting label:", error);
      }
    }
  };

  const openModal = (label?: Label) => {
    if (label) {
      setEditLabel(label);
      setFormData({
        name: label.name,
        country: label.country,
        founded: label.founded,
        status: label.status,
      });
    } else {
      setEditLabel(null);
      setFormData({ name: "", country: "", founded: "", status: "active" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditLabel(null);
  };

  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Labels</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Label
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center bg-white shadow-sm rounded-xl p-3">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search labels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none bg-transparent text-gray-700"
        />
      </div>

      {/* Labels Table */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-4 text-left">Label Name</th>
              <th className="py-3 px-4 text-left">Country</th>
              <th className="py-3 px-4 text-left">Founded</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLabels.length > 0 ? (
              filteredLabels.map((label) => (
                <tr
                  key={label.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{label.name}</td>
                  <td className="py-3 px-4">{label.country}</td>
                  <td className="py-3 px-4">{label.founded}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        label.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {label.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center space-x-3">
                    <button
                      onClick={() => openModal(label)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteLabel(label.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 font-medium"
                >
                  No labels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Label */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editLabel ? "Edit Label" : "Add New Label"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Label Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Founded (Year)"
                value={formData.founded}
                onChange={(e) =>
                  setFormData({ ...formData, founded: e.target.value })
                }
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLabel}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {editLabel ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelsPage;
