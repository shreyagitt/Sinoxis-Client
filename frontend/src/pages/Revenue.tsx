import React, { useState } from "react";
import { Edit, Trash2, CheckCircle2, Clock, XCircle, Send } from "lucide-react";

const RevenueManagementPage = () => {
  const [activeTab, setActiveTab] = useState("reportsList");

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "January Report",
      total: 4500,
      status: "Approved",
      date: "2025-01-31",
    },
    {
      id: 2,
      title: "February Report",
      total: 3800,
      status: "Pending",
      date: "2025-02-28",
    },
    {
      id: 3,
      title: "March Report",
      total: 5200,
      status: "Rejected",
      date: "2025-03-31",
    },
  ]);

  const [form, setForm] = useState({ amount: "", method: "", note: "" });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleEdit = (item: any) => {
    const newTitle = prompt("Edit Report Title:", item.title);
    if (newTitle) {
      setReports((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, title: newTitle } : r))
      );
    }
  };

  const totalRevenue = reports
    .filter((r) => r.status === "Approved")
    .reduce((sum, r) => sum + r.total, 0);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.method) {
      alert("Please fill all required fields!");
      return;
    }
    alert(`Payment Request Submitted: $${form.amount} via ${form.method}`);
    setForm({ amount: "", method: "", note: "" });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      Approved: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Rejected: "bg-red-100 text-red-700",
    };
    const icons = {
      Approved: <CheckCircle2 size={16} />,
      Pending: <Clock size={16} />,
      Rejected: <XCircle size={16} />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${colors[status]}`}
      >
        {icons[status]} {status}
      </span>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "reportsList":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
              <thead className="bg-green-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Report Title</th>
                  <th className="px-4 py-2 text-left">Total Revenue</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{r.title}</td>
                    <td className="px-4 py-2">${r.total}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(r)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "totalRevenue":
        return (
          <div className="text-center py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Total Revenue Overview
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Only approved reports are counted towards total revenue.
            </p>
            <div className="bg-green-100 text-green-700 inline-block px-8 py-4 rounded-2xl shadow-md text-3xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
          </div>
        );

      case "requestPayment":
        return (
          <form
            onSubmit={handlePaymentSubmit}
            className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Request Payment
            </h2>

            <label className="block mb-3">
              <span className="text-gray-700 font-medium">Amount ($)</span>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="Enter amount"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-medium">Payment Method</span>
              <select
                value={form.method}
                onChange={(e) =>
                  setForm({ ...form, method: e.target.value })
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none"
                required
              >
                <option value="">Select Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
                <option value="UPI">UPI</option>
              </select>
            </label>

            <label className="block mb-4">
              <span className="text-gray-700 font-medium">Note (Optional)</span>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none"
                rows={3}
                placeholder="Add remarks or payment details"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
            >
              <Send size={18} /> Submit Request
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Revenue Management
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-10 mb-6 border-b-2 border-green-500 pb-2">
        {[
          { key: "reportsList", label: "Revenue Reports List" },
          { key: "totalRevenue", label: "Total Revenue" },
          { key: "requestPayment", label: "Request Payment" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`pb-2 px-2 text-lg font-medium transition ${
              activeTab === tab.key
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white shadow-md rounded-lg p-6">{renderContent()}</div>
    </div>
  );
};

export default RevenueManagementPage;

