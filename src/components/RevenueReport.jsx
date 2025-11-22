// src/pages/RevenueReports.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * RevenueReports.jsx
 */

const TRANSACTIONS = [
  { source: "YouTube", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "in" },
  { source: "Facebook", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "in" },
  { source: "Money Withdraw", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "withdraw", status: "Pending" },
  { source: "Money Withdraw", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "withdraw", status: "Failed" },
  { source: "Money Withdraw", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "withdraw", status: "Paid" },
  { source: "Spotify", date: "01 Nov 2025", amount: "+598.44 ₹", period: "January 2025", type: "in" },
];

const StatusPill = ({ status }) => {
  if (!status) return null;

  const base =
    "inline-block min-w-[80px] text-center px-3 py-1 rounded-full text-sm font-medium";

  const colors = {
    Pending: "bg-yellow-400 text-black",
    Failed: "bg-red-600 text-white",
    Paid: "bg-green-400 text-black",
    Released: "bg-green-400 text-black",
  };

  return (
    <span className={`${base} ${colors[status] || "bg-gray-400 text-black"}`}>
      {status}
    </span>
  );
};

export default function RevenueReports() {
  const navigate = useNavigate();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const MIN_WITHDRAW = 1000;
  const balance = 819.11;
  const withdrawable = 1050;

  const withdrawAmtNum = parseFloat(withdrawAmount) || 0;
  const canWithdraw =
    withdrawAmtNum >= MIN_WITHDRAW && withdrawAmtNum <= withdrawable;

  const openWithdraw = () => setShowWithdrawModal(true);
  const closeWithdraw = () => {
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  const goToBankDetails = () => navigate("/settings/bank-details");

  const submitWithdraw = (e) => {
    e.preventDefault();
    if (!canWithdraw) return;
    alert(`Withdraw requested: ₹${withdrawAmtNum}`);
    closeWithdraw();
  };

  const formatCurrencyBig = (v) => `₹ ${v.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#020726] text-white px-6 md:px-12 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Revenue Reports</h1>
        <div className="text-sm text-gray-300">
          Home <span className="text-[#29B6F6]"> / Revenue Reports</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#0a1039] border border-white/10 rounded-xl p-8 md:p-10 shadow-lg">
        {/* Balance */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-sm text-gray-300 mb-3">Balance Available</div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-extrabold">₹</span>
              <span className="text-3xl font-extrabold">{balance.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={openWithdraw}
            className="rounded-full border border-[#29B6F6] px-4 py-2 text-sm text-[#29B6F6] hover:bg-[#29B6F6]/10"
          >
            Withdraw
          </button>
        </div>

        {/* Transactions header */}
        <div className="text-lg font-bold mb-6">Transactions</div>

        {/* Transactions list */}
        <div className="space-y-6">
          {TRANSACTIONS.map((t, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center gap-4"
            >
              {/* Source */}
              <div className="col-span-5 flex items-center gap-4 text-gray-200">
                {t.type === "in" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M7 7L17 17M17 17V7M17 17H7"
                      stroke="#15b65b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M17 17L7 7M7 7V16M7 7H16"
                      stroke="#9aa4c5"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                <span className="text-base">{t.source}</span>

                {t.status && <StatusPill status={t.status} />}
              </div>

              {/* Date */}
              <div className="col-span-2 text-gray-300">{t.date}</div>

              {/* Amount */}
              <div className="col-span-3 text-right">
                {/* ALL amounts green as you requested */}
                <div className="text-green-400 font-semibold">{t.amount}</div>
                <div className="text-xs text-gray-400 italic">{t.period}</div>
              </div>

              {/* Action */}
<div className="col-span-2 flex justify-end">
  <button className="p-2 hover:bg-white/10 rounded-md">

    {/* Download Icon */}
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {/* Arrow down */}
      <path
        d="M12 3v10"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M8 11l4 4 4-4"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tray / Base line */}
      <path
        d="M5 17h14"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>

  </button>
</div>

            </div>
          ))}
        </div>
      </div>

      {/* ================== WITHDRAW MODAL ================== */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl bg-[#0b1138] p-6 rounded-xl border border-white/10 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Withdraw Money
            </h2>

            <hr className="border-white/10 mb-6" />

            <form onSubmit={submitWithdraw}>
              {/* Withdrawable */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg text-white">Withdrawable Amount</span>
                <span className="text-xl text-[#15d196] font-semibold">
                  {formatCurrencyBig(withdrawable)}
                </span>
              </div>

              {/* Enter Amount */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-white text-lg">Enter Amount</label>

                <div className="flex flex-col items-end">
                  {/* Input + ₹ button */}
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="px-4 py-2 pr-10 bg-[#1a204b] text-white border border-white/20 rounded-md w-40 text-center text-lg outline-none"
                    />

                    <button
                      type="button"
                      className="absolute right-2 text-[#29B6F6] bg-[#29B6F6]/20 px-2 py-1 rounded text-sm"
                    >
                      ₹
                    </button>
                  </div>

                  {/* Minimum always shown */}
                  <span className="text-xs text-gray-400 mt-1">
                    Minimum withdrawal: ₹1000
                  </span>
                </div>
              </div>

              {/* Bank */}
              <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                <span>To Bank Name, 000000009227</span>

                <button
                  type="button"
                  onClick={goToBankDetails}
                  className="text-[#29B6F6]"
                >
                  Change Bank
                </button>
              </div>

              {/* Validation */}
              {withdrawAmtNum > withdrawable && (
                <div className="bg-[#4a2b2b] border border-[#7a4a4a] text-[#f7d384] px-4 py-3 rounded-md text-sm mb-6">
                  You cannot withdraw more than your withdrawable balance.
                </div>
              )}

              <hr className="border-white/10 mb-6" />

              {/* Button */}
              <button
                type="submit"
                disabled={!canWithdraw}
                className={`w-full py-3 rounded-md font-semibold text-white ${
                  canWithdraw
                    ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1]"
                    : "bg-gray-700 opacity-60 cursor-not-allowed"
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

