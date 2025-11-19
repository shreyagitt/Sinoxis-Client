import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  Search,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

interface BankRecord {
  _id: string;
  userId?: string;
  accountName: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  bankBranch?: string;
  panNumber?: string;
  verified: boolean;
}

const AdminSettingsPage: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [records, setRecords] = useState<BankRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- MODAL STATE ---
  const [editing, setEditing] = useState<BankRecord | null>(null);
  const [editForm, setEditForm] = useState<BankRecord | null>(null);

  // ================================
  // FETCH ALL BANK DETAILS
  // ================================
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${baseUrl}/bank`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setRecords(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching bank details:", err);
        toast.error("Failed to fetch bank details");
      });
  }, [token]);

  // ================================
  // VERIFY ACCOUNT
  // ================================
  const verifyAccount = async (id: string) => {
    try {
      await axios.put(
        `${baseUrl}/bank/${id}/verify`,
        { verified: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecords((prev) =>
        prev.map((r) => (r._id === id ? { ...r, verified: true } : r))
      );

      toast.success("Account verified");
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify");
    }
  };

  // ================================
  // UNVERIFY ACCOUNT
  // ================================
  const unverifyAccount = async (id: string) => {
    try {
      await axios.put(
        `${baseUrl}/bank/${id}/verify`,
        { verified: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecords((prev) =>
        prev.map((r) => (r._id === id ? { ...r, verified: false } : r))
      );

      toast.success("Account unverified");
    } catch (err) {
      console.error(err);
      toast.error("Failed to unverify");
    }
  };

  // ================================
  // DELETE RECORD
  // ================================
  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`${baseUrl}/bank/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords((prev) => prev.filter((r) => r._id !== id));
      toast.success("Record deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // ================================
  // OPEN EDIT MODAL
  // ================================
  const openEdit = (record: BankRecord) => {
    setEditing(record);
    setEditForm({ ...record });
  };

  // ================================
  // SAVE EDIT CHANGES
  // ================================
  const saveEdit = async () => {
    if (!editForm) return;

    try {
      const res = await axios.put(
        `${baseUrl}/bank/${editForm._id}/verify`,
        { verified: editForm.verified },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update entire record (except verified is updated separately)
      setRecords((prev) =>
        prev.map((r) =>
          r._id === editForm._id ? { ...editForm } : r
        )
      );

      toast.success("Details updated");
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update details");
    }
  };

  // ================================
  // SEARCH FILTER
  // ================================
  const filtered = records.filter(
    (r) =>
      r.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">Bank Details Management</h1>

        {/* Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center border border-green-400 rounded-lg p-2 w-72">
            <Search className="text-green-600 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="bg-transparent w-full outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-700">

            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Account Holder</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Bank Name</th>
                <th className="py-3 px-4 text-left">Account No.</th>
                <th className="py-3 px-4 text-left">IFSC</th>
                <th className="py-3 px-4 text-left">Branch</th>
                <th className="py-3 px-4 text-left">PAN</th>
                <th className="py-3 px-4 text-center">Verified</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((record) => (
                <tr key={record._id} className="border-b hover:bg-green-100">

                  <td className="py-3 px-4">{record.accountName}</td>
                  <td className="py-3 px-4">{record.email}</td>
                  <td className="py-3 px-4">{record.bankName}</td>
                  <td className="py-3 px-4">{record.accountNumber}</td>
                  <td className="py-3 px-4">{record.ifscCode}</td>
                  <td className="py-3 px-4">{record.bankBranch || "-"}</td>
                  <td className="py-3 px-4">{record.panNumber || "-"}</td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.verified
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {record.verified ? "Verified" : "Not Verified"}
                    </span>
                  </td>

                  <td className="py-3 px-4 flex justify-center gap-4">

                    {/* VERIFY */}
                    {!record.verified ? (
                      <button
                        onClick={() => verifyAccount(record._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <ShieldCheck size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => unverifyAccount(record._id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <ShieldOff size={18} />
                      </button>
                    )}

                    {/* EDIT */}
                    <button
                      onClick={() => openEdit(record)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteRecord(record._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>

                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500 italic">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

      {/* ----------------------------------------------------
          EDIT MODAL — FULL DETAILS  
      ---------------------------------------------------- */}
      {editing && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[450px] shadow-xl max-h-[90vh] overflow-y-auto">

            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Edit Bank Details
            </h3>

            {/* ACCOUNT HOLDER NAME */}
            <label className="block text-sm font-medium text-gray-600 mt-2">
              Account Holder Name
            </label>
            <input
              className="w-full border p-2 rounded"
              value={editForm.accountName}
              onChange={(e) =>
                setEditForm({ ...editForm, accountName: e.target.value })
              }
            />

            {/* EMAIL (READ ONLY) */}
            <label className="block text-sm font-medium text-gray-600 mt-3">
              Email (readonly)
            </label>
            <input
              className="w-full border p-2 rounded bg-gray-100"
              value={editForm.email}
              readOnly
            />

            {/* BANK NAME */}
            <label className="block text-sm font-medium text-gray-600 mt-3">
              Bank Name
            </label>
            <input
              className="w-full border p-2 rounded"
              value={editForm.bankName}
              onChange={(e) =>
                setEditForm({ ...editForm, bankName: e.target.value })
              }
            />

            {/* ACCOUNT NUMBER */}
            <label className="block text-sm font-medium text-gray-600 mt-3">
              Account Number
            </label>
            <input
              className="w-full border p-2 rounded"
              value={editForm.accountNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, accountNumber: e.target.value })
              }
            />

            {/* IFSC */}
            <label className="block text-sm font-medium text-gray-600 mt-3">
              IFSC Code
            </label>
            <input
              className="w-full border p-2 rounded"
              value={editForm.ifscCode}
              onChange={(e) =>
                setEditForm({ ...editForm, ifscCode: e.target.value })
              }
            />

            {/* BRANCH */}
            <label className="block text-sm font-medium text-gray-600 mt-3">
              Bank Branch
            </label>
            <input
              className="w-full border p-2 rounded"
              value={editForm.bankBranch}
              onChange={(e) =>
                setEditForm({ ...editForm, bankBranch: e.target.value })
              }
            />

            {/* PAN NUMBER */}
            <label className="block text-sm font-medium text-gray-600 mt-3">
              PAN Number
            </label>
            <input
              className="w-full border p-2 rounded"
              value={editForm.panNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, panNumber: e.target.value })
              }
            />

            {/* VERIFIED CHECKBOX */}
            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                checked={editForm.verified}
                onChange={(e) =>
                  setEditForm({ ...editForm, verified: e.target.checked })
                }
                className="w-5 h-5 accent-green-600"
              />
              <span className="text-sm text-gray-700">Verified</span>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSettingsPage;


