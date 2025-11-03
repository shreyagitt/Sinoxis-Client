import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight } from "lucide-react";

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  status: "Active" | "Inactive";
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Distribution Services",
      category: "Distribution",
      description: "Handles digital music distribution across all platforms.",
      status: "Active",
    },
    {
      id: 2,
      name: "Marketing & Promotions",
      category: "Marketing",
      description: "Promotional campaigns and artist marketing services.",
      status: "Active",
    },
    {
      id: 3,
      name: "YouTube Claim Management",
      category: "YouTube",
      description: "Manages YouTube monetization and content claims.",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Facebook / Instagram Claim Management",
      category: "Social Media",
      description: "Handles claim management for Facebook and Instagram.",
      status: "Active",
    },
    {
      id: 5,
      name: "Metadata Update Request Form Management",
      category: "Metadata",
      description: "Ensures song metadata is accurate and updated.",
      status: "Inactive",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    status: "Active",
  });

  const [editing, setEditing] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 4;

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editing) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editing.id ? { ...s, ...formData } : s
        )
      );
    } else {
      setServices((prev) => [...prev, { id: Date.now(), ...formData }]);
    }

    setFormData({ name: "", category: "", description: "", status: "Active" });
    setEditing(null);
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      status: service.status,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleStatusToggle = (id: number) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
          : s
      )
    );
  };

  useEffect(() => {
    if (filtered.length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [filtered]);

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          ⚙️ Service Management
        </h1>

        {/* Search and Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center border border-green-400 rounded-lg p-2 w-72">
            <Search className="text-green-600 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none w-full bg-transparent text-gray-800"
            />
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setFormData({ name: "", category: "", description: "", status: "Active" });
            }}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Plus size={18} /> Add Service
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            {editing ? "Edit Service" : "Add New Service"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-green-300 rounded-lg p-2 mt-3 focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            {editing ? "Update Service" : "Add Service"}
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Service Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.id} className="border-b hover:bg-green-100 transition">
                  <td className="py-2 px-4">{s.name}</td>
                  <td className="py-2 px-4">{s.category}</td>
                  <td className="py-2 px-4">{s.description}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleStatusToggle(s.id)}
                      className="flex justify-center w-full"
                    >
                      {s.status === "Active" ? (
                        <ToggleRight className="text-green-600" />
                      ) : (
                        <ToggleLeft className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500 italic">
                    No services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2 pb-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;

