import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaRupeeSign, FaUser, FaEdit, FaTrash } from "react-icons/fa";

const songs = [
  { title: "Midnight Dreams", artist: "Luna Gray", streams: "1.2M", status: "Trending", color: "green", release: "Oct 2025" },
  { title: "Echoes of You", artist: "Arion Keys", streams: "980K", status: "Rising", color: "blue", release: "Sep 2025" },
  { title: "Lost Frequency", artist: "DJ Nova", streams: "750K", status: "New", color: "yellow", release: "Aug 2025" },
  { title: "Golden Waves", artist: "Violet Sky", streams: "612K", status: "Completed", color: "green", release: "Jul 2025" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020726] text-white px-8 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className="text-sm text-gray-300">
          Home / <span className="text-[#29B6F6]">Dashboard</span>
        </div>
      </div>

      {/* SEARCH + BUTTONS */}
      <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
        <input
          type="text"
          placeholder="Type & Enter to search"
          className="flex-grow bg-[#0a1039] border border-white/10 px-6 py-3 rounded-full text-gray-300"
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

      {/* SUMMARY + BUTTONS */}
      <div className="flex justify-between items-center flex-wrap mb-10">
        
        {/* Summary Cards */}
        <div className="flex gap-6 flex-wrap">

          {/* Total Releases */}
          <div className="bg-[#0a1039] p-5 rounded-xl border border-white/10  items-center flex gap-3 mt-4 md:mt-0 w-64">
            <div className="bg-[#29B6F6] p-3 rounded-lg">
              <FaMusic className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Releases</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>

          {/* Account Balance */}
          <div className="bg-[#0a1039] p-5 rounded-xl border border-white/10 flex items-center gap-4 w-64">
            <div className="bg-[#29B6F6] p-3 rounded-lg">
              <FaRupeeSign className="text-white text-xl bg-[#29B6F6]" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Account Balance</p>
              <p className="text-xl font-bold">₹ 0.00</p>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT RELEASES */}
      <div className="bg-[#0a1039] p-6 rounded-xl border border-white/10 mb-10">
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
          {[1,2,3,4].map((_, i) => (
            <div key={i} className="bg-[#0d123f] rounded-xl overflow-hidden border border-white/5">
              <img
                src="https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-300">Artist Name Here</p>
                <p className="text-lg font-semibold">Song Title Here</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <StatCard
          title="Total Users"
          value="44,278"
          percent="5% Last week"
          color="cyan"
        />

        <StatCard
          title="Total Profit"
          value="67,987"
          percent="5% Last week"
          color="pink"
        />

        <StatCard
          title="Total Expenses"
          value="$76,965"
          percent="0.9% Last 9 days"
          color="green"
        />

        <StatCard
          title="Total Cost"
          value="$59,765"
          percent="0.6% Last year"
          color="yellow"
        />

      </div>

      {/* DELIVERIES TABLE */}
      <div className="bg-[#0a1039] p-6 rounded-xl border border-white/10 mb-10">

        <h3 className="text-xl font-semibold mb-6">Deliveries</h3>

        <table className="w-full text-gray-300 text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="p-3 text-left">Particular</th>
              <th className="p-3 text-left">Percentage</th>
              <th className="p-3 text-right">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-white/10">
              <td className="p-3 text-teal-300 font-medium">On Time Delivery</td>
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
      <div className="bg-[#0a1039] p-6 rounded-xl border border-white/10">

        <h3 className="text-xl font-semibold mb-6">Top Streaming Songs</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead className="border-b border-white/10 uppercase text-gray-400">
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
                <tr key={i} className="border-b border-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#29B6F6] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                        MG
                      </div>
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-xs text-gray-400">Released: {song.release}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 ">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-[#29B6F6]" />
                      {song.artist}
                    </div>
                  </td>

                  <td className="p-4 text-blue-300 font-medium">{song.streams}</td>

                  <td className="p-4">
                    <span className={`px-4 py-1 rounded-full text-xs bg-${song.color}-900/40 text-${song.color}-300`}>
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

/* STAT CARD COMPONENT */
function StatCard({ title, value, percent, color }) {
  return (
    <div className="bg-[#0a1039] p-6 rounded-xl border border-white/10 flex items-center justify-between">

      {/* TEXT */}
      <div>
        <p className="text-gray-300">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className={`text-${color}-400 text-sm mt-1`}>{percent}</p>
      </div>

      {/* ICONS */}
      <div className="p-3 rounded-lg bg-white/10">

        {color === "cyan" && (
          <svg width="40" height="40">
            <rect width="8" height="20" x="4" y="14" fill="#29B6F6"/>
            <rect width="8" height="30" x="16" y="4" fill="#29B6F6"/>
            <rect width="8" height="22" x="28" y="12" fill="#29B6F6"/>
          </svg>
        )}

        {color === "pink" && (
          <svg width="40" height="40">
            <path d="M5 25 Q15 5 25 25 T45 25" stroke="#ff4ecd" strokeWidth="3" fill="none"/>
          </svg>
        )}

        {color === "green" && (
          <svg width="40" height="40">
            <rect width="8" height="30" x="4" y="6" fill="#4ade80"/>
            <rect width="8" height="20" x="16" y="16" fill="#4ade80"/>
            <rect width="8" height="28" x="28" y="8" fill="#4ade80"/>
          </svg>
        )}

        {color === "yellow" && (
          <svg width="40" height="40">
            <path d="M5 25 Q10 10 20 15 T35 35" stroke="#facc15" strokeWidth="3" fill="none"/>
          </svg>
        )}

      </div>

    </div>
  );
}
