import React from "react";
import Chart from "react-apexcharts";
import {
  FaUsers,
  FaDollarSign,
  FaCreditCard,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaUser,
} from "react-icons/fa";

// === Data for Songs Table ===
const songs = [
  { title: "Midnight Dreams", artist: "Luna Gray", genre: "Pop", streams: "1.2M", status: "Trending", color: "green", release: "Oct 2025" },
  { title: "Echoes of You", artist: "Arion Keys", genre: "R&B", streams: "980K", status: "Rising", color: "blue", release: "Sep 2025" },
  { title: "Lost Frequency", artist: "DJ Nova", genre: "EDM", streams: "750K", status: "New", color: "yellow", release: "Aug 2025" },
  { title: "Golden Waves", artist: "Violet Sky", genre: "Indie", streams: "612K", status: "Completed", color: "green", release: "Jul 2025" },
  { title: "City Lights", artist: "Neo Wave", genre: "Synthpop", streams: "540K", status: "Active", color: "blue", release: "Jun 2025" },
];

// === Dashboard Component ===
const Dashboard = () => {
  const revenueOptions = {
    chart: { type: "line", toolbar: { show: false }, height: 300, zoom: { enabled: false } },
    stroke: { curve: "stepline", width: 2, colors: ["#d90429", "#ff8f00"] },
    colors: ["#d90429", "#ff8f00"],
    markers: { size: 5, strokeColors: "#fff", strokeWidth: 2, hover: { size: 7 } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#e3e6f0", strokeDashArray: 4 },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        gradientToColors: ["#d90429", "#ffb300"],
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      labels: { style: { colors: "#555" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { formatter: (val) => `₹${val}`, style: { colors: "#555" } } },
    tooltip: { y: { formatter: (val) => `₹${val}` } },
    legend: { show: true, position: "top", markers: { width: 12, height: 12, radius: 12 } },
  };

  const revenueSeries = [
    { name: "Revenue", data: [100,150,160,180,200,250,120,240,180,240,200,260] },
    { name: "Expenses", data: [50,80,90,60,130,120,100,80,90,70,100,120] },
  ];

  return (
    <div className="bg-gray-100 p-8 min-h-screen font-[Poppins]">
      {/* === Header === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <ol className="flex space-x-2 text-sm text-gray-500 mt-2 sm:mt-0">
          <li>Home</li>
          <li>/</li>
          <li className="text-red-700 font-medium">Dashboard</li>
        </ol>
      </div>

      {/* === Stats + Chart === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Revenue Growth</h4>
          <Chart options={revenueOptions} series={revenueSeries} type="line" height={300} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-red-500">
          <StatCard title="Total Users" value="44,278" percentage="↑ 5% Last week" color="red" icon={<FaUsers size={28} />} />
          <StatCard title="Total Profit" value="₹67,987" percentage="↑ 5% Last week" color="red" icon={<FaDollarSign size={28} />} />
          <StatCard title="Total Expenses" value="₹76,965" percentage="↓ 0.9% Last 9 days" color="red" icon={<FaCreditCard size={28} />} />
          <StatCard title="Total Cost" value="₹59,765" percentage="↑ 0.6% Last year" color="red" icon={<FaChartLine size={28} />} />
        </div>
      </div>

      {/* === Deliveries Table === */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Deliveries</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-gray-600">
            <thead className="border-b">
              <tr>
                <th className="text-left p-2">Particular</th>
                <th className="text-left p-2">Percentage</th>
                <th className="text-right p-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-red-700 p-2 font-medium">On Time Delivery</td>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="w-4/5 h-2 bg-red-500 rounded-full"></div>
                    <span className="ml-2">80%</span>
                  </div>
                </td>
                <td className="text-right p-2">₹45,452.23</td>
              </tr>
              <tr>
                <td className="text-yellow-500 p-2 font-medium">Delayed Delivery</td>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="w-3/12 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="ml-2">15%</span>
                  </div>
                </td>
                <td className="text-right p-2">₹15,256.23</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* === Songs Table === */}
<div className="bg-white rounded-lg shadow-md border border-gray-100">
  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800">
      Top Streaming Songs
    </h3>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-700 text-left uppercase text-[13px] font-semibold">
          <th className="py-3 px-6 w-[25%]">Track</th>
          <th className="py-3 px-6 w-[20%]">Artist</th>
          <th className="py-3 px-6 w-[15%]">Genre</th>
          <th className="py-3 px-6 w-[10%]">Streams</th>
          <th className="py-3 px-6 w-[15%]">Status</th>
          <th className="py-3 px-6 w-[15%] text-center">Actions</th>
        </tr>
      </thead>

      <tbody className="text-gray-700">
        {songs.map((song, i) => (
          <tr
            key={i}
            className="border-t border-gray-100 hover:bg-gray-50 transition"
          >
            {/* Track */}
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://placehold.co/50x50/0d6efd/ffffff?text=MG"
                  alt="track"
                  className="rounded w-[50px] h-[50px] object-cover"
                />
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-gray-500 text-xs">
                    Released: {song.release}
                  </p>
                </div>
              </div>
            </td>

            {/* Artist */}
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <span
                  className={`p-2 rounded-full bg-${song.color}-100 text-${song.color}-600`}
                >
                  <FaUser />
                </span>
                <span>{song.artist}</span>
              </div>
            </td>

            {/* Genre */}
            <td className="py-4 px-6 text-gray-600">{song.genre}</td>

            {/* Streams */}
            <td className="py-4 px-6 font-medium text-red-700">
              {song.streams}
            </td>

            {/* Status */}
            <td className="py-4 px-6">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full border border-${song.color}-300 text-${song.color}-600 bg-${song.color}-50`}
              >
                {song.status}
              </span>
            </td>

            {/* Actions */}
            <td className="py-4 px-6">
              <div className="flex justify-center items-center gap-4">
                <button className="px-3 py-1 rounded-md bg-green-100 text-green-600 font-medium hover:bg-green-600 hover:text-white transition">
                  <FaEdit />
                </button>
                <button className="px-3 py-1 rounded-md bg-red-100 text-red-600 font-medium hover:bg-red-600 hover:text-white transition">
                  <FaTrash />
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
};

// === Stat Card Component ===
const StatCard = ({ title, value, percentage, color, icon }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex justify-between items-center border-t-4 border-${color}-700 hover:bg-${color}-50 transition-all`}>
    <div>
      <h5 className="text-lg font-semibold text-gray-700">{title}</h5>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className={`text-sm mt-2 font-medium text-${color}-700`}>{percentage}</p>
    </div>
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-700`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
