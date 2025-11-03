import React, { useState, useEffect } from "react";
import ReleaseTable from "../Components/Release/ReleaseTable"; 
import ReleaseForm from "../Components/Release/ReleaseForm";  
import Tabs from "../Components/Release/Tabs";
import { Plus } from "lucide-react";

export type Release = {
  id: number;
  title: string;
  artist: string;
  label?: string;
  releaseDate?: string;
  status: "Pending" | "Approved" | "Rejected" | "Unfinished" | "Action Required";
};

const ReleasesPage: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Release | null>(null);

  useEffect(() => {
    // initial demo data
    setReleases([
      { id: 1, title: "Ocean Vibes", artist: "DJ Sinox", status: "Approved" },
      { id: 2, title: "Neon Dreams", artist: "Starline", status: "Pending" },
      { id: 3, title: "Midnight Echoes", artist: "Nova Beats", status: "Rejected" },
    ]);
  }, []);

  const filteredReleases =
    activeTab === "All" ? releases : releases.filter((r) => r.status === activeTab);

  // Create new release (from form)
  const handleCreate = (payload: Omit<Release, "id">) => {
    const next: Release = { id: Date.now(), ...payload };
    setReleases((p) => [next, ...p]);
    setShowForm(false);
    setEditing(null);
  };

  // Update existing release
  const handleUpdate = (payload: Release) => {
    setReleases((p) => p.map((r) => (r.id === payload.id ? payload : r)));
    setShowForm(false);
    setEditing(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (!confirm("Delete this release?")) return;
    setReleases((p) => p.filter((r) => r.id !== id));
  };

  // open form to edit
  const handleEdit = (release: Release) => {
    setEditing(release);
    setShowForm(true);
  };

  // quick status change (approve/reject)
  const handleStatusChange = (id: number, status: Release["status"]) => {
    setReleases((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Releases Management</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus size={18} /> Create New Release
        </button>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ReleaseTable
        releases={filteredReleases}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleStatusChange}
      />

      {showForm && (
        <ReleaseForm
          initial={editing ?? null}
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