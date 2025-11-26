// src/components/ViewReleaseModal.jsx
import React from "react";
import { X, Edit3 } from "lucide-react";
import { useTheme } from "../components/Topbar";

const FieldBlock = ({ label, value, theme }) => {
  const labelColor = theme === "dark" ? "text-gray-300" : "text-[#020726]";
  const boxBg =
    theme === "dark"
      ? "bg-[#111a3b] border border-white/10 text-gray-200"
      : "bg-white border border-gray-200 text-[#020726]";
  return (
    <div className="mt-4">
      <p className={`text-sm ${labelColor}`}>{label}</p>
      <div className={`mt-1 p-3 rounded break-all min-h-[48px] ${boxBg}`}>
        {value || "-"}
      </div>
    </div>
  );
};

export default function ViewReleaseModal({ release, onClose, onEdit }) {
  const { theme } = useTheme();
  if (!release) return null;

  // theme-aware classes
  const overlayBg = theme === "dark" ? "bg-black/70" : "bg-black/30";
  const panelBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10 shadow-xl text-white"
      : "bg-white border border-gray-200 shadow-sm text-[#020726]";
  const headerText = theme === "dark" ? "text-white" : "text-[#020726]";
  const subText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const closeIconColor = theme === "dark" ? "text-gray-300 hover:text-[#29B6F6]" : "text-gray-600 hover:text-[#0288D1]";

  // safe fallback for cover
  const coverSrc =
    release.cover && typeof release.cover === "string"
      ? release.cover
      : "/assets/cover-placeholder.png";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center ${overlayBg} backdrop-blur-sm py-10 overflow-auto`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-[900px] rounded-xl p-6 mx-4 ${panelBg}`}
        style={{ transition: "all .18s ease" }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3"
             style={{ borderColor: theme === "dark" ? "rgba(41,182,246,0.12)" : "rgba(0,0,0,0.04)" }}>
          <h3 className={`text-xl font-semibold ${headerText}`}>Release Details</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(release.id)}
              className={`px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium
                ${theme === "dark"
                  ? "bg-[#29B6F6]/10 border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
                  : "bg-white border border-gray-200 text-[#0288D1] hover:bg-gray-50"}`}
            >
              <Edit3 size={14} />
              Edit
            </button>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded-full"
            >
              <X className={`${closeIconColor} transition`} size={22} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* LEFT COLUMN */}
          <div>
            <FieldBlock label="Release Title" value={release.title} theme={theme} />

            <FieldBlock
              label="Release Date"
              value={release.releaseDate}
              theme={theme}
            />

            <div className="mt-4">
              <p className={`text-sm ${subText}`}>Released Before?</p>
              <div
                className={`mt-1 p-3 rounded ${theme === "dark" ? "bg-[#111a3b] border border-white/10 text-gray-200" : "bg-white border border-gray-200 text-[#020726]"}`}
              >
                {release.releasedBefore ? "Yes" : "No"}
              </div>
            </div>

            <FieldBlock label="Contact Phone" value={release.contactPhone} theme={theme} />
            <FieldBlock label="Short Notes / Bio" value={release.notes} theme={theme} />
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <FieldBlock label="Primary Artist" value={release.artist} theme={theme} />

            <FieldBlock
              label="Tracks / Preview Link"
              value={release.tracksPreview}
              theme={theme}
            />

            <FieldBlock label="Contact Email" value={release.contactEmail} theme={theme} />

            {/* COVER */}
            <div className="mt-4">
              <p className={`text-sm ${subText}`}>Cover Art</p>
              <div className={`mt-2 w-[120px] h-[120px] rounded-xl overflow-hidden ${theme === "dark" ? "bg-[#111a3b] border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                <img
                  src={coverSrc}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/assets/cover-placeholder.png")}
                />
              </div>
            </div>

            {/* STATUS */}
            <FieldBlock label="Status" value={release.status} theme={theme} />
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-8 pt-4"
             style={{ borderTop: theme === "dark" ? "1px solid rgba(41,182,246,0.12)" : "1px solid rgba(0,0,0,0.04)" }}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-full border text-sm font-medium ${theme === "dark" ? "border-white/20 text-gray-300 hover:text-white hover:bg-white/10" : "border-gray-200 text-[#020726] hover:bg-gray-50"}`}
          >
            Close
          </button>

          <button
            onClick={() => onEdit(release.id)}
            className="px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-95 text-white flex items-center gap-2"
          >
            <Edit3 size={14} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}
