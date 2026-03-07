// src/pages/RevenueReports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
//import { useTheme } from "../components/Topbar";

// ================================
// STATUS PILL (RESPONSIVE)
// ================================
const StatusPill = ({ status }) => {
  if (!status) return null;

  const base =
    "inline-block px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap";

  const colorMap = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-400 dark:text-black",
    Failed: "bg-red-100 text-red-800 dark:bg-red-600 dark:text-white",
    Paid: "bg-green-100 text-green-800 dark:bg-green-400 dark:text-black",
  };

  return (
    <span className={`${base} ${colorMap[status] || "bg-gray-200 dark:bg-gray-400 text-gray-800 dark:text-black"}`}>
      {status}
    </span>
  );
};

// ================================
// MAIN PAGE
// ================================
export default function RevenueReports() {
  const navigate = useNavigate();
  //const { theme } = useTheme();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  // ================================
  // STATES
  // ================================
  const [transactions, setTransactions] = useState([]); // Application-wide transactions
  const [balance, setBalance] = useState(5000);            // Real balance from DB
  const [withdrawable, setWithdrawable] = useState(5000);  // Amount user can withdraw

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const MIN_WITHDRAW = 1000;
  const withdrawAmtNum = parseFloat(withdrawAmount) || 0;
  const canWithdraw = withdrawAmtNum >= MIN_WITHDRAW && withdrawAmtNum <= withdrawable;

  const formatCurrencyBig = (v) => `₹ ${parseFloat(v || 0).toFixed(2)}`;

  // ================================
  // FETCH USER REVENUE REPORT FROM API
  // ================================
  useEffect(() => {
  axios
    .get(`${baseUrl}/client/revenue-report`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const d = res.data;

      setBalance(d.balance || 0);
      setWithdrawable(d.withdrawable || 0);

      setTransactions(Array.isArray(d.data) ? d.data : []);
    })
    .catch((err) => {
      console.error("Revenue fetch failed", err);
      alert("Failed to load revenue");
    });
}, []);



