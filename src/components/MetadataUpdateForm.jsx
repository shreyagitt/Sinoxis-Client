// src/pages/MetadataUpdateForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar"; // ⭐ THEME IMPORT

// VALIDATION SCHEMA
const MetadataSchema = Yup.object({
  artistName: Yup.string().required("Artist name is required"),
  trackTitle: Yup.string().required("Track Title is required"),
  album: Yup.string().nullable(),
  label: Yup.string().required("Label name is required"),
  isrc: Yup.string().required("ISRC code is required"),
  upc: Yup.string().nullable(),
  releaseDate: Yup.string().nullable(),
  genre: Yup.string().nullable(),
  composer: Yup.string().nullable(),
  publisher: Yup.string().nullable(),
  language: Yup.string().nullable(),
  lyrics: Yup.string().nullable(),
  contact: Yup.string().email("Enter a valid email").nullable(),
  confirm: Yup.bool().oneOf([true], "You must confirm the information"),
});

const MetadataUpdateForm = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useTheme(); // ⭐ GET THEME

  // 🎨 THEME COLORS
  const pageBg =
    theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";

  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-md";

  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";

  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-300 border-transparent"
      : "bg-gray-100 text-[#020726] placeholder-gray-500 border-gray-300";

  const subtleText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "artwork") {
          if (values.artwork) formData.append("artwork", values.artwork);
        } else {
          formData.append(key, values[key]);
        }
      });

      await axios.post(`${baseUrl}/metadata-update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Metadata Updated Successfully!");
      resetForm();
      document.getElementById("artworkInput").value = "";
    } catch (error) {
      toast.error("Error submitting metadata");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col pb-20 transition-all duration-300 ${pageBg}`}>

      {/* HEADER */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Metadata Update Form</h1>
        <p className={`text-sm ${subtleText}`}>
          Home <span className="text-[#29B6F6]">/ Metadata Update Form</span>
        </p>
      </div>

      {/* CARD */}
      <div className="flex justify-start px-10">
        <div className={`rounded-xl p-10 w-full max-w-5xl border transition-all duration-300 ${cardBg}`}>

          <Formik
            initialValues={{
              artistName: "",
              trackTitle: "",
              album: "",
              label: "",
              isrc: "",
              upc: "",
              releaseDate: "",
              genre: "",
              composer: "",
              publisher: "",
              language: "",
              lyrics: "",
              contact: "",
              artwork: null,
              explicit: false,
              confirm: false,
            }}
            validationSchema={MetadataSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, resetForm }) => (
              <Form className="space-y-6">

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup theme={theme} label="Artist Name *" name="artistName" placeholder="Enter artist name" />
                  <FieldGroup theme={theme} label="Track Title *" name="trackTitle" placeholder="Enter track title" />
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup theme={theme} label="Album / Release" name="album" placeholder="Album or release name" />
                  <FieldGroup theme={theme} label="Label Name *" name="label" placeholder="Enter label name" />
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldGroup theme={theme} label="ISRC Code *" name="isrc" placeholder="Enter ISRC Code" />
                  <FieldGroup theme={theme} label="UPC" name="upc" placeholder="Album/Release UPC" />
                  <FieldGroup theme={theme} type="date" label="Release Date" name="releaseDate" />
                </div>

                {/* ROW 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldGroup theme={theme} label="Genre" name="genre" placeholder="e.g., Pop" />
                  <FieldGroup theme={theme} label="Composer(s)" name="composer" placeholder="Comma separated" />
                  <FieldGroup theme={theme} label="Publisher" name="publisher" placeholder="Publisher name" />
                </div>

                {/* LANGUAGE */}
                <FieldGroup theme={theme} label="Primary Language" name="language" placeholder="e.g., English" />

                {/* LYRICS */}
                <TextAreaGroup
                  theme={theme}
                  label="Lyrics (optional)"
                  name="lyrics"
                  placeholder="Paste lyrics"
                  rows={4}
                />

                {/* CONTACT + ARTWORK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <FieldGroup theme={theme} label="Contact Email / Manager" name="contact" placeholder="contact@example.com" />

                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
                      Upload Artwork (optional)
                    </label>

                    <input
                      id="artworkInput"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFieldValue("artwork", e.target.files[0])}
                      className={`w-full rounded-md px-4 py-2 cursor-pointer border file:bg-[#29B6F6] file:text-white file:px-3 file:py-1 file:rounded-md ${inputBg}`}
                    />

                    <p className={`text-xs mt-1 ${subtleText}`}>
                      PNG/JPG recommended 3000×3000
                    </p>
                  </div>
                </div>

                {/* EXPLICIT SWITCH */}
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="explicit" className="accent-[#29B6F6]" />
                  <span className={`text-sm ${labelColor}`}>Explicit Content</span>
                </div>

                {/* CONFIRM */}
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="confirm" className="accent-[#29B6F6]" />
                  <span className={`text-sm ${labelColor}`}>
                    I confirm that the metadata provided is correct
                  </span>
                </div>
                <ErrorMessage name="confirm" component="p" className="text-red-400 text-xs" />

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      document.getElementById("artworkInput").value = "";
                    }}
                    className={`px-6 py-2 rounded-md border ${
                      theme === "dark"
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-gray-300 text-[#020726] hover:bg-gray-100"
                    }`}
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white px-6 py-2 rounded-md font-medium hover:opacity-90"
                  >
                    Update Metadata
                  </button>
                </div>

              </Form>
            )}
          </Formik>

        </div>
      </div>
    </div>
  );
};

export default MetadataUpdateForm;

/* ===================================================== */
/* REUSABLE INPUT COMPONENTS */
/* ===================================================== */

const FieldGroup = ({ theme, label, name, placeholder, type = "text" }) => {
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-300 border-transparent"
      : "bg-gray-100 text-[#020726] placeholder-gray-500 border-gray-300";

  return (
    <div>
      <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
        {label}
      </label>

      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] border ${inputBg}`}
      />

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};

const TextAreaGroup = ({ theme, label, name, rows, placeholder }) => {
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-300 border-transparent"
      : "bg-gray-100 text-[#020726] placeholder-gray-500 border-gray-300";

  return (
    <div>
      <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
        {label}
      </label>

      <Field
        as="textarea"
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] border ${inputBg}`}
      />

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};
