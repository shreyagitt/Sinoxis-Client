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

const MAX_BALANCE = 89452;
const QUICK_AMOUNTS = [1000, 2500, 5000, 10000];

const RequestPayment = () => {
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
    alert("Payment Request Submitted");
  };

  return (
    <div className="p-6 md:p-10 bg-[#020726] min-h-screen text-white space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-semibold">Request Payment</h1>

        <ol className="flex gap-2 text-sm text-[#29B6F6]">
          <li className="hover:underline cursor-pointer">Home</li>
          <li>/</li>
          <li className="hover:underline cursor-pointer">Revenue Reports</li>
          <li>/</li>
          <li className="font-medium">Request Payment</li>
        </ol>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <MetricCard
          title="Available Balance"
          value="$89,452"
          subtitle="Ready for withdrawal"
          icon={<DollarSign className="text-[#29B6F6] w-8 h-8" />}
          badges={[
            { text: "Available Now", color: "bg-emerald-500/20 text-emerald-400" },
            { text: "Minimum: $50", color: "bg-blue-500/20 text-blue-400" },
          ]}
        />

        <MetricCard
          title="Pending Revenue"
          value="$23,768"
          subtitle="Next payout cycle"
          icon={<Clock className="text-[#29B6F6] w-8 h-8" />}
          badges={[
            { text: "Processing", color: "bg-yellow-500/20 text-yellow-400" },
            { text: "Due: 15th", color: "bg-blue-500/20 text-blue-400" },
          ]}
        />

        <MetricCard
          title="Processing"
          value="$12,450"
          subtitle="Current requests"
          icon={<RefreshCcw className="text-[#29B6F6] w-8 h-8" />}
          badges={[
            { text: "2 Requests", color: "bg-blue-500/20 text-blue-400" },
            { text: "3–5 Days", color: "bg-emerald-500/20 text-emerald-400" },
          ]}
        />

        <MetricCard
          title="Total Processed"
          value="$247,890"
          subtitle="All time payments"
          icon={<CheckCircle className="text-[#29B6F6] w-8 h-8" />}
          badges={[
            { text: "48 Payments", color: "bg-blue-500/20 text-blue-400" },
            { text: "100% Success", color: "bg-emerald-500/20 text-emerald-400" },
          ]}
        />

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="xl:col-span-8 bg-[#0a1039] border border-white/10 rounded-2xl p-8 space-y-8 shadow-lg"
        >

          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">New Payment Request</h3>
            <span className="text-gray-400 text-sm">Step 1 of 3</span>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-white font-medium">Request Amount</label>

            <div className="bg-[#020726] border border-white/10 rounded-xl mt-3 px-5 py-4 flex justify-between">
              <span className="text-gray-400 text-sm">USD</span>

              <input
                type="number"
                className="w-40 text-center bg-[#0a1039] border border-white/10 rounded-lg px-3 py-2 text-xl font-semibold text-[#29B6F6] outline-none focus:border-[#29B6F6]"
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
              />

              <span className="text-gray-400 text-sm">
                Max: {MAX_BALANCE.toLocaleString()}
              </span>
            </div>

            {/* QUICK AMOUNTS */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              {QUICK_AMOUNTS.map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  type="button"
                  className="btn-dark"
                >
                  ${v.toLocaleString()}
                </button>
              ))}
              <button onClick={() => setAmount(MAX_BALANCE)} type="button" className="btn-dark">
                Max
              </button>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <label className="text-white font-medium">Payment Method</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
              <OptionCard
                active={method === "bank"}
                onClick={() => setMethod("bank")}
                title="Bank Transfer"
                subtitle="3–5 business days"
                icon={
                  <span className="w-12 h-12 rounded-full bg-gradient-to-r from-[#29B6F6] to-[#0288D1] flex items-center justify-center">
                    <Briefcase className="text-white" size={20} />
                  </span>
                }
              />

              <OptionCard
                active={method === "paypal"}
                onClick={() => setMethod("paypal")}
                title="PayPal"
                subtitle="1–2 business days"
                icon={
                  <span className="w-12 h-12 rounded-full bg-[#F7C544] flex items-center justify-center">
                    <CreditCard className="text-white" size={20} />
                  </span>
                }
              />
            </div>
          </div>

          {/* BANK DETAILS */}
          {method === "bank" && (
            <BankDetails />
          )}

          {/* PAYPAL DETAILS */}
          {method === "paypal" && (
            <PayPalDetails />
          )}

          {/* NOTES */}
          <div>
            <label className="text-white font-medium">Additional Notes (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-3 bg-[#081435] text-white border border-white/10 p-4 rounded-xl outline-none focus:border-[#29B6F6]"
              placeholder="Add any special instructions..."
            ></textarea>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="accent-[#29B6F6] mt-1"
            />
            <p className="text-sm text-gray-300 leading-6">
              I agree to the{" "}
              <span className="text-[#29B6F6] underline cursor-pointer">
                payment terms and conditions
              </span>{" "}
              and understand a 1.5% processing fee may apply for amounts over $5,000.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button className="px-5 py-3 bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-[#020726] font-semibold rounded-xl flex items-center gap-2 hover:opacity-90 transition">
              <Send size={18} /> Submit Payment Request
            </button>

            <button className="px-5 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition">
              Save as Draft
            </button>
          </div>
        </form>

        {/* SIDEBAR */}
        <Sidebar amount={amount} processingFee={processingFee} tax={tax} totalReceive={totalReceive} deliveryTime={deliveryTime} method={method} />

      </div>

      {/* Tailwind Button Helper */}
      <style>{`
        .btn-dark {
          @apply border border-white/10 text-white py-2 rounded-xl text-sm hover:bg-[#29B6F6] hover:text-[#020726] transition;
        }
      `}</style>

    </div>
  );
};

