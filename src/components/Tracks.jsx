import { useState , useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import { useTheme } from "../components/Topbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";


  

export default function TrackDetails() {
  const [step] = useState(1);
  //const { theme } = useTheme();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

  const mode = localStorage.getItem("releaseMode") || "create";
const isView = mode === "view";
const isEdit = mode === "edit";

const [trackIndex, setTrackIndex] = useState(
  Number(localStorage.getItem("currentTrackIndex")) || 0
);

useEffect(() => {
  localStorage.setItem("currentTrackIndex", trackIndex);
}, [trackIndex]);

  // ✅ DECLARE STATE FIRST
  const [savedDraft, setSavedDraft] = useState(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
const [lyrics, setLyrics] = useState("");
const [languages, setLanguages] = useState([]);

  // ✅ LOAD FROM localStorage
useEffect(() => {
  let objectUrl = null;

  const hydrate = async () => {
    const stored = localStorage.getItem("trackDraft");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const current = parsed.tracks?.[trackIndex] || {};

    setSavedDraft(prev => {
  if (JSON.stringify(prev) === JSON.stringify(parsed)) return prev;
  return parsed;
});
    setLyrics(current.lyrics || "");

    /* CLOUDINARY AUDIO */
    if (current.audioUrl) {
      setAudioFile({
        name: current.audioName || "Uploaded Audio",
        dataUrl: current.audioUrl,
      });
      return;
    }

    /* INDEXEDDB AUDIO */
    if (current.audioKey) {
      const blob = await loadAudio(current.audioKey);

      if (blob) {
        objectUrl = URL.createObjectURL(blob);

        setAudioFile({
          name: current.audioName || "Uploaded Audio",
          dataUrl: objectUrl,
        });
        return;
      }
    }

    setAudioFile(null);
  };

  hydrate();

  return () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  };
}, [trackIndex]);


useEffect(() => {
  const fetchLanguages = async () => {
    try {
      const res = await axios.get(`${baseUrl}/client/language`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLanguages(res.data?.data || []);
    } catch (err) {
      console.error("Language fetch failed:", err);
    }
  };

  if (token) fetchLanguages();
}, [token]);








 const currentTrack =
  savedDraft?.tracks?.[trackIndex] ||
  {
    trackTitle: "",
    primaryArtist: "",
    publisher: "",
    language: "",
    isrc: "",
    writers: [],
    composers: [],
    musicDirectors: [],
    producers: [],
  };

const initialValues = {
  trackTitle: currentTrack.trackTitle || "",
  primaryArtist: currentTrack.primaryArtist || "",
  publisher: currentTrack.publisher || "",
  language: currentTrack.language || "",
  previouslyReleased: currentTrack.previouslyReleased || "",
  isrc: currentTrack.isrc || "",
  writers: currentTrack.writers || [],
  composers: currentTrack.composers || [],
  musicDirectors: currentTrack.musicDirectors || [],
  producers: currentTrack.producers || [],
};




const trackSchema = Yup.object({
  trackTitle: Yup.string().required("Track title is required"),
  primaryArtist: Yup.string().required("Primary artist is required"),
  publisher: Yup.string().required("Publisher is required"),
  language: Yup.string().required("Language is required"),
  previouslyReleased: Yup.string()
    .oneOf(["yes", "no"])
    .required("Please select an option"),

  isrc: Yup.string().when("previouslyReleased", {
    is: "yes",
    then: (schema) => schema.required("ISRC is required for previously released tracks"),
    otherwise: (schema) => schema.notRequired(),
  }),

  writers: Yup.array().min(1, "At least one writer is required"),
  composers: Yup.array().min(1, "At least one composer is required"),
  musicDirectors: Yup.array().min(1, "At least one music director is required"),
  producers: Yup.array().min(1, "At least one producer is required"),
});



  return (
    <div className="min-h-screen font-[Montserrat] bg-gray-100 dark:bg-gradient-to-b dark:from-[#020726] dark:to-[#0a1039] text-[#020726] dark:text-white">


      {/* TOP HEADER */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-medium">Release Application Form</h1>
        <p className="text-sm">
          Home <span className="text-gray-400">/</span>{" "}
          <span className="text-sky-400">Dashboard</span>
        </p>
      </div>

      {/* MAIN CARD */}
      <div
  className="max-w-6xl mx-auto mt-6 rounded-[28px] px-4 sm:px-8 md:px-12 py-8 md:py-10 bg-white dark:bg-[#060b2e] shadow-lg dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-gray-200 dark:border-transparent"
>

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
          <div
  className="absolute top-0 left-0 h-[3px] rounded-full bg-sky-400 transition-all duration-500"
  style={{ width: `${((step + 1) / 4) * 100}%` }}
/>

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
      <div
  className={`relative mt-10 border border-dashed rounded-2xl
    h-[150px] sm:h-[170px]
    flex flex-col items-center justify-center
    border-sky-500 dark:border-sky-400/60 bg-gray-50 dark:bg-[#05092a]
    overflow-hidden
  `}
>

          <MusicIcon />
     <p className="font-medium mt-2">
  {audioFile
    ? isView
      ? `${audioFile.name}`
      : audioFile.name
    : isView
    ? "No audio uploaded"
    : "Drag & drop audio"}
</p>



          <p className="text-sm text-gray-400 opacity-70">MP3 / WAV only</p>
         <input
  type="file"
  accept=".mp3,.wav"
  disabled={isView}
  className="absolute inset-0 opacity-0 cursor-pointer"

 onChange={async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const audioKey = `audio_${Date.now()}`;
  await saveAudio(audioKey, file);

  const existing =
    JSON.parse(localStorage.getItem("trackDraft")) || {};

  const tracks = existing.tracks || [];

  // 🔥 Ensure slot exists
  while (tracks.length <= trackIndex) {
    tracks.push({});
  }

  tracks[trackIndex] = {
    ...tracks[trackIndex],
    audioName: file.name,
    audioKey,
    audioUrl: null,
    audioFileId: null,
  };

  localStorage.setItem(
    "trackDraft",
    JSON.stringify({
      ...existing,
      tracks,
      updatedAt: new Date().toISOString(),
    })
  );

  const objectUrl = URL.createObjectURL(file);

  setAudioFile({
    name: file.name,
    dataUrl: objectUrl,
  });

  setSavedDraft({ ...existing, tracks });   // 🔥 force UI refresh
}}



/>



        </div>

        {/* FORM */}
        <Formik
  key={trackIndex}                 // 🔥 FORCE RESET WHEN SWITCHING TRACKS
  enableReinitialize
  initialValues={initialValues}
  validationSchema={trackSchema}
  onSubmit={(values) => {
    if (isView) {
      
      navigate("/stores");        // ✅ allow forward navigation
      return;
    }

    const releaseDraft =
      JSON.parse(localStorage.getItem("releaseDraft")) || {};

    if (!releaseDraft._id) {
      alert("Release context missing");
      return;
    }

    const stored =
      JSON.parse(localStorage.getItem("trackDraft")) || {};

    const tracks = stored.tracks || [];

    // 🔥 Ensure array length is valid
    while (tracks.length <= trackIndex) {
      tracks.push({});
    }

    const trackPayload = {
      ...tracks[trackIndex],
      ...values,
      previouslyReleased: values.previouslyReleased,
      lyrics,
      audioKey: tracks[trackIndex]?.audioKey || null,
      audioName: tracks[trackIndex]?.audioName || null,
      audioUrl: tracks[trackIndex]?.audioUrl || null,
      audioFileId: tracks[trackIndex]?.audioFileId || null,
    };

    // 🔥 Save ONLY current track, never overwrite others
    tracks[trackIndex] = trackPayload;

    localStorage.setItem(
      "trackDraft",
      JSON.stringify({
        ...stored,
        releaseId: releaseDraft._id,
        tracks,
        updatedAt: new Date().toISOString(),
      })
    );

    if (trackIndex < tracks.length - 1) {
  setTrackIndex(trackIndex + 1);
  return;
}

else {
  localStorage.removeItem("currentTrackIndex");
navigate("/stores");
}
  }}
>

  {({ values, errors, touched, setFieldValue }) => (
    <Form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-12">

      {/* INPUTS */}
      <Input
        name="trackTitle"
        placeholder="Track Title *"
        disabled={isView}
        error={touched.trackTitle && errors.trackTitle}
      />

      <Input
        name="primaryArtist"
        placeholder="Primary Artist *"
        disabled={isView}
        error={touched.primaryArtist && errors.primaryArtist}
      />

      <MultiInput
        name="writers"
        placeholder="Writers *"
        values={values.writers}
        setFieldValue={setFieldValue}
        disabled={isView}
        error={touched.writers && errors.writers}
        options={["Lyrics 1", "Lyrics 2", "Composer Writer", "Traditional"]}
      />

      <MultiInput
        name="composers"
        placeholder="Composers *"
        values={values.composers}
        setFieldValue={setFieldValue}
        disabled={isView}
        error={touched.composers && errors.composers}
        options={["Composer 1", "Composer 2", "Traditional"]}
      />

      <MultiInput
        name="musicDirectors"
        placeholder="Music Directors *"
        values={values.musicDirectors}
        setFieldValue={setFieldValue}
        disabled={isView}
        error={touched.musicDirectors && errors.musicDirectors}
        options={["Director 1", "Director 2"]}
      />

      <MultiInput
        name="producers"
        placeholder="Producers *"
        values={values.producers}
        setFieldValue={setFieldValue}
        disabled={isView}
        error={touched.producers && errors.producers}
        options={["Producer 1", "Producer 2"]}
      />

      <Input
        name="publisher"
        placeholder="Publisher *"
        disabled={isView}
        error={touched.publisher && errors.publisher}
      />
<SelectInput
  name="language"
  placeholder="Select Language *"
  disabled={isView}
  error={touched.language && errors.language}
 options={languages.map((l) => l.name)}
/>

     {/* PREVIOUSLY RELEASED */}
<SelectInput
  name="previouslyReleased"
  placeholder="Previously Released?"
  disabled={isView}
  error={touched.previouslyReleased && errors.previouslyReleased}
  options={["yes", "no"]}
/>

{/* ISRC */}
<Input
  name="isrc"
  placeholder={
    values.previouslyReleased === "yes"
      ? "ISRC *"
      : "ISRC (optional)"
  }
  disabled={isView || values.previouslyReleased === "no"}
  error={touched.isrc && errors.isrc}
/>

      {/* ADD LYRICS */}
      {/* ADD LYRICS + ADD TRACK (SAME ROW) */}
<div className="md:col-span-2 mt-6 flex items-center justify-between">

  {/* LEFT: ADD LYRICS */}
  <button
    type="button"
    onClick={() => setShowLyrics(true)}
    className={`w-full sm:w-[260px] h-[46px] rounded-xl border transition
      border-gray-400 dark:border-white/40 text-[#020726] dark:text-white bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/10
    `}
  >
    {isView
      ? "View Lyrics"
      : lyrics
      ? "Edit Lyrics"
      : "Add Lyrics"}
  </button>

  {/* RIGHT: ADD ANOTHER TRACK */}
  {/* RIGHT: TRACK SWITCHER (VIEW MODE) */}
{isView && savedDraft?.tracks?.length > 1 && (
  <div className="flex gap-2">
    {savedDraft.tracks.map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setTrackIndex(i)}
       className={`h-[46px] px-5 rounded-xl border transition ${
  i === trackIndex
    ? "bg-sky-500 text-[#020726]"
    : "border-gray-400 dark:border-white/40 text-[#020726] dark:text-white bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/10"
}`}
      >
        Track {i + 1}
      </button>
    ))}
  </div>
)}

{/* RIGHT: ADD TRACK (EDIT / CREATE MODE) */}
{!isView && (
  <button
    type="button"
    onClick={() => {
      const stored =
        JSON.parse(localStorage.getItem("trackDraft")) || {};

      const tracks = stored.tracks || [];

      while (tracks.length <= trackIndex) {
        tracks.push({});
      }

      tracks[trackIndex] = {
        ...tracks[trackIndex],
        ...values,
        lyrics,
        audioKey: tracks[trackIndex]?.audioKey || null,
        audioName: tracks[trackIndex]?.audioName || null,
        audioUrl: tracks[trackIndex]?.audioUrl || null,
        audioFileId: tracks[trackIndex]?.audioFileId || null,
      };

        // 🔥 Create EMPTY next track slot
  

      localStorage.setItem(
        "trackDraft",
        JSON.stringify({
          ...stored,
          tracks,
          updatedAt: new Date().toISOString(),
        })
      );

     const nextIndex = tracks.length;

setSavedDraft({ ...stored, tracks });
setTrackIndex(nextIndex);


    }}
    className={`w-full sm:w-[260px] h-[46px] rounded-xl border transition
      border-gray-400 dark:border-white/40 text-[#020726] dark:text-white bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/10
    `}
  >
    + Add Another Track
  </button>
)}


</div>


      {/* ACTION BUTTONS */}
      <div className="md:col-span-2 relative flex items-center mt-12">

        {/* BACK */}
        <button
           type="button"
  onClick={() => {
    if (trackIndex > 0) {
      setTrackIndex(trackIndex - 1);
    } else {
      navigate("/releases/create");
    }
  }}
          className={`h-[46px] px-8 rounded-xl transition
            bg-gray-200 dark:bg-white/20 hover:bg-gray-300 dark:hover:bg-white/30
          `}
        >
          Back
        </button>

        {/* SAVE */}
        {!isView && (
          <button
            type="button"
            onClick={() => {
              const stored = JSON.parse(localStorage.getItem("trackDraft")) || {};
const storedTrack = stored.tracks?.[0] || {};

const trackPayload = {
  ...stored.tracks?.[trackIndex],
  ...values,
  lyrics,
  audioKey: stored.tracks?.[trackIndex]?.audioKey || null,
  audioName: stored.tracks?.[trackIndex]?.audioName || null,
  audioUrl: stored.tracks?.[trackIndex]?.audioUrl || null,
  audioFileId: stored.tracks?.[trackIndex]?.audioFileId || null,
};




const tracks = stored.tracks || [];

// Ensure array has enough slots
while (tracks.length <= trackIndex) {
  tracks.push({});
}

// Save only the current track
tracks[trackIndex] = {
  ...tracks[trackIndex],
  ...trackPayload,
};

localStorage.setItem(
  "trackDraft",
  JSON.stringify({
    ...stored,
    tracks,
    updatedAt: new Date().toISOString(),
  })
);


              alert("Draft saved successfully");
            }}
            className={`absolute left-1/2 -translate-x-1/2
              h-[46px] px-10 rounded-xl border transition
             border-gray-400 dark:border-white/40 hover:bg-gray-200 dark:hover:bg-white/10
            `}
          >
            Save
          </button>
        )}

        {/* NEXT */}
        <button
          type="submit"
          
          className="ml-auto h-[46px] px-10 rounded-xl bg-sky-500 text-[#020726] transition hover:bg-sky-400"
        >
          Next
        </button>

      </div>

    </Form>
  )}
</Formik>

        </div>
      
      
      {/* ================= ADD LYRICS MODAL ================= */}
{showLyrics && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
    <div
      className={`w-full max-w-lg rounded-2xl p-6
       bg-white dark:bg-[#060b2e] text-[#020726] dark:text-white
      `}
    >
      <h3 className="text-lg font-medium text-sky-400 mb-4">
        {isView ? "Lyrics" : lyrics ? "Edit Lyrics" : "Add Lyrics"}
      </h3>

      <textarea
        rows={8}
        value={lyrics}
        readOnly={isView}
        onChange={(e) => !isView && setLyrics(e.target.value)}
        placeholder={isView ? "" : "Enter lyrics here..."}
        className={`w-full rounded-xl p-4 outline-none resize-none
         bg-gray-100 dark:bg-[#2a2f4d] text-[#020726] dark:text-white border border-gray-300 dark:border-white/10
          ${isView ? "opacity-80 cursor-not-allowed" : ""}
        `}
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowLyrics(false)}
          className={`px-4 py-2 rounded-lg
           bg-gray-200 dark:bg-white/20 hover:bg-gray-300 dark:hover:bg-white/30
          `}
        >
          Close
        </button>

        {!isView && (
          <button
  onClick={() => {
    const stored =
      JSON.parse(localStorage.getItem("trackDraft")) || {};

    const tracks = stored.tracks || [];

    // 🔥 Ensure slot exists
    while (tracks.length <= trackIndex) {
      tracks.push({});
    }

    const updatedTrack = {
      ...tracks[trackIndex],
      lyrics,
    };

    tracks[trackIndex] = updatedTrack;

    localStorage.setItem(
      "trackDraft",
      JSON.stringify({
        ...stored,
        tracks,
        updatedAt: new Date().toISOString(),
      })
    );

    setSavedDraft({ ...stored, tracks });   // 🔥 refresh UI
    setShowLyrics(false);
  }}
  className="px-4 py-2 rounded-lg bg-sky-500 text-[#020726] font-medium hover:bg-sky-400"
>
  Save
</button>

        )}
      </div>
    </div>
  </div>
)}



    </div>
  );
}



