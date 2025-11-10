import React from "react";
import { DollarSign, Music, Download, Award, Eye, DownloadCloud } from "lucide-react";

const RevenueReport = () => {
  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen space-y-8">

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Revenue Reports</h1>
        <p className="text-sm text-gray-500">Home / <span className="text-red-600">Revenue Reports</span></p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", amount: "$127,890", change: "+12.5%", icon: <DollarSign />, color: "text-emerald-500" },
          { title: "Streaming Revenue", amount: "$89,452", change: "+8.3%", icon: <Music />, color: "text-red-500" },
          { title: "Downloads Revenue", amount: "$23,765", change: "-2.1%", icon: <Download />, color: "text-blue-500" },
          { title: "Royalties", amount: "$14,673", change: "+5.7%", icon: <Award />, color: "text-yellow-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative">
            <div className={`absolute top-5 right-5 text-3xl opacity-80 ${item.color}`}>
  {item.icon}
</div>

            <p className="text-gray-600 text-sm">{item.title}</p>
            <h2 className="text-3xl font-semibold text-gray-800 mt-1">{item.amount}</h2>
            <p className={`mt-2 text-sm flex items-center gap-1 ${item.change.includes("+") ? "text-emerald-600" : "text-orange-500"}`}>
              ● {item.change} <span className="text-gray-500">Last 30 days</span>
            </p>
          </div>
        ))}
      </div>

      {/* Platform Performance */}
      <div className="bg-white shadow-md border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Platform Performance</h3>
          <select className="border rounded-lg px-3 py-1 text-sm text-gray-600">
            <option>Last 7 Days</option>
            <option selected>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left p-4">Platform</th>
                <th className="p-4 text-center">Streams</th>
                <th className="p-4 text-center">Revenue</th>
                <th className="p-4 text-center">Growth</th>
                <th className="p-4 text-right">Market Share</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {[
                { name: "Spotify", streams: "2.4M", revenue: "$45,230", growth: "+12.5%", share: 42, color: "bg-red-500" },
                { name: "Apple Music", streams: "1.8M", revenue: "$38,765", growth: "+8.3%", share: 35, color: "bg-emerald-500" },
                { name: "YouTube Music", streams: "1.2M", revenue: "$22,450", growth: "+15.2%", share: 23, color: "bg-blue-600" },
                { name: "Amazon Music", streams: "856K", revenue: "$15,230", growth: "-2.1%", share: 16, color: "bg-yellow-500" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{row.name}</td>
                  <td className="p-4 text-center">{row.streams}</td>
                  <td className="p-4 text-center">{row.revenue}</td>
                  <td className={`p-4 text-center font-medium ${row.growth.includes("+") ? "text-emerald-600" : "text-orange-500"}`}>
                    {row.growth}
                  </td>
                  <td className="p-4 text-right flex items-center gap-3 justify-end">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className={`${row.color} h-2 rounded-full`} style={{ width: row.share + "%" }}></div>
                    </div>
                    <span>{row.share}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue By Artist */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Revenue by Artist</h3>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 text-sm rounded-md">Export Report</button>
        </div>

        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Artist</th>
              <th className="p-4 text-left">Total Revenue</th>
              <th className="p-4 text-center">Streaming</th>
              <th className="p-4 text-center">Downloads</th>
              <th className="p-4 text-center">Royalties</th>
              <th className="p-4 text-center">Growth</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {[
              ["Luna Gray", "Pop Artist", "$45,230", "$38,450", "$4,120", "$2,660", "+15.2%", "bg-blue-600"],
              ["Arion Keys", "R&B Artist", "$38,765", "$32,890", "$3,450", "$2,425", "+8.7%", "bg-green-600"],
              ["DJ Nova", "EDM Producer", "$28,450", "$24,120", "$2,890", "$1,440", "-2.3%", "bg-yellow-500"],
              ["Violet Sky", "Indie Artist", "$22,890", "$18,765", "$2,340", "$1,785", "+12.1%", "bg-red-500"],
              ["Neo Wave", "Synthpop Band", "$18,345", "$15,230", "$1,890", "$1,225", "+5.8%", "bg-blue-400"],
            ].map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <span className={`w-9 h-9 flex items-center justify-center text-white text-xs rounded-full ${row[7]}`}>
                    {row[0].split(" ").map(word => word[0]).join("")}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{row[0]}</p>
                    <p className="text-gray-500 text-xs">{row[1]}</p>
                  </div>
                </td>

                <td className="p-4 font-medium text-red-600">{row[2]}</td>
                <td className="p-4 text-center">{row[3]}</td>
                <td className="p-4 text-center">{row[4]}</td>
                <td className="p-4 text-center">{row[5]}</td>

                <td className={`p-4 text-center`}>
                  <span className={`px-3 py-1 text-xs rounded-full ${row[6].includes("+") ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}>
                    {row[6]}
                  </span>
                </td>

                <td className="p-4 flex gap-4 justify-center text-gray-600">
                  <Eye className="cursor-pointer hover:text-red-600" size={17} />
                  <DownloadCloud className="cursor-pointer hover:text-blue-600" size={17} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Performing Tracks */}
      <div className="bg-white shadow-md  rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 bg-gray-50 mb-4">Top Performing Tracks</h3>

        <div className="space-y-4 ">
          {[
            ["Midnight Dreams", "Luna Gray", "$8,450", "#1", "bg-red-600"],
            ["Echoes of You", "Arion Keys", "$7,230", "#2", "bg-green-600"],
            ["Lost Frequency", "DJ Nova", "$6,890", "#3", "bg-blue-600"],
            ["Golden Waves", "Violet Sky", "$5,670", "#4", "bg-yellow-500"],
            ["City Lights", "Neo Wave", "$4,980", "#5", "bg-emerald-500"],
          ].map((track, i) => (
            <div key={i} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium text-gray-800">{track[0]}</p>
                <p className="text-gray-500 text-xs">{track[1]} • {track[2]}</p>
              </div>
              <span className={`${track[4]} text-white text-xs px-3 py-1 rounded-md`}>
                {track[3]}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RevenueReport;

