// src/pages/AdminYouTubeClaims.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  RotateCw,
} from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* -------------------------
   Types
------------------------- */
export interface YouTubeClaim {
  _id: string;
  artistName: string;
  trackTitle: string;
  youtubeLink: string;
  claimType: "copyright" | "content_id" | "manual" | "other";
  claimDetails?: string;
  screenshot?: string;
  screenshotId?: string;
  additionalInfo?: string;
  confirm: boolean;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------
   Component
------------------------- */
const AdminYouTubeClaims: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [items, setItems] = useState<YouTubeClaim[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<YouTubeClaim | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* Fetch claims */
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/youtube-claim`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || [];
      setItems(Array.isArray(data) ? data : [data]);
    } catch {
      toast.error("Failed to fetch YouTube claims");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchClaims();
  }, [token]);

  /* Status Badge */
  const statusBadge = (s: YouTubeClaim["status"]) => {
    const base =
      "px-3 py-1 text-xs rounded-full font-medium border border-gray-300 dark:border-[#1A2347]";

    switch (s) {
      case "Pending":
        return <span className={`${base} bg-yellow-50 text-yellow-700 dark:bg-[#111A3A]`}>Pending</span>;
      case "Reviewed":
        return <span className={`${base} bg-blue-50 text-blue-700 dark:bg-[#111A3A]`}>Reviewed</span>;
      case "Approved":
        return <span className={`${base} bg-emerald-50 text-emerald-700 dark:bg-[#111A3A]`}>Approved</span>;
      case "Rejected":
        return <span className={`${base} bg-red-50 text-red-700 dark:bg-[#111A3A]`}>Rejected</span>;
      default:
        return s;
    }
  };

