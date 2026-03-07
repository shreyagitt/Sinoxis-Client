import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
//import { useTheme } from "../components/Topbar";

export default function SubmissionStep() {
 // const { theme } = useTheme();
    const navigate = useNavigate();
    const mode = localStorage.getItem("releaseMode") || "create";
const isView = mode === "view";
const isEdit = mode === "edit";

  const [confirmed, setConfirmed] = useState(false);
  const [openSection, setOpenSection] = useState(null);

const [release, setRelease] = useState(null);
const [track, setTrack] = useState([]);
const [stores, setStores] = useState([]);


const [coverImage, setCoverImage] = useState(null);
 
useEffect(() => {
  let audioUrl;

  const hydrate = async () => {
    const r = JSON.parse(localStorage.getItem("releaseDraft"));
    const t = JSON.parse(localStorage.getItem("trackDraft"));
    const s = JSON.parse(localStorage.getItem("storeDraft"));

    if (!r) {
      navigate("/releases/myRelease");
      return;
    }

    setRelease(r);

    // ───── COVER IMAGE ─────
    if (r.coverKey) {
      const img = localStorage.getItem(r.coverKey);
      if (img) setCoverImage(img);
    }

    // ───── TRACK (MULTI-TRACK SOURCE OF TRUTH) ─────
if (t?.tracks?.length) {
  const hydratedTracks = [];

  for (const tr of t.tracks) {
    const hydrated = {
      ...tr,
      audioUrl: tr.audioUrl || null,   // keep Cloudinary URL if exists
    };

    // fallback to IndexedDB audio
    if (!hydrated.audioUrl && tr.audioKey) {
      const blob = await loadAudio(tr.audioKey);
      if (blob) {
        hydrated.audioUrl = URL.createObjectURL(blob);
      }
    }

    hydratedTracks.push(hydrated);
  }

  setTrack(hydratedTracks);   // <-- ARRAY, not single object
} else {
  setTrack([]);
}

    // ───── STORES ─────
    if (Array.isArray(s?.stores)) {
      setStores(s.stores);
    } else {
      setStores([]);
    }
  };

  hydrate();

  return () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  };
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
    formData.append("artist", track[0]?.primaryArtist || "");
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
  JSON.stringify(
    track.map((t) => ({
      trackTitle: t.trackTitle,
      primaryArtist: t.primaryArtist,
      publisher: t.publisher,
      language: t.language,
      isrc: t.isrc,
      writers: t.writers || [],
      composers: t.composers || [],
      musicDirectors: t.musicDirectors || [],
      producers: t.producers || [],
      lyrics: t.lyrics || "",
      audioName: t.audioName || "",
      audioKey: t.audioKey || "",
      audioUrl: t.audioUrl || "",
    }))
  )
);


    // ───── AUDIO FILE ─────
// ───── AUDIO FILE ─────
for (const t of track) {
 
  if (t.audioKey && !t.audioUrl) {
     const blob = await loadAudio(t.audioKey);
     if (!blob) {
       toast.error(`Audio file missing for track: ${t.trackTitle}`);
       return;
     }
     formData.append("audio", blob, t.audioName);
  }
}


if (!track.some((t) => t.audioKey || t.audioUrl)) {
  toast.error("Please upload audio files before publishing.");
  return;
}




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

    // ───── AUDIO FILE ─────





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
    <div className="min-h-screen font-[Montserrat]
bg-gray-100 dark:bg-gradient-to-b dark:from-[#020726] dark:to-[#0a1039]
text-[#020726] dark:text-white">

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
     <div className="max-w-6xl mx-auto mt-6 rounded-[28px]
px-4 sm:px-8 md:px-12 py-8 md:py-10
bg-white dark:bg-[#060b2e]
shadow-lg dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]
border border-gray-200 dark:border-white/10">

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
   {track && track.length > 0 ? (
  <div className="space-y-6">
    {track.map((t, idx) => (
      <ul
        key={idx}
        className="text-sm space-y-1 border-b border-white/10 pb-4 last:border-none"
      >
        <li className="font-medium text-sky-400">
          Track {idx + 1}
        </li>

        <li><b>Track Title:</b> {t.trackTitle || "—"}</li>
        <li><b>Primary Artist:</b> {t.primaryArtist || "—"}</li>
        <li><b>Publisher:</b> {t.publisher || "—"}</li>
        <li><b>Language:</b> {t.language || "—"}</li>
        <li><b>ISRC:</b> {t.isrc || "—"}</li>

        <li>
          <b>Writers:</b> {t.writers?.length ? t.writers.join(", ") : "—"}
        </li>
        <li>
          <b>Composers:</b> {t.composers?.length ? t.composers.join(", ") : "—"}
        </li>
        <li>
          <b>Music Directors:</b>{" "}
          {t.musicDirectors?.length ? t.musicDirectors.join(", ") : "—"}
        </li>
        <li>
          <b>Producers:</b> {t.producers?.length ? t.producers.join(", ") : "—"}
        </li>

        {t.audioUrl ? (
          <audio controls src={t.audioUrl} className="mt-2 w-full" />
        ) : t.audioName ? (
          <p><b>Audio File:</b> {t.audioName}</p>
        ) : (
          <p>—</p>
        )}
      </ul>
    ))}
  </div>
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

          className="px-6 py-2 rounded-lg transition
bg-gray-200 hover:bg-gray-300
dark:bg-white/20 dark:hover:bg-white/30">
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
  return (
    <div className="
      border rounded-xl overflow-hidden
      border-gray-400 dark:border-white/20
      bg-white dark:bg-transparent">

      <button
        onClick={onClick}
        className={`
          w-full px-4 sm:px-6 py-4
          flex justify-between items-center transition
          ${open ? "rounded-t-xl" : "rounded-xl"}
          bg-gray-50 hover:bg-gray-100
          dark:bg-white/10 dark:hover:bg-white/20
          ${open ? "bg-sky-100 dark:bg-sky-400/20" : ""}
        `}
      >
        <span className="font-medium text-sm sm:text-base">
          {title}
        </span>

        <span className="text-lg">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="
          px-4 sm:px-6 py-4 text-sm
          bg-white dark:bg-white/5
          rounded-b-xl">
          {children}
        </div>
      )}
    </div>
  );
}


function openAudioDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AudioDraftDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("audios")) {
        db.createObjectStore("audios");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadAudio(key) {
  const db = await openAudioDB();
  const tx = db.transaction("audios", "readonly");
  const store = tx.objectStore("audios");

  return new Promise((resolve) => {
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}
