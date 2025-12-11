import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";
import { Search, Eye, Trash2 } from "lucide-react";

// TYPE (matches your backend schema)
export interface YouTubeOAC {
  _id: string;
  channelName: string;
  channelUrl: string;
  topicUrl?: string;
  officialVideoUrl: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  createdAt?: string;
}

const AdminYouTubeOACRequests: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [data, setData] = useState<YouTubeOAC[]>([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<YouTubeOAC | null>(null);
  const [showModal, setShowModal] = useState(false);

  /* ============================
       Fetch Requests
  ============================ */
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${baseUrl}/youTube-oac`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.data || []);
    } catch {
      toast.error("Failed to load OAC requests");
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  /* ============================
       Update Status
  ============================ */
  const updateStatus = async (id: string, status: YouTubeOAC["status"]) => {
    try {
      await axios.patch(
        `${baseUrl}/youTube-oac/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchRequests();
      setShowModal(false);
    } catch {
      toast.error("Failed to update");
    }
  };

  /* ============================
       Delete Request
  ============================ */
  const deleteReq = async (id: string) => {
    if (!confirm("Delete this request?")) return;

    try {
      await axios.delete(`${baseUrl}/youTube-oac/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      fetchRequests();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ============================
       Status Badge (Dark Mode Ready)
  ============================ */
  const badge = (status: YouTubeOAC["status"]) => {
    const base =
      "px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-[#1A2347]";

    switch (status) {
      case "Pending":
        return (
          <span className={`${base} bg-yellow-50 text-yellow-700 dark:bg-[#111A3A]`}>
            Pending
          </span>
        );
      case "Under Review":
        return (
          <span className={`${base} bg-blue-50 text-blue-700 dark:bg-[#111A3A]`}>
            Under Review
          </span>
        );
      case "Approved":
        return (
          <span className={`${base} bg-green-50 text-green-700 dark:bg-[#111A3A]`}>
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className={`${base} bg-red-50 text-red-700 dark:bg-[#111A3A]`}>
            Rejected
          </span>
        );
    }
  };

  const filtered = data.filter((req) =>
    req.channelName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="
      p-8 min-h-screen
      bg-white dark:bg-[#020726] 
      text-[#020726] dark:text-white
      transition-colors"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">YouTube OAC Requests</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Manage artist channel approval requests
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center mb-5">
        <div className="
          flex items-center px-3 py-2 w-80 rounded-md
          bg-white dark:bg-[#0B1029]
          border border-gray-300 dark:border-[#1A2347]
        ">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search channels..."
            className="
              ml-2 w-full text-sm outline-none bg-transparent 
              text-[#020726] dark:text-white
            "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="
        rounded-xl shadow overflow-hidden
        bg-white dark:bg-[#0B1029]
        border border-gray-300 dark:border-[#1A2347]
      ">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#111A3A] text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-4 text-left">Channel</th>
              <th className="p-4 text-left">Channel URL</th>
              <th className="p-4 text-left">Topic URL</th>
              <th className="p-4 text-left">Official Video</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-[#1A2347]">
            {filtered.map((req) => (
              <tr
                key={req._id}
                className="
                  hover:bg-gray-100 dark:hover:bg-[#111A3A]
                  transition-colors
                "
              >
                <td className="p-4">{req.channelName}</td>

                <td className="p-4 text-[#0288D1] underline">
                  <a href={req.channelUrl} target="_blank">
                    Visit
                  </a>
                </td>

                <td className="p-4 text-[#0288D1] underline">
                  {req.topicUrl ? (
                    <a href={req.topicUrl} target="_blank">Visit</a>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-4 text-red-500 underline">
                  <a href={req.officialVideoUrl} target="_blank">Video Link</a>
                </td>

                <td className="p-4 text-center">{badge(req.status)}</td>

                <td className="p-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setActive(req);
                      setShowModal(true);
                    }}
                    className="text-green-600 dark:text-green-400 hover:opacity-80"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => deleteReq(req._id)}
                    className="text-red-600 dark:text-red-400 hover:opacity-80"
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
                  className="py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============================
            MODAL
      ============================ */}
      {showModal && active && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="
              w-full max-w-md rounded-xl shadow-2xl p-6
              bg-white dark:bg-[#0B1029]
              border border-gray-300 dark:border-[#1A2347]
            "
          >
            <h2 className="text-lg font-semibold mb-4">
              Update Status – {active.channelName}
            </h2>

            <div className="space-y-3">
              {["Pending", "Under Review", "Approved", "Rejected"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(active._id, s as any)}
                    className={`
                      w-full text-left px-4 py-2 rounded-md border
                      border-gray-300 dark:border-[#1A2347]
                      ${
                        active.status === s
                          ? "bg-green-100 dark:bg-[#111A3A]"
                          : "hover:bg-gray-100 dark:hover:bg-[#111A3A]"
                      }
                    `}
                  >
                    {s}
                  </button>
                )
              )}
            </div>

            <button
              className="
                mt-5 w-full py-2 rounded-md
                bg-gray-800 text-white dark:bg-[#111A3A]
                hover:bg-gray-900 dark:hover:bg-[#1A2347]
              "
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminYouTubeOACRequests;
