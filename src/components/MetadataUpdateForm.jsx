// src/pages/MetadataUpdateForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar";

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
  const { theme } = useTheme();

  // THEME COLORS
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-md";

  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-700";

  const handleSubmit = async (values, { resetForm }) => {
  try {
    const token = localStorage.getItem("token"); // ⭐ get token

    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === "artwork" && values.artwork instanceof File) {
        formData.append("artwork", values.artwork); // ⭐ handle file correctly
      } else {
        formData.append(key, values[key] ?? "");
      }
    });

    const res = await axios.post(
      `${baseUrl}/client/metadata`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ⭐ required fix
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data?.success) {
      toast.success("Metadata Updated Successfully!");
      resetForm();

      // Clear file input manually
      const input = document.getElementById("artworkInput");
      if (input) input.value = "";
    } else {
      toast.error(res.data?.error || "Update failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error submitting metadata");
  }
};


  return (
    <div className={`min-h-screen pb-20 transition-all ${pageBg}`}>
      
      {/* HEADER */}
      <div className="px-4 sm:px-8 lg:px-10 py-4 flex flex-col md:flex-row justify-between gap-2 md:items-center">
        <h1 className="text-xl font-semibold">
          Metadata Update Form
        </h1>
        <p className={`text-sm ${subtleText}`}>
          Home <span className="text-[#29B6F6]">/ Metadata Update Form</span>
        </p>
      </div>

      {/* FORM CARD */}
      <div className="px-4 sm:px-8 lg:px-10 flex justify-center">
        <div className={`w-full max-w-5xl rounded-xl p-6 sm:p-8 md:p-10 border ${cardBg}`}>

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
            {({ setFieldValue }) => (
              <Form className="space-y-6">

                {/* ROW 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FieldGroup theme={theme} label="Artist Name *" name="artistName" placeholder="Enter artist name" />
                  <FieldGroup theme={theme} label="Track Title *" name="trackTitle" placeholder="Enter track title" />
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FieldGroup theme={theme} label="Album / Release" name="album" placeholder="Album or release name" />
                  <FieldGroup theme={theme} label="Label Name *" name="label" placeholder="Enter label name" />
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <FieldGroup theme={theme} label="ISRC Code *" name="isrc" placeholder="Enter ISRC Code" />
                  <FieldGroup theme={theme} label="UPC" name="upc" placeholder="Album/Release UPC" />
                  <FieldGroup theme={theme} type="date" label="Release Date" name="releaseDate" />
                </div>

                {/* ROW 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <FieldGroup theme={theme} label="Genre" name="genre" placeholder="Pop, Hip-Hop, EDM" />
                  <FieldGroup theme={theme} label="Composer(s)" name="composer" placeholder="Comma separated" />
                  <FieldGroup theme={theme} label="Publisher" name="publisher" placeholder="Publisher name" />
                </div>

                {/* LANGUAGE */}
                <FieldGroup
                  theme={theme}
                  label="Primary Language"
                  name="language"
                  placeholder="English, Hindi, Spanish..."
                />

                {/* LYRICS */}
                <TextAreaGroup
                  theme={theme}
                  label="Lyrics (optional)"
                  name="lyrics"
                  rows={4}
                  placeholder="Paste lyrics here..."
                />

                {/* CONTACT + ARTWORK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FieldGroup theme={theme} label="Contact Email / Manager" name="contact" placeholder="contact@example.com" />

                  <div>
                    <label className="block text-sm font-semibold mb-1">Upload Artwork (optional)</label>

                    <input
                      id="artworkInput"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFieldValue("artwork", e.target.files[0])}
                      className={`w-full rounded-md px-4 py-2 border cursor-pointer file:bg-[#29B6F6] file:text-white file:px-3 file:py-1 file:rounded-md 
                        ${theme === "dark"
                          ? "bg-[#2c2f4a] text-white border-transparent"
                          : "bg-gray-100 text-[#020726] border-gray-300"
                        }`}
                    />

                    <p className={`text-xs mt-1 ${subtleText}`}>
                      Recommended size: 3000×3000 (JPG/PNG)
                    </p>
                  </div>
                </div>

                {/* EXPLICIT */}
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="explicit" className="accent-[#29B6F6]" />
                  <span className="text-sm">Explicit Content</span>
                </div>

                {/* CONFIRM */}
                <div className="flex items-start gap-3">
                  <Field type="checkbox" name="confirm" className="mt-1 accent-[#29B6F6]" />
                  <span className="text-sm">
                    I confirm that all metadata provided is correct
                  </span>
                </div>
                <ErrorMessage name="confirm" component="p" className="text-red-400 text-xs" />

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("artworkInput").value = "";
                      setFieldValue("artwork", null);
                    }}
                    className={`px-5 py-2 rounded-md border text-sm ${
                      theme === "dark"
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-gray-400 text-[#020726] hover:bg-gray-100"
                    }`}
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90"
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


/* ================================================================================= */
/* REUSABLE COMPONENTS */
/* ================================================================================= */

const FieldGroup = ({ theme, label, name, placeholder, type = "text" }) => {
  const inputStyles =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white border-transparent"
      : "bg-gray-100 text-[#020726] border-gray-300";

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-1">{label}</label>

      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none text-sm focus:ring-1 focus:ring-[#29B6F6] border ${inputStyles}`}
      />

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};

const TextAreaGroup = ({ theme, label, name, rows, placeholder }) => {
  const inputStyles =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white border-transparent"
      : "bg-gray-100 text-[#020726] border-gray-300";

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-1">{label}</label>

      <Field
        as="textarea"
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none text-sm focus:ring-1 focus:ring-[#29B6F6] border ${inputStyles}`}
      />

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};
