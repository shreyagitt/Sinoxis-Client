import React, { useEffect, useState } from "react";
import { Search, Trash2, RefreshCcw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";

type Song = {
  title: string;
  isrc: string;
};

type OACRequest = {
  _id: string;
  ytChannel: string;
  topicChannel?: string;
  artistName: string;
  songs: Song[];
  status: "Submitted" | "Approved" | "Rejected" | "Released";
  createdAt: string;
};

export default function AdminOACPage() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [requests, setRequests] = useState<OACRequest[]>([]);
  const [search, setSearch] = useState("");
  const [songModal, setSongModal] = useState<Song[] | null>(null);

  /* ===============================
      FETCH REQUESTS
  =============================== */
  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${baseUrl}/official-artist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setRequests(res.data.data);
    } catch {
      toast.error("Failed to load OAC requests");
    }
  };

  /* ===============================
      UPDATE STATUS
  =============================== */
  const updateStatus = async (item: OACRequest, newStatus: string) => {
    try {
      await axios.put(
        `${baseUrl}/official-artist/${item._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === item._id ? { ...r, status: newStatus as any } : r
        )
      );

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ===============================
      DELETE REQUEST
  =============================== */
  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this OAC request?")) return;

    try {
      await axios.delete(`${baseUrl}/official-artist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests((prev) => prev.filter((r) => r._id !== id));
      toast.success("Request deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ===============================
      SEARCH FILTER
  =============================== */
  const filtered = requests.filter((r) =>
    r.artistName.toLowerCase().includes(search.toLowerCase())
  );

  /* ===============================
      UI START
  =============================== */
  return (
    <div className="min-h-screen p-6 bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Official Artist Channel Requests</h1>
        </div>

        {/* CARD */}
        <div className="rounded-lg shadow p-6 bg-white dark:bg-[#0B1029] border border-gray-300 dark:border-[#1A2347] transition-colors">

          {/* SEARCH BAR */}
          <div className="flex items-center gap-2 mb-4 border border-gray-300 dark:border-[#1A2347] px-3 py-2 rounded-lg bg-white dark:bg-[#111A3A]">
            <Search size={16} className="text-gray-500 dark:text-gray-300" />
            <input
              placeholder="Search by artist name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm bg-transparent w-full outline-none text-[#020726] dark:text-white"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-[#020726] dark:text-white">
              <thead className="border-b border-gray-300 dark:border-[#1A2347] bg-gray-50 dark:bg-[#111A3A] text-gray-600 dark:text-gray-200">
                <tr>
                  <th className="py-4 px-3 text-left">YouTube Channel</th>
                  <th className="py-4 px-3 text-left">Topic Channel</th>
                  <th className="py-4 px-3 text-left">Artist</th>
                  <th className="py-4 px-3 text-left">Songs</th>
                  <th className="py-4 px-3 text-left">Requested At</th>
                  <th className="py-4 px-3 text-left">Status</th>
                  <th className="py-4 px-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((req) => (
                    <tr
                      key={req._id}
                      className="border-b border-gray-300 dark:border-[#1A2347] hover:bg-gray-50 dark:hover:bg-[#111A3A]"
                    >
                      <td className="py-4 px-3">{req.ytChannel}</td>
                      <td className="py-4 px-3">{req.topicChannel || "—"}</td>
                      <td className="py-4 px-3">{req.artistName}</td>

                      <td className="py-4 px-3">
                        <button
                          onClick={() => setSongModal(req.songs)}
                          className="text-blue-600 dark:text-blue-300 underline text-xs"
                        >
                          View Songs ({req.songs.length})
                        </button>
                      </td>

                      <td className="py-4 px-3">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            req.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : req.status === "Rejected"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : req.status === "Released"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">

                          {/* Approve */}
                          <button
                            onClick={() => updateStatus(req, "Approved")}
                            className="p-2 bg-green-50 dark:bg-green-900/30 rounded hover:bg-green-100 dark:hover:bg-green-800/40 text-xs text-green-700 dark:text-green-300"
                          >
                            Approve
                          </button>

                          {/* Release */}
                          <button
                            onClick={() => updateStatus(req, "Released")}
                            className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-800/40 text-xs text-blue-600 dark:text-blue-300"
                          >
                            Release
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => updateStatus(req, "Rejected")}
                            className="p-2 bg-orange-50 dark:bg-yellow-900/30 rounded hover:bg-orange-100 dark:hover:bg-yellow-800/40 text-xs text-orange-600 dark:text-yellow-300"
                          >
                            Reject
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteRequest(req._id)}
                            className="p-2 bg-red-50 dark:bg-red-900/30 rounded hover:bg-red-100 dark:hover:bg-red-800/40"
                          >
                            <Trash2 size={16} className="text-red-600 dark:text-red-300" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SONG MODAL */}
      {songModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#0B1029] p-6 rounded-lg shadow-xl w-full max-w-md 
                          border border-gray-300 dark:border-[#1A2347]">
            <h2 className="text-lg font-semibold mb-4">Songs</h2>

            {songModal.map((song, idx) => (
              <div
                key={idx}
                className="border-b border-gray-300 dark:border-[#1A2347] py-2"
              >
                <div className="font-medium text-[#020726] dark:text-white">{song.title}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  ISRC: {song.isrc}
                </div>
              </div>
            ))}

            <button
              onClick={() => setSongModal(null)}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-[#111A3A] 
                         rounded border border-gray-300 dark:border-[#1A2347]
                         hover:bg-gray-300 dark:hover:bg-[#0B1029]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
