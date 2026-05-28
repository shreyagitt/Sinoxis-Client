import React from "react";
import Chart from "react-apexcharts";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaPaypal } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { MdAccountBalanceWallet } from "react-icons/md";

const DashboardRow: React.FC = () => {
  // SALES CHART
  const salesOptions = {
    chart: {
      type: "line",
      height: 340,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#0288D1"], // Sinoxis Blue
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
    dataLabels: { enabled: false },
    grid: { borderColor: "rgba(200,200,200,0.2)" },
  };

  const salesSeries = [{ name: "Sales", data: [31, 40, 28, 51, 42, 109, 100] }];

  // USER VISIT CHART
  const userVisitOptions = {
    chart: {
      type: "bar",
      height: 340,
      toolbar: { show: false },
    },
    plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
    colors: ["#0288D1", "#29B6F6"], // Sinoxis Blue gradient range
    dataLabels: { enabled: false },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    grid: { borderColor: "rgba(200,200,200,0.2)" },
    legend: { position: "top" },
  };

  const userVisitSeries = [
    { name: "Chrome", data: [44, 55, 41, 37, 22, 43, 21] },
    { name: "Firefox", data: [53, 32, 33, 52, 13, 44, 32] },
  ];

  const reportData = [
    { name: "Jan", income: 4000, expense: 2400, profit: 1600 },
    { name: "Feb", income: 3000, expense: 1398, profit: 1602 },
    { name: "Mar", income: 5000, expense: 2800, profit: 2200 },
    { name: "Apr", income: 4780, expense: 3908, profit: 870 },
    { name: "May", income: 5890, expense: 4800, profit: 1090 },
    { name: "Jun", income: 4390, expense: 3800, profit: 590 },
  ];

  return (
    <div className="flex flex-wrap gap-5 justify-between mt-5">
      {/* SALES ANALYTICS */}
      <div className="flex-1 min-w-[31%] bg-white dark:bg-[#020726] rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-100 dark:bg-[#111A3A]">
          <h3 className="text-[18px] font-semibold text-gray-800 dark:text-white">
            Sales Analytics
          </h3>
        </div>

        <div className="px-5 py-2">
          <Chart options={salesOptions} series={salesSeries} type="line" height={340} />
        </div>
      </div>

      {/* USER VISITS */}
      <div className="flex-1 min-w-[31%] bg-white dark:bg-[#020726] rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-100 dark:bg-[#111A3A]">
          <h3 className="text-[18px] font-semibold text-gray-800 dark:text-white">
            User Visits by Day
          </h3>
        </div>

        <div className="px-5 py-2">
          <Chart options={userVisitOptions} series={userVisitSeries} type="bar" height={340} />
        </div>
      </div>

      {/* REPORT CARD */}
      <div className="flex-1 min-w-[31%] bg-white dark:bg-[#020726] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-[16px] font-semibold text-gray-800 dark:text-white">Report</div>
            <div className="text-[13px] text-gray-600 dark:text-gray-300">
              Monthly Avg. ₹45.578k
            </div>
          </div>
          <div className="text-[20px] text-gray-500 dark:text-gray-300">⋮</div>
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={reportData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0288D1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0288D1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#29B6F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#29B6F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />

            <Area type="monotone" dataKey="income" stroke="#0288D1" fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="expense" stroke="#29B6F6" fill="url(#colorExpense)" />
            <Area type="monotone" dataKey="profit" stroke="#16a34a" fill="url(#colorProfit)" />
          </AreaChart>
        </ResponsiveContainer>

        {/* INCOME */}
        <div className="bg-gray-50 dark:bg-[#111A3A] rounded-lg p-3 flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <FaPaypal />
            </div>
            <div>
              <div className="text-[14px] text-gray-800 dark:text-gray-200">Income</div>
              <div className="font-semibold text-gray-900 dark:text-white">₹42,845</div>
            </div>
          </div>
          <div className="text-green-500 text-[13px]">+2.34k</div>
        </div>

        {/* EXPENSE */}
        <div className="bg-gray-50 dark:bg-[#111A3A] rounded-lg p-3 flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-500 dark:text-orange-300 flex items-center justify-center">
              <FiShoppingBag />
            </div>
            <div>
              <div className="text-[14px] text-gray-800 dark:text-gray-200">Expense</div>
              <div className="font-semibold text-gray-900 dark:text-white">₹38,658</div>
            </div>
          </div>
          <div className="text-orange-500 text-[13px]">-1.15k</div>
        </div>

        {/* PROFIT */}
        <div className="bg-gray-50 dark:bg-[#111A3A] rounded-lg p-3 flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 flex items-center justify-center">
              <MdAccountBalanceWallet />
            </div>
            <div>
              <div className="text-[14px] text-gray-800 dark:text-gray-200">Profit</div>
              <div className="font-semibold text-gray-900 dark:text-white">₹18,220</div>
            </div>
          </div>
          <div className="text-green-500 text-[13px]">+1.35k</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRow;
