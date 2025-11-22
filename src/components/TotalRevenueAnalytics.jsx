import React from "react";
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
// FIXED Card Component
// Accepts className
// =======================
const SinoxisCard = ({ children, className = "" }) => (
  <div className={`bg-[#0a1039] border border-white/10 rounded-xl p-6 text-white shadow-sm ${className}`}>
    {children}
  </div>
);

export default function TotalRevenueAnalytics() {
  return (
    <div className="min-h-screen w-full bg-[#020726] text-white p-6 md:p-10 space-y-10">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl md:text-3xl font-semibold">Total Revenue Analytics</h1>

        <ol className="flex gap-2 text-sm  mt-2 md:mt-0">
          <li><span className="hover:underline cursor-pointer">Home</span></li>
          <li>/</li>
          <li><span className="hover:underline cursor-pointer">Revenue Reports</span></li>
          <li>/</li>
          <li className="text-[#29B6F6] font-medium">Total Revenue</li>
        </ol>
      </div>

      {/* FILTERS */}
      <SinoxisCard>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className="text-gray-400 text-sm">
              Comprehensive revenue analysis across all platforms & artists
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-transparent border border-[#29B6F6] rounded-full overflow-hidden">
  
  {/* ACTIVE BUTTON */}
  <button className="px-4 py-1.5 bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white font-medium text-sm transition-all">
    Last 30 Days
  </button>

  {/* ALL OTHER BUTTONS – HOVER = FULL BLUE + WHITE */}
  <button className="px-4 py-1.5 text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white font-medium text-sm transition-all">
    Last 90 Days
  </button>

  <button className="px-4 py-1.5 text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white font-medium text-sm transition-all">
    This Year
  </button>

  <button className="px-4 py-1.5 text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white font-medium text-sm transition-all">
    All Time
  </button>

</div>


            <button className="px-4 py-2 bg-gradient-to-r from-[#29B6F6] to-[#0288D1] rounded-lg text-[#020726] font-medium flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>

        </div>
      </SinoxisCard>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Total Revenue */}
        <SinoxisCard>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-300 text-sm">Total Revenue</p>
              <h2 className="text-3xl font-bold mt-1">${overview.totalRevenue.toLocaleString()}</h2>

              <p className="text-xs mt-2 text-gray-400">
                <span className="text-green-300 flex items-center gap-1 font-semibold">
                  <ArrowUpCircle size={14} /> {overview.totalChange}
                </span>
                vs previous period
              </p>
            </div>

            <DollarSign className="text-[#29B6F6] w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#29B6F6]/20 text-[#29B6F6] text-xs">All Platforms</span>
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs">
              +${overview.growthAmount.toLocaleString()}
            </span>
          </div>
        </SinoxisCard>

        {/* Streaming Revenue */}
        <SinoxisCard>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-300 text-sm">Streaming Revenue</p>
              <h2 className="text-3xl font-bold mt-1">${overview.streamingRevenue.toLocaleString()}</h2>

              <p className="text-xs mt-2 text-gray-400">
                <span className="text-green-300 flex items-center gap-1 font-semibold">
                  <ArrowUpCircle size={14} /> {overview.streamingChange}
                </span>
                vs previous period
              </p>
            </div>

            <Music className="text-[#29B6F6] w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs">
              {overview.streamingPercent}% of Total
            </span>
            <span className="px-3 py-1 rounded-full bg-[#29B6F6]/20 text-[#29B6F6] text-xs">
              +${overview.streamingGrowth.toLocaleString()}
            </span>
          </div>
        </SinoxisCard>

        {/* Digital Downloads */}
        <SinoxisCard>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-300 text-sm">Digital Downloads</p>
              <h2 className="text-3xl font-bold mt-1">${overview.downloadsRevenue.toLocaleString()}</h2>

              <p className="text-xs mt-2 text-gray-400">
                <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                  <ArrowDownCircle size={14} /> {overview.downloadsChange}
                </span>
                vs previous period
              </p>
            </div>

            <Download className="text-[#29B6F6] w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#29B6F6]/20 text-[#29B6F6] text-xs">12.2% of Total</span>
            <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs">-$1,412</span>
          </div>
        </SinoxisCard>

        {/* Royalties */}
        <SinoxisCard>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-300 text-sm">Royalties & Licensing</p>
              <h2 className="text-3xl font-bold mt-1">${overview.royaltiesRevenue.toLocaleString()}</h2>

              <p className="text-xs mt-2 text-gray-400">
                <span className="text-green-300 flex items-center gap-1 font-semibold">
                  <ArrowUpCircle size={14} /> {overview.royaltiesChange}
                </span>
                vs previous period
              </p>
            </div>

            <Award className="text-yellow-300 w-8 h-8" />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs">7.8% of Total</span>
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs">+$2,156</span>
          </div>
        </SinoxisCard>
      </div>

      {/* ============================
           TRENDS + DISTRIBUTION
      ============================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* TRENDS */}
        <SinoxisCard className="xl:col-span-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Trends - Last 12 Months</h3>

            <select className="bg-[#0a1039] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300">
              <option>By Month</option>
              <option>By Quarter</option>
              <option>By Platform</option>
            </select>
          </div>

          <div className="border border-white/10 rounded-xl p-8 text-center">
            <BarChart2 className="mx-auto mb-3 text-[#29B6F6]" size={40} />
            <h5 className="font-semibold">Revenue Trends Visualization</h5>
            <p className="text-gray-400 text-sm">Monthly revenue breakdown across all income streams</p>

            <div className="grid grid-cols-4 gap-4 mt-6 text-center">
              <div className="border-r border-white/10 pr-3">
                <div className="text-[#29B6F6] font-bold">$2.1M</div>
                <small className="text-gray-400">Year to Date</small>
              </div>

              <div className="border-r border-white/10 pr-3">
                <div className="text-green-300 font-bold">$347K</div>
                <small className="text-gray-400">Current Month</small>
              </div>

              <div className="border-r border-white/10 pr-3">
                <div className="text-blue-300 font-bold">{overview.growthRate}</div>
                <small className="text-gray-400">Growth Rate</small>
              </div>

              <div>
                <div className="text-yellow-300 font-bold">{overview.revenueSources}</div>
                <small className="text-gray-400">Revenue Sources</small>
              </div>
            </div>
          </div>
        </SinoxisCard>

        {/* DISTRIBUTION */}
        <SinoxisCard className="xl:col-span-4">
          <h3 className="text-lg font-semibold mb-6">Revenue Distribution</h3>

          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full bg-gradient-to-b from-[#29B6F6] to-[#0288D1] flex items-center justify-center">
              <span className="text-white text-3xl font-semibold">100%</span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Streaming Services",
                color: "bg-green-400",
                amount: overview.streamingRevenue,
                percent: overview.distribution.streaming,
              },
              {
                label: "Digital Downloads",
                color: "bg-blue-400",
                amount: overview.downloadsRevenue,
                percent: overview.distribution.downloads,
              },
              {
                label: "Royalties",
                color: "bg-yellow-300",
                amount: overview.royaltiesRevenue,
                percent: overview.distribution.royalties,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-gray-200">{item.label}</span>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-[#29B6F6]">${item.amount.toLocaleString()}</p>
                  <small className="text-gray-400">{item.percent}%</small>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Platform Diversity</span>
              <span className="font-semibold text-green-300">High</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full mt-2">
              <div className="h-2 bg-green-300 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </SinoxisCard>
      </div>

      {/* PLATFORM TABLE */}
      <SinoxisCard>
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <h3 className="text-lg font-semibold">Platform Revenue Performance</h3>

          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search platforms..."
              className="bg-transparent px-3 py-1.5 outline-none w-48 text-sm text-gray-200 placeholder:text-gray-500"
            />
            <button className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] px-3 flex items-center justify-center">
              <Search size={16} className="text-[#020726]" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="text-left py-3">Platform</th>
                <th className="text-right py-3">Streams</th>
                <th className="text-right py-3">Revenue</th>
                <th className="text-right py-3">Avg. Per Stream</th>
                <th className="text-center py-3">Growth</th>
                <th className="text-right py-3">Market Share</th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {overview.platforms.map((p, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3">
                    <div className="flex items-center gap-3">

                      {/* ICON BOX */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background:
                            p.icon === "spotify"
                              ? "#1DB954"
                              : p.icon === "apple"
                              ? "#2DB3B1"
                              : p.icon === "youtube"
                              ? "#1976D2"
                              : "#f2b03d",
                        }}
                      >
                        {p.icon === "spotify" && <Music size={18} className="text-white" />}
                        {p.icon === "apple" && <Play size={18} className="text-white" />}
                        {p.icon === "youtube" && <Youtube size={18} className="text-white" />}
                        {p.icon === "amazon" && <Headphones size={18} className="text-white" />}
                      </div>

                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category}</p>
                      </div>

                    </div>
                  </td>

                  <td className="text-right">{p.streams}</td>

                  <td className="text-right font-semibold text-[#29B6F6]">
                    ${p.revenue.toLocaleString()}
                  </td>

                  <td className="text-right">${p.avgPerStream.toFixed(4)}</td>

                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
                        p.growth < 0
                          ? "bg-yellow-400/20 text-yellow-300"
                          : "bg-green-400/20 text-green-300"
                      }`}
                    >
                      {p.growth < 0 ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                      {Math.abs(p.growth)}%
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-32 h-2 bg-white/10 rounded-full">
                        <div
                          className="h-2 bg-[#29B6F6] rounded-full"
                          style={{ width: `${p.marketShare}%` }}
                        ></div>
                      </div>
                      <span className="text-white">{p.marketShare}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SinoxisCard>

    </div>
  );
}
