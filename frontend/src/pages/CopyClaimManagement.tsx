import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Search,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
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
  // FETCH CLAIMS (Admin)
  // =======================================================
  useEffect(() => {
    if (!token) return;

    const fetchClaims = async () => {
      try {
        const res = await axios.get(`${baseUrl}/copyright-claim`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data.data)) setClaims(res.data.data);
      } catch (err: any) {
        console.error(err.response?.data || err);
      }
    };

    fetchClaims();
  }, [token]);

  // SEARCH FILTER
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
    } catch (error) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // =======================================================
  // DELETE CLAIM
  // =======================================================
  const deleteClaim = async (id: string) => {
    Swal.fire({
      title: "Delete claim?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/copyright-claim/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setClaims((prev) => prev.filter((c) => c._id !== id));
          Swal.fire("Deleted!", "Claim removed successfully.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete claim", "error");
        }
      }
    });
  };

  // =======================================================
  // VIEW CLAIM DETAILS
  // =======================================================
  // =======================================================
// VIEW CLAIM — BEAUTIFUL MODAL UI (LIKE YOUR DESIGN)
// =======================================================
const viewClaim = (c: Claim) => {
  Swal.fire({
    title: `
      <div style="text-align:left; font-size:20px; font-weight:600; color:#1F2937;">
        View Claim Details
      </div>
    `,
    html: `
      <div style="display:flex; flex-direction:column; gap:14px; padding:5px; text-align:left;">

        <!-- Platform -->
        <div>
          <label style="font-size:14px; color:#6B7280;">Platform</label>
          <input 
            class="swal2-input"
            value="${c.platform}"
            disabled
            style="width:100%; background:#F3F4F6; color:#6B7280; border-radius:10px;"
          />
        </div>

        <!-- Video Link -->
        <div>
          <label style="font-size:14px; color:#6B7280;">Video Link</label>
          <input 
            class="swal2-input"
            value="${c.videoLink}"
            disabled
            style="width:100%; background:#F3F4F6; color:#2563EB; border-radius:10px; cursor:pointer;"
            onclick="window.open('${c.videoLink}', '_blank')"
          />
        </div>

        <!-- Notes -->
        <div>
          <label style="font-size:14px; color:#6B7280;">Notes</label>
          <textarea 
            class="swal2-textarea"
            disabled
            style="width:100%; height:90px; background:#F3F4F6; color:#6B7280; border-radius:10px; padding:10px;"
          >${c.notes || "No notes added"}</textarea>
        </div>

        <!-- Status -->
        <div>
          <label style="font-size:14px; color:#6B7280;">Status</label>
          <input 
            class="swal2-input"
            value="${c.status}"
            disabled
            style="
              width:100%; 
              background:${
                c.status === "Released"
                  ? "#DCFCE7"
                  : c.status === "Rejected"
                  ? "#FEE2E2"
                  : "#FEF9C3"
              }; 
              color:${
                c.status === "Released"
                  ? "#15803D"
                  : c.status === "Rejected"
                  ? "#B91C1C"
                  : "#A16207"
              };
              border-radius:10px;
              font-weight:600;
            "
          />
        </div>

        <!-- Created At -->
        <div>
          <label style="font-size:14px; color:#6B7280;">Requested At</label>
          <input 
            class="swal2-input"
            value="${new Date(c.createdAt).toLocaleString()}"
            disabled
            style="width:100%; background:#F3F4F6; color:#6B7280; border-radius:10px;"
          />
        </div>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Close",
    confirmButtonColor: "#16A34A",
    width: 500,
    padding: "20px 25px",
    background: "#FFFFFF",
    customClass: {
      popup: "rounded-2xl shadow-lg",
      confirmButton: "rounded-lg px-4 py-2",
    },
  });
};


  // =======================================================
  // ADD NEW CLAIM
  // =======================================================
  const addClaim = () => {
    Swal.fire({
      title: "Add New Claim",
      html: `
        <select id="platform" class="swal2-input">
          <option value="">Select platform</option>
          <option value="YouTube">YouTube</option>
          <option value="Facebook">Facebook</option>
        </select>
        <input id="videoLink" class="swal2-input" placeholder="Video link" />
        <textarea id="notes" class="swal2-textarea" placeholder="Notes (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Create",
      preConfirm: () => {
        const platform = (document.getElementById("platform") as any).value;
        const videoLink = (document.getElementById("videoLink") as any).value;
        const notes = (document.getElementById("notes") as any).value;

        if (!platform || !videoLink) {
          Swal.showValidationMessage("Platform and Video Link are required!");
          return;
        }

        return { platform, videoLink, notes };
      },
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const response = await axios.post(
            `${baseUrl}/client/copyright-claim`,
            res.value,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setClaims((prev) => [...prev, response.data.data]);

          Swal.fire("Added!", "Claim submitted successfully", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to submit claim", "error");
        }
      }
    });
  };

  // =======================================================
  // EDIT CLAIM
  // =======================================================
// =======================================================
// EDIT CLAIM — MATCHES THE "ADD NEW LABEL" MODAL STYLE
// =======================================================
const EditClaimModal = ({
  open,
  onClose,
  claim,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  claim: Claim | null;
  onSubmit: (updated: any) => void;
}) => {
  const [videoLink, setVideoLink] = useState(claim?.videoLink || "");
  const [notes, setNotes] = useState(claim?.notes || "");
  const [status, setStatus] = useState<Claim["status"]>(
    claim?.status || "Pending"
  );

  if (!open || !claim) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 animate-scaleIn">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Claim</h2>

        <div className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm font-medium">Platform</label>
            <input
              disabled
              value={claim.platform}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Video Link</label>
            <input
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring focus:ring-green-300"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 min-h-[80px] focus:ring focus:ring-green-300"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Claim["status"])}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring focus:ring-green-300"
            >
              <option value="Pending">Pending</option>
              <option value="Released">Released</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit({
                videoLink,
                notes,
                status,
              })
            }
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};






  // =======================================================
  // UI — UPDATED TO MATCH SCREENSHOT
  // =======================================================
  return (
    <div className="min-h-screen p-10 bg-[#F5F7FB]">
      <h1 className="text-2xl font-semibold text-gray-900">YouTube OAC Requests</h1>
      <p className="text-gray-500 mb-6">Manage artist channel approval requests</p>

      {/* Search bar */}
      <div className="relative w-80 mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search channels..."
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
        />
      </div>

      <div className="rounded-2xl bg-white shadow-md border border-gray-200 p-0 overflow-hidden">
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
            {visible.map((c, i) => (
              <tr key={c._id} className="border-t border-gray-100">
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
                    className={`px-4 py-1 rounded-full text-xs ${
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
                  <Eye className="text-green-600 cursor-pointer" onClick={() => viewClaim(c)} />
                  <Edit className="text-blue-600 cursor-pointer" onClick={() => editClaim(c)} />
                  <CheckCircle
                    className="text-green-500 cursor-pointer"
                    onClick={() => updateStatus(c._id, "Released")}
                  />
                  <XCircle
                    className="text-yellow-600 cursor-pointer"
                    onClick={() => updateStatus(c._id, "Rejected")}
                  />
                  <Trash2 className="text-red-600 cursor-pointer" onClick={() => deleteClaim(c._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default CopyClaimManagement;

