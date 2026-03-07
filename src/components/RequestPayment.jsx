// src/pages/RequestPayment.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
//import { useTheme } from "./Topbar";

/* =========================
   RequestPayment page
========================= */

const QUICK_AMOUNTS = [1000, 2500, 5000, 10000];

function RequestPayment() {
  //const { theme } = useTheme();

  /* =========================
     ✅ API + AUTH
  ========================= */
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  /* =========================
     ✅ STATE
  ========================= */
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("bank");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankData, setBankData] = useState({
  name: "",
  number: "",
  bank: "",
  routing: "",
});

const [paypalData, setPaypalData] = useState({
  email: "",
  paypalId: "",
});


  // ✅ LIVE DATA FROM ADMIN
  const [balance, setBalance] = useState(15000);
  const [recentRequests, setRecentRequests] = useState([]);

  /* =========================
     ✅ DERIVED VALUES
  ========================= */
  const processingFee = amount > 5000 ? amount * 0.015 : 0;
  const tax = 0;
  const totalReceive = Math.max(0, amount - processingFee - tax);
  const deliveryTime =
    method === "bank" ? "3–5 business days" : "1–2 business days";

  /* =========================
     ✅ FETCH DASHBOARD DATA
  ========================= */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const res = await axios.get(`${baseUrl}/client/payment`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRecentRequests(res.data.data || []);     // ✅ FIXED
    setBalance(res.data.balance || 0);          // ✅ FIXED
  } catch (err) {
    console.error(err);
    toast.error("Failed to load payment data");
  }
};


  /* =========================
     ✅ SUBMIT PAYMENT REQUEST
  ========================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!agree) return toast.error("You must agree to the terms");
  if (amount <= 0) return toast.error("Enter a valid amount");

  if (method === "bank") {
    if (!bankData.name || !bankData.number || !bankData.bank || !bankData.routing) {
      return toast.error("Please fill all bank details");
    }
  }

  if (method === "paypal") {
    if (!paypalData.email || !paypalData.paypalId) {
      return toast.error("Please fill all PayPal details");
    }
  }

  try {
    setLoading(true);

    const payload = {
      amount,
      method,
      notes,
      bankData,
      paypalData,
    };

    await axios.post(`${baseUrl}/client/payment`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Payment request submitted successfully");

    setAmount(0);
    setNotes("");
    setAgree(false);

    setBankData({
      name: "",
      number: "",
      bank: "",
      routing: "",
    });

    setPaypalData({
      email: "",
      paypalId: "",
    });

    fetchDashboardData();
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Payment request failed"
    );
  } finally {
    setLoading(false);
  }
};


  /* =========================
     ✅ THEME STYLES
  ========================= */
  const pageBg = "bg-white dark:bg-[#020726] text-[#020726] dark:text-white";
