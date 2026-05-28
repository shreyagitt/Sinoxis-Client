// src/components/ViewReleaseModal.jsx
import React, { useEffect, useState } from "react";

import { X, Edit3 } from "lucide-react";
//import { useTheme } from "../components/Topbar";

const FieldBlock = ({ label, value }) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-[#020726] dark:text-gray-300">{label}</p>

      <div className="mt-1 p-3 rounded break-words min-h-[48px] bg-white dark:bg-[#111a3b] border border-gray-200 dark:border-white/10 text-[#020726] dark:text-gray-200">
        {value || "-"}
      </div>
    </div>
  );
};



export default function ViewReleaseModal({
  release,
  track,
  stores,
  onClose,
  onEdit,
}) {
const fullRelease = release;

  //const { theme } = useTheme();

/*
  const overlayBg = theme === "dark" ? "bg-black/70" : "bg-black/40";
  const panelBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10 text-white"
      : "bg-white border border-gray-200 text-[#020726]";

  const closeIconColor =
    theme === "dark"
      ? "text-gray-300 hover:text-[#29B6F6]"
      : "text-gray-600 hover:text-[#0288D1]";

  const subText = theme === "dark" ? "text-gray-300" : "text-gray-600";*/

  // ✅ FINAL IMAGE RESOLUTION LOGIC (UPLOAD SAFE)
  const coverSrc =
    fullRelease?.cover?.startsWith("http")
      ? fullRelease.cover
      : "/assets/cover-placeholder.png";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
    >
      <div
        className={`
          w-full max-w-[900px] max-h-[90vh]
          overflow-y-auto rounded-xl p-6 
          shadow-xl relative bg-white dark:bg-[#0a1039] border border-gray-200 dark:border-white/10 text-[#020726] dark:text-white
          scrollbar-thin scrollbar-thumb-gray-400/40 scrollbar-track-transparent
        `}
      >
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className={`absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-[#0288D1] dark:hover:text-[#29B6F6]`}>
          <X size={22} />
        </button>

        

        {fullRelease && (
          <>
            {/* HEADER */}
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 dark:border-[#29B6F6]/20 pb-3"
            >
              <h3 className="text-xl font-semibold">Release Details</h3>

              <button
                onClick={() => onEdit(fullRelease._id)}
                className={`
                  px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium
                  bg-white dark:bg-[#29B6F6]/10 border border-gray-300 dark:border-[#29B6F6] text-[#0288D1] dark:text-[#29B6F6] hover:bg-gray-50 dark:hover:bg-[#29B6F6] dark:hover:text-white
                `}
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* LEFT */}
              <div>
                <FieldBlock label="Track Title" value={track?.trackTitle}  />
<FieldBlock label="ISRC" value={track?.isrc}  />
<FieldBlock label="Language" value={track?.language}  />
<FieldBlock label="Publisher" value={track?.publisher}  />

              </div>

              {/* RIGHT */}
              <div>
                <FieldBlock
  label="Writers"
  value={track?.writers?.join(", ")}
  
/>

<FieldBlock
  label="Composers"
  value={track?.composers?.join(", ")}
  
/>

<FieldBlock
  label="Music Directors"
  value={track?.musicDirectors?.join(", ")}
  
/>

<FieldBlock
  label="Producers"
  value={track?.producers?.join(", ")}
  
/>

<FieldBlock
  label="Stores"
  value={stores?.length ? stores.join(", ") : "-"}
  
/>

              </div>
            </div>

            {/* FOOTER */}
            <div
             className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-[#29B6F6]/20"
            >
              <button
                onClick={onClose}
                className={`
                  px-6 py-2 rounded-full border text-sm
                 border-gray-300 dark:border-white/20 text-[#020726] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10
                `}
              >
                Close
              </button>

              <button
                onClick={() => onEdit(fullRelease._id)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white text-sm"
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
