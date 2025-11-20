// src/pages/AdminMetadata.tsx
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
   Types (Match your Schema)
============================ */
interface Metadata {
  _id: string;
  artistName: string;
  trackTitle: string;
  album?: string;
  label: string;
  isrc: string;
  upc?: string;
  releaseDate?: string;
  genre?: string;
  composer?: string;
  publisher?: string;
  language?: string;
  lyrics?: string;
  contact?: string;
  explicit: boolean;
  confirm: boolean;
  artwork?: string;
  artworkId?: string;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
  createdAt?: string;
}

/* ============================
      MAIN ADMIN UI
============================ */
const AdminMetadata: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [items, setItems] = useState<Metadata[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [active, setActive] = useState<Metadata | null>(null);
  const [showModal, setShowModal] = useState(false);

  /* ---------------------------
     Fetch Metadata Requests
  --------------------------- */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/metadata`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data || [];
      setItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      toast.error("Failed to load metadata requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  /* ---------------------------
         Refresh Button
  --------------------------- */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    toast.success("Refreshed");
    setRefreshing(false);
  };

  /* ---------------------------
     Update Status (PATCH)
  --------------------------- */
  const updateStatus = async (id: string, status: Metadata["status"]) => {
    try {
      await axios.patch(
        `${baseUrl}/metadata/${id}/status`,
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

  /* ---------------------------
            Delete
  --------------------------- */
  const deleteItem = async (id: string) => {
    if (!confirm("Delete this Metadata request?")) return;

    try {
      await axios.delete(`${baseUrl}/metadata/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchItems();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------------------
       Status Badge UI
  --------------------------- */
  const badge = (s: Metadata["status"]) => ({
    Pending: "bg-yellow-50 text-yellow-700",
    Reviewed: "bg-blue-50 text-blue-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
  }[s]);

  /* ---------------------------
            Search
  --------------------------- */
  const filtered = items.filter(
    (it) =>
      it.artistName.toLowerCase().includes(search.toLowerCase()) ||
      it.trackTitle.toLowerCase().includes(search.toLowerCase()) ||
      it.isrc.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------------------
           Render UI
  --------------------------- */
  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Metadata Update Requests</h1>
          <p className="text-sm text-gray-500">Admin Panel · Review & Approve Metadata Updates</p>
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
          placeholder="Search by Artist, Track or ISRC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Artist</th>
              <th className="p-4 text-left">Track</th>
              <th className="p-4 text-left">ISRC</th>
              <th className="p-4 text-center">Explicit</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Submitted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                
                <td className="p-4">{row.artistName}</td>
                <td className="p-4">{row.trackTitle}</td>
                <td className="p-4">{row.isrc}</td>

                <td className="p-4 text-center">
                  {row.explicit ? (
                    <span className="text-red-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>

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
                    className="text-green-600 hover:text-green-800"
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
                <td colSpan={7} className="text-center py-8 text-gray-500 italic">
                  {loading ? "Loading..." : "No metadata requests found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && active && (
        <MetadataModal
          item={active}
          onClose={() => setShowModal(false)}
          onStatus={updateStatus}
        />
      )}

    </div>
  );
};

export default AdminMetadata;


/* ============================
   MODAL COMPONENT
============================ */
/* ============================
   MODAL COMPONENT (SCROLLABLE)
============================ */
const MetadataModal = ({
  item,
  onClose,
  onStatus,
}: {
  item: Metadata;
  onClose: () => void;
  onStatus: (id: string, status: Metadata["status"]) => void;
}) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

    {/* Modal Box */}
    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full 
                    max-h-[85vh] flex flex-col overflow-hidden">

      {/* Header (Fixed) */}
      <div className="p-5 border-b flex justify-between items-center bg-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item.artistName} — {item.trackTitle}
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

      {/* Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        <Detail label="Album" value={item.album || "-"} />
        <Detail label="Label" value={item.label} />
        <Detail label="ISRC" value={item.isrc} />
        <Detail label="UPC" value={item.upc || "-"} />
        <Detail label="Release Date" value={item.releaseDate || "-"} />
        <Detail label="Genre" value={item.genre || "-"} />
        <Detail label="Composer" value={item.composer || "-"} />
        <Detail label="Publisher" value={item.publisher || "-"} />
        <Detail label="Language" value={item.language || "-"} />
        <Detail label="Contact" value={item.contact || "-"} />
        <Detail label="Explicit" value={item.explicit ? "Yes" : "No"} />

        <div>
          <h4 className="font-semibold text-gray-700">Lyrics</h4>
          <p className="text-gray-600 mt-1 whitespace-pre-line">
            {item.lyrics || "No lyrics provided"}
          </p>
        </div>

        {/* Artwork */}
        {item.artwork && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Artwork</h4>
            <img
              src={item.artwork}
              alt="Artwork"
              className="rounded-lg w-48 border"
            />
          </div>
        )}

      </div>

      {/* Footer (Fixed) */}
      <div className="p-5 border-t bg-white space-y-2">
        {["Pending", "Reviewed", "Approved", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => onStatus(item._id, s as Metadata["status"])}
            className="w-full px-4 py-2 border rounded-md hover:bg-gray-50 text-left"
          >
            {s}
          </button>
        ))}
      </div>

    </div>
  </div>
);


const Detail = ({ label, value }) => (
  <div>
    <h4 className="font-semibold text-gray-700">{label}</h4>
    <p className="text-gray-600">{value}</p>
  </div>
);
