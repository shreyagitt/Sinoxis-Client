import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Search, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

interface PaymentRequest {
  _id: string;
  userId: string;
  amount: number;
  method: "bank" | "paypal";
  notes?: string;
  processingFee: number;
  tax: number;
  totalReceive: number;
  deliveryTime: string;
  status: "Pending" | "Processing" | "Completed" | "Rejected";
  accountDetails?: {
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    routingNumber?: string;
    paypalEmail?: string;
  };
  createdAt: string;
}

const AdminPaymentRequests: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [data, setData] = useState<PaymentRequest[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [active, setActive] = useState<PaymentRequest | null>(null);

  // Fetch data
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${baseUrl}/payment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.data);
    } catch {
      toast.error("Failed to fetch payment requests");
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  // Update status
  const updateStatus = async (id: string, status: PaymentRequest["status"]) => {
    try {
      await axios.patch(
        `${baseUrl}/payment/${id}/status`,
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

  // Delete
  const deleteReq = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(`${baseUrl}/payment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      fetchRequests();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Search filter
  const filtered = data.filter((r) =>
    r.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Payment Requests</h1>

        <div className="flex items-center bg-white border rounded-lg shadow px-3 py-2 w-72">
          <Search className="text-green-600 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by user ID..."
            className="w-full outline-none bg-transparent text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((req) => (
              <tr key={req._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{req.userId}</td>
                <td className="p-3 font-semibold text-green-700">${req.amount}</td>
                <td className="p-3 capitalize">{req.method}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      req.status === "Completed"
                        ? "bg-green-200 text-green-700"
                        : req.status === "Processing"
                        ? "bg-yellow-200 text-yellow-700"
                        : req.status === "Rejected"
                        ? "bg-red-200 text-red-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 flex justify-center gap-4">
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => {
                      setActive(req);
                      setShowModal(true);
                    }}
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteReq(req._id)}
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
                  className="text-center py-4 text-gray-500 italic"
                >
                  No payment requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg border">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Details
            </h2>

            <div className="space-y-2 text-sm">
              <p><strong>User ID:</strong> {active.userId}</p>
              <p><strong>Amount:</strong> ${active.amount}</p>
              <p><strong>Processing Fee:</strong> ${active.processingFee}</p>
              <p><strong>Tax:</strong> ${active.tax}</p>
              <p><strong>Total Receive:</strong> ${active.totalReceive}</p>
              <p><strong>Delivery:</strong> {active.deliveryTime}</p>
              <p><strong>Notes:</strong> {active.notes || "—"}</p>

              <h3 className="font-semibold mt-2">Account Details</h3>
              {active.method === "bank" ? (
                <>
                  <p><strong>Bank Name:</strong> {active.accountDetails?.bankName}</p>
                  <p><strong>Holder:</strong> {active.accountDetails?.accountHolder}</p>
                  <p><strong>Account No:</strong> {active.accountDetails?.accountNumber}</p>
                  <p><strong>Routing No:</strong> {active.accountDetails?.routingNumber}</p>
                </>
              ) : (
                <p><strong>PayPal:</strong> {active.accountDetails?.paypalEmail}</p>
              )}
            </div>

            {/* Modal Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

              {(active.status === "Pending" || active.status === "Processing") && (
                <>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    onClick={() => updateStatus(active._id, "Completed")}
                  >
                    <CheckCircle size={18} /> Complete
                  </button>

                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    onClick={() => updateStatus(active._id, "Rejected")}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentRequests;


