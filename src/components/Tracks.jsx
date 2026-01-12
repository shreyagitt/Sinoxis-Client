import { useState , useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";


  

export default function TrackDetails() {
  const [step] = useState(1);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const mode = localStorage.getItem("releaseMode") || "create";
const isView = mode === "view";
const isEdit = mode === "edit";


  // ✅ DECLARE STATE FIRST
  const [savedDraft, setSavedDraft] = useState(null);
  const [showLyrics, setShowLyrics] = useState(false);

  // ✅ LOAD FROM localStorage
  useEffect(() => {
    const stored = localStorage.getItem("trackDraft");
    if (stored) {
      setSavedDraft(JSON.parse(stored));
    }
  }, []);

  // ✅ NOW IT IS SAFE TO USE savedDraft
  const initialValues = {
    trackTitle: savedDraft?.trackTitle || "",
    primaryArtist: savedDraft?.primaryArtist || "",
    publisher: savedDraft?.publisher || "",
    language: savedDraft?.language || "",
    isrc: savedDraft?.isrc || "",
    writers: savedDraft?.writers || [],
    composers: savedDraft?.composers || [],
    musicDirectors: savedDraft?.musicDirectors || [],
    producers: savedDraft?.producers || [],
  };



const trackSchema = Yup.object({
  trackTitle: Yup.string().required("Track title is required"),
  primaryArtist: Yup.string().required("Primary artist is required"),
  publisher: Yup.string().required("Publisher is required"),
  language: Yup.string().required("Language is required"),
  isrc: Yup.string().required("ISRC is required"),

  writers: Yup.array().min(1, "At least one writer is required"),
  composers: Yup.array().min(1, "At least one composer is required"),
  musicDirectors: Yup.array().min(1, "At least one music director is required"),
  producers: Yup.array().min(1, "At least one producer is required"),
});



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
  className={`max-w-6xl mx-auto mt-6 rounded-[28px] px-4 sm:px-8 md:px-12 py-8 md:py-10
    ${
      theme === "dark"
        ? "bg-[#060b2e] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        : "bg-white shadow-lg border border-gray-200"
    }
  `}
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
  className={`mt-10 border border-dashed rounded-2xl
    h-[150px] sm:h-[170px]
    flex flex-col items-center justify-center
    ${
      theme === "dark"
        ? "border-sky-400/60 bg-[#05092a]"
        : "border-sky-500 bg-gray-50"
    }
  `}
>

          <MusicIcon />
          <p className="font-medium mt-2">Drag & drop audio</p>
          <p className="text-sm text-gray-400 opacity-70">MP3 / WAV only</p>
          <input
            type="file"
            accept=".mp3,.wav"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* FORM */}
        <Formik
        enableReinitialize
  initialValues={initialValues}
  validationSchema={trackSchema}
  onSubmit={(values) => {
  if (isView) return;

  const releaseDraft =
    JSON.parse(localStorage.getItem("releaseDraft")) || {};

  if (!releaseDraft._id) {
    alert("Release context missing");
    return;
  }

  localStorage.setItem(
    "trackDraft",
    JSON.stringify({
      releaseId: releaseDraft._id, // ✅ CRITICAL
      ...values,
      updatedAt: new Date().toISOString(),
    })
  );

  navigate("/stores");
}}

>
  {({ values, errors, touched, setFieldValue }) => (
    <>
    <Form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-12">



          <Input  name="trackTitle"
  placeholder="Track Title *"
  disabled={isView}
  error={touched.trackTitle && errors.trackTitle}
    />
          <Input name="primaryArtist"
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

          <Input name="publisher"
  placeholder="Publisher *"
  disabled={isView}
  error={touched.publisher && errors.publisher} />

          <Input name="language"
  placeholder="Language *"
  disabled={isView}
  error={touched.language && errors.language} />
          <Input 
  name="isrc"
  placeholder="ISRC *"
  disabled={isView}
  error={touched.isrc && errors.isrc}/>
   </Form>

        {/* ADD LYRICS */}
<div className="mt-6 flex justify-start">
  {!isView && (
        <button
          type="button"
          onClick={() => setShowLyrics(true)}
          className={`w-full sm:w-[260px] h-[46px] rounded-xl border transition
            ${
              theme === "dark"
                ? "border-white/40 text-white hover:bg-white/10"
                : "border-gray-400 text-[#020726] bg-white hover:bg-gray-100"
            }
          `}
        >
          Add Lyrics
        </button>
        )}
      </div>


        {/* ACTION BUTTONS */}
<div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
         <button
         type="button"
  onClick={() => navigate("/releases/create")}
  className={`px-6 py-2 rounded-lg transition
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
    <>
         <button
  type="button"
  onClick={() => {
    const existing =
  JSON.parse(localStorage.getItem("trackDraft")) || {};

localStorage.setItem(
  "trackDraft",
  JSON.stringify({
    ...existing,       // ✅ preserves releaseId
    ...values,
    step: "tracks",
    savedAt: new Date().toISOString(),
  })
);

    alert("Draft saved successfully");
  }}
  className={`px-6 py-2 rounded-lg border transition
    ${
      theme === "dark"
        ? "border-white/40 hover:bg-white/10"
        : "border-gray-400 hover:bg-gray-200"
    }
  `}
>
  Save
</button>
</>
)}

            <button
     type="submit"       
  onClick={() => navigate("/stores")}
  className="px-7 py-2 rounded-lg bg-sky-500 text-[#020726] font-medium hover:bg-sky-400 transition"
>
  Next
</button>

          </div>
       
      </>  
      )}
</Formik>
        </div>
      
      
      {/* ================= ADD LYRICS MODAL ================= */}
{showLyrics && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
    <div
      className={`w-full max-w-lg rounded-2xl p-6 transition
        ${
          theme === "dark"
            ? "bg-[#060b2e] text-white"
            : "bg-white text-[#020726]"
        }
      `}
    >
      <h3 className="text-lg font-medium text-sky-400 mb-4">
        Add Lyrics
      </h3>

      {/* TEXTAREA */}
      <textarea
        rows={6}
        placeholder="Enter lyrics here..."
        className={`w-full rounded-xl p-4 outline-none resize-none
          ${
            theme === "dark"
              ? "bg-[#2a2f4d] text-white placeholder-gray-300 border border-white/10"
              : "bg-gray-100 text-[#020726] placeholder-gray-500 border border-gray-300"
          }
        `}
      />

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowLyrics(false)}
          className={`px-4 py-2 rounded-lg transition
            ${
              theme === "dark"
                ? "bg-white/20 hover:bg-white/30"
                : "bg-gray-200 hover:bg-gray-300"
            }
          `}
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

function Input({ name, placeholder, error, disabled }) {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <div className="relative">
        <Field
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-[46px] px-5 rounded-xl outline-none
            ${
              theme === "dark"
                ? "bg-[#2a2f4d] text-white placeholder-gray-300"
                : "bg-white text-[#020726] placeholder-gray-500 border border-gray-300"
            }
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


function MultiInput({
  name,
  placeholder,
  options = [],
  values,
  setFieldValue,
  error,
  disabled,
}) {
  const { theme } = useTheme();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // ✅ CLOSE ON CLICK OUTSIDE
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
    if (!item || values.includes(item)) return;
    
    setFieldValue(name, [...values, item]);
    setValue("");
    setOpen(false);
  };

  const removeItem = (item) => {
    if (disabled) return;
    setFieldValue(
      name,
      values.filter((i) => i !== item)
    );
  };

  const filteredOptions = options.filter(
    (opt) =>
      !values.includes(opt) &&
      opt.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* INPUT BOX */}
      <div
        className={`min-h-[46px] px-4 py-2 rounded-xl
          flex flex-wrap items-center gap-2 cursor-text
          ${
            theme === "dark"
              ? "bg-[#2a2f4d] border border-white/10"
              : "bg-white border border-gray-300"
          }
        `}
        onClick={() => !disabled && setOpen(true)}
      >
        {/* CHIPS */}
        {values.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1
              bg-sky-400/20 text-sky-300
              px-3 py-1 rounded-lg text-sm"
          >
            {item}
            <button
              type="button"
              disabled={disabled}
              onClick={() => removeItem(item)}
              className="hover:text-red-400"
            >
              ×
            </button>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem(value.trim());
            }
          }}
          placeholder={values.length === 0 ? placeholder : ""}
          className={`flex-1 bg-transparent outline-none text-sm min-w-[120px]
            ${
              theme === "dark"
                ? "text-white placeholder-gray-400"
                : "text-[#020726] placeholder-gray-500"
            }
          `}
        />

        {/* DROPDOWN ICON */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className="ml-auto text-gray-400 hover:text-sky-400"
        >
          ▼
        </button>
      </div>

      {/* DROPDOWN */}
      {open && filteredOptions.length > 0 && (
        <div
          className={`absolute z-20 mt-2 w-full rounded-xl overflow-hidden shadow-lg
            ${
              theme === "dark"
                ? "bg-[#1f2440] border border-white/10"
                : "bg-white border border-gray-200"
            }
          `}
        >
          {filteredOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => addItem(opt)}
              className={`w-full text-left px-4 py-2 text-sm transition
                ${
                  theme === "dark"
                    ? "text-gray-200 hover:bg-sky-400/20"
                    : "text-gray-800 hover:bg-sky-100"
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* ERROR */}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}


