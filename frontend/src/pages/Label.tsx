// src/pages/LabelPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Search, ImagePlus , Eye, Download } from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

interface Client {
  _id: string;
  name: string;
  email: string;
}
/* ================================
   LABEL INTERFACE
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

  createdBy?: string;
  createdAt?: string;
  expires?: string;

  aadharFront?: string;
  aadharBack?: string;
}

const LabelPage: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [records, setRecords] = useState<Label[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Label | null>(null);
const [clients, setClients] = useState<Client[]>([]);
  /* FORM DATA */
  const [formData, setFormData] = useState({
  fullName: "",
  labelName: "",
  email: "",
  phone: "",
  youtube: "",
  language: "",
  status: "Pending",
  createdBy: "",

  createdAt: new Date().toISOString().split("T")[0], // auto
  expires: "",

  aadharFront: null as File | null,
  aadharBack: null as File | null,
});


const [viewing, setViewing] = useState<Label | null>(null);


 /* ============================
        DOWNLOAD FILE
  ============================ */
  const downloadFile = (url?: string, name?: string) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = name || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  /* ============================
        FETCH LABELS
  ============================ */
  const fetchLabels = async () => {
    try {
      const res = await axios.get(`${baseUrl}/labels`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setRecords(res.data.data);
    } catch (err) {
      toast.error("Failed to load labels");
    }
  };

  useEffect(() => {
    if (token) fetchLabels();
  }, [token]);

  const fetchClients = async () => {
  try {
    const res = await axios.get(`${baseUrl}/users?role=client`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setClients(res.data.data);
    }
  } catch {
    toast.error("Failed to load clients");
  }
};

  /* ============================
        SAVE LABEL
  ============================ */
  const saveLabel = async () => {
    if (!token) return toast.error("Unauthorized");

    const fd = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (key !== "aadharFront" && key !== "aadharBack") {
        // @ts-ignore
        fd.append(key, val);
      }
    });

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
      fetchClients();
      closeModal();
    } catch {
      toast.error("Failed to save label");
    }
  };

  /* ============================
          DELETE LABEL
  ============================ */
  const deleteLabel = async (id: string) => {
    if (!confirm("Delete this label?")) return;

    try {
      await axios.delete(`${baseUrl}/labels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords((prev) => prev.filter((r) => r._id !== id));
      toast.success("Label deleted");
    } catch {
      toast.error("Failed to delete label");
    }
  };

  /* MODAL HANDLERS */
  const openModal = (label?: Label) => {
  fetchClients();   // ADD THIS
const toDateInput = (date?: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
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
      createdBy: label.createdBy || "",
      createdAt: toDateInput(label.createdAt),
expires: toDateInput(label.expires),
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
      createdBy: "",
      createdAt: new Date().toISOString().split("T")[0],
      expires: "",
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
            SEARCH
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
            UI START
  ============================ */
  return (
    <div className="min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white px-6 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Label Management</h1>

          <button
            onClick={() => openModal()}
            className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#29B6F6] to-[#0288D1] shadow hover:opacity-90"
          >
            + Add Label
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-center border border-[#1A2347] rounded-lg p-2 w-72 mb-6 bg-white dark:bg-[#0B1029]">
          <Search className="text-[#0288D1] mr-2" size={18} />
          <input
            type="text"
            placeholder="Search label, name, phone..."
            className="bg-transparent w-full outline-none text-[#020726] dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl shadow border border-[#1A2347] bg-white dark:bg-[#0B1029]">
          <table className="min-w-full text-sm text-[#020726] dark:text-gray-300 table-auto">
            <thead className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white">
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
                <tr
                  key={label._id}
                  className="border-b border-[#1A2347] hover:bg-gray-100 dark:hover:bg-[#111A3A]"
                >

                  {/* IMAGES */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={label.aadharFront || "https://via.placeholder.com/50"}
                      className="w-12 h-12 rounded object-cover border border-[#1A2347]"
                    />
                    <img
                      src={label.aadharBack || "https://via.placeholder.com/50"}
                      className="w-12 h-12 rounded object-cover border border-[#1A2347]"
                    />
                  </td>

                  {/* LABEL NAME */}
                  <td className="py-3 px-4">{label.labelName}</td>

                  {/* FULL NAME */}
                  <td className="py-3 px-4">{label.fullName}</td>

                  {/* PHONE */}
                  <td className="py-3 px-4">{label.phone}</td>

                  {/* STATUS BADGES */}
                  <td className="py-3 px-4">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${
                          label.status === "Active"
                            ? "bg-[#29B6F6]/20 text-[#29B6F6]"
                            : label.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : label.status === "Inactive"
                            ? "bg-gray-500/20 text-gray-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      `}
                    >
                      {label.status}
                    </span>

                    
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => openModal(label)}
                        className="text-[#29B6F6] hover:text-white hover:bg-[#29B6F6] p-2 rounded transition"
                      >
                        <Edit size={18} />
                      </button>


<button
  onClick={() => setViewing(label)}
  className="text-green-500 hover:text-white hover:bg-green-500 p-2 rounded transition"
>
  <Eye size={18} />
</button>
                      <button
                        onClick={() => deleteLabel(label._id)}
                        className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-5 text-gray-500 dark:text-gray-400 italic"
                  >
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
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 p-4">
            <div className="
  bg-white dark:bg-[#0B1029] text-[#020726] dark:text-white 
  rounded-xl p-6 w-full max-w-md
  shadow-xl border border-[#1A2347]
  max-h-[90vh] overflow-y-auto
">

              <h2 className="text-xl font-semibold mb-4">
                {editing ? "Edit Label" : "Add Label"}
              </h2>

              <div className="space-y-3">
                {/* FIELDS */}
                {[
                  "fullName",
                  "labelName",
                  "email",
                  "phone",
                  "language",
                  "youtube",
                ].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.replace(/^\w/, (x) => x.toUpperCase())}
                    className="w-full border border-[#1A2347] bg-white dark:bg-[#111A3A] rounded-md px-3 py-2"
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                  />
                ))}

                <select
  className="w-full border border-[#1A2347] bg-white dark:bg-[#111A3A] rounded-md px-3 py-2"
  value={formData.createdBy}
  onChange={(e) =>
    setFormData({
      ...formData,
      createdBy: e.target.value,
    })
  }
