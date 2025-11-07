// src/pages/Releases.jsx
import React, { useEffect, useState } from "react";
import { Edit3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewReleaseModal from "../components/ViewReleaseModal";

/**
 * Releases page - reads/writes releases from localStorage so the ReleaseForm
 * (separate file) can edit/create and return to this page.
 *
 * NOTE: Theme and layout follow your dark navy look + status badges.
 */

const COVER_PLACEHOLDER = "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png";

// helper to load/save from localStorage
const STORAGE_KEY = "my_releases_v1";
const loadReleases = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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

 function statusClasses(status) {
  switch (status) {
    case "Rejected":
      return "bg-[#ff0000] text-[#000] font-semibold"; 
      // bright red pill, black text

    case "Inactive":
      return "bg-[#5aa3ff] text-[#000] font-semibold"; 
      // bright sky blue pill

    case "Pending":
      return "bg-[#ffd300] text-[#000] font-semibold"; 
      // yellow pill, black text

    case "Approved":
      return "bg-[#33ff8b] text-[#000] font-semibold"; 
      // green pill like screenshot

    default:
      return "bg-gray-600 text-white";
  }
}



export default function Releases() {
  const navigate = useNavigate();
  const [releases, setReleases] = useState(() => loadReleases() || initialDemo);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [countPage, setCountPage] = useState({ page: 1, perPage: 10 });
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    // persist initial demo if nothing in storage
    if (!loadReleases()) saveReleases(initialDemo);
  }, []);

  useEffect(() => {
    saveReleases(releases);
  }, [releases]);

  const openCreate = () => navigate("/releases/create");
  const openEdit = (id) => navigate(`/releases/edit/${id}`);
  const openView = (release) => setViewing(release);

  const handleDelete = (id) => {
    if (!confirm("Delete this release?")) return;
    setReleases((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = releases.filter((r) => {
    if (filter !== "All" && r.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (r.title || "").toLowerCase().includes(s) ||
      (r.artist || "").toLowerCase().includes(s) ||
      (r.label || "").toLowerCase().includes(s)
    );
  });

  const totalCount = releases.length;
  const countText = `${Math.min(countPage.page, Math.ceil(totalCount / countPage.perPage) || 1)} / ${Math.ceil(totalCount / countPage.perPage) || 1}`;

  return (
    <div className="min-h-screen bg-[#020726] text-white px-6 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-semibold">My Releases</h1>
        <div className="text-sm">
          <span className="text-gray-300">Home / </span>
          <span className="text-[#29B6F6]">My Releases</span>
        </div>
      </div>

      {/* COUNTS + FILTERS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium mb-3">Release Count</div>
          <div className="flex gap-3 flex-wrap">
            {["All", "Approved", "Pending", "Action Required", "Unfinished", "Rejected"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`
  px-4 py-2 rounded-md border 
  transition-all
  
  ${filter === t 
    ? "border-[#29B6F6] text-[#29B6F6] bg-transparent hover:bg-transparent hover:text-[#29B6F6]"
    : "border-[#0A84FF] text-[#0A84FF] hover:bg-[#00AEEF] hover:text-white"
  }
`}

              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-300">{countText}</div>
      </div>

      {/* CARD */}
      <div className="bg-[#0a1039] rounded-2xl p-6 border border-white/10 shadow">
        {/* top bar */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Manage Releases</h2>

          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type & Enter to search"
              className="px-4 py-2 rounded-full bg-[#0a1039] border border-white/20 text-white placeholder-gray-400 focus:outline-none"
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

        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-white/10">
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
                <tr key={r.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <img src={r.cover || COVER_PLACEHOLDER} alt="cover" className="w-14 h-14 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.artist}</td>
                  <td className="px-4 py-3">{r.label}</td>
                  <td className="px-4 py-3">{r.isrc}</td>
                  <td className="px-4 py-3">{r.upc}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEdit(r.id)}
                        className="w-10 h-10 flex items-center justify-center border border-amber-400 rounded-full hover:bg-amber-400 group"
                        title="Edit"
                      >
                        <Edit3 size={18} className="text-amber-300 group-hover:text-white" />
                      </button>

                      <button
                        onClick={() => openView(r)}
                        className="w-10 h-10 flex items-center justify-center border border-sky-500 rounded-full hover:bg-sky-500 group"
                        title="View"
                      >
                        <Eye size={18} className="text-sky-400 group-hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">No results</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* view modal */}
      {viewing && <ViewReleaseModal release={viewing} onClose={() => setViewing(null)} onEdit={() => { setViewing(null); navigate(`/releases/edit/${viewing.id}`); }} />}
    </div>
  );
}
