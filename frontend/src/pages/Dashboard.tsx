import React from "react";
import Chart from "react-apexcharts";
import Row2 from '../Components/Dashboard/row2';


const Dashboard = () => {
  // === Chart Config ===
  const revenueOptions = {
  chart: { 
    type: "line", 
    toolbar: { show: false }, 
    height: 300,
    zoom: { enabled: false }
  },
  stroke: { 
    curve: "stepline", 
    width: 2, // 🔥 thicker, more visible line
    colors: ["#00c853", "#ff8f00"], // brighter & solid colors
  },
  colors: ["#00c853", "#ff8f00"],
  markers: {
    size: 5,
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: { size: 7 },
  },
  dataLabels: { enabled: false },
  grid: { 
    borderColor: "#e3e6f0",
    strokeDashArray: 4 
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 0.2,
      gradientToColors: ["#03351dfc", "#ffb300"], // subtle fade
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
      style: { colors: "#555" } 
    },
  },
  tooltip: { y: { formatter: (val) => `$${val}` } },
  legend: { 
    show: true,
    position: "top",
    markers: { width: 12, height: 12, radius: 12 }
  },
};

const revenueSeries = [
  { name: "Revenue", data: [100, 150, 160, 180, 200, 250, 120, 240, 180, 240, 200, 260] },
  { name: "Expenses", data: [50, 80, 90, 60, 130, 120, 100, 80, 90, 70, 100, 120] },
];

  // === Shared Styles ===
  const cardStyle = {
    border: "1px solid #eee",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    padding: "16px",
    marginBottom: "20px",
  };
  const titleStyle = { fontSize: "16px", marginBottom: "6px", color: "#555" };
  const numberStyle = { fontSize: "24px", fontWeight: "600", margin: "0" };
  const textMuted = { color: "#999", fontSize: "12px" };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* ===== Header ===== */}
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    paddingBottom: "12px",
    marginBottom: "20px",
  }}
>
  {/* Page Title */}
  <h1
    style={{
      fontSize: "26px",
      color: "#2d2f31",
      margin: 0,
      fontWeight: "600",
    }}
  >
    Dashboard
  </h1>

  {/* Breadcrumb */}
  <nav aria-label="breadcrumb">
    <ol
      style={{
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        margin: 0,
        padding: 0,
        fontSize: "14px",
        color: "#6c757d",
      }}
    >
      <li>
        <a
          href="javascript:void(0)"
          style={{
            textDecoration: "none",
            color: "#16a34a",
            fontWeight: "500",
          }}
        >
          Home
        </a>
      </li>
      <li style={{ color: "#6c757d" }}>/</li>
      <li
        style={{
          color: "#6c757d",
          fontWeight: "500",
        }}
      >
        Dashboard
      </li>
    </ol>
  </nav>
</div>


      {/* ===== Top Stats Section ===== */}
     <div> <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {[
          { title: "Total Users", value: "47", change: "5%", color: "#16a34a" },
          { title: "Total Profit", value: "₹67,987", change: "5%", color: "#16a34a" },
          { title: "Total Expenses", value: "₹76,965", change: "0.9%", color: "green" },
          { title: "Total Cost", value: "₹59,765", change: "0.6%", color: "orange" },
        ].map((item, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h6 style={titleStyle}>{item.title}</h6>
                <h2 style={numberStyle}>{item.value}</h2>
              </div>
              <div
                style={{
                  width: "96px",
                  height: "64px",
                  backgroundColor: "#f2f2f2",
                  borderRadius: "5px",
                }}
              ></div>
            </div>
            <span style={textMuted}>
              <span style={{ color: item.color, fontWeight: "500" }}>↑ {item.change}</span> Last
              week
            </span>
          </div>
        ))}
      </div>

      {/* ===== Revenue Growth Chart ===== */}
      <div
  style={{
    backgroundColor: "#fff",
    border: "1px solid #cfd4e2", // slightly darker for visible border
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    padding: "20px",
    marginTop: "20px",
  }}
>
  <h2
    style={{
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "15px",
    }}
  >
    Revenue Growth
  </h2>
  <Chart options={revenueOptions} series={revenueSeries} type="line" height={300} />
</div>

      {/* ===== SMS Widgets ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {[
          { label: "Delivery", color: "green", value: "100%", icon: "📊" },
          { label: "SMS Sent", color: "red", value: "1+", icon: "✉️" },
          { label: "Promotional", color: "blue", value: "25+", icon: "📢" },
          { label: "Transactional", color: "orange", value: "15+", icon: "🔁" },
        ].map((item, idx) => (
          <div key={idx} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h6 style={titleStyle}>{item.label}</h6>
                <span
                  style={{
                    backgroundColor: item.color,
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "5px",
                    fontSize: "13px",
                  }}
                >
                  {item.value}
                </span>
              </div>
              <div
                style={{
                  fontSize: "20px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Deliveries Table ===== */}
      <div style={{ marginTop: "20px" }}>
        <div style={cardStyle}>
          <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "18px" }}>Deliveries</h3>
          </div>
          <div style={{ marginTop: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", fontSize: "13px", color: "#666" }}>
                  <th>Particular</th>
                  <th>Percentage</th>
                  <th style={{ textAlign: "right" }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: "green" }}>On Time Delivery</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          flexGrow: 1,
                          height: "6px",
                          backgroundColor: "#eee",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{ width: "80%", backgroundColor: "green", height: "100%" }}
                        ></div>
                      </div>
                      <span>80%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right", color: "#333" }}>₹45,452.23</td>
                </tr>
                <tr>
                  <td style={{ color: "orange" }}>Delayed Delivery</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          flexGrow: 1,
                          height: "6px",
                          backgroundColor: "#eee",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{ width: "15%", backgroundColor: "orange", height: "100%" }}
                        ></div>
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
        <div><Row2 /></div>
        
      </div>
    </div>
  );
};

export default Dashboard;

