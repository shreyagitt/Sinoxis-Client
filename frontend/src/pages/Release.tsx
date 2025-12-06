import React, { useState, useEffect } from "react";
import ReleaseTable from "../Components/Release/ReleaseTable";
import ReleaseForm from "../Components/Release/ReleaseForm";
import Tabs from "../Components/Release/Tabs";
import { Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";
import { Release } from "./ReleaseTypes";

const ReleasesPage: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [releases, setReleases] = useState<Release[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Release | null>(null);

  const fetchReleases = async () => {
    try {
      const res = await axios.get(`${baseUrl}/release`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReleases(res.data.data || []);
    } catch {
      toast.error("Failed to load releases");
    }
  };

  useEffect(() => {
    if (token) fetchReleases();
  }, [token]);

  const filtered =
    activeTab === "All"
      ? releases
      : releases.filter((r) => r.status === activeTab);

  const handleCreate = async (fd: FormData) => {
    try {
      await axios.post(`${baseUrl}/release`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Release created");
      fetchReleases();
      setShowForm(false);
    } catch {
      toast.error("Create failed");
    }
  };

  const handleUpdate = async (id: string, fd: FormData) => {
    try {
      await axios.put(`${baseUrl}/release/${id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Release updated");
      fetchReleases();
      setShowForm(false);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this release?")) return;
    try {
      await axios.delete(`${baseUrl}/release/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchReleases();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatus = async (id: string, status: Release["status"]) => {
    try {
      await axios.put(
        `${baseUrl}/release/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchReleases();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Releases Management</h1>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md"
        >
          <Plus size={18} /> Create Release
        </button>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ReleaseTable
        releases={filtered}
        onEdit={setEditing}
        onDelete={handleDelete}
        onChangeStatus={handleStatus}
      />

      {showForm && (
        <ReleaseForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ReleasesPage;
