// src/pages/TotalRevenueAnalytics.jsx
import React, { useState } from "react";
import {
  DollarSign,
  Music,
  Download,
  Award,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart2,
  Search,
  Play,
  Youtube,
  Headphones,
} from "lucide-react";
import { useTheme } from "../components/Topbar";

// =======================
// STATIC DATA
// =======================
const overview = {
  totalRevenue: 347892,
  totalChange: "18.4%",
  growthAmount: 54120,
  streamingRevenue: 278314,
  streamingChange: "22.1%",
  streamingPercent: 80,
  streamingGrowth: 50289,
  downloadsRevenue: 42568,
  downloadsChange: "3.2%",
  royaltiesRevenue: 27010,
  royaltiesChange: "8.7%",
  yearToDate: 2100000,
  currentMonth: 347000,
  growthRate: "18.4%",
  revenueSources: 84,
  distribution: {
    streaming: 68.4,
    downloads: 12.2,
    royalties: 7.8,
  },
  platforms: [
    {
      icon: "spotify",
      name: "Spotify",
      category: "Music Streaming",
      streams: "84.2M",
      revenue: 124568,
      avgPerStream: 0.0048,
      growth: 18.2,
      marketShare: 44.8,
    },
    {
      icon: "apple",
      name: "Apple Music",
      category: "Music Streaming",
      streams: "62.5M",
      revenue: 98745,
      avgPerStream: 0.0072,
      growth: 12.4,
      marketShare: 35.5,
    },
    {
      icon: "youtube",
      name: "YouTube Music",
      category: "Video Streaming",
      streams: "128.7M",
      revenue: 42389,
      avgPerStream: 0.0012,
      growth: 24.7,
      marketShare: 15.2,
    },
    {
      icon: "amazon",
      name: "Amazon Music",
      category: "Music Streaming",
      streams: "18.3M",
      revenue: 12612,
      avgPerStream: 0.0051,
      growth: -3.1,
      marketShare: 4.5,
    },
  ],
};

// =======================
// STATUS PILL
// =======================
const StatusPill = ({ status, theme }) => {
  if (!status) return null;

  const base =
    "inline-block px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap";
  const colorMapDark = {
    Pending: "bg-yellow-400 text-black",
    Failed: "bg-red-600 text-white",
    Paid: "bg-green-400 text-black",
  };
  const colorMapLight = {
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
    Paid: "bg-green-100 text-green-800",
  };
  const classes =
    theme === "dark"
      ? colorMapDark[status] || "bg-gray-400 text-black"
      : colorMapLight[status] || "bg-gray-200 text-gray-800";

  return <span className={`${base} ${classes}`}>{status}</span>;
};

