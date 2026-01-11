import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Stores() {
    const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const stores = [
    { id: "spotify", name: "Spotify", icon: <SpotifyIcon /> },
    { id: "apple", name: "Apple Music", icon: <AppleMusicIcon /> },
  ];

  const toggleStore = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected(stores.map((s) => s.id));
  const deselectAll = () => setSelected([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020726] to-[#0a1039] text-white font-[Montserrat]">

      {/* HEADER */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-medium">Release Application Form</h1>
        <p className="text-sm">
          Home <span className="text-gray-400">/</span>{" "}
          <span className="text-sky-400">Dashboard</span>
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto mt-6 bg-[#060b2e] rounded-[28px] px-12 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

        {/* TITLE */}
        <h2 className="text-center text-4xl font-medium text-sky-400">
          Create Release
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Complete all steps to publish your release
        </p>

        {/* PROGRESS */}
        <div className="relative mt-12">
          <div className="h-[3px] bg-white/10 rounded-full" />
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
                  className={`mt-4 text-sm ${
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
  <div className="flex gap-6">
    {stores.map((store) => {
      const active = selected.includes(store.id);

      return (
        <button
          key={store.id}
          onClick={() => toggleStore(store.id)}
          className={`
            relative
            flex items-center gap-3 px-10 py-4 rounded-xl
            border transition-all
            ${
              active
                ? "border-sky-400 bg-sky-400/10 shadow-[0_0_0_3px_rgba(56,189,248,0.15)]"
                : "border-white/20 hover:border-sky-400/50"
            }
          `}
        >
          {store.icon}
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
  <div className="flex gap-4 mt-4">
    <button
      onClick={selectAll}
      className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-sm"
    >
      Select All
    </button>
    <button
      onClick={deselectAll}
      className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-sm"
    >
      Deselect All
    </button>
  </div>
</div>

{/* ACTION BUTTONS */}
<div className="flex justify-between mt-16">
  <button
  onClick={() => navigate("/tracks")}
  className="px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
    Back
  </button>

  <button
    onClick={() => navigate("/submission")}
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
</div>

      </div>
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function SpotifyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1ED760">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.8-9.3-.9-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4.1-.9 7.5-.5 10.4 1.1.3.2.4.6.1.9zm1.3-3.1c-.3.4-.8.6-1.2.3-2.9-1.8-7.4-2.3-10.9-1.2-.5.1-1-.1-1.1-.6-.1-.5.1-1 .6-1.1 4-.9 8.9-.3 12.3 1.7.4.2.6.7.3 1.1zm.1-3.2C15.7 9 8.4 8.9 5 10c-.6.2-1.2-.1-1.4-.7-.2-.6.1-1.2.7-1.4 4-1.3 10-1.2 14.3 1.4.5.3.7.9.4 1.4-.3.5-.9.7-1.4.4z" />
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M16 3L8 5v10.6a2.5 2.5 0 1 0 1 2V9.2l6-1.5v6.9a2.5 2.5 0 1 0 1 2V3z" />
    </svg>
  );
}
