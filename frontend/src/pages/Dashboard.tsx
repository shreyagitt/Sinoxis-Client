import React, { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import Row2 from "../Components/Dashboard/row2";

const Dashboard = () => {
  // Detect dark mode by checking <html>.dark presence; update live via MutationObserver
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setIsDark(el.classList.contains("dark"));
    });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // === Chart Config (Sinoxis colors + dynamic by theme) ===
  const revenueOptions = useMemo(() => {
    const textColor = isDark ? "#FFFFFF" : "#020726"; // Deep Navy in light, white in dark
    const gridColor = isDark ? "#1F2937" : "#e3e6f0";
    const axisLabelColor = isDark ? "#D1D5DB" : "#555";

    return {
      chart: {
        type: "line",
        toolbar: { show: false },
        height: 300,
        zoom: { enabled: false },
        foreColor: textColor,
        background: "transparent",
      },
      stroke: {
        curve: "stepline",
        width: 2,
        colors: ["#0288D1", "#29B6F6"], // Sinoxis colors
      },
      colors: ["#0288D1", "#29B6F6"],
      markers: {
        size: 5,
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: { size: 7 },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.2,
          gradientToColors: ["#29B6F6", "#0288D1"],
          opacityFrom: 0.8,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      xaxis: {
        categories: [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ],
        labels: { style: { colors: axisLabelColor } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (val) => `$${val}`,
          style: { colors: axisLabelColor },
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: { formatter: (val) => `$${val}` },
      },
      legend: {
        show: true,
        position: "top",
        labels: { colors: axisLabelColor },
        markers: { width: 12, height: 12, radius: 12 },
      },
    };
  }, [isDark]);

  const revenueSeries = [
    { name: "Revenue", data: [100,150,160,180,200,250,120,240,180,240,200,260] },
    { name: "Expenses", data: [50,80,90,60,130,120,100,80,90,70,100,120] },
  ];

  // === All layout content preserved; inline styles replaced with Tailwind exact-px utilities ===
  return (
    <div className="p-[20px] font-sans bg-[#FFFFFF] dark:bg-[#020726] text-[#020726] dark:text-[#FFFFFF] min-h-screen">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center border-b border-[#ddd] dark:border-[#1F2937] pb-[12px] mb-[20px]">
        {/* Page Title */}
        <h1 className="text-[26px] m-0 font-[600] text-[#2d2f31] dark:text-[#FFFFFF]">
          Dashboard
        </h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="list-none flex items-center gap-[6px] m-0 p-0 text-[14px] text-[#6c757d] dark:text-[#D1D5DB]">
            <li>
              <a
                href="javascript:void(0)"
                className="no-underline text-[#29B6F6] dark:text-[#29B6F6] font-[500]"
              >
                Home
              </a>
            </li>
            <li className="text-[#6c757d] dark:text-[#D1D5DB]">/</li>
            <li className="text-[#6c757d] dark:text-[#D1D5DB] font-[500]">Dashboard</li>
          </ol>
        </nav>
      </div>

      {/* ===== Top Stats Section ===== */}
      <div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {[
            { title: "Total Users", value: "47", change: "5%", color: "#16a34a" },
            { title: "Total Profit", value: "₹67,987", change: "5%", color: "#16a34a" },
            { title: "Total Expenses", value: "₹76,965", change: "0.9%", color: "green" },
            { title: "Total Cost", value: "₹59,765", change: "0.6%", color: "orange" },
          ].map((item, i) => (
            <div
              key={i}
              className="border border-[#eee] dark:border-[#1F2937] rounded-[10px] bg-[#FFFFFF] dark:bg-[#020726] shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-[16px] mb-[20px]"
            >
              <div className="flex justify-between">
                <div>
                  <h6 className="text-[16px] mb-[6px] text-[#555] dark:text-[#D1D5DB]">
                    {item.title}
                  </h6>
                  <h2 className="text-[24px] font-[600] m-0 text-current">{item.value}</h2>
                </div>
                <div className="w-[96px] h-[64px] rounded-[5px] bg-[#f2f2f2] dark:bg-[#111827]" />
              </div>

              <span className="text-[12px] text-[#999] dark:text-[#9ca3af]">
                <span style={{ color: item.color, fontWeight: 500 }}>↑ {item.change}</span> Last week
              </span>
            </div>
          ))}
        </div>

        {/* ===== Revenue Growth Chart ===== */}
        <div className="bg-[#FFFFFF] dark:bg-[#020726] border border-[#cfd4e2] dark:border-[#1F2937] rounded-[10px] shadow-[0_3px_10px_rgba(0,0,0,0.08)] p-[20px] mt-[20px]">
          <h2 className="text-[18px] font-[600] text-[#333] dark:text-[#E5E7EB] mb-[15px]">Revenue Growth</h2>
          <Chart options={revenueOptions} series={revenueSeries} type="line" height={300} />
        </div>

        {/* ===== SMS Widgets ===== */}
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
          {[
            { label: "Delivery", color: "green", value: "100%", icon: "📊" },
            { label: "SMS Sent", color: "red", value: "1+", icon: "✉️" },
            { label: "Promotional", color: "blue", value: "25+", icon: "📢" },
            { label: "Transactional", color: "orange", value: "15+", icon: "🔁" },
          ].map((item, idx) => (
            <div key={idx} className="border border-[#eee] dark:border-[#1F2937] rounded-[10px] bg-[#FFFFFF] dark:bg-[#0B1029] shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-[16px] mb-[20px]">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-[16px] mb-[6px] text-[#555] dark:text-[#D1D5DB]">{item.label}</h6>
                  <span className="text-[13px] rounded-[5px] px-[8px] py-[2px] text-white" style={{ backgroundColor: item.color }}>
                    {item.value}
                  </span>
                </div>

                <div className="text-[20px] bg-[#f0f0f0] dark:bg-[#111827] rounded-[50%] w-[36px] h-[36px] flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Deliveries Table ===== */}
        <div className="mt-[20px]">
          <div className="border border-[#eee] dark:border-[#1F2937] rounded-[10px] bg-[#FFFFFF] dark:bg-[#020726] shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-[16px]">
            <div className="border-b border-[#eee] dark:border-[#1F2937] pb-[10px]">
              <h3 className="m-0 text-[18px] text-current">Deliveries</h3>
            </div>

            <div className="mt-[10px]">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr style={{ color: "#666" }}>
                    <th>Particular</th>
                    <th>Percentage</th>
                    <th style={{ textAlign: "right" }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: "green" }}>On Time Delivery</td>
                    <td>
                      <div className="flex items-center gap-[10px]">
                        <div className="flex-1 h-[6px] bg-[#eee] dark:bg-[#111827] rounded-[3px] overflow-hidden">
                          <div className="h-full w-[80%] bg-green-600" />
                        </div>
                        <span>80%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", color: "#333" }}>₹45,452.23</td>
                  </tr>

                  <tr>
                    <td style={{ color: "orange" }}>Delayed Delivery</td>
                    <td>
                      <div className="flex items-center gap-[10px]">
                        <div className="flex-1 h-[6px] bg-[#eee] dark:bg-[#111827] rounded-[3px] overflow-hidden">
                          <div className="h-full w-[15%] bg-orange-500" />
                        </div>
                        <span>15%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", color: "#333" }}>₹15,256.23</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ROW2 */}
        <div className="mt-[20px]">
          <Row2 />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

