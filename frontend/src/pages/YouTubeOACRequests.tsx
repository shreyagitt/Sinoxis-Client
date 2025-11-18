import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";
import { Search, Eye, Trash2, CheckCircle, Clock, AlertTriangle } from "lucide-react";

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
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch requests");
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
      toast.error("Update failed");
    }
  };

  /* ============================
       Delete Request
  ============================ */
  const deleteReq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

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
       Status Badge
  ============================ */
  const badge = (s: string) => {
    switch (s) {
      case "Pending":
        return <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      case "Under Review":
        return <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Under Review</span>;
      case "Approved":
        return <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">Approved</span>;
      case "Rejected":
        return <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">Rejected</span>;
    }
  };

  /* ============================
       Filtered Data
  ============================ */
  const filtered = data.filter((req) =>
    req.channelName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">YouTube OAC Requests</h1>
          <p className="text-gray-500 text-sm">Manage artist channel approval requests</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center mb-5">
        <div className="flex items-center border bg-white rounded-md px-3 py-2 w-80">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search channels..."
            className="ml-2 w-full text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-md border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Channel</th>
              <th className="p-4 text-left">Channel URL</th>
              <th className="p-4 text-left">Official Video</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="p-4">{req.channelName}</td>
                <td className="p-4 text-blue-600 underline">
                  <a href={req.channelUrl} target="_blank">Visit</a>
                </td>
                <td className="p-4 text-red-600 underline">
                  <a href={req.officialVideoUrl} target="_blank">Video Link</a>
                </td>

                <td className="p-4 text-center">{badge(req.status)}</td>

                <td className="p-4 flex justify-center gap-3">
                  {/* View / Change Status */}
                  <button
                    onClick={() => {
                      setActive(req);
                      setShowModal(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteReq(req._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (STATUS UPDATE) */}
      {showModal && active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border">

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Update Status – {active.channelName}
            </h2>

            <div className="space-y-3">
              {["Pending", "Under Review", "Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(active._id, s as any)}
                  className={`w-full text-left px-4 py-2 rounded-md border hover:bg-gray-50 ${
                    active.status === s ? "bg-green-100 border-green-400" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              className="mt-5 w-full bg-gray-800 text-white py-2 rounded-md"
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
