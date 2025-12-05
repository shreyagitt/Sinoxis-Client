import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../store/hook";
import { Check, X, Plus, Trash, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

// TYPES
interface Transaction {
  _id: string;
  source: string;
  amount: number;
  period: string;
  status: string;
}

interface WithdrawRequest {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface RevenueData {
  balance: number;
  withdrawable: number;
  transactions: Transaction[];
  withdrawRequests: WithdrawRequest[];
}

export default function AdminRevenue() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);

  const [newIncome, setNewIncome] = useState({
    userId: "",
    source: "",
    amount: "",
    period: "",
  });

  // ===============================
  // FETCH REVENUE + WITHDRAW REQUESTS
  // ===============================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [revRes, withdrawRes] = await Promise.all([
        // CORRECT ADMIN SUMMARY ROUTE
        axios.get(`${baseUrl}/revenue-report/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),

        axios.get(`${baseUrl}/revenue-report/withdraw-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const summary = revRes.data.data;

      setRevenue({
        balance: summary.balance,
        withdrawable: summary.withdrawable,
        transactions: summary.transactions,
        withdrawRequests: withdrawRes.data.data,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // ===============================
  // ADD INCOME
  // ===============================
  const addIncome = async () => {
    try {
     await axios.post(
  `${baseUrl}/revenue-report/add`,
  {
    userId: newIncome.userId,
    source: newIncome.source,
    amount: Number(newIncome.amount),
    period: newIncome.period,
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);


      toast.success("Income added");
      setNewIncome({ userId: "",source: "", amount: "", period: "" });
      fetchData();
    } catch {
      toast.error("Failed to add income");
    }
  };

  // ===============================
  // UPDATE WITHDRAW REQUEST STATUS
  // ===============================
  const updateWithdraw = async (_id: string, status: "Approved" | "Rejected") => {
    try {
      await axios.patch(
        `${baseUrl}/revenue-report/withdraw/${_id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Withdraw ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update request");
    }
  };

  // ===============================
  // DELETE TRANSACTION
  // ===============================
  const deleteTransaction = async (_id: string) => {
    try {
      await axios.delete(`${baseUrl}/revenue-report/transaction/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Transaction deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading || !revenue) return <p>Loading revenue data...</p>;

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Revenue Control</h1>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard label="Balance" value={revenue.balance} />
        <SummaryCard label="Withdrawable" value={revenue.withdrawable} />
        <SummaryCard label="Total Transactions" value={revenue.transactions.length} />
      </div>

      {/* ADD INCOME */}
      <AddIncomeSection newIncome={newIncome} setNewIncome={setNewIncome} addIncome={addIncome} />

      {/* WITHDRAW REQUESTS */}
      <WithdrawRequestsSection withdrawRequests={revenue.withdrawRequests} updateWithdraw={updateWithdraw} />

      {/* TRANSACTIONS */}
      <TransactionsSection transactions={revenue.transactions} deleteTransaction={deleteTransaction} />

    </div>
  );
}

// ============ SMALL COMPONENTS ============

const SummaryCard = ({ label, value }: any) => (
  <div className="bg-white p-6 rounded-xl shadow border">
    <h2 className="text-sm text-gray-500">{label}</h2>
    <p className="text-3xl font-bold mt-2">₹ {value}</p>
  </div>
);

const AddIncomeSection = ({ newIncome, setNewIncome, addIncome }: any) => (
  <div className="bg-white p-6 rounded-xl shadow border space-y-4">
    <h2 className="font-bold">Add Income</h2>

    <div className="grid grid-cols-3 gap-4">
      <input
  placeholder="Client User ID"
  className="border p-2 rounded"
  value={newIncome.userId}
  onChange={(e) =>
    setNewIncome({ ...newIncome, userId: e.target.value })
  }
/>


      <input className="border p-2 rounded" placeholder="Source" value={newIncome.source}
        onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })} />

      <input className="border p-2 rounded" type="number" placeholder="Amount" value={newIncome.amount}
        onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })} />

      <input className="border p-2 rounded" placeholder="Period (Jan 2025)" value={newIncome.period}
        onChange={(e) => setNewIncome({ ...newIncome, period: e.target.value })} />
    </div>

    <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2" onClick={addIncome}>
      <Plus size={16} /> Add Income
    </button>
  </div>
);

const WithdrawRequestsSection = ({ withdrawRequests, updateWithdraw }: any) => (
  <div className="bg-white p-6 rounded-xl shadow border">
    <h2 className="font-bold mb-4">Withdraw Requests</h2>

    {withdrawRequests.length === 0 ? (
      <p className="text-gray-500">No requests</p>
    ) : (
      withdrawRequests.map((r: any) => (
        <div key={r._id} className="flex justify-between items-center border-b py-3">
          <div>
            <p className="font-semibold">₹ {r.amount}</p>
            <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
          </div>

          {r.status === "Pending" ? (
            <div className="flex gap-3">
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => updateWithdraw(r._id, "Approved")}>
                <Check size={16} /> Approve
              </button>

              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => updateWithdraw(r._id, "Rejected")}>
                <X size={16} /> Reject
              </button>
            </div>
          ) : (
            <span className="px-3 py-1 bg-gray-200 rounded text-gray-700">{r.status}</span>
          )}
        </div>
      ))
    )}
  </div>
);

const TransactionsSection = ({ transactions, deleteTransaction }: any) => (
  <div className="bg-white p-6 rounded-xl shadow border">
    <h2 className="font-bold mb-4">All Transactions</h2>

    {transactions.map((t: any) => (
      <div key={t._id} className="grid grid-cols-5 items-center border-b py-3">
        <span>{t.source}</span>
        <span>₹ {t.amount}</span>
        <span>{t.period}</span>
        <span>{t.status}</span>

        <button className="text-red-600" onClick={() => deleteTransaction(t._id)}>
          <Trash size={16} />
        </button>
      </div>
    ))}
  </div>
);
