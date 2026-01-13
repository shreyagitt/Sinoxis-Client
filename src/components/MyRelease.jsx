import React, { useEffect, useState } from "react";
import { Edit3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar";
import ViewReleaseModal from "../components/ViewReleaseModal";

const COVER_PLACEHOLDER =
  "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png";

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
  const { theme } = useTheme();
  const location = useLocation();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const pageBg =
    theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
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

  const mobileCardBg =
    theme === "dark"
      ? "bg-[#050a26] border border-white/10"
      : "bg-white border border-gray-200 shadow-sm";

  // ✅ API STATE
  const [releases, setReleases] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [countPage, setCountPage] = useState({ page: 1, perPage: 10 });
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(false);
 /* ================= FETCH MY RELEASES ================= */
 const fetchReleases = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.get(`${baseUrl}/client/release`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setReleases(res.data.data || []);
  } catch (err) {
    toast.error("Failed to load releases");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchReleases();
}, [location.pathname]);


  const openCreate = () => {
  localStorage.removeItem("releaseDraft");
  localStorage.removeItem("trackDraft");
  localStorage.removeItem("storeDraft");
  localStorage.removeItem("releaseMode");
  navigate("/releases/create");
};

const openEdit = async (release) => {
   try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${baseUrl}/client/release/${release._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const fullRelease = res.data.data;

    /* ================= RELEASE DRAFT ================= */
    
    localStorage.setItem("releaseDraft", JSON.stringify(fullRelease));
    localStorage.setItem("trackDraft", JSON.stringify({
      tracks: fullRelease.tracks || [],
    }));
    localStorage.setItem("storeDraft", JSON.stringify({
      stores: fullRelease.stores || [],
    }));

    localStorage.setItem("releaseMode", "edit");

    navigate("/releases/create");
  } catch {
    toast.error("Failed to load release for editing");
  }
};




const openView = async (release) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${baseUrl}/client/release/${release._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const fullRelease = res.data.data;

    localStorage.setItem("releaseDraft", JSON.stringify(fullRelease));
    localStorage.setItem("trackDraft", JSON.stringify({
      tracks: fullRelease.tracks || [],
    }));
    localStorage.setItem("storeDraft", JSON.stringify({
      stores: fullRelease.stores || [],
    }));

    localStorage.setItem("releaseMode", "view");

    navigate("/releases/create");
  } catch {
    toast.error("Failed to load release details");
  }
};



  const filtered = releases.filter((r) => {
    if (filter !== "All" && r.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(s) ||
      r.artist.toLowerCase().includes(s) ||
      (r.label || "").toLowerCase().includes(s)
    );
  });

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / countPage.perPage) || 1;
  const currentPage = Math.min(countPage.page, totalPages);
  const countText = `${currentPage} / ${totalPages}`;




  return (
    <div className={`min-h-screen px-6 py-8 ${pageBg}`}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold">My Releases</h1>
        <div className="text-sm">
          <span className={subtleText}>Home / </span>
          <span className="text-[#29B6F6]">My Releases</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className={`text-sm font-medium mb-3 ${subtleText}`}>
            Release Count
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              "All",
              "Approved",
              "Pending",
              "Action Required",
              "Unfinished",
              "Rejected",
            ].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-md border text-sm transition-all ${
                  filter === t ? filterActive : filterDefault
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className={`text-sm ${subtleText}`}>{countText}</div>
      </div>

      {/* MAIN CARD */}
      <div className={`rounded-2xl p-4 md:p-6 border ${cardBg}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-lg font-semibold">Manage Releases</h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type & Enter to search"
              className={`px-4 py-2 rounded-full focus:outline-none text-sm ${inputBg}`}
            />
            <button
              onClick={openCreate}
              className="px-5 py-2 rounded-full text-white font-semibold text-sm"
              style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}
            >
              Create Release
            </button>
          </div>
        </div>

{/* MOBILE VIEW */}
<div className="lg:hidden space-y-4">
  {filtered.map((r) => (
    <div
      key={r._id}
      className={`p-4 rounded-xl border ${
        theme === "dark"
          ? "bg-[#050a26] border-white/10"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <img
          src={r.cover || COVER_PLACEHOLDER}
          className="w-16 h-16 rounded-lg object-cover"
        />

        <div className="flex-1">
          <p className="font-semibold">{r.title}</p>
          <p className="text-sm text-gray-400">{r.artist}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${statusClasses(
              r.status,
              theme
            )}`}
          >
            {r.status}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={() => openEdit(r)} className="text-amber-400">
          <Edit3 size={18} />
        </button>
        <button onClick={() => openView(r)} className="text-sky-400">
          <Eye size={18} />
        </button>
      </div>
    </div>
  ))}
</div>


        {/* ✅ DESKTOP TABLE — SAME UI AS YOUR SCREENSHOT */}
        <div className="hidden lg:block overflow-x-auto mt-2">
          <table className="min-w-[1100px] w-full text-left text-sm">
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
                <tr key={r._id} className={`${tableBorder} border-b`}>
                  <td className="px-4 py-3">
                    <img
                      src={r.cover || COVER_PLACEHOLDER}
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>

                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.artist}</td>
                  <td className="px-4 py-3">{r.label || "—"}</td>
                  <td className="px-4 py-3">
  {r.tracks?.[0]?.isrc || "—"}
</td>

                  <td className="px-4 py-3">{r.upc || "—"}</td>

                  <td className="px-4 py-3">
                    <span className={`px-4 py-1 rounded-full ${statusClasses(r.status, theme)}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
  <div className="flex justify-center gap-3">

    {/* EDIT BUTTON */}
    <button onClick={() => openEdit(r)}
      className={`
        w-10 h-10 flex items-center justify-center rounded-full border group transition
        ${
          theme === "dark"
            ? "border-amber-400 hover:bg-amber-400"
            : "border-amber-600 hover:bg-amber-100"
        }
      `}
      title="Edit"
    >
      <Edit3
        size={18}
        className={`${
          theme === "dark"
            ? "text-amber-300 group-hover:text-white"
            : "text-amber-700 group-hover:text-amber-800"
        }`}
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
      title="View"
    >
      <Eye
        size={18}
        className={`${
          theme === "dark"
            ? "text-sky-400 group-hover:text-white"
            : "text-sky-700 group-hover:text-sky-900"
        }`}
      />
    </button>

  </div>
</td>

                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm">
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
{loading && <div className="py-6 text-center">Loading...</div>}
      {/* VIEW MODAL */}
      {viewing && (
        <ViewReleaseModal
  release={viewing.release}
  track={viewing.track}
  stores={viewing.stores}
  onClose={() => setViewing(null)}
  onEdit={() => {
    setViewing(null);
    navigate(`/releases/edit/${viewing.release._id}`);
  }}
/>

      )}
    </div>
  );
}
