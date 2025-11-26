// src/pages/RequestPayment.jsx
import React, { useState } from "react";
import {
  DollarSign,
  Clock,
  RefreshCcw,
  CheckCircle,
  Briefcase,
  CreditCard,
  Send,
  Mail,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "../components/Topbar"; // theme provider from Topbar

const MAX_BALANCE = 89452;
const QUICK_AMOUNTS = [1000, 2500, 5000, 10000];

const RequestPayment = () => {
  const { theme } = useTheme();

  // theme-aware classes
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg = theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#0a1039] text-white border border-white/10" : "bg-gray-50 text-[#020726] border border-gray-200";
  const accentText = "text-[#29B6F6]";
  const accentGradient = "from-[#29B6F6] to-[#0288D1]";

  const [amount, setAmount] = useState(5000);
  const [method, setMethod] = useState("bank");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  const processingFee = amount > 5000 ? amount * 0.015 : 0;
  const tax = 0;
  const totalReceive = Math.max(0, amount - processingFee - tax);
  const deliveryTime = method === "bank" ? "3–5 business days" : "1–2 business days";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) return alert("You must agree to the terms.");
    alert("Payment Request Submitted (demo)");
  };

  return (
    <div className={`p-6 md:p-10 min-h-screen transition-colors duration-200 ${pageBg}`}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Request Payment</h1>
          <p className={`text-sm mt-2 ${subtleText}`}>
            Request payouts from your available balance — secure & quick.
          </p>
        </div>

        <ol className={`flex gap-2 text-sm ${accentText}`}>
          <li className="cursor-pointer">Home</li>
          <li>/</li>
          <li className="cursor-pointer">Revenue Reports</li>
          <li>/</li>
          <li className="font-medium">Request Payment</li>
        </ol>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <MetricCard
          theme={theme}
          title="Available Balance"
          value={`$${MAX_BALANCE.toLocaleString()}`}
          subtitle="Ready for withdrawal"
          icon={<DollarSign className="w-8 h-8" />}
          badges={[
            { text: "Available Now", tone: "emerald" },
            { text: "Minimum: $50", tone: "blue" },
          ]}
        />

        <MetricCard
          theme={theme}
          title="Pending Revenue"
          value="$23,768"
          subtitle="Next payout cycle"
          icon={<Clock className="w-8 h-8" />}
          badges={[
            { text: "Processing", tone: "yellow" },
            { text: "Due: 15th", tone: "blue" },
          ]}
        />

        <MetricCard
          theme={theme}
          title="Processing"
          value="$12,450"
          subtitle="Current requests"
          icon={<RefreshCcw className="w-8 h-8" />}
          badges={[
            { text: "2 Requests", tone: "blue" },
            { text: "3–5 Days", tone: "emerald" },
          ]}
        />

        <MetricCard
          theme={theme}
          title="Total Processed"
          value="$247,890"
          subtitle="All time payments"
          icon={<CheckCircle className="w-8 h-8" />}
          badges={[
            { text: "48 Payments", tone: "blue" },
            { text: "100% Success", tone: "emerald" },
          ]}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className={`xl:col-span-8 rounded-2xl p-6 shadow-sm ${cardBg}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">New Payment Request</h3>
            <span className={`text-sm ${subtleText}`}>Step 1 of 3</span>
          </div>

          {/* AMOUNT */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>
              Request Amount
            </label>

            <div className={`flex items-center justify-between rounded-xl p-4 ${theme === "dark" ? "bg-[#081435] border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
              <span className={`text-sm ${subtleText}`}>USD</span>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value || 0))}
                className={`w-40 text-center text-xl font-semibold focus:outline-none bg-transparent`}
                min={0}
              />

              <span className={`text-sm ${subtleText}`}>Max: {MAX_BALANCE.toLocaleString()}</span>
            </div>

            {/* QUICK AMOUNTS */}
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.map((v) => (
                <button
                  key={v}
                  onClick={(e) => { e.preventDefault(); setAmount(v); }}
                  className={`px-3 py-2 rounded-md text-sm border ${theme === "dark" ? "border-white/10 text-white hover:bg-white/5" : "border-gray-200 text-[#020726] hover:bg-[#e8f6ff]"}`}
                >
                  ${v.toLocaleString()}
                </button>
              ))}

              <button
                onClick={(e) => { e.preventDefault(); setAmount(MAX_BALANCE); }}
                className={`px-3 py-2 rounded-md text-sm border ${theme === "dark" ? "border-white/10 text-white hover:bg-white/5" : "border-gray-200 text-[#020726] hover:bg-[#e8f6ff]"}`}
              >
                Max
              </button>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>
              Payment Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OptionCard
                active={method === "bank"}
                onClick={() => setMethod("bank")}
                title="Bank Transfer"
                subtitle="3–5 business days"
                icon={<Briefcase size={20} />}
                theme={theme}
              />

              <OptionCard
                active={method === "paypal"}
                onClick={() => setMethod("paypal")}
                title="PayPal"
                subtitle="1–2 business days"
                icon={<CreditCard size={20} />}
                theme={theme}
              />
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          {method === "bank" && <BankDetails theme={theme} />}
          {method === "paypal" && <PayPalDetails theme={theme} />}

          {/* NOTES */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full p-4 rounded-xl ${inputBg} focus:outline-none`}
              placeholder="Add any special instructions..."
            />
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="accent-[#29B6F6] mt-1"
            />
            <p className={`text-sm ${subtleText} max-w-2xl`}>
              I agree to the{" "}
              <span className={`${accentText} underline cursor-pointer`}>payment terms and conditions</span>{" "}
              and understand a 1.5% processing fee may apply for amounts over $5,000.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[#020726] bg-gradient-to-r ${accentGradient} hover:opacity-95 transition`}
            >
              <Send size={18} /> Submit Payment Request
            </button>

            <button
              type="button"
              className={`px-5 py-3 rounded-xl border ${theme === "dark" ? "border-white/10 text-white hover:bg-white/5" : "border-gray-200 text-[#020726] hover:bg-gray-50"}`}
            >
              Save as Draft
            </button>
          </div>
        </form>

        {/* SIDEBAR */}
        <Sidebar
          theme={theme}
          amount={amount}
          processingFee={processingFee}
          tax={tax}
          totalReceive={totalReceive}
          deliveryTime={deliveryTime}
          method={method}
        />
      </div>
    </div>
  );
};

