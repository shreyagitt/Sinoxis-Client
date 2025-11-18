// src/pages/AdminSocialISRC.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  Trash2,
  CheckCircle,
  RotateCw,
  XCircle,
  Clock,
} from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* ============================
   Types (match your schema)
   ============================ */
interface SocialISRC {
  _id: string;
  artistNameSocial: string;
  labelName?: string;
  facebookLink?: string;
  instagramLink?: string;
  spotifyLink?: string;
  appleMusicLink?: string;
  isrcCode: string;
  trackTitleSocial?: string;
  officialVideoUrlSocial?: string;
  confirmSocial: boolean;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
  createdAt?: string;
  updatedAt?: string;
}

/* ============================
   Admin Component
   ============================ */
const AdminSocialISRC: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [items, setItems] = useState<SocialISRC[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [active, setActive] = useState<SocialISRC | null>(null);
  const [showModal, setShowModal] = useState(false);

  /* ---------------------------
     Fetch items (GET /social)
  --------------------------- */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/social`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || [];
      setItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("fetchItems:", err);
      toast.error("Failed to fetch Social ISRC requests (showing empty list)");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ---------------------------
     Refresh helper
  --------------------------- */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchItems();
      toast.success("Refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  /* ---------------------------
     Update status (PATCH /social/:id/status)
  --------------------------- */
  const updateStatus = async (id: string, status: SocialISRC["status"]) => {
    try {
      await axios.patch(
        `${baseUrl}/social/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchItems();
      setShowModal(false);
    } catch (err) {
      console.error("updateStatus:", err);
      toast.error("Failed to update status");
    }
  };

  /* ---------------------------
     Delete (DELETE /social/:id)
  --------------------------- */
  const deleteItem = async (id: string) => {
    if (!confirm("Delete this Social ISRC request?")) return;
    try {
      await axios.delete(`${baseUrl}/social/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i._id !== id));
      if (active?._id === id) setShowModal(false);
    } catch (err) {
      console.error("deleteItem:", err);
      toast.error("Delete failed");
    }
  };

  /* ---------------------------
     Small UI helpers
  --------------------------- */
  const statusBadge = (s: SocialISRC["status"]) => {
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

  const filtered = items.filter(
    (it) =>
      it.artistNameSocial.toLowerCase().includes(search.toLowerCase()) ||
      it.trackTitleSocial?.toLowerCase().includes(search.toLowerCase()) ||
      it.isrcCode.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------------------
     Render
  --------------------------- */
  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Social ISRC Submissions (Admin)</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage social profile & ISRC submissions</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
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
            placeholder="Search by artist, track or ISRC..."
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
              <th className="p-4 text-left">ISRC</th>
              <th className="p-4 text-left">Social Links</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Submitted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-800">{row.artistNameSocial}</div>
                  <div className="text-xs text-gray-500 mt-1">{row.trackTitleSocial || "-"}</div>
                </td>

                <td className="p-4">{row.isrcCode}</td>

                <td className="p-4">
                  <div className="flex flex-col text-xs">
                    {row.facebookLink && <a href={row.facebookLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">Facebook</a>}
                    {row.instagramLink && <a href={row.instagramLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">Instagram</a>}
                    {row.spotifyLink && <a href={row.spotifyLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">Spotify</a>}
                    {row.appleMusicLink && <a href={row.appleMusicLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">Apple Music</a>}
                    {!row.facebookLink && !row.instagramLink && !row.spotifyLink && !row.appleMusicLink && <span className="text-gray-400 italic">No links</span>}
                  </div>
                </td>

                <td className="p-4 text-center">{statusBadge(row.status)}</td>

                <td className="p-4 text-right text-xs text-gray-500">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>

                <td className="p-4 text-center flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setActive(row); setShowModal(true); }}
                    className="text-green-600 hover:text-green-800"
                    title="View / Update"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => deleteItem(row._id)}
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
                  {loading ? "Loading..." : "No submissions found."}
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
                <h3 className="text-lg font-semibold text-gray-800">{active.artistNameSocial} — {active.trackTitleSocial || "—"}</h3>
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
                  <h4 className="text-sm font-semibold text-gray-700">ISRC Code</h4>
                  <div className="text-sm text-gray-600">{active.isrcCode}</div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Label</h4>
                  <div className="text-sm text-gray-600">{active.labelName || <span className="italic text-gray-400">No label</span>}</div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Social Links</h4>
                  <div className="text-sm space-y-1">
                    {active.facebookLink && <a href={active.facebookLink} className="text-red-600 underline" target="_blank" rel="noreferrer">Facebook</a>}
                    {active.instagramLink && <a href={active.instagramLink} className="text-red-600 underline" target="_blank" rel="noreferrer">Instagram</a>}
                    {active.spotifyLink && <a href={active.spotifyLink} className="text-red-600 underline" target="_blank" rel="noreferrer">Spotify</a>}
                    {active.appleMusicLink && <a href={active.appleMusicLink} className="text-red-600 underline" target="_blank" rel="noreferrer">Apple Music</a>}
                    {!active.facebookLink && !active.instagramLink && !active.spotifyLink && !active.appleMusicLink && <div className="text-gray-400 italic">No links provided</div>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Official Video</h4>
                  {active.officialVideoUrlSocial ? (
                    <a href={active.officialVideoUrlSocial} className="text-red-600 underline" target="_blank" rel="noreferrer">Open Video</a>
                  ) : (
                    <div className="text-gray-400 italic">No official video provided</div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Confirmed by User</h4>
                  <div className="text-sm">
                    {active.confirmSocial ? (
                      <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">Yes</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs">No</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Status</h4>

                  <div className="space-y-2">
                    {(["Pending", "Reviewed", "Approved", "Rejected"] as SocialISRC["status"][]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(active._id, s)}
                        className={`w-full text-left px-4 py-2 rounded-md border ${active.status === s ? "bg-green-50 border-green-400" : "hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {s === "Pending" && <Clock size={16} className="text-yellow-600" />}
                            {s === "Reviewed" && <RotateCw size={16} className="text-blue-600" />}
                            {s === "Approved" && <CheckCircle size={16} className="text-emerald-600" />}
                            {s === "Rejected" && <XCircle size={16} className="text-red-600" />}
                            <span className="ml-1">{s}</span>
                          </div>

                          <div className="text-xs text-gray-500">{active.status === s ? "Current" : `Set as ${s}`}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => deleteItem(active._id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Delete Submission
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

export default AdminSocialISRC;