/* ---------------- COMPONENTS ---------------- */

function Input({ name, placeholder, error, disabled }) {
  //const { theme } = useTheme();

  return (
    <div className="w-full">
      <div className="relative">
        <Field
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-[46px] px-5 rounded-xl outline-none
            bg-white dark:bg-[#2a2f4d] text-[#020726] dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/10
          `}
        />

        {error && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2
            w-5 h-5 rounded-full border border-red-400
            text-red-400 flex items-center justify-center text-xs font-bold">
            !
          </span>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
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

async function saveAudio(key, blob) {
  const db = await openAudioDB();
  const tx = db.transaction("audios", "readwrite");
  tx.objectStore("audios").put(blob, key);
  return new Promise((resolve) => (tx.oncomplete = resolve));
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

function getSavedSuggestions(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveSuggestion(key, value) {
  const existing = getSavedSuggestions(key);

  if (!existing.includes(value)) {
    const updated = [...existing, value];
    localStorage.setItem(key, JSON.stringify(updated));
  }
}

function MultiInput({
  name,
  placeholder,
  values,
  setFieldValue,
  error,
  disabled,
}) {

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const storageKey = `suggestions_${name}`;

  const suggestions = getSavedSuggestions(storageKey);

  // close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addItem = (item) => {
    if (disabled) return;

    const clean = item.trim();
    if (!clean || values.includes(clean)) return;

    const updated = [...values, clean];
    setFieldValue(name, updated, true);

    saveSuggestion(storageKey, clean); // 🔥 save suggestion

    setValue("");
    setOpen(false);
  };

  const removeItem = (item) => {
    if (disabled) return;

   setFieldValue(
  name,
  values.filter((i) => i !== item),
  true
);
  };

  const filteredOptions = suggestions.filter(
    (opt) =>
      !values.includes(opt) &&
      opt.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
  return () => {
    if (value.trim()) {
      addItem(value);
    }
  };
}, []);

  return (
    <div ref={containerRef} className="relative w-full">

      {/* INPUT BOX */}
      <div
        className="min-h-[46px] px-4 py-2 rounded-xl
        flex flex-wrap items-center gap-2 cursor-text
        bg-white dark:bg-[#2a2f4d] text-[#020726] dark:text-white
        border border-gray-300 dark:border-white/10"
        onClick={() => !disabled && setOpen(true)}
      >

        {/* TAGS */}
        {values.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1
            bg-sky-400/20 text-sky-300
            px-3 py-1 rounded-lg text-sm"
          >
            {item}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="hover:text-red-400"
              >
                ×
              </button>
            )}
          </span>
        ))}

        {/* INPUT */}
        <input
  value={value}
  disabled={disabled}
  onChange={(e) => {
    setValue(e.target.value);
    setOpen(true);
  }}
  onBlur={() => {
    if (value.trim()) {
      addItem(value);
    }
  }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem(value);
            }
          }}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
        />

      </div>

      {/* SUGGESTIONS */}
      {open && filteredOptions.length > 0 && (
        <div
          className="absolute z-20 mt-2 w-full rounded-xl overflow-hidden shadow-lg
          bg-white dark:bg-[#1f2440]
          border border-gray-200 dark:border-white/10"
        >
          {filteredOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => addItem(opt)}
              className="w-full text-left px-4 py-2 text-sm transition
              text-gray-800 dark:text-gray-200
              hover:bg-sky-100 dark:hover:bg-sky-400/20"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

    </div>
  );
}


function SelectInput({ name, placeholder, error, disabled, options }) {
  return (
    <div className="w-full">
      <div className="relative">
        <Field
          as="select"
          name={name}
          disabled={disabled}
          className={`w-full h-[46px] px-5 rounded-xl outline-none
          bg-white dark:bg-[#2a2f4d] text-[#020726] dark:text-white
          border border-gray-300 dark:border-white/10`}
        >
          <option value="">{placeholder}</option>

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Field>

        {error && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2
          w-5 h-5 rounded-full border border-red-400
          text-red-400 flex items-center justify-center text-xs font-bold">
            !
          </span>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