// =======================
// MAIN COMPONENT
// =======================
export default function TotalRevenueAnalytics() {
  const { theme } = useTheme();

  // theme classes
  const pageBg =
    theme === "dark"
      ? "bg-[#020726] text-white"
      : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10"
      : "bg-white border border-gray-200 shadow-sm";
  const inputBg =
    theme === "dark"
      ? "bg-[#1f233d] text-white placeholder-gray-400 border border-white/10"
      : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-200";
  const subtleText =
    theme === "dark" ? "text-gray-300" : "text-gray-600";
  const modalBg =
    theme === "dark" ? "bg-[#0b1138] border border-white/10" : "bg-white border border-gray-200";

  const [search, setSearch] = useState("");
  const [filterRange, setFilterRange] = useState("Last 30 Days");
  const [showExportModal, setShowExportModal] = useState(false);

  const fmtCurrency = (v) => `$${Number(v).toLocaleString()}`;

  const filteredPlatforms = overview.platforms.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 lg:p-10 space-y-8 transition-colors duration-200 ${pageBg}`}
    >
      {/* ======================= HEADER ======================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Total Revenue Analytics
        </h1>

        <div className={`text-sm ${subtleText}`}>
          Home <span className="text-[#29B6F6]">/ Total Revenue</span>
        </div>
      </div>

      {/* ======================= FILTERS CARD ======================= */}
      <div className={`${cardBg} rounded-xl p-4 sm:p-6`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className={`text-sm ${subtleText}`}>
              Comprehensive revenue analysis across all platforms
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={`flex rounded-full overflow-hidden border ${
                theme === "dark"
                  ? "border-white/10"
                  : "border-[#0288D1]"
              }`}
            >
              {[
                "Last 30 Days",
                "Last 90 Days",
                "This Year",
                "All Time",
              ].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRange(r)}
                  className={`px-4 py-1.5 text-sm font-medium ${
                    filterRange === r
                      ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white"
                      : theme === "dark"
                      ? "text-[#29B6F6]"
                      : "text-[#0288D1] hover:bg-[#0288D1]/10"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#29B6F6] to-[#0288D1] rounded-lg text-[#020726] font-medium flex items-center gap-2"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* ======================= TOP METRICS ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* CARD 1 */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${subtleText}`}>Total Revenue</p>
              <h2 className="text-3xl font-bold mt-1">
                {fmtCurrency(overview.totalRevenue)}
              </h2>
              <p className={`text-xs mt-2 ${subtleText}`}>
                <span className="flex items-center gap-1 text-green-300 font-semibold">
                  <ArrowUpCircle size={14} />
                  {overview.totalChange}
                </span>{" "}
                vs previous period
              </p>
            </div>
            <DollarSign className="text-[#29B6F6] w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#29B6F6]/20 text-[#29B6F6] text-xs">
              All Platforms
            </span>
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs">
              +{fmtCurrency(overview.growthAmount)}
            </span>
          </div>
        </div>

        {/* CARD 2 */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${subtleText}`}>Streaming Revenue</p>
              <h2 className="text-3xl font-bold mt-1">
                {fmtCurrency(overview.streamingRevenue)}
              </h2>
              <p className={`text-xs mt-2 ${subtleText}`}>
                <span className="flex items-center gap-1 text-green-300 font-semibold">
                  <ArrowUpCircle size={14} />
                  {overview.streamingChange}
                </span>{" "}
                vs previous
              </p>
            </div>
            <Music className="text-[#29B6F6] w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs">
              {overview.streamingPercent}% of Total
            </span>
            <span className="px-3 py-1 rounded-full bg-[#29B6F6]/20 text-[#29B6F6] text-xs">
              +{fmtCurrency(overview.streamingGrowth)}
            </span>
          </div>
        </div>

        {/* CARD 3 */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${subtleText}`}>
                Digital Downloads
              </p>
              <h2 className="text-3xl font-bold mt-1">
                {fmtCurrency(overview.downloadsRevenue)}
              </h2>
              <p className={`text-xs mt-2 ${subtleText}`}>
                <span className="flex items-center gap-1 text-yellow-300 font-semibold">
                  <ArrowDownCircle size={14} />
                  {overview.downloadsChange}
                </span>{" "}
                vs previous
              </p>
            </div>
            <Download className="text-[#29B6F6] w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-xs">
              12.2% of Total
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs">
              -$1,412
            </span>
          </div>
        </div>

        {/* CARD 4 */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${subtleText}`}>
                Royalties & Licensing
              </p>
              <h2 className="text-3xl font-bold mt-1">
                {fmtCurrency(overview.royaltiesRevenue)}
              </h2>
              <p className={`text-xs mt-2 ${subtleText}`}>
                <span className="flex items-center gap-1 text-green-300 font-semibold">
                  <ArrowUpCircle size={14} />
                  {overview.royaltiesChange}
                </span>{" "}
                vs previous
              </p>
            </div>
            <Award className="text-yellow-300 w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs">
              7.8% of Total
            </span>
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs">
              +{fmtCurrency(2156)}
            </span>
          </div>
        </div>
      </div>

      {/* ======================= GRID: TRENDS + DISTRIBUTION ======================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* TRENDS CARD */}
        <div className={`${cardBg} rounded-xl p-6 xl:col-span-8`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-lg font-semibold">
              Revenue Trends - Last 12 Months
            </h3>
            <select
              className={`px-3 py-1.5 text-sm rounded-lg ${
                theme === "dark"
                  ? "bg-[#0a1039] border border-white/10 text-gray-300"
                  : "bg-white border border-gray-200 text-[#020726]"
              }`}
            >
              <option>By Month</option>
              <option>By Quarter</option>
              <option>By Platform</option>
            </select>
          </div>

          {/* Visualization Placeholder */}
          <div
            className={`rounded-2xl p-6 sm:p-8 ${
              theme === "dark"
                ? "bg-[#070d2b] border border-white/10"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="flex justify-center mb-6">
              <BarChart2 className="text-[#29B6F6]" size={48} />
            </div>

            <h3 className="text-center text-xl font-semibold">
              Revenue Trends Visualization
            </h3>
            <p className={`text-center text-sm mt-1 ${subtleText}`}>
              Monthly revenue breakdown across all income streams
            </p>

            {/* 4 Boxes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 text-center mt-8 gap-6">
              <div className="border-r border-white/10 last:border-none">
                <h4 className="text-[#29B6F6] font-bold text-lg">
                  {fmtCurrency(overview.yearToDate)}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>Year to Date</p>
              </div>

              <div className="border-r border-white/10 last:border-none">
                <h4 className="text-green-300 font-bold text-lg">
                  {fmtCurrency(overview.currentMonth)}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>
                  Current Month
                </p>
              </div>

              <div className="border-r border-white/10 last:border-none">
                <h4 className="text-blue-300 font-bold text-lg">
                  {overview.growthRate}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>
                  Growth Rate
                </p>
              </div>

              <div>
                <h4 className="text-yellow-300 font-bold text-lg">
                  {overview.revenueSources}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>
                  Revenue Sources
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DISTRIBUTION CARD */}
        <div className={`${cardBg} rounded-xl p-6 xl:col-span-4`}>
          <h3 className="text-lg font-semibold mb-6">
            Revenue Distribution
          </h3>

          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full bg-gradient-to-b from-[#29B6F6] to-[#0288D1] flex items-center justify-center">
              <span className="text-white text-3xl font-semibold">
                100%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Categories */}
            {[
              {
                label: "Streaming Services",
                amount: overview.streamingRevenue,
                percent: overview.distribution.streaming,
                color: "bg-green-400",
              },
              {
                label: "Digital Downloads",
                amount: overview.downloadsRevenue,
                percent: overview.distribution.downloads,
                color: "bg-blue-400",
              },
              {
                label: "Royalties",
                amount: overview.royaltiesRevenue,
                percent: overview.distribution.royalties,
                color: "bg-yellow-300",
              },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${item.color}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-[#29B6F6]">
                    ${item.amount.toLocaleString()}
                  </p>
                  <small className={`text-xs ${subtleText}`}>
                    {item.percent}%
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* Diversity Bar */}
          <div className="mt-6">
            <div className="flex justify-between">
              <span className={subtleText}>Platform Diversity</span>
              <span className="font-semibold text-green-300">
                High
              </span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full mt-2">
              <div
                className="h-2 bg-green-300 rounded-full"
                style={{ width: "85%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================= PLATFORM TABLE ======================= */}
      <div className={`${cardBg} rounded-xl p-6`}>
        {/* SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
          <h3 className="text-lg font-semibold">Platform Revenue Performance</h3>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div
              className={`flex w-full md:w-auto border rounded-lg overflow-hidden ${
                theme === "dark" ? "border-white/10" : "border-gray-200"
              }`}
            >
              <input
                type="text"
                placeholder="Search platforms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`px-3 py-1.5 outline-none w-full md:w-56 text-sm ${
                  theme === "dark"
                    ? "bg-transparent text-gray-200 placeholder-gray-400"
                    : "bg-white text-[#020726] placeholder-gray-400"
                }`}
              />

              <button className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] px-3 flex items-center justify-center">
                <Search
                  size={16}
                  className={
                    theme === "dark" ? "text-[#020726]" : "text-white"
                  }
                />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead
              className={`${
                theme === "dark"
                  ? "text-gray-400 border-b border-white/10"
                  : "text-gray-600 border-b border-gray-200"
              }`}
            >
              <tr>
                <th className="text-left py-3">Platform</th>
                <th className="text-right py-3">Streams</th>
                <th className="text-right py-3">Revenue</th>
                <th className="text-right py-3">Avg. Per Stream</th>
                <th className="text-center py-3">Growth</th>
                <th className="text-right py-3">Market Share</th>
              </tr>
            </thead>

            <tbody
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {filteredPlatforms.map((p, idx) => (
                <tr
                  key={idx}
                  className={`${
                    theme === "dark"
                      ? "border-b border-white/5 hover:bg-white/5"
                      : "border-b border-gray-100 hover:bg-gray-50"
                  } transition`}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {/* PLATFORM ICON */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{
                          background:
                            p.icon === "spotify"
                              ? "#1DB954"
                              : p.icon === "apple"
                              ? "#A3AAAE"
                              : p.icon === "youtube"
                              ? "#FF0000"
                              : "#4285F4",
                        }}
                      >
                        {p.icon === "spotify" && (
                          <Music size={18} className="text-white" />
                        )}
                        {p.icon === "apple" && (
                          <Play size={18} className="text-white" />
                        )}
                        {p.icon === "youtube" && (
                          <Youtube size={18} className="text-white" />
                        )}
                        {p.icon === "amazon" && (
                          <Headphones size={18} className="text-white" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-400">
                          {p.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-right">{p.streams}</td>

                  <td className="text-right font-semibold text-[#29B6F6]">
                    ${p.revenue.toLocaleString()}
                  </td>

                  <td className="text-right">
                    ${p.avgPerStream.toFixed(4)}
                  </td>

                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
                        p.growth < 0
                          ? "bg-yellow-400/20 text-yellow-300"
                          : "bg-green-400/20 text-green-300"
                      }`}
                    >
                      {p.growth < 0 ? (
                        <ArrowDownCircle size={14} />
                      ) : (
                        <ArrowUpCircle size={14} />
                      )}
                      {Math.abs(p.growth)}%
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-32 h-2 bg-white/10 rounded-full">
                        <div
                          className="h-2 bg-[#29B6F6] rounded-full"
                          style={{ width: `${p.marketShare}%` }}
                        />
                      </div>
                      <span>{p.marketShare}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================= EXPORT MODAL ======================= */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-lg md:max-w-2xl rounded-xl p-6 shadow-xl ${modalBg}`}
          >
            <h2 className="text-xl font-semibold">Export Report</h2>
            <p className={`text-sm mt-2 ${subtleText}`}>
              Choose export format and date range.
            </p>

            {/* FORM */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm block mb-1">Format</label>
                <select
                  className={`${inputBg} px-3 py-2 rounded-md w-full`}
                >
                  <option>CSV</option>
                  <option>Excel</option>
                  <option>PDF</option>
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">Range</label>
                <select
                  className={`${inputBg} px-3 py-2 rounded-md w-full`}
                >
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className={`px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "border border-white/20 text-white hover:bg-white/5"
                    : "border border-gray-200 text-[#020726] hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>

              <button className="px-4 py-2 rounded-md bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-[#020726] font-semibold">
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