export default RequestPayment;

/* ---------------------- SUBCOMPONENTS ---------------------- */

const MetricCard = ({ title, value, subtitle, icon, badges }) => (
  <div className="bg-[#0a1039] border border-white/10 rounded-2xl p-6 shadow-lg">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400">{title}</p>
        <h2 className="text-3xl font-semibold text-white">{value}</h2>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      {icon}
    </div>

    <div className="flex gap-2 mt-4 flex-wrap">
      {badges?.map((b, i) => (
        <span key={i} className={`px-3 py-1 rounded-full text-xs ${b.color}`}>
          {b.text}
        </span>
      ))}
    </div>
  </div>
);

const OptionCard = ({ active, onClick, icon, title, subtitle }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-xl flex items-center gap-4 border transition w-full ${
      active ? "border-[#29B6F6] bg-[#29B6F6]/10" : "border-white/10 hover:bg-white/5"
    }`}
  >
    {icon}
    <div className="flex-1">
      <p className="font-medium text-white">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
    <input type="radio" checked={active} readOnly className="accent-[#29B6F6]" />
  </button>
);

const ReadOnlyFieldDark = ({ label, value }) => (
  <div>
    <label className="text-sm text-white">{label}</label>
    <input
      value={value}
      readOnly
      className="w-full bg-[#0a1039] mt-2 px-4 py-3 rounded-xl text-white border border-white/10"
    />
  </div>
);

const BankDetails = () => (
  <div>
    <label className="text-white font-medium">Bank Account Details</label>

    <div className="bg-[#081435] border border-white/10 rounded-xl p-6 mt-3">
      <div className="grid md:grid-cols-2 gap-6">

        <ReadOnlyFieldDark label="Account Holder Name" value="Alex Mora" />
        <ReadOnlyFieldDark label="Account Number" value="**** **** **** 7284" />
        <ReadOnlyFieldDark label="Bank Name" value="Chase Bank" />
        <ReadOnlyFieldDark label="Routing Number" value="*****3210" />

      </div>

      <div className="text-right mt-5">
        <button className="px-4 py-2 rounded-lg border border-[#29B6F6]/40 text-[#29B6F6] hover:bg-[#29B6F6]/10 transition">
          Update Bank Details
        </button>
      </div>
    </div>
  </div>
);

const PayPalDetails = () => (
  <div>
    <label className="text-white font-medium">PayPal Account Details</label>

    <div className="bg-[#081435] border border-white/10 rounded-xl p-6 mt-3">
      <div className="grid md:grid-cols-2 gap-6">

        <ReadOnlyFieldDark label="Account Holder Name" value="Alex Mora" />
        <ReadOnlyFieldDark label="PayPal Email" value="alex.mora@example.com" />
        <ReadOnlyFieldDark label="PayPal ID" value="PP-9823-ABX7" />
        <ReadOnlyFieldDark label="Account Status" value="Verified" />

      </div>

      <div className="text-right mt-5">
        <button className="px-4 py-2 rounded-lg border border-[#29B6F6]/40 text-[#29B6F6] hover:bg-[#29B6F6]/10 transition">
          Update PayPal Details
        </button>
      </div>
    </div>
  </div>
);

const Sidebar = ({ amount, processingFee, tax, totalReceive, deliveryTime, method }) => (
  <div className="xl:col-span-4 space-y-8">

    {/* Payment Summary */}
    <div className="bg-[#0a1039] p-6 border border-white/10 rounded-2xl">
      <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>

      <div className="space-y-4">
        <Row label="Request Amount" value={`$${amount.toLocaleString()}`} />
        <Row label="Processing Fee" value={`$${processingFee.toFixed(2)}`} />
        <Row label="Estimated Tax" value={`$${tax.toFixed(2)}`} />
        <Row label="Payment Method" value={method === "bank" ? "Bank Transfer" : "PayPal"} />
        <Row label="Delivery Time" value={deliveryTime} />

        <div className="border-t border-white/10 pt-4 flex justify-between">
          <span className="font-semibold text-white">Total Receive</span>
          <span className="text-[#29B6F6] text-xl font-bold">
            ${totalReceive.toLocaleString()}
          </span>
        </div>
      </div>
    </div>

    {/* Recent Requests */}
    <div className="bg-[#0a1039] p-6 border border-white/10 rounded-2xl">
      <h3 className="text-xl font-semibold mb-4">Recent Requests</h3>

      <RecentItem
        icon={<CheckCircle size={16} />}
        amount="$8,500.00"
        subtitle="Completed • Dec 15, 2024"
        badgeText="Paid"
        badgeColor="text-emerald-300 bg-emerald-500/20"
      />

      <RecentItem
        icon={<RefreshCcw size={16} />}
        amount="$12,450.00"
        subtitle="Processing • Jan 5, 2025"
        badgeText="Processing"
        badgeColor="text-blue-300 bg-blue-500/20"
      />

      <RecentItem
        icon={<Clock size={16} />}
        amount="$6,200.00"
        subtitle="Pending • Jan 12, 2025"
        badgeText="Pending"
        badgeColor="text-yellow-300 bg-yellow-500/20"
      />
    </div>

    {/* Help */}
    <div className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] p-6 rounded-2xl text-white">
      <div className="flex items-center gap-3">
        <HelpCircle />
        <div>
          <h4 className="font-semibold text-white">Need Help?</h4>
          <p className="text-white/80 text-sm">
            Contact our support team for payment-related questions
          </p>
        </div>
      </div>

      <button className="mt-4 bg-white text-[#020726] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
        <Mail size={14} /> Contact Support
      </button>
    </div>

  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

const RecentItem = ({ icon, amount, subtitle, badgeText, badgeColor }) => (
  <div className="flex items-center gap-4 py-4 border-b border-white/10 last:border-0">
    <span className="w-10 h-10 bg-[#29B6F6] rounded-full flex items-center justify-center text-white">
      {icon}
    </span>

    <div className="flex-1">
      <p className="font-medium text-white">{amount}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>

    <span className={`px-3 py-1 rounded-full text-xs ${badgeColor}`}>
      {badgeText}
    </span>
  </div>
);
