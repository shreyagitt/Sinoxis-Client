import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import { useTheme } from "../components/Topbar";

const CopyrightClaim = () => {
  //const { theme } = useTheme();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [openModal, setOpenModal] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    platform: "",
    videoLink: "",
    notes: "",
  });

  // Fetch data
  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/client/copyright-claim`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) setClaims(data.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // Form handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/client/copyright-claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setClaims((prev) => [data.data, ...prev]);
        setFormData({ platform: "", videoLink: "", notes: "" });
        setOpenModal(false);
        alert("Claim submitted successfully!");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Server error");
    }
  };

  // THEME CLASSES
  /*const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10"
      : "bg-white border border-gray-200";
  const headerText = theme === "dark" ? "text-white" : "text-[#020726]";
  const labelText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cellText = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const rowBorder = theme === "dark" ? "border-b border-white/10" : "border-b border-gray-200";
  const inputBg =
    theme === "dark"
      ? "bg-[#1b214d] text-white border border-white/10"
      : "bg-gray-50 text-[#020726] border border-gray-200";*/

  const statusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400 text-black";
      case "Rejected":
        return "bg-red-500 text-white";
      case "Released":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  if (loading)
    return <div className="text-center p-10 text-xl">Loading…</div>;

  return (
    <div className={`bg-white dark:bg-[#020726] text-[#020726] dark:text-white min-h-screen px-4 sm:px-8 lg:px-12 py-6`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-8">
        <h1 className={`text-2xl font-semibold text-[#020726] dark:text-white`}>
          Copyright Claim
        </h1>
        <p className={`text-sm text-gray-600 dark:text-gray-300`}>
          Home <span className="text-[#29B6F6]">/ Copyright Claim</span>
        </p>
      </div>

      {/* Card */}
      <div className={`bg-white dark:bg-[#0a1039] border border-gray-200 dark:border-white/10rounded-xl p-6 sm:p-10 shadow-xl w-full`}>

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h2 className={`text-xl font-semibold text-[#020726] dark:text-white`}>Requests</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="px-6 py-2 rounded-xl border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/20"
          >
            Add Request
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            to="/requests/claim"
            className="px-5 py-2 rounded-full border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
          >
            Copyright Claims
          </Link>

          <Link
            to="/requests/artist"
            className="px-5 py-2 rounded-full border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
          >
            Official Artist Channel
          </Link>
        </div>

        {/* TABLE HEADERS (Only Desktop) */}
<div className="hidden sm:grid grid-cols-4 font-medium text-gray-400 mb-3">
  <div>Link</div>
  <div>Platform</div>
  <div>Requested At</div>
  <div>Status</div>
</div>

{/* TABLE ROWS */}
<div className="space-y-4">
  {claims.map((row) => (
    <div
      key={row._id}
      className={`border ${rowBorder} rounded-lg p-4 
      grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-0 items-start`}
    >

      {/* ==== LINK ==== */}
      <div className="flex flex-col sm:justify-start sm:items-start">
        <span className="text-gray-400 text-xs font-medium sm:hidden">Link</span>
        <a
          href={row.videoLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:underline break-all"
        >
          Visit
        </a>
      </div>

      {/* ==== PLATFORM ==== */}
      <div className="flex flex-col sm:justify-start sm:items-start">
        <span className="text-gray-400 text-xs font-medium sm:hidden">Platform</span>
        <span>{row.platform}</span>
      </div>

      {/* ==== DATE ==== */}
      <div className="flex flex-col sm:justify-start sm:items-start">
        <span className="text-gray-400 text-xs font-medium sm:hidden">Requested At</span>
        <span>{new Date(row.createdAt).toLocaleString()}</span>
      </div>

      {/* ==== STATUS ==== */}
      <div className="flex flex-col sm:justify-start sm:items-start">
        <span className="text-gray-400 text-xs font-medium sm:hidden">Status</span>
        <span
          className={`px-4 py-1 rounded-full text-sm w-max ${statusClass(
            row.status
          )}`}
        >
          {row.status}
        </span>
      </div>

    </div>
  ))}
</div>



      </div>

      {/* =================== MODAL =================== */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div className={`bg-white dark:bg-[#0a1039] border border-gray-200 dark:border-white/10w-full max-w-lg rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto`}>

            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold text-[#020726] dark:text-white`}>
                Submit Copyright Claim
              </h2>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 text-xl"
              >
                ✖
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Platform */}
              <div>
                <label className={`block text-sm mb-1 text-gray-600 dark:text-gray-300`}>
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-gray-50 dark:bg-[#1b214d] text-[#020726] dark:text-white border border-gray-200 dark:border-white/10`}
                >
                  <option value="">Select platform</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              {/* Video Link */}
              <div>
                <label className={`block text-sm mb-1 text-gray-600 dark:text-gray-300`}>
                  Video Link
                </label>
                <input
                  type="url"
                  name="videoLink"
                  value={formData.videoLink}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full p-3 rounded-lg bg-gray-50 dark:bg-[#1b214d] text-[#020726] dark:text-white border border-gray-200 dark:border-white/10`}
                />
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm mb-1 text-gray-600 dark:text-gray-300`}>
                  Notes (optional)
                </label>
                <textarea
                  rows="3"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-gray-50 dark:bg-[#1b214d] text-[#020726] dark:text-white border border-gray-200 dark:border-white/10`}
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  type="button"
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white"
                  style={{ background: "linear-gradient(90deg,#29B6F6,#0288D1)" }}
                >
                  Submit Request
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default CopyrightClaim;

