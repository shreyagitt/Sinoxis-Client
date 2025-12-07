// src/pages/TotalRevenueAnalytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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

/* =======================
   ✅ SAFE DEFAULT STATE
======================= */
const DEFAULT_OVERVIEW = {
  totalRevenue: 0,
  totalChange: "0%",
  growthAmount: 0,
  streamingRevenue: 0,
  streamingChange: "0%",
  streamingPercent: 0,
  streamingGrowth: 0,
  downloadsRevenue: 0,
  downloadsChange: "0%",
  royaltiesRevenue: 0,
  royaltiesChange: "0%",
  yearToDate: 0,
  currentMonth: 0,
  growthRate: "0%",
  revenueSources: 0,
  distribution: {
    streaming: 0,
    downloads: 0,
    royalties: 0,
  },
  platforms: [],
};

export default function TotalRevenueAnalytics() {
  const { theme } = useTheme();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [search, setSearch] = useState("");
  const [filterRange, setFilterRange] = useState("Last 30 Days");
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const filteredPlatforms = overview.platforms.filter((p) => {
  const q = search.toLowerCase();
  return (
    p.name?.toLowerCase().includes(q) ||
    p.category?.toLowerCase().includes(q)
  );
});

  /* =========================
        THEME CLASSES
  ========================== */
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
    theme === "dark"
      ? "bg-[#0b1138] border border-white/10"
      : "bg-white border border-gray-200";

  const fmtCurrency = (v) => `$${Number(v || 0).toLocaleString()}`;

const handleExport = async () => {
  try {
    const res = await axios.get(
      `${baseUrl}/client/revenue-analytics/export/csv`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "revenue-analytics.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Exported successfully");
  } catch (err) {
    toast.error("Export failed");
  }
};


  /* =========================
        ✅ FETCH API DATA
  ========================== */
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/client/revenue-analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data?.data || {};

      const finalData = {
        ...DEFAULT_OVERVIEW,
        ...data,
        distribution: {
          ...DEFAULT_OVERVIEW.distribution,
          ...(data.distribution || {}),
        },
        platforms: Array.isArray(data.platforms)
          ? data.platforms
          : [],
      };

      setOverview(finalData);
    } catch (err) {
      console.error("Revenue fetch error:", err);
      toast.error("Failed to load revenue analytics");
      setOverview(DEFAULT_OVERVIEW);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filterRange]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBg}`}>
        <p className="text-lg font-semibold">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 lg:p-10 space-y-8 transition-colors duration-200 ${pageBg}`}
    >
      {/* ======================= 1️⃣ TOP HEADER SECTION ======================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Total Revenue Analytics
        </h1>

        <div className={`text-sm ${subtleText}`}>
          Home <span className="text-[#29B6F6]">/ Total Revenue</span>
        </div>
      </div>

      {/* ======================= FILTER CARD ======================= */}
      <div className={`${cardBg} rounded-xl p-4 sm:p-6`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className={`text-sm ${subtleText}`}>
              Comprehensive revenue analysis across all platforms
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={`flex rounded-full overflow-hidden border ${
                theme === "dark"
                  ? "border-white/10"
                  : "border-[#0288D1]"
              }`}
            >
              {["Last 30 Days", "Last 90 Days", "This Year", "All Time"].map(
                (r) => (
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
                )
              )}
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

      {/* ======================= 2️⃣ FOUR METRIC CARDS ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL REVENUE */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <p className={subtleText}>Total Revenue</p>
          <h2 className="text-3xl font-bold mt-1">
            {fmtCurrency(overview.totalRevenue)}
          </h2>
        </div>

        {/* STREAMING */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <p className={subtleText}>Streaming Revenue</p>
          <h2 className="text-3xl font-bold mt-1">
            {fmtCurrency(overview.streamingRevenue)}
          </h2>
        </div>

        {/* DOWNLOADS */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <p className={subtleText}>Digital Downloads</p>
          <h2 className="text-3xl font-bold mt-1">
            {fmtCurrency(overview.downloadsRevenue)}
          </h2>
        </div>

        {/* ROYALTIES */}
        <div className={`${cardBg} rounded-xl p-6`}>
          <p className={subtleText}>Royalties & Licensing</p>
          <h2 className="text-3xl font-bold mt-1">
            {fmtCurrency(overview.royaltiesRevenue)}
          </h2>
        </div>

      </div>
      {/* ======================= 3️⃣ THIRD SECTION (2 BLOCKS) ======================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ========= LEFT BLOCK: REVENUE TRENDS ========= */}
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

          {/* Visual Placeholder */}
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

            {/* 4 MINI STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 text-center mt-8 gap-6">

              <div>
                <h4 className="text-[#29B6F6] font-bold text-lg">
                  {fmtCurrency(overview.yearToDate)}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>Year to Date</p>
              </div>

              <div>
                <h4 className="text-green-300 font-bold text-lg">
                  {fmtCurrency(overview.currentMonth)}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>Current Month</p>
              </div>

              <div>
                <h4 className="text-blue-300 font-bold text-lg">
                  {overview.growthRate}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>Growth Rate</p>
              </div>

              <div>
                <h4 className="text-yellow-300 font-bold text-lg">
                  {overview.revenueSources}
                </h4>
                <p className={`text-xs mt-1 ${subtleText}`}>Revenue Sources</p>
              </div>

            </div>
          </div>
        </div>

        {/* ========= RIGHT BLOCK: REVENUE DISTRIBUTION ========= */}
        <div className={`${cardBg} rounded-xl p-6 xl:col-span-4`}>
          <h3 className="text-lg font-semibold mb-6">Revenue Distribution</h3>

          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full bg-gradient-to-b from-[#29B6F6] to-[#0288D1] flex items-center justify-center">
              <span className="text-white text-3xl font-semibold">100%</span>
            </div>
          </div>

          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <span>Streaming Services</span>
              <span className="font-semibold">
                {fmtCurrency(overview.streamingRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Digital Downloads</span>
              <span className="font-semibold">
                {fmtCurrency(overview.downloadsRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Royalties</span>
              <span className="font-semibold">
                {fmtCurrency(overview.royaltiesRevenue)}
              </span>
            </div>

          </div>

          {/* Diversity Bar */}
          <div className="mt-6">
            <div className="flex justify-between">
              <span className={subtleText}>Platform Diversity</span>
              <span className="font-semibold text-green-300">High</span>
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
      {/* ======================= 4️⃣ FINAL SECTION: PLATFORM TABLE ======================= */}
      <div className={`${cardBg} rounded-xl p-6`}>

        {/* ===== SEARCH BAR ===== */}
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

        {/* ===== TABLE ===== */}
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

            <tbody className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
  {filteredPlatforms.map((p, idx) => {
    const avg = Number(p.avgPerStream || 0);
    const growth = Number(p.growth || 0);
    const revenue = Number(p.revenue || 0);
    const streams = Number(p.streams || 0);
    const share = Number(p.marketShare || 0);

    return (
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
              {p.icon === "spotify" && <Music size={18} />}
              {p.icon === "apple" && <Play size={18} />}
              {p.icon === "youtube" && <Youtube size={18} />}
              {p.icon === "amazon" && <Headphones size={18} />}
            </div>

            <div>
              <p className="font-medium">{p.name || "Unknown"}</p>
              <p className="text-xs text-gray-400">{p.category || "N/A"}</p>
            </div>
          </div>
        </td>

        <td className="text-right">{streams}</td>

        <td className="text-right font-semibold text-[#29B6F6]">
          ${revenue.toLocaleString()}
        </td>

        <td className="text-right">${avg.toFixed(4)}</td>

        <td className="text-center">
          <span
            className={`px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
              growth < 0
                ? "bg-yellow-400/20 text-yellow-300"
                : "bg-green-400/20 text-green-300"
            }`}
          >
            {growth < 0 ? (
              <ArrowDownCircle size={14} />
            ) : (
              <ArrowUpCircle size={14} />
            )}
            {Math.abs(growth)}%
          </span>
        </td>

        <td className="text-right">
          <div className="flex items-center justify-end gap-3">
            <div className="w-32 h-2 bg-white/10 rounded-full">
              <div
                className="h-2 bg-[#29B6F6] rounded-full"
                style={{ width: `${share}%` }}
              />
            </div>
            <span>{share}%</span>
          </div>
        </td>
      </tr>
    );
  })}
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

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm block mb-1">Format</label>
                <select className={`${inputBg} px-3 py-2 rounded-md w-full`}>
                  <option>CSV</option>
                  <option>Excel</option>
                  <option>PDF</option>
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">Range</label>
                <select className={`${inputBg} px-3 py-2 rounded-md w-full`}>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

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

            <button
  onClick={handleExport}
  className="px-4 py-2 rounded-md bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-[#020726] font-semibold"
>
  Export
</button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

