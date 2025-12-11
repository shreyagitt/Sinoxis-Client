// src/pages/AdminFacebookVideo.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  Trash2,
  RotateCw,
} from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* =============================
   Types (MATCHES your SCHEMA)
============================= */
interface FacebookVideo {
  _id: string;
  artistNameFb: string;
  labelNameFb?: string;
  facebookVideoUrl: string;
  isrcCodeFb: string;
  claimTypeFb: string;
  claimDetailsFb?: string;
  screenshotFb?: string;
  screenshotFbId?: string;
  confirmFb: boolean;
  status: "Pending" | "Reviewed" | "Resolved" | "Rejected";
  createdAt?: string;
}

/* =============================
        MAIN ADMIN PAGE
============================= */
const AdminFacebookVideo: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [items, setItems] = useState<FacebookVideo[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [active, setActive] = useState<FacebookVideo | null>(null);
  const [showModal, setShowModal] = useState(false);

  /* ------------------------
        FETCH DATA
  ------------------------ */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/facebook-video`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || [];
      setItems(Array.isArray(data) ? data : [data]);
    } catch {
      toast.error("Failed to load video claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  /* ------------------------
        REFRESH
  ------------------------ */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    toast.success("Refreshed");
    setRefreshing(false);
  };

  /* ------------------------
      UPDATE STATUS
  ------------------------ */
  const updateStatus = async (
    id: string,
    status: FacebookVideo["status"]
  ) => {
    try {
      await axios.patch(
        `${baseUrl}/facebook-video/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchItems();
      setShowModal(false);
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ------------------------
      DELETE REQUEST
  ------------------------ */
  const deleteItem = async (id: string) => {
    if (!confirm("Delete this Facebook video claim?")) return;

    try {
      await axios.delete(`${baseUrl}/facebook-video/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchItems();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ------------------------
        STATUS COLORS
  ------------------------ */
  const badge = (s: FacebookVideo["status"]) =>
    ({
      Pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      Reviewed: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      Resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      Rejected: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    }[s]);

  /* ------------------------
        SEARCH FILTER
  ------------------------ */
  const filtered = items.filter(
    (it) =>
      it.artistNameFb.toLowerCase().includes(search.toLowerCase()) ||
      it.isrcCodeFb.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Facebook Video Claims</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Review copyright/monetization claims
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 border border-gray-300 dark:border-[#1A2347] bg-white dark:bg-[#0B1029] rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#111A3A]"
        >
          <RotateCw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border border-gray-300 dark:border-[#1A2347] bg-white dark:bg-[#0B1029] rounded-lg px-3 py-2 w-80">
        <Search size={18} className="text-gray-500 dark:text-gray-300" />
        <input
          className="ml-2 text-sm w-full bg-transparent text-[#020726] dark:text-white outline-none"
          placeholder="Search by Artist or ISRC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#0B1029] border border-gray-300 dark:border-[#1A2347] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-[#020726] dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-[#111A3A] text-gray-600 dark:text-gray-200">
            <tr>
              <th className="p-4 text-left">Artist</th>
              <th className="p-4 text-left">Label</th>
              <th className="p-4 text-left">ISRC</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Submitted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-[#1A2347]">
            {filtered.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50 dark:hover:bg-[#111A3A]">

                <td className="p-4">{row.artistNameFb}</td>
                <td className="p-4">{row.labelNameFb || "-"}</td>
                <td className="p-4">{row.isrcCodeFb}</td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 text-xs rounded-full ${badge(row.status)}`}>
                    {row.status}
                  </span>
                </td>

                <td className="p-4 text-right text-xs text-gray-500 dark:text-gray-400">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>

                <td className="p-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActive(row);
                      setShowModal(true);
                    }}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => deleteItem(row._id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                  {loading ? "Loading..." : "No Facebook video claims found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && active && (
        <FacebookVideoModal
          item={active}
          onClose={() => setShowModal(false)}
          onStatus={updateStatus}
        />
      )}

    </div>
  );
};

export default AdminFacebookVideo;

/* ======================================
          MODAL COMPONENT (DARK MODE)
====================================== */
const FacebookVideoModal = ({
  item,
  onClose,
  onStatus,
}: {
  item: FacebookVideo;
  onClose: () => void;
  onStatus: (id: string, status: FacebookVideo["status"]) => void;
}) => (
  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-[#0B1029] text-[#020726] dark:text-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col border border-gray-300 dark:border-[#1A2347] max-h-[90vh]">

      {/* Header */}
      <div className="p-5 border-b border-gray-300 dark:border-[#1A2347] flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {item.artistNameFb} — ISRC: {item.isrcCodeFb}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1 border border-gray-300 dark:border-[#1A2347] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#111A3A]"
        >
          Close
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <Detail label="Artist" value={item.artistNameFb} />
        <Detail label="Label" value={item.labelNameFb || "-"} />
        <Detail label="Facebook Video URL" value={item.facebookVideoUrl} />
        <Detail label="ISRC Code" value={item.isrcCodeFb} />
        <Detail label="Claim Type" value={item.claimTypeFb} />
        <Detail label="Claim Details" value={item.claimDetailsFb || "-"} />

        {/* Screenshot */}
        {item.screenshotFb && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Screenshot</h4>
            <img
              src={item.screenshotFb}
              alt="Claim Screenshot"
              className="rounded-lg w-full md:w-64 border border-gray-300 dark:border-[#1A2347]"
            />
          </div>
        )}

        <Detail label="Confirm" value={item.confirmFb ? "Yes" : "No"} />
      </div>

      {/* Status Update Footer */}
      <div className="p-5 border-t border-gray-300 dark:border-[#1A2347] bg-white dark:bg-[#0B1029] space-y-2">
        {["Pending", "Reviewed", "Resolved", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => onStatus(item._id, s as FacebookVideo["status"])}
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#1A2347] rounded-md hover:bg-gray-50 dark:hover:bg-[#111A3A] text-left"
          >
            {s}
          </button>
        ))}
      </div>

    </div>
  </div>
);

/* ========================= */
const Detail = ({ label, value }) => (
  <div>
    <h4 className="font-semibold text-gray-700 dark:text-gray-300">{label}</h4>
    <p className="text-gray-600 dark:text-gray-400">{value}</p>
  </div>
);
