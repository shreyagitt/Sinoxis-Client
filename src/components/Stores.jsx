import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar";
import axios from "axios";

export default function Stores() {
  const [step] = useState(2);
    const navigate = useNavigate();
    const { theme } = useTheme();
  const [selected, setSelected] = useState([]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

const mode = localStorage.getItem("releaseMode") || "create";
const isView = mode === "view";
const isEdit = mode === "edit";


  const [stores, setStores] = useState([]);

useEffect(() => {
  const fetchStores = async () => {
    const res = await axios.get(`${baseUrl}/client/store`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStores(res.data.data || []);
  };

  fetchStores();
}, []);


  const toggleStore = (id) => {
  if (isView) return;
  setSelected((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
  );
};

const selectAll = () => {
  if (isView) return;
  setSelected(stores.map((s) => s.platform));
};

const deselectAll = () => {
  if (isView) return;
  setSelected([]);
};

 useEffect(() => {
  const stored = localStorage.getItem("storeDraft");
  if (!stored) return;

  const parsed = JSON.parse(stored);

 if (Array.isArray(parsed)) {
  setSelected(parsed);
} else if (Array.isArray(parsed.stores)) {
  setSelected(parsed.stores.map((s) => s.platform || s));
}

}, []);

useEffect(() => {
  if (isView) return;

  const releaseDraft =
    JSON.parse(localStorage.getItem("releaseDraft")) || {};

  if (!releaseDraft._id) return;

  const existing =
    JSON.parse(localStorage.getItem("storeDraft")) || {};

  localStorage.setItem(
    "storeDraft",
    JSON.stringify({
      ...existing,
      releaseId: releaseDraft._id, // ✅ CRITICAL
      stores: selected.map((id) => ({ platform: id })),
      step: "stores",
      savedAt: new Date().toISOString(),
    })
  );
}, [selected, isView]);




  return (
    <div
      className={`min-h-screen font-[Montserrat]
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#020726] to-[#0a1039] text-white"
            : "bg-gray-100 text-[#020726]"
        }
      `}
    >

      {/* HEADER */}
       <div className="flex justify-between items-center px-6 sm:px-10 py-6">
        <h1 className="text-lg sm:text-xl font-medium">Release Application Form</h1>
        <p className="text-sm">
          Home <span className="text-gray-400">/</span>{" "}
          <span className="text-sky-400">Dashboard</span>
        </p>
      </div>

      {/* MAIN CARD */}
       <div
        className={`max-w-6xl mx-auto mt-6 rounded-[28px]
          px-4 sm:px-8 md:px-12 py-8 md:py-10
          ${
            theme === "dark"
              ? "bg-[#060b2e] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              : "bg-white shadow-lg border border-gray-200"
          }
        `}
      >

        {/* TITLE */}
       <h2 className="text-center text-3xl sm:text-4xl font-medium text-sky-400">
  {isView ? "View Release" : isEdit ? "Edit Release" : "Create Release"}
</h2>

        <p className="text-center text-gray-300 mt-2">
          Complete all steps to publish your release
        </p>

        {/* PROGRESS */}
        <div className="relative mt-12">
          <div
            className={`h-[3px] rounded-full ${
              theme === "dark" ? "bg-white/10" : "bg-gray-300"
            }`}
          />
          <div className="absolute top-0 h-[3px] w-[66%] bg-sky-400 rounded-full" />

          <div className="absolute top-[-7px] left-0 w-full flex justify-between">
            {["Release", "Tracks", "Stores", "Submission"].map((t, i) => (
              <div key={t} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    i < 2
                      ? "bg-yellow-400"
                      : i === 2
                      ? "bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.15)]"
                      : "bg-sky-400/40"
                  }`}
                />
                <span
                  className={`mt-4 text-xs sm:text-sm ${
                    i === 2 ? "text-sky-400" : "text-gray-400"
                  }`}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION PILL */}
        <div className="flex justify-center mt-12">
          <span className="px-8 py-2 rounded-full bg-sky-400 text-[#020726] font-medium shadow-md">
            Stores
          </span>
        </div>

        {/* STORE CARDS */}
<div className="flex flex-col items-center mt-14">

  {/* CARDS ROW */}
  <div className="w-full flex flex-col sm:flex-row justify-center gap-6">

    {stores.map((store) => {
      const active = selected.includes(store.platform);

      return (
        <button
  key={store._id}
  disabled={isView}
  onClick={() => toggleStore(store.platform)}
  className={`
    relative
    w-full sm:w-[260px]
    flex items-center justify-center gap-3
    px-6 py-4 rounded-xl
    border transition-all
    ${
      active
        ? "border-sky-400 bg-sky-400/10 shadow-[0_0_0_3px_rgba(56,189,248,0.15)]"
        : theme === "dark"
        ? "border-white/20 hover:border-sky-400/50"
        : "border-gray-300 hover:border-sky-400"
    }
    ${isView ? "cursor-not-allowed opacity-60" : ""}
  `}
>


            <img
                  src={store.icon}
                  alt={store.name}
                  className="w-6 h-6 object-contain"
                />
          <span className="text-base">{store.name}</span>

          {/* CHECK MARK */}
          {active && (
            <span className="
              absolute -top-2 -right-2
              w-6 h-6 rounded-full
              bg-sky-400 text-[#020726]
              flex items-center justify-center
              text-sm font-bold
            ">
              ✓
            </span>
          )}
        </button>
      );
    })}
  </div>

  {/* ERROR — ONLY WHEN NONE SELECTED */}
  {selected.length === 0 && (
    <p className="text-red-400 text-sm mt-3">
      Select at least one store
    </p>
  )}

  {/* SELECT / DESELECT */}
  {!isView && (
  <div className="flex gap-4 mt-4">
    <button
      onClick={selectAll}
      className={`px-4 py-2 rounded-lg text-sm transition
  ${
    theme === "dark"
      ? "bg-white/20 hover:bg-white/30 text-white"
      : "bg-white border border-gray-300 hover:bg-gray-100 text-[#020726]"
  }
`}

    >
      Select All
    </button>
    <button
      onClick={deselectAll}
      className={`px-4 py-2 rounded-lg text-sm transition
  ${
    theme === "dark"
      ? "bg-white/20 hover:bg-white/30 text-white"
      : "bg-white border border-gray-300 hover:bg-gray-100 text-[#020726]"
  }
`}

    >
      Deselect All
    </button>
  </div>
  )}
</div>

{/* ACTION BUTTONS */}
<div className="flex justify-between mt-16">
  <button
  onClick={() => {
  if (isView) {
    navigate("/releases/myRelease");
  } else {
    navigate("/tracks");
  }
}}

  className={`px-7 py-2 rounded-lg transition
    ${
      theme === "dark"
        ? "bg-white/20 hover:bg-white/30"
        : "bg-gray-200 hover:bg-gray-300"
    }
  `}
>

    Back
  </button>
{!isView && (
 <button
  onClick={() => {
  const releaseDraft =
    JSON.parse(localStorage.getItem("releaseDraft")) || {};

  if (!releaseDraft._id) {
    alert("Release context missing");
    return;
  }

  localStorage.setItem(
    "storeDraft",
    JSON.stringify({
      releaseId: releaseDraft._id, // ✅ CRITICAL
      stores: selected.map((id) => ({ platform: id })),
      step: "stores",
      savedAt: new Date().toISOString(),
    })
  );

const trackDraft =
  JSON.parse(localStorage.getItem("trackDraft")) || {};

if (
  !trackDraft?.tracks?.[0]?.audioKey &&
  !trackDraft?.tracks?.[0]?.audioUrl
) {

  alert("Audio file missing. Please re-upload your track.");
  return;
}



  navigate("/submission");
}}

  disabled={selected.length === 0}
  className={`px-8 py-2 rounded-lg font-medium transition
    ${
      selected.length === 0
        ? "bg-sky-400/40 cursor-not-allowed"
        : "bg-sky-500 hover:bg-sky-400 text-[#020726]"
    }
  `}
>
  Next
</button>
)}

</div>

      </div>
    </div>
  );
}