  /* Update Status */
  const updateStatus = async (id: string, status: YouTubeClaim["status"]) => {
    try {
      await axios.patch(
        `${baseUrl}/youtube-claim/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchClaims();
      setShowModal(false);
    } catch {
      toast.error("Failed to update");
    }
  };

  /* Delete Claim */
  const deleteClaim = async (id: string) => {
    if (!confirm("Delete this claim?")) return;

    try {
      await axios.delete(`${baseUrl}/youtube-claim/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Claim deleted");
      setItems((prev) => prev.filter((p) => p._id !== id));
      if (active?._id === id) setShowModal(false);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* Refresh */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClaims();
    setRefreshing(false);
  };

  const filtered = items.filter(
    (it) =>
      it.artistName.toLowerCase().includes(search.toLowerCase()) ||
      it.trackTitle.toLowerCase().includes(search.toLowerCase()) ||
      it.youtubeLink.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="
      p-8 min-h-screen space-y-6 
      bg-white dark:bg-[#020726] 
      text-[#020726] dark:text-white
      transition-colors
    ">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">YouTube Claim Releases</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Manage client YouTube claim submissions
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm 
            bg-white dark:bg-[#0B1029] 
            border border-gray-300 dark:border-[#1A2347] 
            hover:bg-gray-100 dark:hover:bg-[#111A3A]
          "
        >
          <RotateCw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="
          flex items-center px-3 py-2 w-96 rounded-md 
          bg-white dark:bg-[#0B1029]
          border border-gray-300 dark:border-[#1A2347]
        ">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search artist, track or link..."
            className="ml-2 w-full text-sm outline-none bg-transparent 
            text-[#020726] dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="
        rounded-xl overflow-hidden shadow 
        bg-white dark:bg-[#0B1029]
        border border-gray-300 dark:border-[#1A2347]
      ">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#111A3A]">
            <tr className="text-gray-700 dark:text-gray-300">
              <th className="p-4 text-left">Artist / Track</th>
              <th className="p-4 text-left">YouTube Link</th>
              <th className="p-4 text-left">Claim Type</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Submitted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-[#1A2347]">
            {filtered.map((row) => (
              <tr
                key={row._id}
                className="hover:bg-gray-100 dark:hover:bg-[#111A3A] transition"
              >
                <td className="p-4">
                  <div className="font-medium">{row.artistName}</div>
                  <div className="text-xs opacity-70">{row.trackTitle}</div>
                </td>

                <td className="p-4">
                  <a
                    href={row.youtubeLink}
                    target="_blank"
                    className="text-[#0288D1] underline"
                  >
                    Open Video
                  </a>
                </td>

                <td className="p-4 capitalize">{row.claimType}</td>

                <td className="p-4 text-center">{statusBadge(row.status)}</td>

                <td className="p-4 text-right text-xs opacity-70">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>

                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    className="text-green-600 dark:text-green-400 hover:opacity-80"
                    onClick={() => {
                      setActive(row);
                      setShowModal(true);
                    }}
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="text-red-600 dark:text-red-400 hover:opacity-80"
                    onClick={() => deleteClaim(row._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center opacity-70">
                  {loading ? "Loading..." : "No claims found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===========================
             MODAL
      =========================== */}
      {showModal && active && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="
            max-w-4xl w-full rounded-xl shadow-2xl 
            bg-white dark:bg-[#0B1029]
            border border-gray-300 dark:border-[#1A2347]
          ">

            {/* Modal Header */}
            <div className="
              p-5 border-b 
              border-gray-300 dark:border-[#1A2347]
              flex justify-between items-start
            ">
              <div>
                <h3 className="text-lg font-semibold">
                  {active.artistName} — {active.trackTitle}
                </h3>
                <p className="text-xs opacity-70">
                  Submitted: {active.createdAt ? new Date(active.createdAt).toLocaleString() : "-"}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="
                  px-3 py-1 rounded-md 
                  border border-gray-300 dark:border-[#1A2347]
                  hover:bg-gray-100 dark:hover:bg-[#111A3A]
                "
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* LEFT */}
              <div className="md:col-span-2 space-y-4">

                <div>
                  <h4 className="text-sm font-semibold">YouTube Link</h4>
                  <a href={active.youtubeLink} className="text-[#0288D1] underline text-sm" target="_blank">
                    Open Video
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Claim Type</h4>
                  <p className="capitalize">{active.claimType}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Claim Details</h4>
                  <p className="opacity-80 whitespace-pre-line">
                    {active.claimDetails || "No details provided"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Additional Info</h4>
                  <p className="opacity-80 whitespace-pre-line">
                    {active.additionalInfo || "No additional info"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">User Confirmation</h4>
                  {active.confirm ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Yes — Confirmed
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      No — Not Confirmed
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Screenshot ID</h4>
                  <p className="text-xs p-2 rounded 
                    bg-gray-50 dark:bg-[#111A3A]
                    border border-gray-300 dark:border-[#1A2347]"
                  >
                    {active.screenshotId || "Not provided"}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">

                <div>
                  <h4 className="text-sm font-semibold mb-2">Screenshot</h4>
                  {active.screenshot ? (
                    <img
                      src={active.screenshot}
                      alt="Screenshot"
                      className="w-full h-48 object-contain rounded 
                        border border-gray-300 dark:border-[#1A2347]"
                    />
                  ) : (
                    <div className="
                      w-full h-48 flex items-center justify-center rounded
                      border border-gray-300 dark:border-[#1A2347]
                      opacity-60
                    ">
                      No screenshot uploaded
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Update Status</h4>

                  {(["Pending", "Reviewed", "Approved", "Rejected"] as const).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(active._id, s)}
                        className={`
                          w-full px-4 py-2 text-left rounded-md border
                          border-gray-300 dark:border-[#1A2347]
                          ${active.status === s
                            ? "bg-green-50 dark:bg-[#111A3A]"
                            : "hover:bg-gray-100 dark:hover:bg-[#111A3A]"
                          }
                        `}
                      >
                        <div className="flex justify-between">
                          <span>{s}</span>
                          <span className="text-xs opacity-70">
                            {active.status === s ? "Current" : "Set"}
                          </span>
                        </div>
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => deleteClaim(active._id)}
                  className="
                    w-full py-2 rounded-md flex items-center justify-center gap-2
                    bg-red-600 text-white hover:bg-red-700
                  "
                >
                  <Trash2 size={16} /> Delete Claim
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminYouTubeClaims;