export default RequestPayment;

/* ---------------------- SUBCOMPONENTS ---------------------- */

const MetricCard = ({ theme, title, value, subtitle, icon, badges = [] }) => {
  const cardBg = theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-500";
  const titleColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const valueColor = theme === "dark" ? "text-white" : "text-[#020726]";

  const toneMap = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className={`rounded-2xl p-5 shadow-sm ${cardBg}`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className={`text-sm ${titleColor}`}>{title}</p>
          <h2 className={`text-2xl font-semibold mt-1 ${valueColor}`}>{value}</h2>
          <p className={`text-xs mt-1 ${subtleText}`}>{subtitle}</p>
        </div>

        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#29B6F6] to-[#0288D1] flex items-center justify-center text-white">
          {icon}
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        {badges.map((b, i) => (
          <span key={i} className={`px-3 py-1 rounded-full text-xs ${toneMap[b.tone] || "bg-gray-100 text-gray-800"}`}>
            {b.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const OptionCard = ({ active, onClick, icon, title, subtitle, theme }) => {
  const activeBg = theme === "dark" ? "bg-[#29B6F6]/10 border-[#29B6F6]" : "bg-[#e8f6ff] border-[#cfeeff]";
  const defaultBg = theme === "dark" ? "bg-transparent border border-white/10" : "bg-white border border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-[#020726]";

  return (
    <button
      onClick={onClick}
      type="button"
      className={`p-4 rounded-xl flex items-center gap-4 border transition w-full ${active ? activeBg : defaultBg}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? "bg-white/10" : "bg-gray-100/10"}`}>
        <span className={`${active ? "text-white" : "text-[#29B6F6]"}`}>{icon}</span>
      </div>

      <div className="flex-1 text-left">
        <p className={`font-medium ${textColor}`}>{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      <input type="radio" checked={active} readOnly className="accent-[#29B6F6]" />
    </button>
  );
};

const ReadOnlyField = ({ theme, label, value }) => {
  const bg = theme === "dark" ? "bg-[#081435] border border-white/10 text-white" : "bg-gray-50 border border-gray-200 text-[#020726]";
  return (
    <div>
      <label className={`text-sm block mb-2 ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>{label}</label>
      <input value={value} readOnly className={`w-full p-3 rounded-xl ${bg}`} />
    </div>
  );
};

const BankDetails = ({ theme }) => (
  <div className="mb-6">
    <label className={`block text-sm font-medium mb-3 ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Bank Account Details</label>

    <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-[#081435] border border-white/10" : "bg-white border border-gray-200"}`}>
      <div className="grid md:grid-cols-2 gap-4">
        <ReadOnlyField theme={theme} label="Account Holder Name" value="Alex Mora" />
        <ReadOnlyField theme={theme} label="Account Number" value="**** **** **** 7284" />
        <ReadOnlyField theme={theme} label="Bank Name" value="Chase Bank" />
        <ReadOnlyField theme={theme} label="Routing Number" value="*****3210" />
      </div>

      <div className="text-right mt-4">
        <button className={`px-4 py-2 rounded-lg ${theme === "dark" ? "border border-[#29B6F6]/30 text-[#29B6F6] bg-transparent" : "border border-[#0288D1] text-[#0288D1] bg-white"}`}>
          Update Bank Details
        </button>
      </div>
    </div>
  </div>
);

const PayPalDetails = ({ theme }) => (
  <div className="mb-6">
    <label className={`block text-sm font-medium mb-3 ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>PayPal Account Details</label>

    <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-[#081435] border border-white/10" : "bg-white border border-gray-200"}`}>
      <div className="grid md:grid-cols-2 gap-4">
        <ReadOnlyField theme={theme} label="Account Holder Name" value="Alex Mora" />
        <ReadOnlyField theme={theme} label="PayPal Email" value="alex.mora@example.com" />
        <ReadOnlyField theme={theme} label="PayPal ID" value="PP-9823-ABX7" />
        <ReadOnlyField theme={theme} label="Account Status" value="Verified" />
      </div>

      <div className="text-right mt-4">
        <button className={`px-4 py-2 rounded-lg ${theme === "dark" ? "border border-[#29B6F6]/30 text-[#29B6F6] bg-transparent" : "border border-[#0288D1] text-[#0288D1] bg-white"}`}>
          Update PayPal Details
        </button>
      </div>
    </div>
  </div>
);

const Sidebar = ({ theme, amount, processingFee, tax, totalReceive, deliveryTime, method }) => {
  const cardBg = theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <aside className="xl:col-span-4 space-y-6">
      <div className={`rounded-2xl p-5 shadow-sm ${cardBg}`}>
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>

        <div className="space-y-3 text-sm">
          <Row label="Request Amount" value={`$${amount.toLocaleString()}`} theme={theme} />
          <Row label="Processing Fee" value={`$${processingFee.toFixed(2)}`} theme={theme} />
          <Row label="Estimated Tax" value={`$${tax.toFixed(2)}`} theme={theme} />
          <Row label="Payment Method" value={method === "bank" ? "Bank Transfer" : "PayPal"} theme={theme} />
          <Row label="Delivery Time" value={deliveryTime} theme={theme} />

          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Total Receive</span>
            <span className="text-xl font-bold text-[#29B6F6]">${totalReceive.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 shadow-sm ${cardBg}`}>
        <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>

        <RecentItem theme={theme} icon={<CheckCircle />} amount="$8,500.00" subtitle="Completed • Dec 15, 2024" badgeText="Paid" tone="emerald" />
        <RecentItem theme={theme} icon={<RefreshCcw />} amount="$12,450.00" subtitle="Processing • Jan 5, 2025" badgeText="Processing" tone="blue" />
        <RecentItem theme={theme} icon={<Clock />} amount="$6,200.00" subtitle="Pending • Jan 12, 2025" badgeText="Pending" tone="yellow" />
      </div>

      <div className={`rounded-2xl p-5 text-white`} style={{ background: "linear-gradient(90deg,#29B6F6,#0288D1)" }}>
        <div className="flex items-start gap-3">
          <HelpCircle />
          <div>
            <h4 className="font-semibold">Need Help?</h4>
            <p className="text-sm">Contact our support team for payment-related questions</p>
          </div>
        </div>

        <button className="mt-4 bg-white text-[#020726] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Mail size={14} /> Contact Support
        </button>
      </div>
    </aside>
  );
};

const Row = ({ label, value, theme }) => (
  <div className="flex justify-between items-center">
    <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
    <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>{value}</span>
  </div>
);

const RecentItem = ({ theme, icon, amount, subtitle, badgeText, tone = "blue" }) => {
  const toneMap = {
    emerald: "bg-emerald-100 text-emerald-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };
  return (
    <div className={`flex items-center gap-4 py-3 border-b ${theme === "dark" ? "border-white/5" : "border-gray-100"}`}>
      <span className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-[#29B6F6]" : "bg-[#e8f6ff]"}`}>
        {icon}
      </span>

      <div className="flex-1">
        <p className={`font-medium ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>{amount}</p>
        <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{subtitle}</p>
      </div>

      <span className={`px-3 py-1 rounded-full text-xs ${toneMap[tone]}`}>{badgeText}</span>
    </div>
  );
};
