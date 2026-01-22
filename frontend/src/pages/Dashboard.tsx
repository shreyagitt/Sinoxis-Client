// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
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

  const [totalReleases, setTotalReleases] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalArtists, setTotalArtists] = useState(0);
  const [recentReleases, setRecentReleases] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // ───── RELEASES ─────
        const releasesRes = await axios.get(`${baseUrl}/release`, { headers });
        const releases =
          releasesRes.data?.data ||
          releasesRes.data?.releases ||
          [];

        setTotalReleases(releases.length);
        setRecentReleases(releases.slice(0, 4));

        // ───── USERS (ONLY CLIENTS) ─────
        const usersRes = await axios.get(`${baseUrl}/users`, { headers });

        const allUsers =
          usersRes.data?.data ||
          usersRes.data?.users ||
          [];

        // 🔥 Filter only client users
        const clientUsers = allUsers.filter(
          (u) => u.role === "client" || u.isAdmin === false
        );

        setTotalUsers(clientUsers.length);

        // ───── ARTISTS ─────
        const artistsRes = await axios.get(`${baseUrl}/artist`, { headers });
        const artists =
          artistsRes.data?.data ||
          artistsRes.data?.artists ||
          [];

        setTotalArtists(artists.length);

      } catch (err) {
        console.error("Admin dashboard load failed:", err);
        toast.error("Admin dashboard load failed");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-[20px] font-sans bg-[#FFFFFF] dark:bg-[#020726] text-[#020726] dark:text-[#FFFFFF] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#ddd] dark:border-[#1F2937] pb-[12px] mb-[20px]">
        <h1 className="text-[26px] m-0 font-[600] text-[#2d2f31] dark:text-[#FFFFFF]">
          Admin Dashboard
        </h1>

        <nav>
          <ol className="list-none flex items-center gap-[6px] text-[14px] text-[#6c757d] dark:text-[#D1D5DB]">
            <li className="text-[#29B6F6] font-[500]">Home</li>
            <li>/</li>
            <li>Dashboard</li>
          </ol>
        </nav>
      </div>

      {/* Top Stats */}
      <div
        className="grid gap-[20px]"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {[
          { title: "Total Releases", value: totalReleases, color: "#29B6F6" },
          { title: "Total Users", value: totalUsers, color: "#16a34a" }, // 🔥 now only clients
          { title: "Total Artists", value: totalArtists, color: "#f59e0b" },
        ].map((item, i) => (
          <div
            key={i}
            className="border border-[#eee] dark:border-[#1F2937] rounded-[10px] bg-[#FFFFFF] dark:bg-[#020726] shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-[16px]"
          >
            <h6 className="text-[16px] mb-[6px] text-[#555] dark:text-[#D1D5DB]">
              {item.title}
            </h6>
            <h2 className="text-[26px] font-[600] m-0">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Releases */}
      <div className="bg-[#FFFFFF] dark:bg-[#020726] border border-[#cfd4e2] dark:border-[#1F2937] rounded-[10px] shadow-[0_3px_10px_rgba(0,0,0,0.08)] p-[20px] mt-[20px]">
        <div className="flex justify-between items-center mb-[15px]">
          <h2 className="text-[18px] font-[600]">Recent Releases</h2>
          <button
            onClick={() => navigate("/releases")}
            className="bg-[#29B6F6] hover:bg-[#0288D1] px-[14px] py-[6px] rounded-[6px] text-white text-[13px]"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentReleases.map((r, i) => (
            <div
              key={r._id || i}
              className="border border-[#eee] dark:border-[#1F2937] rounded-[10px] overflow-hidden bg-[#fff] dark:bg-[#0B1029] hover:scale-[1.02] transition-transform cursor-pointer"
              onClick={() => navigate(`/releases/${r._id}`)}
            >
              <div className="w-full aspect-square bg-[#111827]">
                <img
                  src={
                    r.cover ||
                    "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
                  }
                  alt="Release cover"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-[12px]">
                <p className="text-[13px] text-[#999] dark:text-[#9ca3af] truncate">
                  {r.artist || "—"}
                </p>
                <p className="text-[16px] font-[600] truncate">
                  {r.title || "Untitled"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