>
  <option value="">Select Client</option>
  {clients.map((client) => (
    <option key={client._id} value={client._id}>
      {client.name} ({client.email})
    </option>
  ))}
</select>

                {/* STATUS */}
                <select
                  className="w-full border border-[#1A2347] bg-white dark:bg-[#111A3A] rounded-md px-3 py-2"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Rejected</option>
                  <option>Inactive</option>
                </select>

                {/* CREATED DATE */}
<input
  type="date"
  className="w-full border border-[#1A2347] rounded-md px-3 py-2"
  value={formData.createdAt}
  onChange={(e) =>
    setFormData({ ...formData, createdAt: e.target.value })
  }
/>

{/* EXPIRY DATE */}
<input
  type="date"
  className="w-full border border-[#1A2347] rounded-md px-3 py-2"
  value={formData.expires}
  onChange={(e) =>
    setFormData({ ...formData, expires: e.target.value })
  }
/>

                {/* FILE UPLOADS */}
                <div>
  <label
    htmlFor="aadharFrontInput"
    className="flex gap-2 cursor-pointer items-center"
  >
    <ImagePlus size={18} /> Upload Aadhar Front
  </label>

  <input
    id="aadharFrontInput"
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
  <label
    htmlFor="aadharBackInput"
    className="flex gap-2 cursor-pointer items-center"
  >
    <ImagePlus size={18} /> Upload Aadhar Back
  </label>

  <input
    id="aadharBackInput"
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

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 dark:bg-[#111A3A] rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={saveLabel}
                  className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90"
                >
                  {editing ? "Update" : "Submit"}
                </button>
              </div>

            </div>
          </div>
        )}

        {viewing && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div className="bg-white dark:bg-[#0B1029] p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

      <h2 className="text-xl font-semibold mb-4">Label Details</h2>

      <div className="space-y-2 text-sm">

        <p><b>Full Name:</b> {viewing.fullName}</p>
        <p><b>Label Name:</b> {viewing.labelName}</p>
        <p><b>Email:</b> {viewing.email}</p>
        <p><b>Phone:</b> {viewing.phone}</p>
        <p><b>Language:</b> {viewing.language}</p>
        <p><b>YouTube:</b> {viewing.youtube}</p>

        <p><b>Status:</b> {viewing.status}</p>
        <p><b>Created Date:</b> {viewing.createdAt}</p>
        <p><b>Expiry Date:</b> {viewing.expires}</p>

      </div>

      {/* AADHAR PREVIEW */}
      <div className="mt-4 space-y-3">
        <p className="font-medium">Documents</p>

        <img
          src={viewing.aadharFront}
          className="w-full h-40 object-cover rounded"
        />

        <img
          src={viewing.aadharBack}
          className="w-full h-40 object-cover rounded"
        />
      </div>

      {/* DOWNLOAD BUTTONS */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => downloadFile(viewing.aadharFront, "aadhar-front.jpg")}
          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <Download size={16}/> Front
        </button>

        <button
          onClick={() => downloadFile(viewing.aadharBack, "aadhar-back.jpg")}
          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <Download size={16}/> Back
        </button>
      </div>

      <button
        onClick={() => setViewing(null)}
        className="mt-5 w-full bg-gray-400 py-2 rounded"
      >
        Close
      </button>

    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default LabelPage;
