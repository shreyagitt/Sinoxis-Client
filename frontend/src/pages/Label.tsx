import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Search, ImagePlus } from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* ================================
   LABEL INTERFACE (MATCHES SCHEMA)
================================ */
interface Label {
  _id: string;
  fullName: string;
  labelName: string;
  email: string;
  phone: string;
  youtube: string;
  language: string;
  status: "Active" | "Pending" | "Rejected" | "Inactive";
  aadharFront?: string;
  aadharBack?: string;
  created?: string;
  expiry?: string;
}

const LabelPage: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [records, setRecords] = useState<Label[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Label | null>(null);

  /* FORM DATA (ADMIN CREATE / EDIT) */
  const [formData, setFormData] = useState({
    fullName: "",
    labelName: "",
    email: "",
    phone: "",
    youtube: "",
    language: "",
    status: "Pending",
    aadharFront: null as File | null,
    aadharBack: null as File | null,
  });

  /* ============================
        FETCH LABELS (ADMIN)
  ============================ */
  const fetchLabels = async () => {
    try {
      const res = await axios.get(`${baseUrl}/labels`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to load labels");
    }
  };

  useEffect(() => {
    if (token) fetchLabels();
  }, [token]);

  /* ============================
        SAVE LABEL (CREATE/UPDATE)
  ============================ */
  const saveLabel = async () => {
    if (!token) return toast.error("Unauthorized");

    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("labelName", formData.labelName);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("youtube", formData.youtube);
    fd.append("language", formData.language);
    fd.append("status", formData.status);

    if (formData.aadharFront) fd.append("aadharFront", formData.aadharFront);
    if (formData.aadharBack) fd.append("aadharBack", formData.aadharBack);

    try {
      if (editing) {
        await axios.put(`${baseUrl}/labels/${editing._id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Label updated");
      } else {
        await axios.post(`${baseUrl}/labels`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Label created");
      }

      fetchLabels();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save label");
    }
  };

  /* ============================
          DELETE LABEL (ADMIN)
  ============================ */
  const deleteLabel = async (id: string) => {
    if (!confirm("Delete this label?")) return;

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

  /* ============================
        OPEN / CLOSE MODAL
  ============================ */
  const openModal = (label?: Label) => {
    if (label) {
      setEditing(label);
      setFormData({
        fullName: label.fullName,
        labelName: label.labelName,
        email: label.email,
        phone: label.phone,
        youtube: label.youtube,
        language: label.language,
        status: label.status,
        aadharFront: null,
        aadharBack: null,
      });
    } else {
      setEditing(null);
      setFormData({
        fullName: "",
        labelName: "",
        email: "",
        phone: "",
        youtube: "",
        language: "",
        status: "Pending",
        aadharFront: null,
        aadharBack: null,
      });
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  /* ============================
          SEARCH (SAFE)
  ============================ */
  const filtered = records.filter((r) => {
    const s = searchTerm.toLowerCase();
    return (
      r.fullName?.toLowerCase().includes(s) ||
      r.labelName?.toLowerCase().includes(s) ||
      r.phone?.toLowerCase().includes(s)
    );
  });

  /* ============================
              UI
  ============================ */
  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Label Management</h1>

          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            + Add Label
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-center border border-green-400 rounded-lg p-2 w-72 mb-6">
          <Search className="text-green-600 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search label, name, phone..."
            className="bg-transparent w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl shadow">
  <table className="min-w-full text-sm text-gray-800 table-auto">
    <thead className="bg-green-600 text-white">
      <tr>
        <th className="py-3 px-4 w-40 text-left">Aadhar</th>
        <th className="py-3 px-4 w-48 text-left">Label Name</th>
        <th className="py-3 px-4 w-48 text-left">Full Name</th>
        <th className="py-3 px-4 w-32 text-left">Phone</th>
        <th className="py-3 px-4 w-32 text-left">Status</th>
        <th className="py-3 px-4 w-32 text-center">Actions</th>
      </tr>
    </thead>

    <tbody>
      {filtered.map((label) => (
        <tr key={label._id} className="border-b hover:bg-gray-100">

          {/* AADHAR FRONT + BACK */}
          <td className="py-3 px-4 flex items-center gap-3">
            <img
              src={label.aadharFront || "https://via.placeholder.com/50"}
              className="w-12 h-12 rounded object-cover border"
            />
            <img
              src={label.aadharBack || "https://via.placeholder.com/50"}
              className="w-12 h-12 rounded object-cover border"
            />
          </td>

          {/* LABEL NAME */}
          <td className="py-3 px-4">{label.labelName}</td>

          {/* FULL NAME */}
          <td className="py-3 px-4">{label.fullName}</td>

          {/* PHONE */}
          <td className="py-3 px-4">{label.phone}</td>

          {/* STATUS */}
          <td className="py-3 px-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                label.status === "Active"
                  ? "bg-green-200 text-green-800"
                  : label.status === "Rejected"
                  ? "bg-red-200 text-red-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {label.status}
            </span>
          </td>

          {/* ACTIONS */}
         <td className="py-3 px-4">
  <div className="flex justify-center items-center gap-4">
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
  </div>
</td>

        </tr>
      ))}

      {filtered.length === 0 && (
        <tr>
          <td colSpan={6} className="text-center py-5 text-gray-500 italic">
            No labels found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


        {/* ============================
                MODAL FORM
        ============================ */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

              <h2 className="text-xl font-semibold mb-4">
                {editing ? "Edit Label" : "Add Label"}
              </h2>

              <div className="space-y-3">

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Label Name"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.labelName}
                  onChange={(e) =>
                    setFormData({ ...formData, labelName: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Email"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Language"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="YouTube Link"
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.youtube}
                  onChange={(e) =>
                    setFormData({ ...formData, youtube: e.target.value })
                  }
                />

                {/* STATUS */}
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Label["status"],
                    })
                  }
                >
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Rejected</option>
                  <option>Inactive</option>
                </select>

                {/* FILE UPLOADS */}
                <div>
                  <label className="flex gap-2 cursor-pointer">
                    <ImagePlus size={18} /> Upload Aadhar Front
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aadharFront: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="flex gap-2 cursor-pointer">
                    <ImagePlus size={18} /> Upload Aadhar Back
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aadharBack: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={saveLabel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  {editing ? "Update" : "Submit"}
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