const handleDownload = (t) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Transaction Receipt", 20, 20);

  doc.setFontSize(12);
  doc.text(`Source: ${t.source}`, 20, 40);
  doc.text(`Amount: ₹ ${t.amount}`, 20, 50);
  doc.text(`Type: ${t.type}`, 20, 60);
  doc.text(`Status: ${t.status || "N/A"}`, 20, 70);
  doc.text(`Period: ${t.period || "-"}`, 20, 80);
  doc.text(`Date: ${t.date}`, 20, 90);

  doc.save(`transaction-${t._id || Date.now()}.pdf`);
};


  // ================================
  // WITHDRAW HANDLER WITH API
  // ================================
  const handleWithdraw = (e) => {
  e.preventDefault();
  if (!canWithdraw) return;

  axios
    .post(
      `${baseUrl}/client/revenue-report/withdraw`,
      { amount: withdrawAmtNum },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert("Withdrawal request sent successfully!");

      // Add temporary pending transaction before refresh
      const newTransaction = {
        source: "Money Withdraw",
        amount: withdrawAmtNum,
        type: "withdraw",
        status: "Pending",
        date: new Date().toLocaleDateString(),
        period: "Current Month",
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      setShowWithdrawModal(false);
      setWithdrawAmount("");

      // Fetch updated balance + transactions from backend
      return axios.get(`${baseUrl}/client/revenue-report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    })
    .then((res) => {
      const d = res.data;

      // backend returns "balance" & "withdrawable"
      setBalance(d.balance);
      setWithdrawable(d.withdrawable);

      // backend returns all user transactions as "data"
      setTransactions(Array.isArray(d.data) ? d.data : []);
    })
    .catch((err) => {
      console.error(err);
      alert(err?.response?.data?.message || "Withdraw failed.");
    });
};


  // ================================
  // THEME DESIGN
  // ================================
  const pageBg = "bg-white dark:bg-[#020726] text-[#020726] dark:text-white";
const cardBg = "bg-white dark:bg-[#0a1039] border border-gray-200 dark:border-white/10 shadow-sm";
const inputBg = "bg-gray-50 dark:bg-[#1f233d] border border-gray-200 dark:border-white/10 text-[#020726] dark:text-white";
const subtleText = "text-gray-600 dark:text-gray-300";
const modalBg = "bg-white dark:bg-[#0b1138] border border-gray-200 dark:border-white/10";

  // ================================
  // UI START
  // ================================
  return (
    <div className={`min-h-screen px-4 sm:px-6 md:px-12 py-6 md:py-8 transition-colors duration-200 ${pageBg}`}>
      
      {/* ================================ HEADER ================================ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-2">
        <h1 className="text-2xl md:text-3xl font-semibold">Revenue Reports</h1>
        <div className={`text-xs sm:text-sm ${subtleText}`}>
          Home <span className="text-[#29B6F6]"> / Revenue Reports</span>
        </div>
      </div>

      {/* ================================ MAIN CARD ================================ */}
      <div className={`${cardBg} rounded-xl p-4 sm:p-6 md:p-8`}>
        
        {/* BALANCE */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 md:mb-8 gap-4">
          <div>
            <div className={`text-sm ${subtleText} mb-2`}>Balance Available</div>
            <div className="flex items-baseline gap-2 sm:gap-4">
              
              <span className="text-2xl sm:text-3xl font-extrabold">{formatCurrencyBig(balance)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="self-start sm:self-auto rounded-full px-4 py-2 text-sm font-medium
border border-[#0288D1] dark:border-[#29B6F6]
text-[#0288D1] dark:text-[#29B6F6]
hover:bg-[#e8f6ff] dark:hover:bg-[#29B6F6]/10"
          >
            Withdraw
          </button>
        </div>

        {/* TRANSACTION TITLE */}
        <div className="text-lg font-bold mb-4 sm:mb-6">Transactions</div>

        {/* ================================ TRANSACTIONS LIST ================================ */}
        <div className="space-y-6">
          {transactions.length === 0 && (
            <p className="text-center text-gray-400">No transactions yet</p>
          )}

          {transactions.map((t, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start sm:items-center border-b border-gray-100 dark:border-white/5 pb-4`}
            >
              {/* SOURCE */}
              <div className="col-span-5 flex items-center gap-3 sm:gap-4">
                <span className="text-base">{t.source}</span>
                {t.status && <StatusPill status={t.status} />}
              </div>

              {/* DATE */}
              <div className="col-span-2 text-sm sm:text-base">
                <div className={subtleText}>{t.date}</div>
              </div>

              {/* AMOUNT */}
              <div className="col-span-3 text-right">
                <div
                  className={`font-semibold ${
                    t.type === "withdraw" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  ₹ {t.amount}
                </div>
                <div className="text-xs text-gray-400 italic">{t.period}</div>
              </div>

              {/* ACTION */}
              <div className="col-span-2 flex justify-end">
                <button
  onClick={() => handleDownload(t)}
  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5"
>
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M12 3v10" stroke="currentColor"
className="text-[#020726] dark:text-white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 11l4 4 4-4" stroke="currentColor"
className="text-[#020726] dark:text-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 17h14" stroke="currentColor"
className="text-[#020726] dark:text-white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
</button>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================================ WITHDRAW MODAL ================================ */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg md:max-w-2xl rounded-xl p-6 shadow-xl ${modalBg}`}>
            <h2 className="text-lg sm:text-xl font-semibold text-[#020726] dark:text-white">
              Withdraw Money
            </h2>

            <hr className="my-4 border-gray-200 dark:border-white/10" />

            {/* FORM */}
            <form onSubmit={handleWithdraw}>
              {/* AVAILABLE */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-base sm:text-lg text-[#020726] dark:text-white">
                  Withdrawable Amount
                </span>
                <span className="text-lg sm:text-xl text-[#15d196] font-semibold">
                  {formatCurrencyBig(withdrawable)}
                </span>
              </div>

              {/* ENTER AMOUNT */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <label className="text-base sm:text-lg text-[#020726] dark:text-white">
                  Enter Amount
                </label>

                <div className="flex flex-col items-end w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className={`px-4 py-2 pr-10 rounded-md w-full sm:w-40 text-center ${inputBg} focus:outline-none`}
                    />

                    <span
                      className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded text-[#0288D1] dark:text-[#29B6F6] bg-[#e8f6ff] dark:bg-[#29B6F6]/10`}
                    >
                      ₹
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 mt-1">
                    Minimum withdrawal: ₹1000
                  </span>
                </div>
              </div>

              {/* ERROR */}
             {withdrawAmtNum > withdrawable && (
  <div className="px-4 py-3 rounded-md mb-6 bg-red-50 dark:bg-[#4a2b2b] border border-red-200 dark:border-[#7a4a4a] text-red-700 dark:text-[#f7d384]">
                  You cannot withdraw more than your withdrawable balance.
                </div>
              )}

<hr className="my-4 border-gray-200 dark:border-white/10" />
              {/* SUBMIT */}
              <button
                type="submit"
                disabled={!canWithdraw}
                className={`w-full py-3 rounded-md font-semibold ${
                  canWithdraw
                    ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-[#020726]"
                    : "bg-gray-400 opacity-60 cursor-not-allowed text-white"
                }`}
              >
                WITHDRAW MONEY
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