const cardBg = "bg-white dark:bg-[#0a1039] border border-gray-200 dark:border-white/10";
const subtleText = "text-gray-600 dark:text-gray-300";
const inputBg = "bg-gray-50 dark:bg-[#0a1039] text-[#020726] dark:text-white border border-gray-200 dark:border-white/10";
  const accentText = "text-[#29B6F6]";
  const accentGradient = "from-[#29B6F6] to-[#0288D1]";

  return (
    <div
      className={`p-4 sm:p-6 lg:p-10 min-h-screen transition-colors duration-200 ${pageBg}`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Request Payment
          </h1>
          <p className={`text-sm mt-2 ${subtleText}`}>
            Request payouts from your available balance — secure & quick.
          </p>
        </div>

        <ol className={`flex gap-2 text-sm ${accentText} flex-wrap`}>
          <li className="cursor-pointer">Home</li>
          <li>/</li>
          <li className="font-medium">Request Payment</li>
        </ol>
      </div>

      {/* ================= ✅ SUMMARY CARDS (LIVE BALANCE) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <MetricCard
          
          title="Available Balance"
          value={`$${balance.toLocaleString()}`}
          subtitle="Ready for withdrawal"
          icon={<DollarSign className="w-6 h-6" />}
        />

        <MetricCard
          
          title="Pending Revenue"
          value="$23,768"
          subtitle="Next payout cycle"
          icon={<Clock className="w-6 h-6" />}
        />

        <MetricCard
          
          title="Processing"
          value="$12,450"
          subtitle="Current requests"
          icon={<RefreshCcw className="w-6 h-6" />}
        />

        <MetricCard
          
          title="Total Processed"
          value="$247,890"
          subtitle="All time payments"
          icon={<CheckCircle className="w-6 h-6" />}
        />
      </div>

      {/* ================= MAIN GRID START ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* ================= FORM START ================= */}
        <form
          onSubmit={handleSubmit}
          className={`xl:col-span-8 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm ${cardBg}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h3 className="text-lg sm:text-xl font-semibold">
              New Payment Request
            </h3>
            <span className={`text-sm ${subtleText}`}>Step 1 of 3</span>
          </div>

          {/* ================= AMOUNT ================= */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Request Amount
            </label>

            <div
              className={`flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl p-4 
              bg-gray-50 dark:bg-[#081435] border border-gray-200 dark:border-white/10`}
            >
              <span className={`text-sm ${subtleText}`}>USD</span>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full sm:w-40 text-center text-xl font-semibold focus:outline-none bg-transparent py-1"
                min={0}
              />

              <span className={`text-sm ${subtleText}`}>
                Available: {balance.toLocaleString()}
              </span>
            </div>

            {/* QUICK AMOUNTS */}
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.map((v) => (
                <button
                  key={v}
                  onClick={(e) => {
                    e.preventDefault();
                    setAmount(v);
                  }}
                  className={`px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-white/10 text-[#020726] dark:text-white hover:bg-[#e8f6ff] dark:hover:bg-white/5`}
                >
                  ${v}
                </button>
              ))}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setAmount(balance);
                }}
                  className="px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-white/10 
             text-[#020726] dark:text-white 
             hover:bg-[#e8f6ff] dark:hover:bg-white/5"
              >
                Max
              </button>
            </div>
          </div>

          {/* ================= PAYMENT METHOD ================= */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Payment Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OptionCard
                active={method === "bank"}
                onClick={() => setMethod("bank")}
                title="Bank Transfer"
                icon={<Briefcase size={20} />}
                
              />

              <OptionCard
                active={method === "paypal"}
                onClick={() => setMethod("paypal")}
                title="PayPal"
                icon={<CreditCard size={20} />}
                
              />
            </div>
          </div>

          {/* ================= PAYMENT DETAILS ================= */}
         {method === "bank" && (
  <BankDetails
    
    bankData={bankData}
    setBankData={setBankData}
  />
)}

{method === "paypal" && (
  <PayPalDetails
    
    paypalData={paypalData}
    setPaypalData={setPaypalData}
  />
)}



          {/* ================= NOTES ================= */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full p-4 rounded-xl ${inputBg} focus:outline-none resize-none`}
            />
          </div>

          {/* ================= TERMS ================= */}
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="accent-[#29B6F6] mt-1"
            />
            <p className={`text-sm ${subtleText}`}>
              I agree to the{" "}
              <span className={`${accentText} underline cursor-pointer`}>
                payment terms and conditions
              </span>
            </p>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[#020726] bg-gradient-to-r ${accentGradient} hover:opacity-95 transition disabled:opacity-50`}
            >
              {loading ? "Submitting..." : <><Send size={18} /> Submit Payment Request</>}
            </button>
          </div>
        </form>
        {/* ================= SIDEBAR ================= */}
        <Sidebar
          
          amount={amount}
          processingFee={processingFee}
          tax={tax}
          totalReceive={totalReceive}
          deliveryTime={deliveryTime}
          method={method}
          recentRequests={recentRequests}
        />
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

/* ================= METRIC CARD ================= */
const MetricCard = ({ title, value, subtitle, icon, badges = [] }) => {
  const cardBg = "bg-white dark:bg-[#0a1039] border border-gray-200 dark:border-white/10";

  const toneMap = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className={`rounded-2xl p-4 shadow-sm ${cardBg}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-70">{title}</p>
          <h2 className="text-2xl font-semibold mt-1">{value}</h2>
          <p className="text-xs opacity-60">{subtitle}</p>
        </div>

        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#29B6F6] to-[#0288D1] flex items-center justify-center text-white">
          {icon}
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        {badges.map((b, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full text-xs ${
              toneMap[b.tone]
            }`}
          >
            {b.text}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ================= OPTION CARD ================= */
const OptionCard = ({ active, onClick, icon, title}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`p-4 rounded-xl flex items-center gap-4 border transition w-full ${
       active
  ? "border-[#29B6F6] bg-[#29B6F6]/10"
  : "border-gray-200 dark:border-white/10"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-[#29B6F6]/20 flex items-center justify-center">
        {icon}
      </div>

      <p className="font-medium">{title}</p>
      <input type="radio" checked={active} readOnly />
    </button>
  );
};

const EditableField = ({ label, value, onChange }) => {
  const inputStyle =
  "bg-gray-50 dark:bg-[#0a1039] text-[#020726] dark:text-white border border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-gray-400";

  const labelStyle = "text-[#020726] dark:text-white";

  return (
    <div>
      <label className={`block text-sm mb-2 ${labelStyle}`}>
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        className={`w-full p-3 rounded-xl focus:outline-none ${inputStyle}`}
        placeholder={`Enter ${label}`}
      />
    </div>
  );
};



/* ================= BANK DETAILS ================= */
const BankDetails = ({  bankData, setBankData }) => (

  <div className="mb-6">
    <h4 className="font-semibold mb-3">Bank Account Details</h4>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EditableField
      
        label="Account Holder"
        value={bankData.name}
        onChange={(e) =>
          setBankData({ ...bankData, name: e.target.value })
        }
      />

      <EditableField
      
        label="Account Number"
        value={bankData.number}
        onChange={(e) =>
          setBankData({ ...bankData, number: e.target.value })
        }
      />

      <EditableField
      
        label="Bank Name"
        value={bankData.bank}
        onChange={(e) =>
          setBankData({ ...bankData, bank: e.target.value })
        }
      />

      <EditableField
      
        label="Routing Number"
        value={bankData.routing}
        onChange={(e) =>
          setBankData({ ...bankData, routing: e.target.value })
        }
      />
    </div>
  </div>
);


/* ================= PAYPAL DETAILS ================= */
const PayPalDetails = ({  paypalData, setPaypalData }) => (

  <div className="mb-6">
    <h4 className="font-semibold mb-3">PayPal Account Details</h4>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EditableField
      
        label="PayPal Email"
        value={paypalData.email}
        onChange={(e) =>
          setPaypalData({ ...paypalData, email: e.target.value })
        }
      />

      <EditableField
      
        label="PayPal ID"
        value={paypalData.paypalId}
        onChange={(e) =>
          setPaypalData({ ...paypalData, paypalId: e.target.value })
        }
      />
    </div>
  </div>
);


/* ================= SIDEBAR ================= */
const Sidebar = ({ amount, processingFee, tax, totalReceive, deliveryTime, method, recentRequests }) => {
  const cardBg = "bg-white dark:bg-[#0a1039] border border-gray-200 dark:border-white/10";

  return (
    <aside className="xl:col-span-4 space-y-6">
      {/* ===== PAYMENT SUMMARY ===== */}
      <div className={`rounded-2xl p-5 shadow-sm ${cardBg}`}>
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>

        <div className="space-y-3 text-sm">
          <Row label="Request Amount" value={`$${amount}`} />
          <Row label="Processing Fee" value={`$${processingFee.toFixed(2)}`} />
          <Row label="Estimated Tax" value={`$${tax}`} />
          <Row
            label="Payment Method"
            value={method === "bank" ? "Bank Transfer" : "PayPal"}
          />
          <Row label="Delivery Time" value={deliveryTime} />

          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Total Receive</span>
            <span className="text-xl font-bold text-[#29B6F6]">
              ${totalReceive.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ===== RECENT REQUESTS ===== */}
      <div className={`rounded-2xl p-5 shadow-sm ${cardBg}`}>
        <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>

        {recentRequests.length === 0 && (
          <p className="text-sm opacity-60">No requests yet</p>
        )}

        {recentRequests.map((req) => (
          <RecentItem
            key={req._id}
            amount={`$${req.amount}`}
            subtitle={req.status}
            badgeText={req.status}
          />
        ))}
      </div>

      {/* ===== CONTACT SUPPORT ===== */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{ background: "linear-gradient(90deg,#29B6F6,#0288D1)" }}
      >
        <div className="flex items-start gap-3">
          <HelpCircle />
          <div>
            <h4 className="font-semibold">Need Help?</h4>
            <p className="text-sm">
              Contact our support team for payment-related questions.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open("mailto:support@yourcompany.com")}
          className="mt-4 bg-white text-[#020726] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Mail size={14} /> Contact Support
        </button>
      </div>
    </aside>
  );
};

/* ================= ROW ================= */
const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="opacity-60">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

/* ================= RECENT ITEM ================= */
const RecentItem = ({ amount, subtitle, badgeText }) => (
  <div className="flex items-center gap-4 py-3 border-b">
    <div className="flex-1">
      <p className="font-medium">{amount}</p>
      <p className="text-xs opacity-60">{subtitle}</p>
    </div>

    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
      {badgeText}
    </span>
  </div>
);

export default RequestPayment;
