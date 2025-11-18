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
   Types (match your schema)
------------------------- */
export interface YouTubeClaim {
  _id: string;
  artistName: string;
  trackTitle: string;
  youtubeLink: string;
  claimType: "copyright" | "content_id" | "manual" | "other";
  claimDetails?: string;
  screenshot?: string; // URL
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

  /* ================
     Fetch list
     ================ */
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
      toast.error("Failed to load claims (showing empty list)");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ================
     Helpers
     ================ */
  const statusBadge = (s: YouTubeClaim["status"]) => {
    switch (s) {
      case "Pending":
        return <span className="px-3 py-1 text-xs rounded-full bg-yellow-50 text-yellow-700">Pending</span>;
      case "Reviewed":
        return <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700">Reviewed</span>;
      case "Approved":
        return <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700">Approved</span>;
      case "Rejected":
        return <span className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-700">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs rounded-full bg-gray-50 text-gray-700">{s}</span>;
    }
  };

  /* ================
     Update status
     ================ */
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
      console.error("updateStatus:", err);
      toast.error("Failed to update status");
    }
  };

  /* ================
     Delete
     ================ */
  const deleteClaim = async (id: string) => {
    if (!confirm("Delete this claim?")) return;
    try {
      await axios.delete(`${baseUrl}/youtube-claim/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Claim deleted");
      setItems((prev) => prev.filter((p) => p._id !== id));
      if (active && active._id === id) setShowModal(false);
    } catch (err) {
      console.error("deleteClaim:", err);
      toast.error("Delete failed");
    }
  };

  /* ================
     Refresh (with indicator)
     ================ */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchClaims();
      toast.success("Refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  /* ================
     Filtered
     ================ */
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
          <h1 className="text-2xl font-semibold text-gray-800">YouTube Claim Releases</h1>
          <p className="text-sm text-gray-500 mt-1">Manage claim submissions from clients</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            disabled={refreshing}
          >
            <RotateCw size={16} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border bg-white rounded-md px-3 py-2 w-96">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search by artist, track or YouTube link..."
            className="ml-2 w-full text-sm outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  <div className="font-medium text-gray-800">{row.artistName}</div>
                  <div className="text-xs text-gray-500 mt-1">{row.trackTitle}</div>
                </td>

                <td className="p-4">
                  <a
                    href={row.youtubeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Open Video
                  </a>
                </td>

                <td className="p-4">{row.claimType}</td>

                <td className="p-4 text-center">{statusBadge(row.status)}</td>

                <td className="p-4 text-right text-xs text-gray-500">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
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
                <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                  {loading ? "Loading..." : "No claims found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Details & Status Update */}
      {showModal && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-auto">
            <div className="p-5 border-b flex justify-between items-start gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{active.artistName} — {active.trackTitle}</h3>
                <p className="text-xs text-gray-500 mt-1">Submitted: {active.createdAt ? new Date(active.createdAt).toLocaleString() : "-"}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Info */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">YouTube Link</h4>
                  <a href={active.youtubeLink} target="_blank" rel="noreferrer" className="text-red-600 underline text-sm">
                    Open Video
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Claim Type</h4>
                  <div className="text-sm text-gray-600">{active.claimType}</div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Claim Details</h4>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {active.claimDetails || <span className="text-gray-400 italic">No details provided</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Additional Info</h4>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {active.additionalInfo || <span className="text-gray-400 italic">No additional info</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Confirmed by User</h4>
                  <div className="text-sm">
                    {active.confirm ? (
                      <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">Yes</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs">No</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Screenshot & Status buttons */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Screenshot</h4>
                  {active.screenshot ? (
                    <a href={active.screenshot} target="_blank" rel="noreferrer" className="block">
                      <img src={active.screenshot} alt="screenshot" className="w-full h-48 object-contain rounded border" />
                    </a>
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center border rounded text-sm text-gray-400">
                      No screenshot uploaded
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Update Status</h4>
                  <div className="space-y-2">
                    {(["Pending", "Reviewed", "Approved", "Rejected"] as YouTubeClaim["status"][]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(active._id, s)}
                        className={`w-full text-left px-4 py-2 rounded-md border ${
                          active.status === s ? "bg-green-50 border-green-400" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {s === "Pending" && <Clock size={16} className="text-yellow-600" />}
                            {s === "Reviewed" && <RotateCw size={16} className="text-blue-600" />}
                            {s === "Approved" && <CheckCircle size={16} className="text-emerald-600" />}
                            {s === "Rejected" && <XCircle size={16} className="text-red-600" />}
                            <span className="ml-1">{s}</span>
                          </div>
                          <div className="text-xs text-gray-500">{active.status === s ? "Current" : "Set as " + s}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => deleteClaim(active._id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Delete Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminYouTubeClaims;
