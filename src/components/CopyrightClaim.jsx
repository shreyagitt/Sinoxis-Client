import React, { useState } from "react";
import { Link } from "react-router-dom"; 

const CopyrightClaim = () => {
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

  const statusColor = {
    Pending: "bg-yellow-400 text-black",
    Rejected: "bg-red-600 text-white",
    Released: "bg-green-500 text-white",
  };

  return (
    <div className="min-h-screen bg-[#020726] text-white p-10">

      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Copyright Claim</h1>
        <p className="text-gray-300">
          Home <span className="text-[#29B6F6]"> / Copyright Claim</span>
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#0a1039] rounded-xl p-10 border border-white/10 shadow-xl">

        {/* Header + Add button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Requests</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 rounded-xl border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/20 transition"
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

        {/* Table */}
        <div className="grid grid-cols-4 text-left text-gray-10 font-medium mb-4">
          <div>Link</div>
          <div>Platform</div>
          <div>Requested at</div>
          <div>Status</div>
        </div>

        <div className="space-y-5">
          {requests.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 items-center py-3 border-b border-white/10 text-gray-200"
            >
              <div>{row.link}</div>
              <div>{row.platform}</div>
              <div>{row.date}</div>
              <div>
                <span
                  className={`px-4 py-1 rounded-full text-sm ${statusColor[row.status]}`}
                >
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
          <div className="bg-[#0a1039] w-full max-w-lg rounded-xl shadow-xl border border-white/10 p-6">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold">Copyright Claim Removal</h2>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-300 hover:text-white"
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4">

              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Platform
                </label>
                <select className="w-full p-3 rounded-lg bg-[#1b214d] text-white border border-white/10">
                  <option value="">Select platform</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Video Link
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 rounded-lg bg-[#1b214d] text-white border border-white/10"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Notes (optional)
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3 rounded-lg bg-[#1b214d] text-white border border-white/10"
                  placeholder="Explain why this claim should be removed..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-400 text-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#29B6F6] to-[#0288D1]"
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
