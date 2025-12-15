// src/pages/AdminMetadata.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, Trash2, RotateCw } from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* ========================
      TYPES
======================== */
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
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
  createdAt?: string;
  artwork?: string;
}

/* ========================
      MAIN PAGE
======================== */
const AdminMetadata: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [items, setItems] = useState<Metadata[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState<Metadata | null>(null);
  const [showModal, setShowModal] = useState(false);

  /* FETCH DATA */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/metadata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.data || []);
    } catch {
      toast.error("Failed to load metadata requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  /* REFRESH */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
    toast.success("Refreshed");
  };

  /* UPDATE STATUS */
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

  /* DELETE */
  const deleteItem = async (id: string) => {
    if (!confirm("Delete this metadata request?")) return;

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

  /* STATUS COLORS */
  const badge = (s: Metadata["status"]) =>
    ({
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
      Reviewed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      Approved:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      Rejected:
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    }[s]);

  /* SEARCH FILTER */
  const filtered = items.filter(
    (it) =>
      it.artistName.toLowerCase().includes(search.toLowerCase()) ||
      it.trackTitle.toLowerCase().includes(search.toLowerCase()) ||
      it.isrc.toLowerCase().includes(search.toLowerCase())
  );

  /* ========================
        UI RENDER
  ======================== */
  return (
    <div className="p-8 min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Metadata Update Requests</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Review & approve metadata updates
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 border border-gray-300 dark:border-[#1A2347] 
                     bg-white dark:bg-[#0B1029] rounded-lg text-sm flex items-center gap-2 
                     hover:bg-gray-100 dark:hover:bg-[#111A3A]"
        >
          <RotateCw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center border border-gray-300 dark:border-[#1A2347]
                      bg-white dark:bg-[#0B1029] rounded-lg px-3 py-2 w-80">
        <Search size={18} className="text-gray-500 dark:text-gray-300" />
        <input
          className="ml-2 text-sm w-full outline-none bg-transparent"
          placeholder="Search by Artist, Track or ISRC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="border border-gray-300 dark:border-[#1A2347] rounded-xl 
                      bg-white dark:bg-[#0B1029] shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#111A3A] text-gray-700 dark:text-white">
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

          <tbody>
            {filtered.map((row) => (
              <tr
                key={row._id}
                className="border-b border-gray-300 dark:border-[#1A2347] 
                           hover:bg-gray-100 dark:hover:bg-[#111A3A]"
              >
                <td className="p-4">{row.artistName}</td>
                <td className="p-4">{row.trackTitle}</td>
                <td className="p-4">{row.isrc}</td>

                <td className="p-4 text-center">
                  {row.explicit ? (
                    <span className="text-red-600 dark:text-red-400 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-300">No</span>
                  )}
                </td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${badge(row.status)}`}>
                    {row.status}
                  </span>
                </td>

                <td className="p-4 text-right text-xs text-gray-600 dark:text-gray-400">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>

                <td className="p-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActive(row);
                      setShowModal(true);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-600 dark:text-gray-400 italic"
                >
                  {loading ? "Loading..." : "No metadata requests found"}
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

/* ========================
      MODAL COMPONENT
======================== */
const MetadataModal = ({
  item,
  onClose,
  onStatus,
}: {
  item: Metadata;
  onClose: () => void;
  onStatus: (id: string, status: Metadata["status"]) => void;
}) => (
  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">

    <div className="max-w-3xl w-full rounded-xl shadow-2xl 
                    border border-gray-300 dark:border-[#1A2347]
                    bg-white dark:bg-[#0B1029] 
                    text-[#020726] dark:text-white
                    flex flex-col max-h-[90vh] overflow-hidden">

      {/* HEADER */}
      <div className="p-5 border-b border-gray-300 dark:border-[#1A2347] 
                      bg-white dark:bg-[#0B1029] flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {item.artistName} — {item.trackTitle}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1 border border-gray-300 dark:border-[#1A2347] 
                     rounded-md bg-white dark:bg-[#111A3A]
                     hover:bg-gray-100 dark:hover:bg-[#0B1029]"
        >
          Close
        </button>
      </div>

      {/* BODY */}
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

        {/* LYRICS */}
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-300">Lyrics</h4>
          <p className="text-gray-700 dark:text-gray-400 mt-1 whitespace-pre-line">
            {item.lyrics || "No lyrics provided"}
          </p>
        </div>

        {/* ARTWORK */}
        {item.artwork && (
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">Artwork</h4>
            <img
              src={item.artwork}
              className="w-48 rounded-lg border border-gray-300 dark:border-[#1A2347]"
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-5 border-t border-gray-300 dark:border-[#1A2347] 
                      bg-white dark:bg-[#0B1029] space-y-2">
        {["Pending", "Reviewed", "Approved", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => onStatus(item._id, s as Metadata["status"])}
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#1A2347] 
                       rounded-md bg-white dark:bg-[#111A3A] 
                       hover:bg-gray-100 dark:hover:bg-[#0B1029] text-left"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* DETAIL COMPONENT */
const Detail = ({ label, value }) => (
  <div>
    <h4 className="font-semibold text-gray-800 dark:text-gray-300">{label}</h4>
    <p className="text-gray-700 dark:text-gray-400">{value}</p>
  </div>
);
