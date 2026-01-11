import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar";


export default function CreateRelease() {
  const [step] = useState(1);
  const navigate = useNavigate();
  const [coverPreview, setCoverPreview] = useState(null);
  const { theme } = useTheme();

const pageBg =
  theme === "dark"
    ? "bg-gradient-to-b from-[#020726] to-[#0a1039] text-white"
    : "bg-gray-100 text-[#020726]";

const cardBg =
  theme === "dark"
    ? "bg-[#060b2e] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
    : "bg-white border border-gray-200 shadow-lg";

const inputBg =
  theme === "dark"
    ? "bg-[#2a2f4d] text-white placeholder-gray-300"
    : "bg-white text-[#020726] placeholder-gray-500 border border-gray-300";

const [formData, setFormData] = useState({
  title: "",
  subtitle: "",
  label: "",
  year: "",
});


 const handleSave = () => {
  const payload = {
    ...formData,
    coverPreview,
    currentStep: "release",
  };

  localStorage.setItem("releaseDraft", JSON.stringify(payload));
  alert("Draft saved");
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020726] to-[#0a1039] text-white font-[Montserrat]">

      {/* TOP HEADER */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-medium">
          Release Application Form
        </h1>
        <p className="text-sm ">
          Home <span className="text-gray-400">/</span> <span className="text-sky-400">Dashboard </span>
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
{/* PROGRESS WRAPPER */}
<div className="relative mt-12">

  {/* LINE */}
  <div className="mx-auto w-full h-[3px] bg-white/10 rounded-full" />

  {/* ACTIVE LINE (LEFT DOT → CURRENT STEP) */}
  <div className="absolute top-0 left-0 h-[3px] w-[12%] bg-sky-400 rounded-full" />

  {/* DOTS */}
  <div className="absolute top-[-6px] left-0 w-full flex justify-between px-1">
    {["Release", "Tracks", "Stores", "Submission"].map((label, i) => (
      <div key={label} className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${
            i === 0
              ? "bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.15)]"
              : "bg-sky-400/40"
          }`}
        />
      </div>
    ))}
  </div>

  {/* LABELS */}
  <div className="mt-6 flex justify-between text-sm">
    <span className="text-sky-400">Release</span>
    <span className="text-gray-400">Tracks</span>
    <span className="text-gray-400">Stores</span>
    <span className="text-gray-400">Submission</span>
  </div>
</div>

{/* SECTION PILL */}
<div className="flex justify-center mt-10">
  <span className="px-7 py-2 rounded-full bg-sky-400 text-[#020726] font-medium shadow-md">
    Release Details
  </span>
</div>


        {/* FORM */}
<div className="grid md:grid-cols-2 gap-x-10 gap-y-6 mt-12">

 <Input placeholder="Title *" 
  value={formData.title}
  onChange={(e) =>
    setFormData({ ...formData, title: e.target.value })
  }
 error />
  <Input placeholder="Subtitle" />

  <Select placeholder="Genre *" error />
  <Select placeholder="Subgenre *" error />

  <Input placeholder="Label *" error />
  <DateInput placeholder="dd-mm-yyyy" error />

  <DateInput placeholder="dd-mm-yyyy" error />
  <Input placeholder="℗ 2026 Sinoxis Digital" error />

  <Input placeholder="Production Year" error />

</div>

{/* COVER ART – FULL WIDTH */}
<div className="col-span-full mt-12">
  <label className="block text-sm mb-4 text-gray-200">
    Cover Art <span className="text-red-400">*</span>
  </label>

  <div className="
    relative w-full h-[190px]
    rounded-2xl
    border border-dashed border-white/30
    flex flex-col items-center justify-center
    bg-[#05092a]
  ">
{/* COVER PREVIEW OR UPLOAD */}
{coverPreview ? (
  <img
    src={coverPreview}
    alt="Cover Preview"
    className="w-full h-full object-cover rounded-2xl"
  />
) : (
  <>
    {/* Upload Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-11 h-11 text-sky-400 mb-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v10m0 0l-4-4m4 4l4-4"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      />
    </svg>

    <p className="text-gray-300 font-medium">
      Drag & drop image
    </p>
    </>
)}

    <input
  type="file"
  accept="image/png,image/jpeg"
  className="absolute inset-0 opacity-0 cursor-pointer"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  }}
/>
  </div>
</div>


{/* ACTION BUTTONS */}
<div className="flex justify-end gap-4 mt-12">
  <button 
   onClick={handleSave}
  className="px-6 py-2 rounded-lg border border-white/40 text-white hover:bg-white/10 transition">
    Save
  </button>
  <button
  onClick={() => navigate("/tracks")}
  className="px-7 py-2 rounded-lg bg-sky-500 text-[#020726] font-medium hover:bg-sky-400 transition">
    Next
  </button>
</div>

      </div>
    </div>
  );
}

/* ----------------- COMPONENTS ----------------- */

function ErrorIcon() {
  return (
    <span className="absolute right-4 top-1/2 -translate-y-1/2
      w-5 h-5 rounded-full border border-red-400
      text-red-400 text-xs font-bold
      flex items-center justify-center">
      !
    </span>
  );
}

function Input({ placeholder, error, value, onChange  }) {
  return (
    <div className="relative">
      <input
      value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-[46px] px-5 rounded-xl 
        bg-[#2a2f4d] text-white placeholder-gray-300 
        outline-none border border-white/10
          focus:border-sky-400/60 transition
        "
      />

      {error && <ErrorIcon />}
    </div>
  );
}



function Select({ placeholder, error }) {
  return (
    <div className="relative">
      <select
        className="w-full h-[46px] px-5 pr-10 rounded-xl 
        bg-[#2a2f4d] text-white outline-none appearance-none border border-white/10
          focus:border-sky-400/60 transition
       "
      >
        <option value="">{placeholder}</option>
        <option>Ambient / Instrumental</option>
        <option>Carnatic Classical</option>
        <option>Children's Music</option>
        <option>Dance</option>
        <option>Devotional</option>
        <option>Electronic</option>
        <option>Film</option>
        <option>Folk</option>
        <option>Hip-Hop / Rap</option>
        <option>Indie</option>
        <option>Jazz</option>
        <option>Pop</option>
        <option>Rock</option>
        <option>Worldwide</option>
      </select>

      {/* Dropdown arrow */}
      <span className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        ▼
      </span>

      {error && <ErrorIcon />}
    </div>
  );
}




function DateInput({ placeholder, error }) {
  return (
    <div className="relative">
      <input
        type="date"
        placeholder={placeholder}
        className="w-full h-[46px] px-5 pr-10 rounded-xl 
        bg-[#2a2f4d] text-white outline-none 
        "
      />

      {error && <ErrorIcon />}
    </div>
  );
}
