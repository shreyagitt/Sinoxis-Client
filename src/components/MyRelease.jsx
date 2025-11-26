// src/pages/Releases.jsx
import React, { useEffect, useState } from "react";
import { Edit3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar"; // ⭐ THEME SUPPORT
import ViewReleaseModal from "../components/ViewReleaseModal";

const COVER_PLACEHOLDER =
  "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png";

const STORAGE_KEY = "my_releases_v1";
const loadReleases = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveReleases = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const initialDemo = [
  {
    id: 1,
    title: "Demo Song Title",
    artist: "Demo Artist",
    label: "Demo Label",
    isrc: "INSI32500000",
    upc: "744662977286",
    status: "Rejected",
    cover: COVER_PLACEHOLDER,
    createdAt: "2025-01-01",
  },
  {
    id: 2,
    title: "Demo Song Title",
    artist: "Demo Artist",
    label: "Demo Label",
    isrc: "INSI32500001",
    upc: "744662977287",
    status: "Inactive",
    cover: COVER_PLACEHOLDER,
    createdAt: "2025-02-01",
  },
  {
    id: 3,
    title: "Demo Song Title",
    artist: "Demo Artist",
    label: "Demo Label",
    isrc: "INSI32500002",
    upc: "744662977288",
    status: "Pending",
    cover: COVER_PLACEHOLDER,
    createdAt: "2025-03-01",
  },
  {
    id: 4,
    title: "Demo Song Title",
    artist: "Demo Artist",
    label: "Demo Label",
    isrc: "INSI32500003",
    upc: "744662977289",
    status: "Approved",
    cover: COVER_PLACEHOLDER,
    createdAt: "2025-04-01",
  },
];

function statusClasses(status, theme) {
  const textDark = theme === "dark" ? "text-[#000]" : "text-[#020726]";

  switch (status) {
    case "Rejected":
      return `bg-[#ff0000] ${textDark} font-semibold`;
    case "Inactive":
      return `bg-[#5aa3ff] ${textDark} font-semibold`;
    case "Pending":
      return `bg-[#ffd300] ${textDark} font-semibold`;
    case "Approved":
      return `bg-[#33ff8b] ${textDark} font-semibold`;
    default:
      return "bg-gray-500 text-white";
  }
}

export default function Releases() {
  const navigate = useNavigate();
  const { theme } = useTheme(); // ⭐ GET THEME

  // theme adaptive colors
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-md";

  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const tableBorder = theme === "dark" ? "border-white/10" : "border-gray-300";

  const inputBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/20 text-white placeholder-gray-400"
      : "bg-gray-100 border-gray-300 text-[#020726] placeholder-gray-500";

  const filterActive =
    theme === "dark"
      ? "border-[#29B6F6] text-[#29B6F6]"
      : "border-[#0288D1] text-[#0288D1]";

  const filterDefault =
    theme === "dark"
      ? "border-[#0A84FF] text-[#0A84FF] hover:bg-[#00AEEF] hover:text-white"
      : "border-[#0288D1] text-[#0288D1] hover:bg-[#29B6F6] hover:text-white";

  // states
  const [releases, setReleases] = useState(() => loadReleases() || initialDemo);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [countPage, setCountPage] = useState({ page: 1, perPage: 10 });
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    if (!loadReleases()) saveReleases(initialDemo);
  }, []);

  useEffect(() => {
    saveReleases(releases);
  }, [releases]);

  const openCreate = () => navigate("/releases/create");
  const openEdit = (id) => navigate(`/releases/edit/${id}`);
  const openView = (r) => setViewing(r);

  const filtered = releases.filter((r) => {
    if (filter !== "All" && r.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(s) ||
      r.artist.toLowerCase().includes(s) ||
      r.label.toLowerCase().includes(s)
    );
  });

  const totalCount = releases.length;
  const countText = `${Math.min(
    countPage.page,
    Math.ceil(totalCount / countPage.perPage) || 1
  )} / ${Math.ceil(totalCount / countPage.perPage) || 1}`;

  return (
    <div className={`min-h-screen px-6 py-8 transition-all duration-300 ${pageBg}`}>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-semibold">My Releases</h1>
        <div className="text-sm">
          <span className={subtleText}>Home / </span>
          <span className="text-[#29B6F6]">My Releases</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-wrap justify-between gap-4">
        <div>
          <div className={`text-sm font-medium mb-3 ${subtleText}`}>
            Release Count
          </div>
          <div className="flex gap-3 flex-wrap">
            {["All", "Approved", "Pending", "Action Required", "Unfinished", "Rejected"].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`
                    px-4 py-2 rounded-md border transition-all 
                    ${
                      filter === t
                        ? `${filterActive} bg-transparent`
                        : `${filterDefault}`
                    }
                  `}
                >
                  {t}
                </button>
              )
            )}
          </div>
        </div>

        <div className={`text-sm ${subtleText}`}>{countText}</div>
      </div>

      {/* CARD */}
      <div className={`rounded-2xl p-6 border ${cardBg}`}>
        {/* TOP BAR */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Manage Releases</h2>

          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type & Enter to search"
              className={`px-4 py-2 rounded-full focus:outline-none ${inputBg}`}
            />
            <button
              onClick={openCreate}
              className="px-5 py-2 rounded-full text-white font-semibold"
              style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}
            >
              Create Release
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left">
            <thead>
              <tr className={`${subtleText} ${tableBorder} border-b`}>
                <th className="py-3 px-4">Cover Art</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Artist</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">ISRC</th>
                <th className="py-3 px-4">UPC</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={`${tableBorder} border-b ${
                    theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100"
                  } transition`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={r.cover || COVER_PLACEHOLDER}
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>

                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.artist}</td>
                  <td className="px-4 py-3">{r.label}</td>
                  <td className="px-4 py-3">{r.isrc}</td>
                  <td className="px-4 py-3">{r.upc}</td>

                  {/* Status Pill */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses(
                        r.status,
                        theme
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* ACTION BUTTONS FIXED FOR LIGHT MODE */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">

                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => openEdit(r.id)}
                        className={`
                          w-10 h-10 flex items-center justify-center rounded-full border group transition
                          ${
                            theme === "dark"
                              ? "border-amber-400 hover:bg-amber-400"
                              : "border-amber-600 hover:bg-amber-100"
                          }
                        `}
                      >
                        <Edit3
                          size={18}
                          className={`
                            ${
                              theme === "dark"
                                ? "text-amber-300 group-hover:text-white"
                                : "text-amber-700 group-hover:text-amber-800"
                            }
                          `}
                        />
                      </button>

                      {/* VIEW BUTTON */}
                      <button
                        onClick={() => openView(r)}
                        className={`
                          w-10 h-10 flex items-center justify-center rounded-full border group transition
                          ${
                            theme === "dark"
                              ? "border-sky-500 hover:bg-sky-500"
                              : "border-sky-600 hover:bg-sky-100"
                          }
                        `}
                      >
                        <Eye
                          size={18}
                          className={`
                            ${
                              theme === "dark"
                                ? "text-sky-400 group-hover:text-white"
                                : "text-sky-700 group-hover:text-sky-900"
                            }
                          `}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={`py-8 text-center ${subtleText}`}>
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewing && (
        <ViewReleaseModal
          release={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setViewing(null);
            navigate(`/releases/edit/${viewing.id}`);
          }}
        />
      )}
    </div>
  );
}
