// src/components/ViewReleaseModal.jsx
import React from "react";
import { X, Edit3 } from "lucide-react";

export default function ViewReleaseModal({ release, onClose, onEdit }) {
  if (!release) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 py-10 overflow-auto">
      <div className="bg-[#0a1039] w-[820px] rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-xl font-semibold">View Release</h3>
          <button onClick={onClose}><X className="text-gray-300 hover:text-white" /></button>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <p className="text-sm text-gray-300">Cover Art</p>
            <div className="mt-2 w-full flex flex-col items-center">
              <div className="w-[220px] h-[220px] rounded-lg overflow-hidden bg-gray-700 border border-white/5">
                <img src={release.cover || "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"} alt="cover" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <p className="text-sm text-gray-300">Release Title</p>
            <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded">{release.title}</div>

            <p className="text-sm text-gray-300 mt-4">Primary Artist</p>
            <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded">{release.artist}</div>

            <p className="text-sm text-gray-300 mt-4">Label</p>
            <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded">{release.label || "-"}</div>

            <p className="text-sm text-gray-300 mt-4">ISRC</p>
            <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded">{release.isrc || "-"}</div>

            <p className="text-sm text-gray-300 mt-4">UPC</p>
            <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded">{release.upc || "-"}</div>

            <p className="text-sm text-gray-300 mt-4">Tracks / Preview</p>
            <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded break-all">{release.tracksPreview || "-"}</div>

            <p className="text-sm text-gray-300 mt-4">Notes</p>
            <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded">{release.notes || "-"}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
          <button onClick={onClose} className="px-6 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white">Close</button>
          <button onClick={onEdit} className="px-6 py-2 rounded-full bg-amber-500/10 border border-amber-400 text-amber-300 hover:bg-amber-400 flex items-center gap-2">
            <Edit3 size={14} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}
