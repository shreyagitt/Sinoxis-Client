// src/pages/CopyrightClaim.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Topbar";

const CopyrightClaim = () => {
  const { theme } = useTheme();
  const [openModal, setOpenModal] = useState(false);

  const requests = [
    {
      link: "www.youtube.com/video",
      platform: "YouTube",
      date: "05-11-2025, 06:25 PM",
      status: "Pending",
    },
    {
      link: "www.youtube.com/video",
      platform: "YouTube",
      date: "05-11-2025, 06:25 PM",
      status: "Rejected",
    },
    {
      link: "www.youtube.com/video",
      platform: "YouTube",
      date: "05-11-2025, 06:25 PM",
      status: "Released",
    },
  ];

  const statusClass = (status) => {
    if (status === "Pending") return theme === "dark" ? "bg-yellow-400 text-black" : "bg-yellow-100 text-black";
    if (status === "Rejected") return theme === "dark" ? "bg-red-600 text-white" : "bg-red-100 text-red-700";
    if (status === "Released") return theme === "dark" ? "bg-green-500 text-white" : "bg-green-100 text-green-700";
    return theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800";
  };

  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg = theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const headerText = theme === "dark" ? "text-white" : "text-[#020726]";
  const subText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const btnOutline = theme === "dark"
    ? "border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/20"
    : "border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/10";

  const rowText = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const rowBorder = theme === "dark" ? "border-b border-white/10" : "border-b border-gray-100";
  const tableHeading = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#1b214d] text-white border border-white/10" : "bg-gray-50 text-[#020726] border border-gray-200";

  return (
    <div className={`${pageBg} min-h-screen p-10`}>

      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-semibold ${headerText}`}>Copyright Claim</h1>
        <p className={`${subText}`}>
          Home <span className="text-[#29B6F6"> / Copyright Claim</span>
        </p>
      </div>

      {/* Card */}
      <div className={`${cardBg} rounded-xl p-10 shadow-xl`}>

        {/* Header + Add button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${headerText}`}>Requests</h2>

          <button
            onClick={() => setOpenModal(true)}
            className={`px-5 py-2 rounded-xl transition ${btnOutline}`}
          >
            Add Request
          </button>
        </div>

        {/* TABS */}
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

        {/* Table headings */}
        <div className={`grid grid-cols-4 text-left ${tableHeading} font-medium mb-4`}>
          <div>Link</div>
          <div>Platform</div>
          <div>Requested at</div>
          <div>Status</div>
        </div>

        {/* Rows */}
        <div className="space-y-5">
          {requests.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-4 items-center py-3 ${rowBorder} ${rowText}`}
            >
              <div>
                <a
                  href={`https://${row.link}`}
                  target="_blank"
                  rel="noreferrer"
                  className={theme === "dark" ? "text-sky-300 hover:text-white" : "text-[#0288D1] hover:underline"}
                >
                  {row.link}
                </a>
              </div>

              <div>{row.platform}</div>
              <div>{row.date}</div>
              <div>
                <span className={`px-4 py-1 rounded-full text-sm ${statusClass(row.status)}`}>
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className={`${theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200"} w-full max-w-lg rounded-xl shadow-xl p-6`}>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-lg font-semibold ${headerText}`}>Copyright Claim Removal</h2>
              <button
                onClick={() => setOpenModal(false)}
                className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"}`}
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4">

              <div>
                <label className={`block mb-1 text-sm ${subText}`}>Platform</label>
                <select className={`w-full p-3 rounded-lg ${inputBg}`}>
                  <option value="">Select platform</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 text-sm ${subText}`}>Video Link</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full p-3 rounded-lg ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block mb-1 text-sm ${subText}`}>Notes (optional)</label>
                <textarea
                  rows="3"
                  className={`w-full p-3 rounded-lg ${inputBg}`}
                  placeholder="Explain why this claim should be removed..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className={`${theme === "dark" ? "px-5 py-2 rounded-lg border border-gray-400 text-gray-300" : "px-5 py-2 rounded-lg border border-gray-300 text-gray-700"}`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white font-medium"
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
