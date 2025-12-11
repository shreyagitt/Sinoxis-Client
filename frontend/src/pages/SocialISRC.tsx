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
   Types
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

const AdminSocialISRC: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [items, setItems] = useState<SocialISRC[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [active, setActive] = useState<SocialISRC | null>(null);
  const [showModal, setShowModal] = useState(false);

  /* ============================
     Fetch Items
  ============================ */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/social`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data || [];
      setItems(Array.isArray(data) ? data : [data]);
    } catch {
      toast.error("Failed to load Social ISRC requests");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  /* ============================
     Refresh
  ============================ */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    toast.success("Refreshed");
    setRefreshing(false);
  };

  /* ============================
     Update Status
  ============================ */
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
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ============================
     Delete Item
  ============================ */
  const deleteItem = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    try {
      await axios.delete(`${baseUrl}/social/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i._id !== id));
      if (active?._id === id) setShowModal(false);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ============================
     Badge Styles (Dark + Light)
  ============================ */
  const statusBadge = (s: SocialISRC["status"]) => {
    const base = "px-3 py-1 text-xs rounded-full font-medium";
    const styles = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
      Reviewed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      Approved:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      Rejected:
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    };
    return <span className={`${base} ${styles[s]}`}>{s}</span>;
  };

  const filtered = items.filter(
    (it) =>
      it.artistNameSocial.toLowerCase().includes(search.toLowerCase()) ||
      it.trackTitleSocial?.toLowerCase().includes(search.toLowerCase()) ||
      it.isrcCode.toLowerCase().includes(search.toLowerCase())
  );

  /* ============================
     UI
  ============================ */
  return (
    <div className="p-8 min-h-screen space-y-6 
      bg-white dark:bg-[#020726] 
      text-[#020726] dark:text-white transition-colors"
    >

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Social ISRC Submissions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Review & manage artist social profiles + ISRC requests
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
            bg-white dark:bg-[#0B1029]
            border border-gray-300 dark:border-[#1A2347]
            hover:bg-gray-100 dark:hover:bg-[#111A3A] transition"
        >
          <RotateCw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center border rounded-lg px-3 py-2 w-96
        bg-white dark:bg-[#0B1029]
        border-gray-300 dark:border-[#1A2347]"
      >
        <Search size={18} className="text-gray-500 dark:text-gray-300" />
        <input
          placeholder="Search by artist, track, or ISRC..."
          className="ml-2 w-full text-sm outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl overflow-hidden shadow 
        bg-white dark:bg-[#0B1029]
        border border-gray-300 dark:border-[#1A2347]"
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#111A3A]">
            <tr className="text-gray-700 dark:text-white">
              <th className="p-4 text-left">Artist / Track</th>
              <th className="p-4 text-left">ISRC</th>
              <th className="p-4 text-left">Social Links</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Submitted</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300 dark:divide-[#1A2347]">
            {filtered.map((row) => (
              <tr
                key={row._id}
                className="hover:bg-gray-100 dark:hover:bg-[#111A3A] transition"
              >
                <td className="p-4">
                  <div className="font-medium">{row.artistNameSocial}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {row.trackTitleSocial || "-"}
                  </div>
                </td>

                <td className="p-4">{row.isrcCode}</td>

                <td className="p-4 text-xs">
                  <div className="flex flex-col gap-1">
                    {row.facebookLink && (
                      <a className="text-blue-600 underline" href={row.facebookLink} target="_blank">
                        Facebook
                      </a>
                    )}
                    {row.instagramLink && (
                      <a className="text-blue-600 underline" href={row.instagramLink} target="_blank">
                        Instagram
                      </a>
                    )}
                    {row.spotifyLink && (
                      <a className="text-blue-600 underline" href={row.spotifyLink} target="_blank">
                        Spotify
                      </a>
                    )}
                    {row.appleMusicLink && (
                      <a className="text-blue-600 underline" href={row.appleMusicLink} target="_blank">
                        Apple Music
                      </a>
                    )}

                    {!row.facebookLink &&
                      !row.instagramLink &&
                      !row.spotifyLink &&
                      !row.appleMusicLink && (
                        <span className="text-gray-400 italic">No links</span>
                      )}
                  </div>
                </td>

                <td className="p-4 text-center">{statusBadge(row.status)}</td>

                <td className="p-4 text-right text-xs text-gray-600 dark:text-gray-400">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setActive(row);
                        setShowModal(true);
                      }}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => deleteItem(row._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 italic text-gray-600 dark:text-gray-400"
                >
                  No submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && active && (
        <Modal
          item={active}
          onClose={() => setShowModal(false)}
          onStatus={updateStatus}
          onDelete={deleteItem}
        />
      )}
    </div>
  );
};

export default AdminSocialISRC;

/* ============================
   MODAL COMPONENT
============================ */
const Modal = ({
  item,
  onClose,
  onStatus,
  onDelete,
}: {
  item: SocialISRC;
  onClose: () => void;
  onStatus: (id: string, status: SocialISRC["status"]) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full rounded-xl shadow-2xl overflow-hidden
        bg-white dark:bg-[#0B1029] 
        text-[#020726] dark:text-white
        border border-gray-300 dark:border-[#1A2347]"
      >
        {/* HEADER */}
        <div className="p-5 border-b border-gray-300 dark:border-[#1A2347] 
          bg-white dark:bg-[#111A3A] flex justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold">
              {item.artistNameSocial} — {item.trackTitleSocial || "—"}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded-md
              bg-white dark:bg-[#0B1029]
              border border-gray-300 dark:border-[#1A2347]
              hover:bg-gray-100 dark:hover:bg-[#111A3A]"
          >
            Close
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">

          <Detail label="ISRC Code" value={item.isrcCode} />
          <Detail label="Label" value={item.labelName || "-"} />
          <Detail label="Confirmed" value={item.confirmSocial ? "Yes" : "No"} />

          {/* SOCIAL LINKS */}
          <div>
            <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">Social Links</h4>
            <div className="text-sm space-y-1">
              {item.facebookLink && (
                <a href={item.facebookLink} className="text-blue-400 underline" target="_blank">
                  Facebook
                </a>
              )}
              {item.instagramLink && (
                <a href={item.instagramLink} className="text-blue-400 underline" target="_blank">
                  Instagram
                </a>
              )}
              {item.spotifyLink && (
                <a href={item.spotifyLink} className="text-blue-400 underline" target="_blank">
                  Spotify
                </a>
              )}
              {item.appleMusicLink && (
                <a href={item.appleMusicLink} className="text-blue-400 underline" target="_blank">
                  Apple Music
                </a>
              )}
              {!item.facebookLink &&
                !item.instagramLink &&
                !item.spotifyLink &&
                !item.appleMusicLink && (
                  <p className="italic text-gray-500 dark:text-gray-400">No links provided</p>
                )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="p-5 space-y-2 border-t 
          border-gray-300 dark:border-[#1A2347]
          bg-white dark:bg-[#111A3A]"
        >
          {(["Pending", "Reviewed", "Approved", "Rejected"] as SocialISRC["status"][]).map((s) => (
            <button
              key={s}
              onClick={() => onStatus(item._id, s)}
              className="w-full text-left px-4 py-2 rounded-md
                bg-white dark:bg-[#0B1029]
                border border-gray-300 dark:border-[#1A2347]
                hover:bg-gray-100 dark:hover:bg-[#111A3A] transition"
            >
              {s}
            </button>
          ))}

          <button
            onClick={() => onDelete(item._id)}
            className="w-full mt-2 px-4 py-2 rounded-md
              bg-red-600 text-white hover:bg-red-700"
          >
            Delete Submission
          </button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: any }) => (
  <div>
    <h4 className="font-semibold text-gray-700 dark:text-gray-300">{label}</h4>
    <p className="text-gray-600 dark:text-gray-400">{value}</p>
  </div>
);
