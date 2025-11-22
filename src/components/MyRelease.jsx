import React from "react";
import { Edit3, Eye } from "lucide-react";

export default function Releases() {
  return (
    <div className="min-h-screen bg-[#020726] text-white px-6 py-8">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-semibold">My Releases</h1>

        <div className="text-sm">
          <span className="text-gray-300">Home / </span>
          <span className="text-[#29B6F6]">My Releases</span>
        </div>
      </div>

      {/* RELEASE COUNT */}
      <div className="bg-[#0a1039] p-6 rounded-xl border border-white/10">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h6 className="font-semibold text-base">Release Count</h6>

          <div className="flex items-center gap-1">
            <span>1</span>
            <span>/</span>
            <span>10</span>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "All",
            "Approved",
            "Pending",
            "Action Required",
            "Unfinished",
            "Rejected",
          ].map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 rounded-md border border-[#0A84FF] text-[#0A84FF] hover:bg-[#0A84FF]/10"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* MANAGE RELEASES CARD */}
      <div className="bg-[#0f1b36] rounded-2xl p-6 border border-white/10 shadow mt-6">

        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Manage Releases</h2>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type & Enter to search"
              className="px-4 py-2 rounded-full bg-[#0a1039] border border-white/20 text-white placeholder-gray-400 focus:outline-none"
            />

            <button
              className="px-5 py-2 rounded-full text-white font-semibold"
              style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}
            >
              Create Release
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-white/10">
                <th className="py-3 px-4">Cover Art</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Artist</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">ISRC</th>
                <th className="py-3 px-4">UPC</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {[
                {
                  title: "Demo Song Title",
                  artist: "Demo Artist",
                  label: "Demo Label",
                  isrc: "INSI32500000",
                  upc: "744662977286",
                  status: "Rejected",
                  color: "bg-red-500/20 text-red-400",
                },
                {
                  title: "Demo Song Title",
                  artist: "Demo Artist",
                  label: "Demo Label",
                  isrc: "INSI32500000",
                  upc: "744662977286",
                  status: "Inactive",
                  color: "bg-blue-500/20 text-blue-400",
                },
                {
                  title: "Demo Song Title",
                  artist: "Demo Artist",
                  label: "Demo Label",
                  isrc: "INSI32500000",
                  upc: "744662977286",
                  status: "Pending",
                  color: "bg-yellow-500/20 text-yellow-400",
                },
                {
                  title: "Demo Song Title",
                  artist: "Demo Artist",
                  label: "Demo Label",
                  isrc: "INSI32500000",
                  upc: "744662977286",
                  status: "Approved",
                  color: "bg-green-500/20 text-green-400",
                },
              ].map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src="https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>

                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.artist}</td>
                  <td className="px-4 py-3">{r.label}</td>
                  <td className="px-4 py-3">{r.isrc}</td>
                  <td className="px-4 py-3">{r.upc}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${r.color}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="w-10 h-10 flex items-center justify-center border border-amber-400 rounded-full hover:bg-amber-400 group">
                        <Edit3 size={18} className="text-amber-300 group-hover:text-white" />
                      </button>

                      <button className="w-10 h-10 flex items-center justify-center border border-sky-500 rounded-full hover:bg-sky-500 group">
                        <Eye size={18} className="text-sky-400 group-hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
