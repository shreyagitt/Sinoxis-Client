import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Topbar";

const CopyrightClaim = () => {
  const { theme } = useTheme();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [openModal, setOpenModal] = useState(false);

  // API Connected State
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    platform: "",
    videoLink: "",
    notes: "",
  });

  // ===================================================================
  // FETCH CLAIMS FROM API
  // ===================================================================
  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/client/copyright-claim`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setClaims(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // ===================================================================
  // FORM INPUT HANDLER
  // ===================================================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===================================================================
  // SUBMIT NEW CLAIM
  // ===================================================================
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
        alert("Claim submitted successfully!");

        // Add newly created record to UI
        setClaims((prev) => [data.data, ...prev]);

        // Close modal & reset
        setFormData({ platform: "", videoLink: "", notes: "" });
        setOpenModal(false);
      } else {
        alert(data.error || "Failed to submit claim");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // ===================================================================
  // UI THEME STYLES
  // ===================================================================
  const statusClass = (status) => {
    if (status === "Pending")
      return theme === "dark" ? "bg-yellow-400 text-black" : "bg-yellow-100 text-black";
    if (status === "Rejected")
      return theme === "dark" ? "bg-red-600 text-white" : "bg-red-100 text-red-700";
    if (status === "Released")
      return theme === "dark" ? "bg-green-500 text-white" : "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-700";
  };

  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg = theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const headerText = theme === "dark" ? "text-white" : "text-[#020726]";
  const subText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const rowText = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const rowBorder = theme === "dark" ? "border-b border-white/10" : "border-b border-gray-100";
  const tableHeading = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#1b214d] text-white border border-white/10" : "bg-gray-50 text-[#020726] border border-gray-200";

  if (loading) {
    return (
      <div className={`p-10 text-center text-xl ${headerText}`}>
        Loading...
      </div>
    );
  }

  return (
    <div className={`${pageBg} min-h-screen p-10`}>

      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-semibold ${headerText}`}>Copyright Claim</h1>
        <p className={`${subText}`}>
          Home <span className="text-[#29B6F6]">/ Copyright Claim</span>
        </p>
      </div>

      {/* Card Container */}
      <div className={`${cardBg} rounded-xl p-10 shadow-xl`}>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${headerText}`}>Requests</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 rounded-xl border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/20 transition"
          >
            Add Request
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <Link
            to="/requests/claim"
            className="px-5 py-2 rounded-full border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white transition"
          >
            Copyright Claims
          </Link>

          <Link
            to="/requests/artist"
            className="px-5 py-2 rounded-full border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white transition"
          >
            Official Artist Channel
          </Link>
        </div>

        {/* Table Headings */}
        <div className={`grid grid-cols-4 text-left ${tableHeading} font-medium mb-4`}>
          <div>Link</div>
          <div>Platform</div>
          <div>Requested at</div>
          <div>Status</div>
        </div>

        {/* Rows */}
        <div className="space-y-5">
          {claims.map((row) => (
            <div
              key={row._id}
              className={`grid grid-cols-4 items-center py-3 ${rowBorder} ${rowText}`}
            >
              <div>
                <a
                  href={row.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Visit
                </a>
              </div>

              <div>{row.platform}</div>

              <div>{new Date(row.createdAt).toLocaleString()}</div>

              <div>
                <span className={`px-4 py-1 rounded-full text-sm ${statusClass(row.status)}`}>
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================== MODAL ================== */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className={`${cardBg} w-full max-w-lg rounded-xl shadow-xl p-6`}>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-lg font-semibold ${headerText}`}>Submit Copyright Claim</h2>
              <button
                onClick={() => setOpenModal(false)}
                className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
              >
                ✖
              </button>
            </div>

            {/* API Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className={`block mb-1 text-sm ${subText}`}>Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg ${inputBg}`}
                >
                  <option value="">Select platform</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 text-sm ${subText}`}>Video Link</label>
                <input
                  type="url"
                  name="videoLink"
                  value={formData.videoLink}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full p-3 rounded-lg ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block mb-1 text-sm ${subText}`}>Notes (optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full p-3 rounded-lg ${inputBg}`}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600"
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
