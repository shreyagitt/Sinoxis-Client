import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Check, X, RefreshCcw, Trash2 } from "lucide-react";
import { useAppSelector } from "../store/hook";

type ReleaseStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Inactive"
  | "Unfinished"
  | "Action Required";

interface Release {
  _id: string;
  title: string;
  artist: string;
  label?: string;
  isrc?: string;
  upc?: string;
  cover?: string;
  status: ReleaseStatus;
  createdAt: string;
  userId?: {
    fullName?: string;
    email?: string;
  };
}

const AdminReleases: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);

  /* ============================
      FETCH RELEASES
  ============================ */
  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/release`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReleases(res.data.data || []);
    } catch {
      toast.error("Failed to load releases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReleases();
  }, [token]);

  /* ============================
        CHANGE STATUS
  ============================ */
  const changeStatus = async (id: string, status: ReleaseStatus) => {
    try {
      await axios.patch(
        `${baseUrl}/release/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated");
      fetchReleases();
    } catch {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Release Management</h1>

        <button
          onClick={fetchReleases}
          className="flex items-center gap-2 px-4 py-2 
                     bg-white dark:bg-[#0B1029] 
                     border border-gray-300 dark:border-[#1A2347] 
                     rounded-md text-sm hover:bg-gray-100 dark:hover:bg-[#111A3A]"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white dark:bg-[#0B1029] 
                      rounded-lg shadow 
                      border border-gray-300 dark:border-[#1A2347] 
                      overflow-x-auto transition-colors">

        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#111A3A] text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-[#1A2347]">
            <tr>
              <th className="px-4 py-3 text-left">Cover</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Artist</th>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {releases.map((r) => (
              <tr
                key={r._id}
                className="border-b border-gray-300 dark:border-[#1A2347] 
                           hover:bg-gray-50 dark:hover:bg-[#111A3A] transition-colors"
              >
                {/* COVER */}
                <td className="px-4 py-3">
                  <img
                    src={r.cover || "https://via.placeholder.com/60"}
                    className="w-12 h-12 object-cover rounded border border-gray-300 dark:border-[#1A2347]"
                  />
                </td>

                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.artist}</td>
                <td className="px-4 py-3">{r.label || "-"}</td>

                {/* USER */}
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{r.userId?.fullName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {r.userId?.email}
                    </p>
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        r.status === "Approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : r.status === "Rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : r.status === "Action Required"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          : r.status === "Inactive"
                          ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      }
                    `}
                  >
                    {r.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2 flex-wrap">

                    {/* Approve */}
                    <button
                      onClick={() => changeStatus(r._id, "Approved")}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 
                                 text-white rounded text-xs flex items-center gap-1"
                    >
                      <Check size={14} /> Approve
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => changeStatus(r._id, "Rejected")}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 
                                 text-white rounded text-xs flex items-center gap-1"
                    >
                      <X size={14} /> Reject
                    </button>

                    {/* Action Required */}
                    <button
                      onClick={() => changeStatus(r._id, "Action Required")}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 
                                 text-black rounded text-xs"
                    >
                      Action Req.
                    </button>

                    {/* Inactive */}
                    <button
                      onClick={() => changeStatus(r._id, "Inactive")}
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs"
                    >
                      Inactive
                    </button>

                  </div>
                </td>
              </tr>
            ))}

            {!loading && releases.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-600 dark:text-gray-400">
                  No releases found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center py-8 font-medium">Loading releases...</div>
      )}
    </div>
  );
};

export default AdminReleases;
