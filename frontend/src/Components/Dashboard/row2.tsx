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
  // Chart 1: Sales Analytics (Line)
  const salesOptions = {
    chart: {
      type: "line",
      height: 340,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#16a34a"],
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
    dataLabels: { enabled: false },
    grid: { borderColor: "#e0e0e0" },
  };

  const salesSeries = [{ name: "Sales", data: [31, 40, 28, 51, 42, 109, 100] }];

  // Chart 2: User Visits (Bar)
  const userVisitOptions = {
    chart: {
      type: "bar",
      height: 340,
      toolbar: { show: false },
    },
    plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
    colors: ["#ff8f00", "#16a34a"],
    dataLabels: { enabled: false },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    grid: { borderColor: "#e0e0e0" },
    legend: { position: "top" },
  };

  const userVisitSeries = [
    { name: "Chrome", data: [44, 55, 41, 37, 22, 43, 21] },
    { name: "Firefox", data: [53, 32, 33, 52, 13, 44, 32] },
  ];

  // Data for Report Card Chart
  const reportData = [
    { name: "Jan", income: 4000, expense: 2400, profit: 1600 },
    { name: "Feb", income: 3000, expense: 1398, profit: 1602 },
    { name: "Mar", income: 5000, expense: 2800, profit: 2200 },
    { name: "Apr", income: 4780, expense: 3908, profit: 870 },
    { name: "May", income: 5890, expense: 4800, profit: 1090 },
    { name: "Jun", income: 4390, expense: 3800, profit: 590 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      {/* Sales Analytics Card */}
      <div
        style={{
          flex: "1 1 31%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #eee",
            padding: "16px 20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              margin: 0,
              color: "#222",
              fontWeight: 600,
            }}
          >
            Sales Analytics
          </h3>
        </div>

        <div style={{ padding: "10px 20px" }}>
          <Chart options={salesOptions} series={salesSeries} type="line" height={340} />
        </div>
      </div>

      {/* User Visits Card */}
      <div
        style={{
          flex: "1 1 31%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #eee",
            padding: "16px 20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              margin: 0,
              color: "#222",
              fontWeight: 600,
            }}
          >
            User Visits by Day
          </h3>
        </div>

        <div style={{ padding: "10px 20px" }}>
          <Chart
            options={userVisitOptions}
            series={userVisitSeries}
            type="bar"
            height={340}
          />
        </div>
      </div>

      {/* Report Card */}
      <div
        style={{
          flex: "1 1 31%",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "16px", color: "#333" }}>
              Report
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>
              Monthly Avg. ₹45.578k
            </div>
          </div>
          <div style={{ fontSize: "20px", color: "#999" }}>⋮</div>
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={reportData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ff8f00"
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#16a34a"
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Income */}
        <div
          style={{
            background: "#f9f9fc",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#eef2ff",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaPaypal />
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "#333" }}>Income</div>
              <div style={{ fontWeight: 600, color: "#111" }}>₹42,845</div>
            </div>
          </div>
          <div style={{ color: "#22c55e", fontSize: "13px" }}>+2.34k</div>
        </div>

        {/* Expense */}
        <div
          style={{
            background: "#f9f9fc",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#fff7ed",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiShoppingBag />
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "#333" }}>Expense</div>
              <div style={{ fontWeight: 600, color: "#111" }}>₹38,658</div>
            </div>
          </div>
          <div style={{ color: "#f59e0b", fontSize: "13px" }}>-1.15k</div>
        </div>

        {/* Profit */}
        <div
          style={{
            background: "#f9f9fc",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#ecfdf5",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdAccountBalanceWallet />
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "#333" }}>Profit</div>
              <div style={{ fontWeight: 600, color: "#111" }}>₹18,220</div>
            </div>
          </div>
          <div style={{ color: "#22c55e", fontSize: "13px" }}>+1.35k</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRow;
