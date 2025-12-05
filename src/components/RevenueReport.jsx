// src/pages/RevenueReports.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar";

// ================================
// SAMPLE TRANSACTIONS
// ================================
const TRANSACTIONS = [
  { source: "YouTube", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "in" },
  { source: "Facebook", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "in" },
  { source: "Money Withdraw", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "withdraw", status: "Pending" },
  { source: "Money Withdraw", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "withdraw", status: "Failed" },
  { source: "Money Withdraw", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "withdraw", status: "Paid" },
  { source: "Spotify", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "in" },
];

// ================================
// STATUS PILL (RESPONSIVE)
// ================================
const StatusPill = ({ status, theme }) => {
  if (!status) return null;

  const base = "inline-block px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap";

  const colorMapDark = {
    Pending: "bg-yellow-400 text-black",
    Failed: "bg-red-600 text-white",
    Paid: "bg-green-400 text-black",
  };

  const colorMapLight = {
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
    Paid: "bg-green-100 text-green-800",
  };

  const classes = theme === "dark"
    ? (colorMapDark[status] || "bg-gray-400 text-black")
    : (colorMapLight[status] || "bg-gray-200 text-gray-800");

  return <span className={`${base} ${classes}`}>{status}</span>;
};

// ================================
// MAIN PAGE
// ================================
export default function RevenueReports() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Theme Classes
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg = theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200 shadow-sm";
  const inputBg = theme === "dark" ? "bg-[#1f233d] text-white placeholder-gray-400 border border-white/10" : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-200";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const modalBg = theme === "dark" ? "bg-[#0b1138] border border-white/10" : "bg-white border border-gray-200";

  // Withdraw states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const MIN_WITHDRAW = 1000;
  const balance = 819.11;
  const withdrawable = 1050;

  const withdrawAmtNum = parseFloat(withdrawAmount) || 0;
  const canWithdraw = withdrawAmtNum >= MIN_WITHDRAW && withdrawAmtNum <= withdrawable;

  const formatCurrencyBig = (v) => `₹ ${v.toFixed(2)}`;

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
              <span className="text-2xl sm:text-3xl font-extrabold">₹</span>
              <span className="text-2xl sm:text-3xl font-extrabold">{balance.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className={`self-start sm:self-auto rounded-full px-4 py-2 text-sm font-medium ${
              theme === "dark"
                ? "border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/10"
                : "border border-[#0288D1] text-[#0288D1] hover:bg-[#e8f6ff]"
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* TRANSACTION TITLE */}
        <div className="text-lg font-bold mb-4 sm:mb-6">Transactions</div>

        {/* ================================ TRANSACTIONS LIST ================================ */}
        <div className="space-y-6">
          {TRANSACTIONS.map((t, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start sm:items-center ${
                theme === "dark" ? "border-b border-white/5 pb-4" : "border-b border-gray-100 pb-4"
              }`}
            >
              {/* SOURCE */}
              <div className="col-span-5 flex items-center gap-3 sm:gap-4">
                {t.type === "in" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M7 7L17 17M17 17V7M17 17H7" stroke="#15b65b" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M17 17L7 7M7 7V16M7 7H16" stroke="#9aa4c5" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span className="text-base">{t.source}</span>

                {t.status && <StatusPill status={t.status} theme={theme} />}
              </div>

              {/* DATE */}
              <div className="col-span-2 text-sm sm:text-base">
                <div className={subtleText}>{t.date}</div>
              </div>

              {/* AMOUNT */}
              <div className="col-span-3 text-right">
                <div className="text-green-400 font-semibold">{t.amount}</div>
                <div className="text-xs text-gray-400 italic">{t.period}</div>
              </div>

              {/* ACTION */}
              <div className="col-span-2 flex justify-end">
                <button className={`p-2 rounded-md ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100"}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path d="M12 3v10" stroke={theme === "dark" ? "#ffffff" : "#020726"} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 11l4 4 4-4" stroke={theme === "dark" ? "#ffffff" : "#020726"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 17h14" stroke={theme === "dark" ? "#ffffff" : "#020726"} strokeWidth="1.5" strokeLinecap="round" />
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
            <h2 className={`text-lg sm:text-xl font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>
              Withdraw Money
            </h2>

            <hr className={`my-4 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`} />

            {/* FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canWithdraw) {
                  alert(`Withdraw requested: ₹${withdrawAmtNum}`);
                }
              }}
            >
              {/* AVAILABLE */}
              <div className="flex items-center justify-between mb-6">
                <span className={`text-base sm:text-lg ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>
                  Withdrawable Amount
                </span>
                <span className="text-lg sm:text-xl text-[#15d196] font-semibold">
                  {formatCurrencyBig(withdrawable)}
                </span>
              </div>

              {/* ENTER AMOUNT */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <label className={`text-base sm:text-lg ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>
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
                      className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded ${
                        theme === "dark" ? "text-[#29B6F6] bg-[#29B6F6]/10" : "text-[#0288D1] bg-[#e8f6ff]"
                      }`}
                    >
                      ₹
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 mt-1">
                    Minimum withdrawal: ₹1000
                  </span>
                </div>
              </div>

              {/* BANK INFO */}
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm mb-4 gap-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <span>To Bank Name, 000000009227</span>

                <button
                  type="button"
                  onClick={() => navigate("/settings/bank-details")}
                  className={`font-medium ${theme === "dark" ? "text-[#29B6F6]" : "text-[#0288D1]"}`}
                >
                  Change Bank
                </button>
              </div>

              {/* ERROR */}
              {withdrawAmtNum > withdrawable && (
                <div
                  className={`px-4 py-3 rounded-md mb-6 ${
                    theme === "dark"
                      ? "bg-[#4a2b2b] border border-[#7a4a4a] text-[#f7d384]"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  You cannot withdraw more than your withdrawable balance.
                </div>
              )}

              <hr className={`my-4 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`} />

              {/* SUBMIT BUTTON */}
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

