import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Search, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* ============================
   TYPES
============================ */
interface BankDetails {
  accountHolder?: string;
  accountNumber?: string;
  bankName?: string;
  routingNumber?: string;
}

interface PayPalDetails {
  name?: string;
  email?: string;
  paypalId?: string;
}

interface PaymentRequest {
  _id: string;
  amount: number;
  processingFee: number;
  totalReceive: number;
  method: "bank" | "paypal";
  notes?: string;
  status: "Pending" | "Paid" | "Failed";
  paymentDetails: {
    bank?: BankDetails;
    paypal?: PayPalDetails;
  };
  userId?: {
    fullName?: string;
    email?: string;
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

  /* ============================
        FETCH DATA
  ============================ */
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${baseUrl}/payment`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.data);
    } catch {
      toast.error("Failed to load payment requests");
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  /* ============================
        UPDATE STATUS
  ============================ */
  const updateStatus = async (id: string, status: "Paid" | "Failed") => {
    try {
      await axios.patch(
        `${baseUrl}/payment/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated");
      fetchRequests();
      setShowModal(false);
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ============================
        DELETE REQUEST
  ============================ */
  const deleteReq = async (id: string) => {
    if (!confirm("Delete this request?")) return;

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

  /* ============================
        SEARCH FILTER
  ============================ */
  const filtered = data.filter((r) =>
    (r.userId?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Payment Requests</h1>

        {/* SEARCH */}
        <div className="flex items-center bg-white dark:bg-[#0B1029] 
                        border border-gray-300 dark:border-[#1A2347] 
                        rounded-lg px-3 py-2 shadow w-72">
          <Search className="mr-2 text-blue-600 dark:text-blue-300" size={18} />
          <input
            type="text"
            placeholder="Search by email..."
            className="w-full outline-none bg-transparent text-[#020726] dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#0B1029] rounded-xl shadow 
                      border border-gray-300 dark:border-[#1A2347] overflow-x-auto">

        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#111A3A] border-b border-gray-300 dark:border-[#1A2347] text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((req) => (
              <tr
                key={req._id}
                className="border-b border-gray-300 dark:border-[#1A2347] 
                           hover:bg-gray-100 dark:hover:bg-[#111A3A] transition-colors"
              >
                {/* USER */}
                <td className="p-3">
                  {req.userId?.fullName} <br />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{req.userId?.email}</span>
                </td>

                {/* AMOUNT */}
                <td classnName="p-3 font-semibold text-green-700 dark:text-green-300">
                  ${req.amount}
                </td>

                {/* METHOD */}
                <td className="p-3 capitalize">{req.method}</td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        req.status === "Paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : req.status === "Failed"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                      }
                    `}
                  >
                    {req.status}
                  </span>
                </td>

                {/* DATE */}
                <td className="p-3 text-gray-600 dark:text-gray-400">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex justify-center gap-4">

                  <button
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    onClick={() => {
                      setActive(req);
                      setShowModal(true);
                    }}
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    onClick={() => deleteReq(req._id)}
                  >
                    <Trash2 size={18} />
                  </button>

                </td>
              </tr>
            ))}

            {/* EMPTY STATE */}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-600 dark:text-gray-400 italic">
                  No requests found
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
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 
                        flex items-center justify-center z-[99999] p-4">

          <div className="bg-white dark:bg-[#0B1029] rounded-xl p-6 
                          w-full max-w-lg shadow-xl 
                          border border-gray-300 dark:border-[#1A2347]">

            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

            <div className="space-y-2 text-sm">
              <p><strong>User:</strong> {active.userId?.fullName} ({active.userId?.email})</p>
              <p><strong>Amount:</strong> ${active.amount}</p>
              <p><strong>Processing Fee:</strong> ${active.processingFee}</p>
              <p><strong>Total Receive:</strong> ${active.totalReceive}</p>
              <p><strong>Notes:</strong> {active.notes || "—"}</p>

              <h3 className="font-semibold mt-3">Account Details</h3>

              {active.method === "bank" ? (
                <>
                  <p><strong>Bank:</strong> {active.paymentDetails?.bank?.bankName || "—"}</p>
                  <p><strong>Holder:</strong> {active.paymentDetails?.bank?.accountHolder || "—"}</p>
                  <p><strong>Account No:</strong> {active.paymentDetails?.bank?.accountNumber || "—"}</p>
                  <p><strong>Routing:</strong> {active.paymentDetails?.bank?.routingNumber || "—"}</p>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {active.paymentDetails?.paypal?.name || "—"}</p>
                  <p><strong>Email:</strong> {active.paymentDetails?.paypal?.email || "—"}</p>
                  <p><strong>PayPal ID:</strong> {active.paymentDetails?.paypal?.paypalId || "—"}</p>
                </>
              )}
            </div>

            {/* MODAL ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white 
                           rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

              {active.status === "Pending" && (
                <>
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 
                               text-white rounded-lg flex items-center gap-2"
                    onClick={() => updateStatus(active._id, "Paid")}
                  >
                    <CheckCircle size={18} /> Approve
                  </button>

                  <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 
                               text-white rounded-lg flex items-center gap-2"
                    onClick={() => updateStatus(active._id, "Failed")}
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
