// src/pages/AdminFacebookVideo.tsx
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
      Pending: "bg-yellow-50 text-yellow-700",
      Reviewed: "bg-blue-50 text-blue-700",
      Resolved: "bg-emerald-50 text-emerald-700",
      Rejected: "bg-red-50 text-red-700",
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
    <div className="p-8 bg-[#f7f9fc] min-h-screen space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Facebook Video Claims
          </h1>
          <p className="text-sm text-gray-500">
            Review copyright/monetization claims
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
        >
          <RotateCw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border bg-white rounded-lg px-3 py-2 w-80">
        <Search size={18} className="text-gray-500" />
        <input
          className="ml-2 text-sm w-full outline-none"
          placeholder="Search by Artist or ISRC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Artist</th>
              <th className="p-4 text-left">Label</th>
              <th className="p-4 text-left">ISRC</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Submitted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">

                <td className="p-4">{row.artistNameFb}</td>
                <td className="p-4">{row.labelNameFb || "-"}</td>
                <td className="p-4">{row.isrcCodeFb}</td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 text-xs rounded-full ${badge(row.status)}`}>
                    {row.status}
                  </span>
                </td>

                <td className="p-4 text-right text-xs text-gray-500">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>

                <td className="p-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActive(row);
                      setShowModal(true);
                    }}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => deleteItem(row._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 italic">
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
          MODAL COMPONENT (UPDATED)
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
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]">

      {/* Header */}
      <div className="p-5 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item.artistNameFb} — ISRC: {item.isrcCodeFb}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
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
            <h4 className="font-semibold text-gray-700">Screenshot</h4>
            <img
              src={item.screenshotFb}
              alt="Claim Screenshot"
              className="rounded-lg w-full md:w-64 border"
            />
          </div>
        )}

        <Detail label="Confirm" value={item.confirmFb ? "Yes" : "No"} />
      </div>

      {/* Status Update Footer (Fixed) */}
      <div className="p-5 border-t space-y-2 bg-white">
        {["Pending", "Reviewed", "Resolved", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => onStatus(item._id, s as FacebookVideo["status"])}
            className="w-full px-4 py-2 border rounded-md hover:bg-gray-50 text-left"
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
    <h4 className="font-semibold text-gray-700">{label}</h4>
    <p className="text-gray-600">{value}</p>
  </div>
);
