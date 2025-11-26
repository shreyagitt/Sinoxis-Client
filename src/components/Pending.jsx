// src/pages/Pending.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewReleaseModal from "../components/ViewReleaseModal";
import { useTheme } from "../components/Topbar"; // 🌗 THEME

const STORAGE_KEY = "my_releases_v1";

const readFromStorage = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

/* ------------------------- Status Pill ------------------------- */
const StatusPill = ({ status = "Pending" }) => (
  <span
    className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold"
    style={{
      width: "fit-content",
      background: "#F4C20D", // Yellow same as your screenshot
      color: "black",
    }}
  >
    {status}
  </span>
);

export default function Pending() {
  const navigate = useNavigate();
  const { theme } = useTheme(); // 🌗 GET THEME

  /* ------------------------- THEME COLORS ------------------------- */
  const pageBg =
    theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";

  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-gray-100 border-gray-300";

  const inputBg =
    theme === "dark"
      ? "bg-[#1f233d] text-white placeholder-gray-400 border-white/10"
      : "bg-gray-200 text-[#020726] placeholder-gray-600 border-gray-300";

  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const borderSoft = theme === "dark" ? "border-[#0d133d]" : "border-gray-300";

  /* ------------------------- STATES ------------------------- */
  const [releases, setReleases] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRelease, setActiveRelease] = useState(null);

  /* ------------------------- LOAD DATA ------------------------- */
  useEffect(() => {
    const list = readFromStorage();
    const pendingOnly = list.filter((r) => r.status === "Pending");
    setReleases(pendingOnly);
  }, []);

  const openCreate = () => navigate("/releases/create");
  const openEdit = (id) => navigate(`/releases/edit/${id}`);

  const openModal = (release) => {
    setActiveRelease(release);
    setModalOpen(true);
  };

  const closeModal = () => {
    setActiveRelease(null);
    setModalOpen(false);
  };

  return (
    <div className={`min-h-screen px-10 py-8 transition-all duration-300 ${pageBg}`}>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pending</h1>

        <div className="text-right">
          <nav className="text-md">
            <span className={subtleText}>Home</span>
            <span className="mx-1">/</span>
            <span className="text-[#29B6F6] font-medium">Pending</span>
          </nav>
        </div>
      </div>

      {/* SEARCH + CREATE */}
      <div className="flex items-center justify-between mt-10 gap-4">
        <input
          type="text"
          placeholder="Type & Enter to search"
          className={`w-full rounded-full px-5 py-3 outline-none border ${inputBg}`}
        />

        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] px-6 py-3 text-white rounded-full font-medium hover:opacity-90"
        >
          Create
        </button>
      </div>

      {/* RELEASE COUNT */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-lg font-semibold">Release Count</h2>
        <p className={subtleText}>{releases.length} / 10</p>
      </div>

      {/* EMPTY STATE */}
      {releases.length === 0 && (
        <div className={`text-center mt-20 text-lg ${subtleText}`}>
          No pending releases found.
        </div>
      )}

      {/* GRID */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {releases.map((release) => (
          <div
            key={release.id}
            className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 ${cardBg}`}
          >
            {/* IMAGE */}
            <img
              src={
                release.cover ||
                "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
              }
              alt="cover"
              className="w-full h-44 object-cover"
            />

            {/* CONTENT */}
            <div className="p-5">
              <p className={`text-sm ${subtleText}`}>
                {release.subtitle || "Music Release"}
              </p>

              <h2 className="font-bold text-xl tracking-wide">
                {release.title}
              </h2>

              <div className="flex justify-between items-center mt-5">
                {/* ⭐ STATUS PILL */}
                <StatusPill status="Pending" />

                {/* VIEW BUTTON */}
                <button
                  onClick={() => openModal(release)}
                  className={`
                    px-4 py-1 rounded-md text-sm border transition-all duration-300
                    ${
                      theme === "dark"
                        ? "border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
                        : "border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1] hover:text-white"
                    }
                  `}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {modalOpen && (
        <ViewReleaseModal
          release={activeRelease}
          onClose={closeModal}
          onEdit={(id) => openEdit(id)}
        />
      )}
    </div>
  );
}
