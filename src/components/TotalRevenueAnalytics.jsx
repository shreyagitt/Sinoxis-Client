import React from "react";
import {
  DollarSign,
  Music,
  Download,
  Award,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart2,
  Download as DownloadIcon,
  Search,
  Play,
  Youtube,
  Headphones,
} from "lucide-react";

const TotalRevenueAnalytics = () => {
  return (
    <div className="p-6 md:p-8 bg-[#f7f9fc] min-h-screen space-y-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Total Revenue Analytics</h1>

        <ol className="flex items-center text-sm text-gray-500 gap-2">
          <li><a className="hover:text-red-500" href="#">Home</a></li>
          <li>/</li>
          <li><a className="hover:text-red-500" href="#">Revenue Reports</a></li>
          <li>/</li>
          <li className="text-red-500 font-medium">Total Revenue</li>
        </ol>
      </div>

      {/* TIME FILTERS + EXPORT */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          <div>
            <h5 className="text-base font-semibold text-gray-800">Revenue Overview</h5>
            <p className="text-sm text-gray-500">
              Comprehensive revenue analysis across all platforms and artists
            </p>
          </div>

          {/* FILTER BUTTONS */}
<div className="flex items-center">
  <div className="inline-flex rounded-full overflow-hidden border border-red-500">
    
    {/* Active */}
    <button className="px-4 py-1.5 text-sm font-medium bg-red-500 text-white transition">
      Last 30 Days
    </button>

    {/* Inactive */}
    <button className="px-4 py-1.5 text-sm font-medium text-red-500 bg-white hover:bg-red-500 hover:text-white transition border-l border-red-500">
      Last 90 Days
    </button>

    <button className="px-4 py-1.5 text-sm font-medium text-red-500 bg-white hover:bg-red-500 hover:text-white transition border-l border-red-500">
      This Year
    </button>

    <button className="px-4 py-1.5 text-sm font-medium text-red-500 bg-white hover:bg-red-500 hover:text-white transition border-l border-red-500">
      All Time
    </button>

  </div>
</div>


          {/* EXPORT BUTTON */}
          <button className="inline-flex items-center gap-2 rounded-lg bg-red-500 text-white text-sm px-3 py-1.5 hover:bg-red-400">
            <DownloadIcon size={16} />
            Export Report
          </button>

        </div>
      </div>

      {/* REVENUE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            title: "Total Revenue",
            value: "$347,892",
            change: "18.4%",
            changeColor: "text-emerald-600",
            icon: <DollarSign className="w-8 h-8 text-red-500/80" />,
            badges: [
              ["All Platforms", "bg-red-50 text-red-500"],
              ["+$54,120", "bg-emerald-50 text-emerald-600"],
            ],
          },
          {
            title: "Streaming Revenue",
            value: "$278,314",
            change: "22.1%",
            changeColor: "text-emerald-600",
            icon: <Music className="w-8 h-8 text-emerald-600/80" />,
            badges: [
              ["80% of Total", "bg-emerald-50 text-emerald-600"],
              ["+$50,289", "bg-red-50 text-red-500"],
            ],
          },
          {
            title: "Digital Downloads",
            value: "$42,568",
            change: "-3.2%",
            changeColor: "text-amber-600",
            icon: <Download className="w-8 h-8 text-blue-600/80" />,
            badges: [
              ["12.2% of Total", "bg-blue-50 text-blue-600"],
              ["-$1,412", "bg-amber-50 text-amber-600"],
            ],
          },
          {
            title: "Royalties & Licensing",
            value: "$27,010",
            change: "8.7%",
            changeColor: "text-emerald-600",
            icon: <Award className="w-8 h-8 text-amber-500/90" />,
            badges: [
              ["7.8% of Total", "bg-amber-50 text-amber-600"],
              ["+$2,156", "bg-emerald-50 text-emerald-600"],
            ],
          }
        ].map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <h2 className="text-3xl font-semibold text-gray-800 mt-1">{card.value}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  <span
                    className={`${card.changeColor} inline-flex items-center gap-1 font-medium`}
                  >
                    {card.change.includes("-") ? (
                      <ArrowDownCircle size={14} />
                    ) : (
                      <ArrowUpCircle size={14} />
                    )}
                    {card.change}
                  </span>{" "}
                  vs previous period
                </p>
              </div>
              {card.icon}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {card.badges.map(([label, style], i) => (
                <span key={i} className={`px-2.5 py-1 text-xs rounded-full ${style}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* REVENUE DISTRIBUTION + TRENDS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* TRENDS PANEL */}
        <div className="xl:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trends - Last 12 Months</h3>
            <select className="border rounded-lg px-3 py-1.5 text-sm text-gray-600">
              <option>By Month</option>
              <option>By Quarter</option>
              <option>By Platform</option>
            </select>
          </div>

          <div className="p-6 pt-0">
            <div className="rounded-xl border border-dashed border-gray-200 text-center p-8">
              <BarChart2 size={40} className="mx-auto mb-3 text-red-600" />
              <h5 className="font-semibold text-gray-800">Revenue Trends Visualization</h5>
              <p className="text-sm text-gray-500">Monthly revenue breakdown across all income streams</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 mt-6 gap-4">
                <div className="border-r border-gray-200 pr-4">
                  <p className="font-bold text-red-600">$2.1M</p>
                  <small className="text-gray-500">Year to Date</small>
                </div>
                <div className="border-r border-gray-200 pr-4">
                  <p className="font-bold text-emerald-600">$347K</p>
                  <small className="text-gray-500">Current Month</small>
                </div>
                <div className="border-r border-gray-200 pr-4">
                  <p className="font-bold text-blue-600">18.4%</p>
                  <small className="text-gray-500">Growth Rate</small>
                </div>
                <div>
                  <p className="font-bold text-amber-500">84</p>
                  <small className="text-gray-500">Revenue Sources</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DISTRIBUTION PANEL */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue Distribution</h3>

          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
              100%
            </div>
          </div>

          <div className="space-y-4">
            {[
              { color: "bg-emerald-500", title: "Streaming Services", amount: "$278,314", percent: "80.0%" },
              { color: "bg-blue-500", title: "Digital Downloads", amount: "$42,568", percent: "12.2%" },
              { color: "bg-amber-500", title: "Royalties", amount: "$27,010", percent: "7.8%" },
            ].map((d, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded ${d.color}`} />
                  <span>{d.title}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{d.amount}</p>
                  <small className="text-gray-500">{d.percent}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Platform Diversity</span>
              <span className="font-semibold text-emerald-600">High</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 bg-emerald-600 rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* PLATFORM PERFORMANCE TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Platform Revenue Performance</h3>

          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
            <input
              type="text"
              placeholder="Search platforms..."
              className="h-9 w-56 pl-3 outline-none text-sm bg-transparent placeholder:text-gray-400"
            />
            <button className="h-9 px-3 bg-red-500 text-white hover:bg-red-500">
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Platform</th>
                <th className="p-4 text-right">Streams</th>
                <th className="p-4 text-right">Revenue</th>
                <th className="p-4 text-right">Avg. per Stream</th>
                <th className="p-4 text-center">Growth</th>
                <th className="p-4 text-right">Market Share</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {/* Spotify */}
              <tr className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                      <Music size={16} className="text-white" />
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">Spotify</p>
                      <small className="text-gray-500">Music Streaming</small>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">84.2M</td>
                <td className="p-4 text-right font-semibold text-red-600">$124,568</td>
                <td className="p-4 text-right">$0.0048</td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center gap-1">
                    <ArrowUpCircle size={14} /> 18.2%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-red-500" style={{ width: "44.8%" }} />
                    </div>
                    <span className="font-medium">44.8%</span>
                  </div>
                </td>
              </tr>

              {/* Apple Music */}
              <tr className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Play size={16} className="text-white" />
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">Apple Music</p>
                      <small className="text-gray-500">Music Streaming</small>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">62.5M</td>
                <td className="p-4 text-right font-semibold text-red-600">$98,745</td>
                <td className="p-4 text-right">$0.0072</td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center gap-1">
                    <ArrowUpCircle size={14} /> 12.4%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-emerald-500" style={{ width: "35.5%" }} />
                  </div>
                  <span className="font-medium">35.5%</span>
                </td>
              </tr>

              {/* YouTube Music */}
              <tr className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Youtube size={16} className="text-white" />
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">YouTube Music</p>
                      <small className="text-gray-500">Video Streaming</small>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">128.7M</td>
                <td className="p-4 text-right font-semibold text-red-500">$42,389</td>
                <td className="p-4 text-right">$0.0012</td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center gap-1">
                    <ArrowUpCircle size={14} /> 24.7%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-blue-600" style={{ width: "15.2%" }} />
                  </div>
                  <span className="font-medium">15.2%</span>
                </td>
              </tr>

              {/* Amazon Music */}
              <tr className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                      <Headphones size={16} className="text-white" />
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">Amazon Music</p>
                      <small className="text-gray-500">Music Streaming</small>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">18.3M</td>
                <td className="p-4 text-right font-semibold text-red-500">$12,612</td>
                <td className="p-4 text-right">$0.0051</td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-600 inline-flex items-center gap-1">
                    <ArrowDownCircle size={14} /> 3.1%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-amber-500" style={{ width: "4.5%" }} />
                  </div>
                  <span className="font-medium">4.5%</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default TotalRevenueAnalytics;
