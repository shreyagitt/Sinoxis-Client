import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar";

export default function SubmissionStep() {
  const { theme } = useTheme();
    const navigate = useNavigate();
    const mode = localStorage.getItem("releaseMode") || "create";
const isView = mode === "view";
const isEdit = mode === "edit";

  const [confirmed, setConfirmed] = useState(false);
  const [openSection, setOpenSection] = useState(null);

const [release, setRelease] = useState(null);
const [track, setTrack] = useState(null);
const [stores, setStores] = useState([]);


const [coverImage, setCoverImage] = useState(null);
 
useEffect(() => {
  const r = JSON.parse(localStorage.getItem("releaseDraft"));
  const t = JSON.parse(localStorage.getItem("trackDraft"));
  const s = JSON.parse(localStorage.getItem("storeDraft"));

  if (!r) {
    navigate("/releases/myRelease");
    return;
  }

  setRelease(r);

  if (r.coverKey) {
    const img = localStorage.getItem(r.coverKey);
    if (img) setCoverImage(img);
  }

  // ✅ TRACKS — always array
  if (t?.tracks?.length) {
    setTrack(t.tracks[0]);
  } else {
    setTrack(null);
  }

  // ✅ STORES — normalized
  if (Array.isArray(s?.stores)) {
    setStores(s.stores);
  } else {
    setStores([]);
  }
}, [navigate]);

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const handlePublish = async () => {
  if (isView) return;

  if (!release || !track || !stores.length) {
    toast.error("Submission incomplete");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const formData = new FormData();

    // ✅ REQUIRED FOR EDIT
    if (isEdit && release._id) {
      formData.append("_id", release._id);
    }

    // ───── RELEASE ─────
    formData.append("title", release.title);
    formData.append("subtitle", release.subtitle || "");
    formData.append("artist", track.primaryArtist);
    formData.append("genre", release.genre);
    formData.append("subgenre", release.subgenre);
    formData.append("label", release.label);
    formData.append("upc", release.upc || "");
    formData.append("originalReleaseDate", release.originalReleaseDate);
    formData.append("digitalReleaseDate", release.digitalReleaseDate);
    formData.append("productionYear", release.productionYear);
    formData.append("copyrightText", release.copyrightText || "");

    // ───── TRACKS ─────
    formData.append(
      "tracks",
      JSON.stringify([
        {
          trackTitle: track.trackTitle,
          primaryArtist: track.primaryArtist,
          publisher: track.publisher,
          language: track.language,
          isrc: track.isrc,
          writers: track.writers || [],
          composers: track.composers || [],
          musicDirectors: track.musicDirectors || [],
          producers: track.producers || [],
        },
      ])
    );

    // ───── STORES ─────
    formData.append(
      "stores",
      JSON.stringify(
        stores.map((s) => (typeof s === "string" ? s : s.platform))
      )
    );

    // ───── COVER IMAGE (🔥 CRITICAL FIX) ─────
    if (release.coverKey) {
      const base64 = localStorage.getItem(release.coverKey);

      if (base64) {
        const blob = await fetch(base64).then((res) => res.blob());
        formData.append("cover", blob);
      }
    }

    // ───── META ─────
    formData.append("currentStep", "submission");
    formData.append("status", "Pending");

    // ✅ SINGLE API FOR CREATE + EDIT
    await axios.post(`${baseUrl}/client/release`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(isEdit ? "Release updated successfully" : "Release submitted successfully");

    // ✅ CLEANUP
    localStorage.removeItem("releaseDraft");
    localStorage.removeItem("trackDraft");
    localStorage.removeItem("storeDraft");
    localStorage.removeItem("releaseMode");

    navigate("/releases/myRelease");
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit release");
  }
};




  return (
    <div className={`min-h-screen font-[Montserrat]
    ${
      theme === "dark"
        ? "bg-gradient-to-b from-[#020726] to-[#0a1039] text-white"
        : "bg-gray-100 text-[#020726]"
    }
  `}>

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 sm:px-10 py-6">
  <h1 className="text-lg sm:text-xl font-medium">
    Release Application Form
  </h1>
  <p className="text-xs sm:text-sm">
    Home <span className="text-gray-400">/</span>{" "}
    <span className="text-sky-400">Dashboard</span>
  </p>
</div>


      {/* MAIN CARD */}
      <div className={`max-w-6xl mx-auto mt-6 rounded-[28px]
    px-4 sm:px-8 md:px-12 py-8 md:py-10
    ${
      theme === "dark"
        ? "bg-[#060b2e] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        : "bg-white shadow-lg border border-gray-200"
    }
  `}>

        {/* TITLE */}
        <h2 className="text-center text-4xl font-medium text-sky-400">
  {isView ? "View Release" : isEdit ? "Edit Release" : "Create Release"}
</h2>

        <p className="text-center text-gray-300 mt-2">
          Complete all steps to publish your release
        </p>

        {/* PROGRESS BAR */}
        <div className="relative mt-12">
          <div className="h-[3px] bg-white/10 rounded-full" />
          <div className="absolute top-0 h-[3px] w-full bg-sky-400 rounded-full" />

          <div className="absolute top-[-7px] left-0 w-full flex justify-between">
            {["Release", "Tracks", "Stores", "Submission"].map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    i < 3
                      ? "bg-yellow-400"
                      : "bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.15)]"
                  }`}
                />
                <span
                  className={`mt-4 text-sm ${
                    i === 3 ? "text-sky-400" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION PILL */}
        <div className="flex justify-center mt-12">
          <span className="px-8 py-2 rounded-full bg-sky-400 text-[#020726] font-medium shadow-md">
            Submission
          </span>
        </div>

        {/* STATUS CARDS */}
        <div className="mt-14 space-y-6">

  {/* RELEASE DETAILS */}
  <Section
    title="Release Details"
    open={openSection === "release"}
    onClick={() =>
      setOpenSection(openSection === "release" ? null : "release")
    }
  >
    {release ? (
  <ul className="text-sm space-y-1">
    <li><b>Title:</b> {release.title}</li>
    <li><b>Subtitle:</b> {release.subtitle}</li>
    <li><b>Label:</b> {release.label}</li>
    <li><b>Genre:</b> {release.genre} / {release.subgenre}</li>
    <li><b>Original Release Date:</b> {release.originalReleaseDate}</li>
    <li><b>Digital Release Date:</b> {release.digitalReleaseDate}</li>
    <li><b>Production Year:</b> {release.productionYear}</li>
    <li><b>Copyright:</b> {release.copyrightText || "—"}</li>
<li><b>UPC:</b> {release.upc || "—"}</li>


    {coverImage && (
  <img
    src={coverImage}
    alt="Cover"
    className="w-32 rounded-lg mt-2"
  />
)}

  </ul>
) : (
  <p className="text-red-400 text-sm">Release details incomplete</p>
)}

  </Section>

  {/* TRACK DETAILS */}
  <Section
    title="Track Details"
    open={openSection === "track"}
    onClick={() =>
      setOpenSection(openSection === "track" ? null : "track")
    }
  >
    {track ? (
  <ul className="text-sm space-y-1">
    <li><b>Track Title:</b> {track.trackTitle}</li>
    <li><b>Primary Artist:</b> {track.primaryArtist}</li>
    <li><b>Publisher:</b> {track.publisher}</li>
    <li><b>Language:</b> {track.language}</li>
    <li><b>ISRC:</b> {track.isrc}</li>

    <li>
      <b>Writers:</b> {track.writers?.join(", ") || "—"}
    </li>
    <li>
      <b>Composers:</b> {track.composers?.join(", ") || "—"}
    </li>
    <li>
      <b>Music Directors:</b> {track.musicDirectors?.join(", ") || "—"}
    </li>
    <li>
      <b>Producers:</b> {track.producers?.join(", ") || "—"}
    </li>
  </ul>
) : (
  <p className="text-red-400 text-sm">Track details incomplete</p>
)}

  </Section>

  {/* STORE RELEASES */}
  <Section
  className="list-disc pl-5 text-sm"
    title="Store Releases"
    open={openSection === "stores"}
    onClick={() =>
      setOpenSection(openSection === "stores" ? null : "stores")
    }
  >
    {stores.length > 0 ? (
      <ul className="list-disc pl-4 text-sm">
       {stores.map((s, i) => (
  <li key={i}>
    {typeof s === "string" ? s : s.platform}
  </li>
))}


      </ul>
    ) : (
      <p className="text-red-400 text-sm">No store selected</p>
    )}
  </Section>

</div>


        {/* CONFIRMATION */}
        <div className="flex items-center gap-3 mt-8">
          <input
          disabled={isView}
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 accent-sky-400"
          />
          <span className="text-sm leading-snug">
            I confirm the information is accurate
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
          <button
          onClick={() => {
  if (isView) {
    navigate("/releases/myRelease");
  } else {
    navigate("/stores");
  }
}}

          className={`px-6 py-2 rounded-lg transition
      ${
        theme === "dark"
          ? "bg-white/20 hover:bg-white/30"
          : "bg-gray-200 hover:bg-gray-300"
      }
    `}>
            Back
          </button>
{!isView && (
          <button
          disabled={!confirmed}
    className={`px-8 py-2 rounded-lg font-medium transition
      ${
        confirmed
          ? "bg-sky-500 hover:bg-sky-400 text-[#020726]"
          : "bg-sky-400/40 cursor-not-allowed"
      }
    `}
  onClick={handlePublish}
>
  Publish
</button>
)}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUB COMPONENT ---------------- */

function StatusCard({ text }) {
  return (
    <div className="
      rounded-full
      px-6 py-3
      border border-yellow-400/70
      bg-white/5
      text-center
      text-sm
      text-yellow-300
    ">
      {text}
    </div>
  );
}

function Section({ title, open, onClick, children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`
        border
        rounded-xl
        overflow-hidden
        ${isDark ? "border-white/20" : "border-gray-400"}
        ${isDark ? "bg-transparent" : "bg-white"}
      `}
    >
      {/* HEADER */}
      <button
        onClick={onClick}
        className={`
          w-full px-4 sm:px-6 py-4
          flex justify-between items-center
          transition
          ${open ? "rounded-t-xl" : "rounded-xl"}
          ${
            isDark
              ? open
                ? "bg-sky-400/20"
                : "bg-white/10 hover:bg-white/20"
              : open
                ? "bg-sky-100"
                : "bg-gray-50 hover:bg-gray-100"
          }
        `}
      >
        <span className="font-medium text-sm sm:text-base">
          {title}
        </span>
        <span className="text-lg">{open ? "−" : "+"}</span>
      </button>

      {/* CONTENT */}
      {open && (
        <div
          className={`
            px-4 sm:px-6 py-4 text-sm
            rounded-b-xl
            ${isDark ? "bg-white/5" : "bg-white"}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}
