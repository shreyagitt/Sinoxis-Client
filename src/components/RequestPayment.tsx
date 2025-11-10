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

const RequestPayment: React.FC = () => {
  const [amount, setAmount] = useState<number>(5000);
  const [method, setMethod] = useState<"bank" | "paypal">("bank");
  const [notes, setNotes] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);

  // derived
  const processingFee = amount > 5000 ? amount * 0.015 : 0;
  const tax = 0;
  const totalReceive = Math.max(0, amount - processingFee - tax);
  const deliveryTime = method === "bank" ? "3-5 business days" : "1-2 business days";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert("Please agree to the terms to continue.");
      return;
    }
    alert(
      `Submitted!\nAmount: $${amount.toLocaleString()}\nMethod: ${method}\nNotes: ${notes || "-"}`
    );
  };

  return (
    <div className="p-6 md:p-8 bg-[#f7f9fc] min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Request Payment</h1>
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li className="hover:text-red-600 cursor-pointer">Home</li>
          <li>/</li>
          <li className="hover:text-red-600 cursor-pointer">Revenue Reports</li>
          <li>/</li>
          <li className="text-red-600 font-medium">Request Payment</li>
        </ol>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Available Balance"
          value="$89,452"
          subtitle="Ready for withdrawal"
          icon={<DollarSign className="w-8 h-8 text-emerald-500" />}
          badges={[
            { text: "Available Now", tone: "emerald" },
            { text: "Minimum: $50", tone: "red" },
          ]}
        />
        <MetricCard
          title="Pending Revenue"
          value="$23,768"
          subtitle="Next payout cycle"
          icon={<Clock className="w-8 h-8 text-amber-500" />}
          badges={[
            { text: "Processing", tone: "amber" },
            { text: "Due: 15th", tone: "blue" },
          ]}
        />
        <MetricCard
          title="Processing"
          value="$12,450"
          subtitle="Current requests"
          icon={<RefreshCcw className="w-8 h-8 text-blue-500" />}
          badges={[
            { text: "2 Requests", tone: "blue" },
            { text: "3-5 Days", tone: "emerald" },
          ]}
        />
        <MetricCard
          title="Total Processed"
          value="$247,890"
          subtitle="All time payments"
          icon={<CheckCircle className="w-8 h-8 text-red-500" />}
          badges={[
            { text: "48 Payments", tone: "red" },
            { text: "100% Success", tone: "emerald" },
          ]}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="xl:col-span-8 bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">New Payment Request</h3>
            <span className="text-sm text-gray-500">Step 1 of 3</span>
          </div>

          {/* Amount */}
          <div>
            <label className="font-medium text-gray-700">Request Amount</label>

            {/* Amount display row */}
            <div className="bg-gray-50 rounded-lg mt-2 border">
              <div className="flex items-center justify-between px-4 py-4 text-center">
                <span className="text-gray-500 text-sm">USD</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="amount-input w-40 text-center bg-white border rounded-lg px-3 py-2 text-lg font-semibold text-gray-800 outline-none focus:border-red-500"
                    value={amount}
                    min={0}
                    onChange={(e) => {
                      const v = Number(e.target.value || 0);
                      setAmount(v);
                    }}
                  />
                </div>
                <span className="text-gray-500 text-sm">Max: ${MAX_BALANCE.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick amounts */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(a)}
                  className="btn-like"
                >
                  ${a.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(MAX_BALANCE)}
                className="btn-like"
              >
                Max
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="font-medium text-gray-700">Payment Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <OptionCard
                active={method === "bank"}
                onClick={() => setMethod("bank")}
                icon={
                  <span className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                    <Briefcase size={18} />
                  </span>
                }
                title="Bank Transfer"
                subtitle="3-5 business days"
              />
              <OptionCard
                active={method === "paypal"}
                onClick={() => setMethod("paypal")}
                icon={
                  <span className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                    <CreditCard size={18} />
                  </span>
                }
                title="PayPal"
                subtitle="1-2 business days"
              />
            </div>
          </div>

          {/* Bank Details */}
          {method === "bank" && (
            <div>
              <label className="font-medium text-gray-700">Bank Account Details</label>
              <div className="border rounded-xl mt-2">
                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Account Holder Name" value="Alex Mora" />
                    <ReadOnlyField label="Account Number" value="**** **** **** 7284" />
                    <ReadOnlyField label="Bank Name" value="Chase Bank" />
                    <ReadOnlyField label="Routing Number" value="*****3210" />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      className="mt-3 border rounded-md px-3 py-1.5 text-sm hover:bg-red-50 hover:border-red-600"
                    >
                      Update Bank Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PayPal Details */}
          {method === "paypal" && (
            <div>
              <label className="font-medium text-gray-700">PayPal Account</label>
              <div className="border rounded-xl mt-2 p-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                    <CreditCard size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">alex.mora@example.com</div>
                    <small className="text-gray-500">Primary PayPal account</small>
                  </div>
                  <button
                    type="button"
                    className="border rounded-md px-3 py-1.5 text-sm hover:bg-red-50 hover:border-red-600"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="font-medium text-gray-700">
              Additional Notes <span className="text-gray-400 text-sm">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg p-3 mt-2 outline-none focus:border-red-500"
              placeholder="Add any special instructions or notes for this payment request..."
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <span className="text-red-600 hover:underline cursor-pointer">
                payment terms and conditions
              </span>
              . I understand that processing may take 3–5 business days and a 1.5% processing fee may
              apply for amounts over $5,000.
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Send size={16} /> Submit Payment Request
            </button>
            <button
              type="button"
              className="border px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Save as Draft
            </button>
          </div>
        </form>

        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          {/* Payment Summary */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Payment Summary</h3>
            </div>
            <div className="p-5 space-y-3">
              <Row label="Request Amount" value={`$${amount.toLocaleString()}`} />
              <Row label="Processing Fee" value={`$${processingFee.toFixed(2)}`} />
              <Row label="Estimated Tax" value={`$${tax.toFixed(2)}`} />
              <Row label="Payment Method" value={method === "bank" ? "Bank Transfer" : "PayPal"} />
              <Row label="Delivery Time" value={deliveryTime} />
              <div className="pt-3 mt-1 border-t flex items-center justify-between">
                <span className="font-semibold">Total Receive</span>
                <span className="text-xl font-bold text-red-600">
                  ${totalReceive.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                The final amount you will receive after deductions
              </p>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Recent Requests</h3>
            </div>
            <div className="divide-y">
              <RecentItem
                tone="emerald"
                icon={<CheckCircle size={16} />}
                amount="$8,500.00"
                subtitle="Completed • Dec 15, 2024"
                badgeText="Paid"
              />
              <RecentItem
                tone="blue"
                icon={<RefreshCcw size={16} />}
                amount="$12,450.00"
                subtitle="Processing • Jan 5, 2025"
                badgeText="Processing"
              />
              <RecentItem
                tone="amber"
                icon={<Clock size={16} />}
                amount="$6,200.00"
                subtitle="Pending • Jan 12, 2025"
                badgeText="Pending"
              />
            </div>
          </div>

          {/* Help */}
          <div className="bg-red-600 text-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <HelpCircle />
              <div>
                <h4 className="font-semibold">Need Help?</h4>
                <p className="text-white/80 text-sm">
                  Contact our support team for payment-related questions
                </p>
              </div>
            </div>
            <button className="mt-4 bg-white text-red-600 px-3 py-2 text-sm rounded-lg inline-flex items-center gap-2">
              <Mail size={14} /> Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind helpers */}
      <style>{`
        .btn-like {
          @apply border rounded-lg py-2 text-sm hover:bg-red-600 hover:text-white transition;
        }
      `}</style>
    </div>
  );
};

export default RequestPayment;

/* --------------------------------
 * Small UI subcomponents
 * -------------------------------- */

const tones: Record<string, string> = {
  red: "bg-red-50 text-red-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  badges: { text: string; tone: keyof typeof tones }[];
}> = ({ title, value, subtitle, icon, badges }) => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-semibold text-gray-800">{value}</h2>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      {icon}
    </div>
    <div className="flex flex-wrap gap-2 mt-3">
      {badges.map((b) => (
        <span
          key={b.text}
          className={`px-2 py-1 text-xs rounded-full ${tones[b.tone]}`}
        >
          {b.text}
        </span>
      ))}
    </div>
  </div>
);

const OptionCard: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ active, onClick, icon, title, subtitle }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left p-4 border rounded-xl w-full flex items-center gap-3 transition ${
      active ? "border-red-600 bg-red-50" : "hover:bg-gray-50"
    }`}
  >
    {icon}
    <div className="flex-1">
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
    <input type="radio" checked={active} readOnly />
  </button>
);

const ReadOnlyField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      readOnly
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
      value={value}
    />
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const RecentItem: React.FC<{
  tone: "emerald" | "blue" | "amber";
  icon: React.ReactNode;
  amount: string;
  subtitle: string;
  badgeText: string;
}> = ({ tone, icon, amount, subtitle, badgeText }) => {
  const dotBg =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "blue"
      ? "bg-blue-500"
      : "bg-amber-500";
  const badge =
    tone === "emerald"
      ? "text-emerald-600 bg-emerald-50"
      : tone === "blue"
      ? "text-blue-600 bg-blue-50"
      : "text-amber-600 bg-amber-50";

  return (
    <div className="p-4 flex items-center gap-3">
      <span
        className={`w-8 h-8 ${dotBg} text-white flex items-center justify-center rounded-full`}
      >
        {icon}
      </span>
      <div className="flex-1 text-sm">
        <div className="font-medium">{amount}</div>
        <small className="text-gray-500">{subtitle}</small>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${badge}`}>{badgeText}</span>
    </div>
  );
};

