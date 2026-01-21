import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";


const releaseSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  subtitle: Yup.string(),
  genre: Yup.string().required("Genre is required"),
  subgenre: Yup.string().required("Subgenre is required"),
  label: Yup.string().required("Label is required"),
  originalReleaseDate: Yup.date().required("Original release date required"),
  digitalReleaseDate: Yup.date().required("Digital release date required"),
  copyrightText: Yup.string().required("Copyright is required"),
  upc: Yup.string(), // ✅ ADD THIS
  productionYear: Yup.number()
    .typeError("Enter valid year")
    .min(1900)
    .max(new Date().getFullYear()),
});


const initialValues = {
  title: "",
  subtitle: "",
  genre: "",
  subgenre: "",
  label: "",
  originalReleaseDate: "",
  digitalReleaseDate: "",
  copyrightText: "",
  upc: "", 
  productionYear: "",
};



export default function CreateRelease() {
  const [step] = useState(0);
  const navigate = useNavigate();
  const formikRef = useRef(null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const { theme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState(initialValues);

  const mode = localStorage.getItem("releaseMode") || "create";
  const isView = mode === "view";
  const isEdit = mode === "edit";

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

    const coverTextColor =
  theme === "dark" ? "text-gray-300" : "text-black";

const toDateInputValue = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
};


useEffect(() => {
  const saved = localStorage.getItem("releaseDraft");
  if (!saved) return;

  const parsed = JSON.parse(saved);

  setInitialFormValues({
    title: parsed.title || "",
    subtitle: parsed.subtitle || "",
    genre: parsed.genre || "",
    subgenre: parsed.subgenre || "",
    label: parsed.label || "",
    originalReleaseDate: toDateInputValue(parsed.originalReleaseDate),
digitalReleaseDate: toDateInputValue(parsed.digitalReleaseDate),
    copyrightText: parsed.copyrightText || "",
    upc: parsed.upc || "",
    productionYear: parsed.productionYear || "",
  });

  // ✅ PRIORITY: API COVER URL
  if (parsed.cover) {
    setCoverPreview(parsed.cover);
  }
  // ✅ FALLBACK: draft coverKey
  else if (parsed.coverKey) {
    const img = localStorage.getItem(parsed.coverKey);
    if (img) setCoverPreview(img);
  }
}, []);


  return (
    <div className={`min-h-screen ${pageBg} font-[Montserrat]`}>

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
     <div className={`max-w-6xl mx-auto mt-6 rounded-[28px] px-6 sm:px-10 md:px-12 py-8 md:py-10 ${cardBg}`}>

        {/* TITLE */}
        <h2 className="text-center text-4xl font-medium text-sky-400">
  {isView ? "View Release" : isEdit ? "Edit Release" : "Create Release"}
</h2>

        <p className="text-center text-gray-300 mt-2">
          Complete all steps to publish your release
        </p>
{/* PROGRESS WRAPPER */}
<div className="relative mt-10 sm:mt-12">
  {/* BASE LINE */}
  <div
    className={`mx-auto w-full h-[3px] rounded-full transition-colors
      ${theme === "dark" ? "bg-white/10" : "bg-gray-300"}
    `}
  />

  {/* ACTIVE LINE */}
  <div
    className="absolute top-0 left-0 h-[3px] rounded-full bg-sky-400 transition-all duration-500"
    style={{ width: `${((step + 1) / 4) * 100}%` }}
  />

  {/* DOTS */}
  <div className="absolute -top-[6px] left-0 w-full flex justify-between px-1 sm:px-2">
    {["Release", "Tracks", "Stores", "Submission"].map((label, i) => {
      const isActive = i <= step;

      return (
        <div key={label} className="flex flex-col items-center">
          <div
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition
              ${
                isActive
                  ? "bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.18)]"
                  : theme === "dark"
                    ? "bg-sky-400/40"
                    : "bg-gray-400"
              }
            `}
          />
        </div>
      );
    })}
  </div>

  {/* LABELS */}
  <div className="mt-5 sm:mt-6 grid grid-cols-4 text-xs sm:text-sm text-center">
    {["Release", "Tracks", "Stores", "Submission"].map((label, i) => (
      <span
        key={label}
        className={
          i === step
            ? "text-sky-400 font-medium"
            : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
        }
      >
        {label}
      </span>
    ))}
  </div>
</div>



{/* SECTION PILL */}
<div className="flex justify-center mt-10">
  <span className="px-7 py-2 rounded-full bg-sky-400 text-[#020726] font-medium shadow-md">
    Release Details
  </span>
</div>


        {/* FORM */}
<Formik
innerRef={formikRef}
  initialValues={initialFormValues}
  validationSchema={releaseSchema}
  enableReinitialize
  onSubmit={(values) => {
  const mode = localStorage.getItem("releaseMode") || "create";
  const existingDraft =
    JSON.parse(localStorage.getItem("releaseDraft")) || {};

  // ✅ ALWAYS PRESERVE ID
  const releaseId =
    mode === "edit"
      ? existingDraft._id
      : crypto.randomUUID();

  // ✅ SAVE DRAFT (single source of truth)
 const trackDraft =
  JSON.parse(localStorage.getItem("trackDraft")) || null;

localStorage.setItem(
  "releaseDraft",
  JSON.stringify({
    _id: releaseId,
    ...values,
    coverKey: existingDraft.coverKey,
    trackDraftExists: Boolean(trackDraft), // debug flag
    updatedAt: new Date().toISOString(),
  })
);



  navigate("/tracks");
}}


>
{({ errors, touched, values }) => (
<Form className="grid md:grid-cols-2 gap-x-10 gap-y-6 mt-12">


  {/* TEXT FIELDS */}
  <FormField
    theme={theme}
    name="title"
    placeholder="Title *"
    disabled={isView}
    error={touched.title && errors.title}
  />

  <FormField
    theme={theme}
    name="subtitle"
    disabled={isView}
    placeholder="Subtitle"
  />

  <SelectField
    theme={theme}
    name="genre"
    placeholder="Genre *"
    options={[
      "Ambient / Instrumental",
      "Carnatic Classical",
      "Children's Music",
      "Dance",
      "Devotional",
      "Electronic",
      "Film",
      "Folk",
      "Hip-Hop / Rap",
      "Indie",
      "Jazz",
      "Pop",
      "Rock",
      "Worldwide",
    ]}
      disabled={isView}   // ✅ FIX
    error={touched.genre && errors.genre}
  />

  <SelectField
    theme={theme}
    name="subgenre"
    placeholder="Subgenre *"
    options={[
      "Ambient",
      "Classical",
      "Electronic",
      "Indie",
      "Pop",
      "Rock",
    ]}
      disabled={isView}   // ✅ FIX
    error={touched.subgenre && errors.subgenre}
  />

  <FormField
    theme={theme}
    name="label"
    placeholder="Label *"
    disabled={isView}
    error={touched.label && errors.label}
  />

  <DateField
    theme={theme}
    name="originalReleaseDate"
      disabled={isView}   // ✅ FIX
    error={touched.originalReleaseDate && errors.originalReleaseDate}
  />

  <DateField
    theme={theme}
    name="digitalReleaseDate"
      disabled={isView}   // ✅ FIX
    error={touched.digitalReleaseDate && errors.digitalReleaseDate}
  />

  <FormField
    theme={theme}
    name="copyrightText"
    placeholder="℗ 2026 Sinoxis Digital"
    disabled={isView}
    error={touched.copyrightText && errors.copyrightText}
  />

  {/* ✅ UPC FIELD (ADDED BELOW COPYRIGHT) */}
<FormField
  theme={theme}
  name="upc"
  placeholder="UPC (Optional)"
  disabled={isView}
  error={touched.upc && errors.upc}
/>

  <FormField
    theme={theme}
    name="productionYear"
    placeholder="Production Year"
    disabled={isView}
    error={touched.productionYear && errors.productionYear}
  />

  {/* ✅ COVER ART — FULL WIDTH (INSIDE FORM) */}
  <div className="md:col-span-2 mt-6">
    <label className={`block text-sm mb-3 ${coverTextColor}`}>
      Cover Art <span className="text-red-400">*</span>
    </label>

    <div
      className="
        relative w-full h-[190px]
        rounded-2xl
        border border-dashed border-white/30
        flex items-center justify-center
        bg-[#05092a]
      "
    >
      {coverPreview ? (
        <img
          src={coverPreview}
          alt="Cover Preview"
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-11 h-11 text-sky-400 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v10m0 0l-4-4m4 4l4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>

          <p className={`text-sm ${coverTextColor}`}>Drag & drop image</p>
        </div>
      )}

     <input
  type="file"
  accept="image/png,image/jpeg"
  className="absolute inset-0 opacity-0 cursor-pointer"
  onChange={(e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const existingDraft =
      JSON.parse(localStorage.getItem("releaseDraft")) || {};

    const releaseId =
      existingDraft._id || crypto.randomUUID();

    const coverKey = `cover_${releaseId}`;

    // store image ONCE
    localStorage.setItem(coverKey, reader.result);

    // show preview immediately
    setCoverPreview(reader.result);

    // persist reference
    localStorage.setItem(
      "releaseDraft",
      JSON.stringify({
        ...existingDraft,
        _id: releaseId,
        coverKey,
        updatedAt: new Date().toISOString(),
      })
    );
  };

  reader.readAsDataURL(file);
}}


/>

    </div>

    {/* ACTION BUTTONS */}
    {saved && (
  <div
    className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg
      ${theme === "dark"
        ? "bg-green-500 text-black"
        : "bg-green-600 text-white"
      }
    `}
  >
    Saved successfully
  </div>
)}

<div className="flex justify-end gap-4 mt-12">
  <button
  type="button"
  onClick={() => {
    if (!formikRef.current) return;

    const values = formikRef.current.values;

    const existingDraft =
  JSON.parse(localStorage.getItem("releaseDraft")) || {};

localStorage.setItem(
  "releaseDraft",
  JSON.stringify({
    ...existingDraft,
    ...values,
    currentStep: "release",
    updatedAt: new Date().toISOString(),
  })
);



    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // auto hide
  }}
    
 className={`px-6 py-2 rounded-lg border transition
  ${theme === "dark"
    ? "border-white/40 text-white hover:bg-white/10"
    : "border-gray-400 text-gray-800 hover:bg-gray-200"
  }
`}

>
  Save
</button>


  <button
  type="submit"
  className="px-7 py-2 rounded-lg bg-sky-500 text-[#020726] font-medium hover:bg-sky-400 transition"
>
  Next
</button>

</div>
  </div>

</Form>
)}
</Formik>






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

export const FormField = ({ theme, error, disabled, ...props }) => {
  const inputBg =
    theme === "dark"
      ? "bg-[#2a2f4d] text-white placeholder-gray-300"
      : "bg-white text-[#020726] placeholder-gray-500 border border-gray-300";

  return (
    <div className="relative flex flex-col w-full">
      <Field
      disabled={disabled}
        {...props}
        aria-invalid={Boolean(error)}
        className={`w-full h-[46px] px-5 pr-12 rounded-xl outline-none
          focus:ring-1 focus:ring-sky-400 transition ${inputBg}`}
      />

      {Boolean(error) && (
        <>
          <div className="absolute right-4 top-[14px] pointer-events-none">
            <ErrorIcon />
          </div>

          <span className="text-red-400 text-xs mt-1 leading-tight">
            {error}
          </span>
        </>
      )}
    </div>
  );
};




export const SelectField = ({
  theme,
  name,
  placeholder,
  options,
  error,
   disabled
}) => {
  const inputBg =
    theme === "dark"
      ? "bg-[#2a2f4d] text-white"
      : "bg-white text-[#020726] border border-gray-300";

  return (
    <div className="relative flex flex-col w-full">
      <Field
      disabled={disabled}
        as="select"
        name={name}
        aria-invalid={!!error}
        className={`w-full h-[46px] px-5 pr-12 rounded-xl outline-none
        focus:ring-1 focus:ring-sky-400 transition ${inputBg}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Field>

      {error && (
        <div className="absolute right-4 top-[14px]">
          <ErrorIcon />
        </div>
      )}

      {error && (
        <span className="text-red-400 text-xs mt-1 leading-tight">
          {error}
        </span>
      )}
    </div>
  );
};



export const DateField = ({ theme, name, error , disabled }) => {
  const inputBg =
    theme === "dark"
      ? "bg-[#2a2f4d] text-white"
      : "bg-white text-[#020726] border border-gray-300";

  return (
    <div className="relative flex flex-col w-full">
      <Field
        type="date"
        name={name}
        disabled={disabled}
        aria-invalid={!!error}
        className={`w-full h-[46px] px-5 pr-12 rounded-xl outline-none
        focus:ring-1 focus:ring-sky-400 transition ${inputBg}`}
      />

      {error && (
        <div className="absolute right-4 top-[14px]">
          <ErrorIcon />
        </div>
      )}

      {error && (
        <span className="text-red-400 text-xs mt-1 leading-tight">
          {error}
        </span>
      )}
    </div>
  );
};

