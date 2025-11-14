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

  // ================================
  // FETCH ALL BANK DETAILS
  // ================================
  useEffect(() => {
    axios
      .get(`${baseUrl}/bank`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setRecords(res.data.data);
      })
      .catch((err) => console.error("Error fetching bank details:", err));
  }, []);

  // ================================
  // VERIFY BANK RECORD
  // ================================
  const verifyAccount = async (id: string) => {
    try {
      await axios.put(
        `${baseUrl}/bank/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecords((prev) =>
        prev.map((r) => (r._id === id ? { ...r, verified: true } : r))
      );

      alert("Bank account verified successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // ================================
  // DELETE BANK RECORD
  // ================================
  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bank record?")) return;

    try {
      await axios.delete(`${baseUrl}/bank/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords((prev) => prev.filter((r) => r._id !== id));

      alert("Bank details deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  // ================================
  // SEARCH
  // ================================
  const filtered = records.filter(
    (r) =>
      r.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Bank Details Management</h1>

        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center border border-green-400 rounded-lg p-2 w-72">
            <Search className="text-green-600 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="bg-transparent w-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-800">
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
                <tr
                  key={record._id}
                  className="border-b hover:bg-green-100"
                >
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

                  <td className="py-3 px-4 flex justify-center gap-3">
                    {!record.verified ? (
                      <button
                        onClick={() => verifyAccount(record._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <ShieldCheck size={18} />
                      </button>
                    ) : (
                      <ShieldOff className="text-gray-400" size={18} />
                    )}

                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>

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
                  <td
                    colSpan={9}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No bank details found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminSettingsPage;
