import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function TrackDetails() {
  const [step] = useState(2);
  const navigate = useNavigate();
  const [trackDraft, setTrackDraft] = useState({});
  const [showLyrics, setShowLyrics] = useState(false);


  const handleSave = () => {
  const payload = {
    step: "tracks",
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem("trackDraft", JSON.stringify(payload));
  alert("Track details saved");
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020726] to-[#0a1039] text-white font-[Montserrat]">

      {/* TOP HEADER */}
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

        {/* PROGRESS BAR */}
        <div className="relative mt-12">
          <div className="h-[3px] bg-white/10 rounded-full" />
          <div className="absolute top-0 h-[3px] w-[33%] bg-sky-400 rounded-full" />

          <div className="absolute top-[-7px] left-0 w-full flex justify-between">
            {["Release", "Tracks", "Stores", "Submission"].map((t, i) => (
              <div key={t} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    i === 1
                      ? "bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.15)]"
                      : i < 1
                      ? "bg-yellow-400"
                      : "bg-sky-400/40"
                  }`}
                />
                <span
                  className={`mt-4 text-sm ${
                    i === 1 ? "text-sky-400" : "text-gray-400"
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
          <span className="px-7 py-2 rounded-full bg-sky-400 text-[#020726] font-medium shadow-md">
            Track Details
          </span>
        </div>

        {/* AUDIO DROPBOX */}
        <div className="mt-10 border border-dashed border-sky-400/60 rounded-2xl h-[170px] flex flex-col items-center justify-center bg-[#05092a]">
          <MusicIcon />
          <p className="font-medium mt-2">Drag & drop audio</p>
          <p className="text-sm text-gray-400">MP3 / WAV only</p>
          <input
            type="file"
            accept=".mp3,.wav"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* FORM */}
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 mt-12">

          <Input placeholder="Track Title *" error />
          <Input placeholder="Primary Artist *" error />

         <MultiInput
  placeholder="Writers *"
  options={["Lyrics 1", "Lyrics 2", "Composer Writer", "Traditional"]}
/>

<MultiInput
  placeholder="Composers *"
  options={["Composer 1", "Composer 2", "Traditional"]}
/>

<MultiInput
  placeholder="Music Directors *"
  options={["Director 1", "Director 2"]}
/>

<MultiInput
  placeholder="Producers *"
  options={["Producer 1", "Producer 2"]}
/>



          <Input placeholder="Producers *" error />
          <Input placeholder="Publisher *" error />

          <Input placeholder="Language *" error />
          <Input placeholder="ISRC *" error />
        </div>

        {/* ADD LYRICS */}
        <div className="mt-6">
          <button 
          onClick={() => setShowLyrics(true)}
          className="w-full md:w-1/2 h-[46px] rounded-xl border border-white/40 hover:bg-white/10 transition">
            Add Lyrics
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between mt-12">
          <button 
          onClick={() => navigate("/releases/create")}
          className="px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
            Back
          </button>

          <div className="flex gap-3">
            <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-lg border border-white/40 hover:bg-white/10 transition">
              Save
            </button>
            <button 
            onClick={() => navigate("/stores")}
            className="px-7 py-2 rounded-lg bg-sky-500 text-[#020726] font-medium hover:bg-sky-400 transition">
              Next
            </button>
          </div>
        </div>
      </div>
      {/* ================= ADD LYRICS MODAL ================= */}
{showLyrics && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#060b2e] w-full max-w-lg rounded-2xl p-6">
      <h3 className="text-lg font-medium text-sky-400 mb-4">
        Add Lyrics
      </h3>

      <textarea
        rows={6}
        placeholder="Enter lyrics here..."
        className="w-full rounded-xl bg-[#2a2f4d] text-white p-4 outline-none"
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowLyrics(false)}
          className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setShowLyrics(false);
            alert("Lyrics saved");
          }}
          className="px-4 py-2 rounded-lg bg-sky-500 text-[#020726] font-medium hover:bg-sky-400 transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}



/* ---------------- COMPONENTS ---------------- */

function Input({ placeholder, label, error }) {
  return (
    <div>
      {label && (
        <label className="block text-sm mb-2 text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          placeholder={placeholder}
          className={`w-full h-[46px] px-5 rounded-xl bg-[#2a2f4d]
          text-white placeholder-gray-300 outline-none
          border ${error ? "border-transparent" : "border-transparent"}`}
        />
        {error && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2
          w-5 h-5 rounded-full border border-red-400 text-red-400
          flex items-center justify-center text-xs font-bold">
            !
          </span>
        )}
      </div>
    </div>
  );
}



function MusicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-sky-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19V6l12-2v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}


function MultiInput({ placeholder, options = [] }) {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const addItem = (item) => {
    if (!items.includes(item)) {
      setItems([...items, item]);
    }
    setValue("");
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      addItem(value.trim());
    }
  };

  const removeItem = (item) => {
    setItems(items.filter(i => i !== item));
  };

  return (
    <div className="relative">
      {/* INPUT CONTAINER */}
      <div
        className="
        min-h-[46px]
        w-full
        px-4 py-2
        rounded-xl
        bg-[#2a2f4d]
        border border-white/10
        flex flex-wrap items-center gap-2
        focus-within:border-sky-400/60
        transition
        "
      >
        {/* CHIPS */}
        {items.map(item => (
          <span
            key={item}
            className="
            flex items-center gap-1
            bg-sky-400/20
            text-sky-300
            px-3 py-1
            rounded-lg
            text-sm
            "
          >
            {item}
            <button
              onClick={() => removeItem(item)}
              className="hover:text-red-400"
            >
              ×
            </button>
          </span>
        ))}

        {/* TEXT INPUT */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={items.length === 0 ? placeholder : ""}
          className="
          flex-1
          bg-transparent
          outline-none
          text-white
          placeholder-gray-400
          text-sm
          min-w-[120px]
          "
        />

        {/* DROPDOWN BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="ml-auto text-gray-300 hover:text-sky-400"
        >
          ▼
        </button>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
          absolute z-20 mt-2 w-full
          rounded-xl
          bg-[#1f2440]
          border border-white/10
          shadow-lg
          overflow-hidden
          "
        >
          {options
            .filter(opt => !items.includes(opt))
            .map(opt => (
              <button
                key={opt}
                onClick={() => addItem(opt)}
                className="
                w-full text-left px-4 py-2
                text-sm text-gray-200
                hover:bg-sky-400/20
                transition
                "
              >
                {opt}
              </button>
            ))}

          {options.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              No options
            </div>
          )}
        </div>
      )}
    </div>
  );
}
