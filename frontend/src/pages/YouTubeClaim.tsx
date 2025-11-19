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
   Types (match backend model)
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

  /* =============================
        Fetch Claims
  ============================= */
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/youtube-claim`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data || [];
      setItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("fetchClaims:", err);
      toast.error("Failed to load claims");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchClaims();
  }, [token]);

  /* =============================
        Status Badge
  ============================= */
  const statusBadge = (s: YouTubeClaim["status"]) => {
    switch (s) {
      case "Pending":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-yellow-50 text-yellow-700">
            Pending
          </span>
        );

      case "Reviewed":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
            Reviewed
          </span>
        );

      case "Approved":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700">
            Approved
          </span>
        );

      case "Rejected":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-700">
            Rejected
          </span>
        );

      default:
        return s;
    }
  };

  /* =============================
        Update Status
  ============================= */
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
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  /* =============================
        Delete
  ============================= */
  const deleteClaim = async (id: string) => {
    if (!confirm("Delete this claim?")) return;

    try {
      await axios.delete(`${baseUrl}/youtube-claim/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Claim deleted");
      setItems((prev) => prev.filter((p) => p._id !== id));

      if (active && active._id === id) setShowModal(false);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =============================
        Refresh
  ============================= */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClaims();
    setRefreshing(false);
    toast.success("Refreshed");
  };

  /* =============================
        Search Filter
  ============================= */
  const filtered = items.filter(
    (it) =>
      it.artistName.toLowerCase().includes(search.toLowerCase()) ||
      it.trackTitle.toLowerCase().includes(search.toLowerCase()) ||
      it.youtubeLink.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            YouTube Claim Releases
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage client YouTube claim submissions
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          <RotateCw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border bg-white rounded-md px-3 py-2 w-96">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search artist, track or link..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 w-full text-sm outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Artist / Track</th>
              <th className="p-4 text-left">YouTube Link</th>
              <th className="p-4 text-left">Claim Type</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Submitted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-800">
                    {row.artistName}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {row.trackTitle}
                  </div>
                </td>

                <td className="p-4">
                  <a
                    href={row.youtubeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open Video
                  </a>
                </td>

                <td className="p-4 capitalize">{row.claimType}</td>

                <td className="p-4 text-center">{statusBadge(row.status)}</td>

                <td className="p-4 text-right text-xs text-gray-500">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td className="p-4 text-center flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActive(row);
                      setShowModal(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                    title="View / Update"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => deleteClaim(row._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-500 italic"
                >
                  {loading ? "Loading..." : "No claims found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===========================
             MODAL (FULL DETAILS)
      =========================== */}
      {showModal && active && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full">

            {/* Header */}
            <div className="p-5 border-b flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {active.artistName} — {active.trackTitle}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Submitted:{" "}
                  {active.createdAt
                    ? new Date(active.createdAt).toLocaleString()
                    : "-"}
                </p>

                <p className="text-xs text-gray-500">
                  Updated:{" "}
                  {active.updatedAt
                    ? new Date(active.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* LEFT SIDE */}
              <div className="md:col-span-2 space-y-4">

                {/* YouTube Link */}
                <div>
                  <h4 className="font-semibold text-sm">YouTube Link</h4>
                  <a
                    href={active.youtubeLink}
                    target="_blank"
                    className="text-blue-600 underline text-sm"
                  >
                    Open Video
                  </a>
                </div>

                {/* Claim Type */}
                <div>
                  <h4 className="font-semibold text-sm">Claim Type</h4>
                  <p className="text-sm capitalize">{active.claimType}</p>
                </div>

                {/* Claim Details */}
                <div>
                  <h4 className="font-semibold text-sm">Claim Details</h4>
                  <p className="text-sm whitespace-pre-line">
                    {active.claimDetails || (
                      <span className="text-gray-400 italic">
                        No details provided
                      </span>
                    )}
                  </p>
                </div>

                {/* Additional Info */}
                <div>
                  <h4 className="font-semibold text-sm">Additional Info</h4>
                  <p className="text-sm whitespace-pre-line">
                    {active.additionalInfo || (
                      <span className="text-gray-400 italic">
                        No additional info
                      </span>
                    )}
                  </p>
                </div>

                {/* User Confirm */}
                <div>
                  <h4 className="font-semibold text-sm">User Confirmation</h4>
                  {active.confirm ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Yes — User Confirmed
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      No — Not Confirmed
                    </span>
                  )}
                </div>

                {/* Screenshot ID */}
                <div>
                  <h4 className="font-semibold text-sm">Screenshot ID</h4>
                  <p className="text-xs bg-gray-50 p-2 rounded border">
                    {active.screenshotId || "No screenshotId provided"}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-4">

                {/* Screenshot */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Screenshot</h4>
                  {active.screenshot ? (
                    <a href={active.screenshot} target="_blank">
                      <img
                        src={active.screenshot}
                        alt="Screenshot"
                        className="w-full h-48 object-contain border rounded"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center border rounded text-gray-400 text-sm">
                      No screenshot uploaded
                    </div>
                  )}
                </div>

                {/* Status Update Buttons */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Update Status</h4>

                  <div className="space-y-2">
                    {(["Pending", "Reviewed", "Approved", "Rejected"] as const).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(active._id, s)}
                          className={`w-full px-4 py-2 text-left border rounded-md ${
                            active.status === s
                              ? "bg-green-50 border-green-400"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span>{s}</span>
                            <span className="text-xs text-gray-500">
                              {active.status === s ? "Current" : "Set"}
                            </span>
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteClaim(active._id)}
                  className="w-full bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700"
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

