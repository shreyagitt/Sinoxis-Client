import React from "react";
import Chart from "react-apexcharts";
import { Users, DollarSign, TrendingUp, CreditCard } from "lucide-react";

const Revenue = () => {
  // === Chart Config ===
  const revenueOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      height: 300,
      zoom: { enabled: false },
    },
    stroke: {
      curve: "stepline",
      width: 2,
      colors: ["#f82c29ff", "#ff8f00"],
    },
    colors: ["#f82c29ff", "#ff8f00"],
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: "#e3e6f0", strokeDashArray: 4 },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.2,
        gradientToColors: ["#f82c29ff", "#ffb300"],
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      labels: { style: { colors: "#555" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}`,
        style: { colors: "#555" },
      },
    },
    tooltip: { y: { formatter: (val) => `$${val}` } },
    legend: {
      show: true,
      position: "top",
      markers: { width: 12, height: 12, radius: 12 },
    },
  };

  const revenueSeries = [
    {
      name: "Revenue",
      data: [100, 150, 160, 180, 200, 250, 120, 240, 180, 240, 200, 260],
    },
    {
      name: "Expenses",
      data: [50, 80, 90, 60, 130, 120, 100, 80, 90, 70, 100, 120],
    },
  ];

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      {/* === Page Header === */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 ">
        <h1 className="text-2xl font-semibold text-gray-800">Revenue Reports</h1>
        <ol className="flex space-x-2 text-sm text-gray-500 mt-2 sm:mt-0">
          <li>Home</li>
          <li>/</li>
          <li className="text-red-500 font-medium">Revenue Reports</li>
        </ol>
      </div>

      {/* === Main Grid === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Revenue Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-semibold text-gray-800">Revenue Growth</h4>
          </div>
          <Chart options={revenueOptions} series={revenueSeries} type="line" height={300} />
        </div>

        {/* === Updated Stats Cards === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard
            title="Total Users"
            value="44,278"
            percentage="↑ 5% Last week"
            color="red"
            icon={<Users size={28} />}
          />
          <StatCard
            title="Total Profit"
            value="₹67,987"
            percentage="↑ 5% Last week"
            color="red"
            icon={<DollarSign size={28} />}
          />
          <StatCard
            title="Total Expenses"
            value="₹76,965"
            percentage="↓ 0.9% Last 9 days"
            color="red"
            icon={<CreditCard size={28} />}
          />
          <StatCard
            title="Total Cost"
            value="₹59,765"
            percentage="↑ 0.6% Last year"
            color="red"
            icon={<TrendingUp size={28} />}
          />
        </div>
      </div>

      {/* === Deliveries Table === */}
      <div className="bg-white p-6 rounded-lg shadow-md">
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
                <td className="text-red-600 p-2 font-medium">On Time Delivery</td>
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

    </div>
  );
};

// === Updated Stat Card Component ===
const StatCard = ({ title, value, percentage, color, icon }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md flex justify-between items-center border-t-4 border-${color}-600 hover:bg-${color}-50 transition-all duration-300`}
    >
      <div>
        <h5 className="text-lg font-semibold text-gray-700">{title}</h5>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-sm mt-2 font-medium text-${color}-600`}>{percentage}</p>
      </div>
      <div
        className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}
      >
        {icon}
      </div>
    </div>
  );
};

export default Revenue;
