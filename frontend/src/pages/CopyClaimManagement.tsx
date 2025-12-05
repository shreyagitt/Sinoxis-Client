// src/pages/CopyClaimManagement.tsx
import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAppSelector } from "../store/hook";

interface Claim {
  _id: string;
  platform: "YouTube" | "Facebook";
  videoLink: string;
  notes?: string;
  status: "Pending" | "Rejected" | "Released";
  createdAt: string;
  userId: string;
}

const CopyClaimManagement: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { token } = useAppSelector((state) => state.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // =======================================================
  // FETCH CLAIMS (ADMIN)
  // =======================================================
  useEffect(() => {
    if (!token) return;

    const fetchClaims = async () => {
      try {
        const res = await axios.get(`${baseUrl}/copyright-claim`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClaims(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err: any) {
        console.error(err.response?.data || err);
      }
    };

    fetchClaims();
  }, [token]);

  // =======================================================
  // SEARCH FILTER + PAGINATION
  // =======================================================
  const filtered = claims.filter(
    (c) =>
      c.platform.toLowerCase().includes(search.toLowerCase()) ||
      c.videoLink.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const visible = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // =======================================================
  // UPDATE STATUS
  // =======================================================
  const updateStatus = async (id: string, status: Claim["status"]) => {
    try {
      await axios.patch(
        `${baseUrl}/copyright-claim/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClaims((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );

      Swal.fire("Updated!", `Status changed to ${status}`, "success");
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // =======================================================
  // DELETE CLAIM
  // =======================================================
  const deleteClaim = (id: string) => {
    Swal.fire({
      title: "Delete claim?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        await axios.delete(`${baseUrl}/copyright-claim/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClaims((prev) => prev.filter((c) => c._id !== id));

        Swal.fire("Deleted!", "Claim removed successfully.", "success");
      } catch {
        Swal.fire("Error", "Failed to delete claim", "error");
      }
    });
  };

  // =======================================================
  // VIEW MODAL STATE
  // =======================================================
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Claim | null>(null);

  const viewClaim = (c: Claim) => {
    setViewData(c);
    setViewOpen(true);
  };

  // =======================================================
  // EDIT MODAL STATES
  // =======================================================
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);

  const [editData, setEditData] = useState({
    videoLink: "",
    notes: "",
    status: "Pending" as Claim["status"],
  });

  const editClaim = (claim: Claim) => {
    setEditingClaim(claim);
    setEditData({
      videoLink: claim.videoLink,
      notes: claim.notes || "",
      status: claim.status,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (updated: Partial<Claim>) => {
    if (!editingClaim) return;

    try {
      await axios.put(
        `${baseUrl}/copyright-claim/${editingClaim._id}`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClaims((prev) =>
        prev.map((c) =>
          c._id === editingClaim._id ? { ...c, ...updated } : c
        )
      );

      setEditModalOpen(false);
      Swal.fire("Updated!", "Claim updated successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to update claim", "error");
    }
  };

  // =======================================================
  // VIEW CLAIM MODAL
  // =======================================================
  const ViewClaimModal = () => {
    if (!viewOpen || !viewData) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Claim Details</h2>

          <div className="space-y-3 text-gray-700 text-sm">
            <p><b>Platform:</b> {viewData.platform}</p>
            <p>
              <b>Video:</b>{" "}
              <a
                href={viewData.videoLink}
                target="_blank"
                className="text-blue-600 underline"
              >
                Open Video
              </a>
            </p>
            <p><b>Notes:</b> {viewData.notes || "No notes"}</p>
            <p><b>Status:</b> {viewData.status}</p>
            <p><b>Date:</b> {new Date(viewData.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setViewOpen(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =======================================================
  // EDIT CLAIM MODAL
  // =======================================================
  const EditClaimModal = () => {
    if (!editModalOpen || !editingClaim) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Edit Claim</h2>

          <div className="space-y-4">

            <div>
              <label className="text-gray-600 text-sm">Platform</label>
              <input
                disabled
                value={editingClaim.platform}
                className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-lg"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Video Link</label>
              <input
                value={editData.videoLink}
                onChange={(e) =>
                  setEditData({ ...editData, videoLink: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Notes</label>
              <textarea
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg min-h-[90px]"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Status</label>
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    status: e.target.value as Claim["status"],
                  })
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="Pending">Pending</option>
                <option value="Released">Released</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={() => handleEditSubmit(editData)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =======================================================
  // MAIN UI
  // =======================================================
  return (
    <div className="min-h-screen p-10 bg-[#F5F7FB]">
      <h1 className="text-2xl font-semibold text-gray-900">Copyright Claims</h1>
      <p className="text-gray-500 mb-6">Manage client copyright claim requests</p>

      {/* Search */}
      <div className="relative w-80 mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-xl border bg-white shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-white shadow-md border p-0 overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">Platform</th>
              <th className="py-3 px-4 text-left">Video Link</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="py-3 px-4">{c.platform}</td>

                <td className="py-3 px-4">
                  <a
                    href={c.videoLink}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Visit
                  </a>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      c.status === "Released"
                        ? "bg-green-100 text-green-700"
                        : c.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  {new Date(c.createdAt).toLocaleString()}
                </td>

                <td className="py-3 px-4 flex justify-center gap-4">
                  <Eye
                    className="text-green-600 cursor-pointer"
                    onClick={() => viewClaim(c)}
                  />
                  <Edit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => editClaim(c)}
                  />
                  <CheckCircle
                    className="text-green-500 cursor-pointer"
                    onClick={() => updateStatus(c._id, "Released")}
                  />
                  <XCircle
                    className="text-yellow-600 cursor-pointer"
                    onClick={() => updateStatus(c._id, "Rejected")}
                  />
                  <Trash2
                    className="text-red-600 cursor-pointer"
                    onClick={() => deleteClaim(c._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6 text-gray-600">
        <p>
          Showing {(page - 1) * itemsPerPage + 1}–
          {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-1 rounded-lg border bg-white disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-1 rounded-lg border bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS */}
      {ViewClaimModal()}
      {EditClaimModal()}
    </div>
  );
};

export default CopyClaimManagement;
