import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../store/hook";
import { RefreshCcw, Check, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface RevenueItem {
  _id: string;
  source: string;
  amount: number;
  period?: string;
  status?: string;
  type: "in" | "withdraw";
  date: string;
  userId?: {
    email?: string;
  };
}

export default function AdminRevenue() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<RevenueItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<RevenueItem[]>([]);

  /* ===========================================
        FETCH REVENUE
  ============================================ */
  const fetchRevenue = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${baseUrl}/revenue-report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.success) {
        toast.error("Failed to load revenue report");
        return;
      }

      const items = res.data.data;

      const sorted = items.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTransactions(sorted);
      setWithdrawals(sorted.filter((t) => t.type === "withdraw"));
    } catch {
      toast.error("Error loading revenue report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRevenue();
  }, [token]);


  /* ===========================================
        UPDATE STATUS
  ============================================ */
  const updateStatus = async (id: string, status: "Paid" | "Failed") => {
    try {
      await axios.put(
        `${baseUrl}/revenue-report/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Updated to ${status}`);
      fetchRevenue();
    } catch {
      toast.error("Failed to update status");
    }
  };


  /* ===========================================
        DELETE TRANSACTION
  ============================================ */
  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await axios.delete(`${baseUrl}/revenue-report/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted successfully");
      fetchRevenue();
    } catch {
      toast.error("Delete failed");
    }
  };


  if (loading)
    return (
      <p className="p-8 text-[#020726] dark:text-white">
        Loading...
      </p>
    );


  /* ===========================================
        UI (SINOSIS THEME)
  ============================================ */
  return (
    <div className="p-8 space-y-10 min-h-screen 
                    bg-white dark:bg-[#020726] 
                    text-[#020726] dark:text-white transition-colors">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Revenue Report</h1>

        <button
          onClick={fetchRevenue}
          className="flex items-center gap-2 px-4 py-2 
                     bg-white dark:bg-[#0B1029]
                     border border-gray-300 dark:border-[#1A2347]
                     rounded-lg hover:bg-gray-100 dark:hover:bg-[#111A3A]
                     transition-colors"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* =============================================
            WITHDRAW REQUESTS
      ============================================== */}
      <div className="p-6 rounded-xl shadow 
                      bg-white dark:bg-[#0B1029]
                      border border-gray-300 dark:border-[#1A2347]">

        <h2 className="font-bold mb-4 text-lg">Withdrawal Requests</h2>

        {withdrawals.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No withdrawal requests
          </p>
        ) : (
          withdrawals.map((w) => (
            <div
              key={w._id}
              className="flex justify-between items-center 
                         border-b border-gray-300 dark:border-[#1A2347]
                         py-4"
            >
              <div>
                <p className="font-semibold">
                  ₹ {w.amount} ({w.userId?.email || "Unknown User"})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(w.date).toLocaleString()}
                </p>
              </div>

              {w.status === "Pending" ? (
                <div className="flex gap-3">

                  <button
                    onClick={() => updateStatus(w._id, "Paid")}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 
                               text-white rounded flex items-center gap-1"
                  >
                    <Check size={16} /> Approve
                  </button>

                  <button
                    onClick={() => updateStatus(w._id, "Failed")}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 
                               text-white rounded flex items-center gap-1"
                  >
                    <X size={16} /> Reject
                  </button>

                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded 
                               bg-gray-200 dark:bg-[#111A3A]
                               text-gray-700 dark:text-gray-300"
                  >
                    {w.status}
                  </span>

                  <button
                    onClick={() => deleteTransaction(w._id)}
                    className="p-2 rounded 
                               bg-red-100 dark:bg-red-900/40
                               hover:bg-red-200 dark:hover:bg-red-900/60
                               text-red-600 dark:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* =============================================
            ALL TRANSACTIONS
      ============================================== */}
      <div className="p-6 rounded-xl shadow 
                      bg-white dark:bg-[#0B1029]
                      border border-gray-300 dark:border-[#1A2347]">

        <h2 className="font-bold mb-4 text-lg">All Transactions</h2>

        <div className="grid grid-cols-6 font-semibold 
                        text-gray-700 dark:text-gray-300 
                        border-b border-gray-300 dark:border-[#1A2347] pb-3">
          <span>Source</span>
          <span>Amount</span>
          <span>Period</span>
          <span>Type</span>
          <span>User</span>
          <span>Action</span>
        </div>

        {transactions.map((t) => (
          <div
            key={t._id}
            className="grid grid-cols-6 items-center 
                       border-b border-gray-300 dark:border-[#1A2347]
                       py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#111A3A] transition"
          >
            <span>{t.source}</span>
            <span>₹ {t.amount}</span>
            <span>{t.period || "-"}</span>
            <span>{t.type === "in" ? "Income" : t.status}</span>
            <span>{t.userId?.email || "-"}</span>

            <button
              onClick={() => deleteTransaction(t._id)}
              className="p-2 text-red-600 dark:text-red-400 
                         bg-red-100 dark:bg-red-900/40 
                         hover:bg-red-200 dark:hover:bg-red-900/60
                         rounded w-fit"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
