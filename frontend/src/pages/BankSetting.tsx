import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, ShieldCheck, ShieldOff } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  bankName: string;
  accountNumber: string;
}

const AdminSettingsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "John Doe", email: "john@sinoxis.org", status: "Active", bankName: "HDFC Bank", accountNumber: "XXXX5678" },
    { id: 2, name: "Jane Smith", email: "jane@sinoxis.org", status: "Inactive", bankName: "ICICI Bank", accountNumber: "XXXX1234" },
    { id: 3, name: "Alex Lee", email: "alex@sinoxis.org", status: "Active", bankName: "SBI", accountNumber: "XXXX7890" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
    bankName: "",
    accountNumber: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Add or Edit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...c, ...formData } : c))
      );
      alert("✅ Client details updated successfully!");
    } else {
      setClients((prev) => [...prev, { id: Date.now(), ...formData } as Client]);
      alert("✅ New client added successfully!");
    }

    setFormData({
      name: "",
      email: "",
      status: "Active",
      bankName: "",
      accountNumber: "",
    });
    setEditingClient(null);
  };

  // Edit Client
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      status: client.status,
      bankName: client.bankName,
      accountNumber: client.accountNumber,
    });
  };

  // Delete Client
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      alert("🗑️ Client deleted successfully!");
    }
  };

  // Toggle Active / Inactive
  const toggleStatus = (id: number) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c
      )
    );
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / perPage);
  const paginated = filteredClients.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    if (filteredClients.length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [filteredClients]);

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
          Bank Details Management
        </h1>

        {/* Search and Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center border border-green-400 rounded-lg p-2 w-72">
            <Search className="text-green-600 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none w-full bg-transparent text-gray-800"
            />
          </div>

          <button
            onClick={() => {
              setEditingClient(null);
              setFormData({
                name: "",
                email: "",
                status: "Active",
                bankName: "",
                accountNumber: "",
              });
            }}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <Plus size={18} /> Add Client
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className=" border border-green-300 p-6 rounded-xl mb-8 shadow"
        >
          <h2 className="text-lg font-semibold text-green-700 mb-4">
            {editingClient ? "Edit Client" : "Add New Client"}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Client Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            <input
              type="text"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              className="border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {editingClient ? "Update Client" : "Add Client"}
          </button>
        </form>

        {/* Client Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Bank</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((client) => (
                <tr
                  key={client.id}
                  className="border-b hover:bg-green-100 transition"
                >
                  <td className="py-2 px-4">{client.name}</td>
                  <td className="py-2 px-4">{client.email}</td>
                  <td className="py-2 px-4">{client.bankName}</td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => toggleStatus(client.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      {client.status === "Active" ? (
                        <ShieldOff size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
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
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
    </div>
  );
};

export default AdminSettingsPage;
