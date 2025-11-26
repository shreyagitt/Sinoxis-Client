// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaRupeeSign, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { useTheme } from "../components/Topbar";

// Dummy songs data
const songs = [
  { title: "Midnight Dreams", artist: "Luna Gray", streams: "1.2M", status: "Trending", badge: "green", release: "Oct 2025" },
  { title: "Echoes of You", artist: "Arion Keys", streams: "980K", status: "Rising", badge: "blue", release: "Sep 2025" },
  { title: "Lost Frequency", artist: "DJ Nova", streams: "750K", status: "New", badge: "yellow", release: "Aug 2025" },
  { title: "Golden Waves", artist: "Violet Sky", streams: "612K", status: "Completed", badge: "green", release: "Jul 2025" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // THEME-ADAPTIVE COLORS
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg = theme === "dark" ? "bg-[#0a1039] border-white/10" : "bg-white border-gray-200";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const searchBg = theme === "dark" ? "bg-[#0a1039] border-white/10 text-gray-300" : "bg-gray-100 border-gray-300 text-[#020726]";
  const boxDark = theme === "dark" ? "bg-[#0d123f] border-white/10" : "bg-gray-100 border-gray-200";

  const statusBg = {
    green: theme === "dark" ? "bg-green-900/40 text-green-300" : "bg-green-100 text-green-700",
    blue: theme === "dark" ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700",
    yellow: theme === "dark" ? "bg-yellow-900/40 text-yellow-300" : "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className={`min-h-screen px-8 py-8 transition-all duration-300 ${pageBg}`}>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className={`text-sm ${textSecondary}`}>
          Home / <span className="text-[#29B6F6]">Dashboard</span>
        </div>
      </div>

      {/* SEARCH + BUTTONS */}
      <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
        <input
          type="text"
          placeholder="Type & Enter to search"
          className={`flex-grow px-6 py-3 rounded-full border ${searchBg}`}
        />

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/releases/create")}
            className="bg-[#29B6F6] hover:bg-[#0288D1] px-6 py-2 rounded-full text-white"
          >
            Create Release
          </button>

          <button
            onClick={() => navigate("/releases/myRelease")}
            className="bg-[#29B6F6] hover:bg-[#0288D1] px-6 py-2 rounded-full text-white"
          >
            My Release
          </button>
        </div>
      </div>

      {/* TOTAL CARDS */}
      <div className="flex justify-between items-center flex-wrap mb-10">
        <div className="flex gap-6 flex-wrap">

          {/* Total Releases */}
          <div className={`p-5 rounded-xl flex gap-3 w-64 border ${cardBg}`}>
            <div className="bg-[#29B6F6] p-3 rounded-lg">
              <FaMusic className="text-white text-xl" />
            </div>
            <div>
              <p className={textSecondary}>Total Releases</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>

          {/* Balance */}
          <div className={`p-5 rounded-xl flex gap-4 w-64 border ${cardBg}`}>
            <div className="bg-[#29B6F6] p-3 rounded-lg">
              <FaRupeeSign className="text-white text-xl" />
            </div>
            <div>
              <p className={textSecondary}>Account Balance</p>
              <p className="text-xl font-bold">₹ 0.00</p>
            </div>
          </div>

        </div>
      </div>

      {/* RECENT RELEASES */}
      <div className={`p-6 rounded-xl border mb-10 ${cardBg}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Releases</h2>
          <button
            onClick={() => navigate("/releases/create")}
            className="bg-[#29B6F6] hover:bg-[#0288D1] px-5 py-2 rounded-full text-white"
          >
            Create Release
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className={`rounded-xl overflow-hidden border ${boxDark}`}>
              <img
                src="https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className={textSecondary}>Artist Name Here</p>
                <p className="text-lg font-semibold">Song Title Here</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <StatCard title="Total Users" value="44,278" percent="5% Last week" color="cyan" theme={theme}/>
        <StatCard title="Total Profit" value="67,987" percent="5% Last week" color="pink" theme={theme}/>
        <StatCard title="Total Expenses" value="$76,965" percent="0.9% Last 9 days" color="green" theme={theme}/>
        <StatCard title="Total Cost" value="$59,765" percent="0.6% Last year" color="yellow" theme={theme}/>
      </div>

      {/* DELIVERIES */}
      <div className={`p-6 rounded-xl border mb-10 ${cardBg}`}>
        <h3 className="text-xl font-semibold mb-6">Deliveries</h3>

        <table className={`w-full text-sm ${textSecondary}`}>
          <thead
            className={`${
              theme === "dark" ? "border-white/10" : "border-gray-200"
            } border-b`}
          >
            <tr>
              <th className="p-3 text-left">Particular</th>
              <th className="p-3 text-left">Percentage</th>
              <th className="p-3 text-right">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className={`border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
              <td className="p-3 text-teal-400 font-medium">On Time Delivery</td>
              <td className="p-3">
                <div className="flex items-center">
                  <div className="h-2 bg-teal-400 w-4/5 rounded-full"></div>
                  <span className="ml-3">80%</span>
                </div>
              </td>
              <td className="p-3 text-right">$45,452.23</td>
            </tr>

            <tr>
              <td className="p-3 text-yellow-400 font-medium">Delayed Delivery</td>
              <td className="p-3">
                <div className="flex items-center">
                  <div className="h-2 bg-yellow-400 w-2/6 rounded-full"></div>
                  <span className="ml-3">15%</span>
                </div>
              </td>
              <td className="p-3 text-right">$15,256.23</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TOP STREAMING SONGS */}
      <div className={`p-6 rounded-xl border ${cardBg}`}>
        <h3 className="text-xl font-semibold mb-6">Top Streaming Songs</h3>

        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${textSecondary}`}>
            <thead className={`${theme === "dark" ? "border-white/10" : "border-gray-200"} border-b uppercase`}>
              <tr>
                <th className="p-3 text-left">Track</th>
                <th className="p-3 text-left">Artist</th>
                <th className="p-3 text-left">Streams</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {songs.map((song, i) => (
                <tr key={i} className={`${theme === "dark" ? "border-white/5" : "border-gray-200"} border-b`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#29B6F6] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                        MG
                      </div>
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-xs">{`Released: ${song.release}`}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-[#29B6F6]" />
                      {song.artist}
                    </div>
                  </td>

                  <td className="p-4 text-blue-400 font-medium">{song.streams}</td>

                  <td className="p-4">
                    <span className={`px-4 py-1 rounded-full text-xs ${statusBg[song.badge]}`}>
                      {song.status}
                    </span>
                  </td>

                  <td className="p-4 text-center flex justify-center gap-4">
                    <button className="text-blue-400 hover:text-blue-300">
                      <FaEdit />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <FaTrash />
                    </button>
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

/* ---------------- STAT CARD COMPONENT ---------------- */
function StatCard({ title, value, percent, color, theme }) {
  const cardBg = theme === "dark" ? "bg-[#0a1039] border-white/10" : "bg-white border-gray-200";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const percentColor = {
    cyan: "text-[#29B6F6]",
    pink: "text-pink-400",
    green: "text-green-400",
    yellow: "text-yellow-500",
  };

  return (
    <div className={`p-6 rounded-xl border flex items-center justify-between ${cardBg}`}>
      <div>
        <p className={textSecondary}>{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className={`mt-1 text-sm ${percentColor[color]}`}>{percent}</p>
      </div>

      {/* ICONS AS THEY WERE */}
      <div className="p-3 rounded-lg bg-white/10">
        {color === "cyan" && (
          <svg width="40" height="40">
            <rect width="8" height="20" x="4" y="14" fill="#29B6F6" />
            <rect width="8" height="30" x="16" y="4" fill="#29B6F6" />
            <rect width="8" height="22" x="28" y="12" fill="#29B6F6" />
          </svg>
        )}

        {color === "pink" && (
          <svg width="40" height="40">
            <path d="M5 25 Q15 5 25 25 T45 25" stroke="#ff4ecd" strokeWidth="3" fill="none" />
          </svg>
        )}

        {color === "green" && (
          <svg width="40" height="40">
            <rect width="8" height="30" x="4" y="6" fill="#4ade80" />
            <rect width="8" height="20" x="16" y="16" fill="#4ade80" />
            <rect width="8" height="28" x="28" y="8" fill="#4ade80" />
          </svg>
        )}

        {color === "yellow" && (
          <svg width="40" height="40">
            <path d="M5 25 Q10 10 20 15 T35 35" stroke="#facc15" strokeWidth="3" fill="none" />
          </svg>
        )}
      </div>
    </div>
  );
}
