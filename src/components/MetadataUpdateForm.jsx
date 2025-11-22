// src/pages/MetadataUpdateForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

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
      console.error(error);
      toast.error("Error submitting metadata");
    }
  };

  return (
    <div className="min-h-screen bg-[#020726] flex flex-col pb-20">

      {/* Header */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Metadata Update Form</h1>
        <p className="text-sm text-white">
          Home <span className="text-[#29B6F6]">/ Metadata Update Form</span>
        </p>
      </div>

      {/* Form Card */}
      <div className="flex justify-start px-10">
        <div className="bg-[#0a1039] rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-white/10">

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

                {/* Artist & Track */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup 
                    label="Artist Name *"
                    name="artistName"
                    placeholder="Enter artist name"
                  />
                  
                  <FieldGroup 
                    label="Track Title *"
                    name="trackTitle"
                    placeholder="Enter track title"
                  />
                </div>

                {/* Album & Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Album / Release" name="album" placeholder="Album or release name" />

                  <FieldGroup 
                    label="Label Name *"
                    name="label"
                    placeholder="Enter Label name"
                  />
                </div>

                {/* ISRC / UPC / Release Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldGroup 
                    label="ISRC Code *"
                    name="isrc"
                    placeholder="Enter ISRC Code"
                  />

                  <FieldGroup 
                    label="UPC"
                    name="upc"
                    placeholder="Album/Release UPC"
                  />

                  <FieldGroup
                    label="Release Date"
                    name="releaseDate"
                    type="date"
                  />
                </div>

                {/* Genre / Composer / Publisher */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldGroup label="Genre" name="genre" placeholder="e.g., Pop" />
                  <FieldGroup label="Composer(s)" name="composer" placeholder="Comma separated" />
                  <FieldGroup label="Publisher" name="publisher" placeholder="Publisher name" />
                </div>

                {/* Language */}
                <FieldGroup label="Primary Language" name="language" placeholder="e.g., English" />

                {/* Lyrics */}
                <TextAreaGroup 
                  label="Lyrics (optional)"
                  name="lyrics"
                  rows={4}
                  placeholder="Paste lyrics"
                />

                {/* Contact + Artwork */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Contact Email / Manager" name="contact" placeholder="contact@example.com" />

                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Upload Artwork (optional)
                    </label>
                    <input
                      id="artworkInput"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFieldValue("artwork", e.target.files[0])}
                      className="w-full bg-[#2c2f4a] text-white rounded-md px-4 py-2 cursor-pointer
                        file:bg-[#1c2340] file:text-white file:px-3 file:py-1 file:rounded-md
                        hover:bg-[#32395a]"
                    />
                    <p className="text-xs text-[#9bb6d8] mt-1">PNG/JPG recommended 3000×3000</p>
                  </div>
                </div>

                {/* Explicit */}
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="explicit" className="accent-[#29B6F6]" />
                  <span className="text-sm text-white">Explicit Content</span>
                </div>

                {/* Confirm */}
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="confirm" className="accent-[#29B6F6]" />
                  <span className="text-sm text-white">
                    I confirm that the metadata provided is correct
                  </span>
                </div>
                <ErrorMessage name="confirm" component="p" className="text-red-400 text-xs" />

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      document.getElementById("artworkInput").value = "";
                    }}
                    className="border border-white/20 text-white px-6 py-2 rounded-md hover:bg-white/10"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90 
                    text-white px-6 py-2 rounded-md font-medium"
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

const FieldGroup = ({ label, name, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">{label}</label>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8]
      rounded-md px-4 py-2 border border-transparent
      focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);

const TextAreaGroup = ({ label, name, rows, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">{label}</label>
    <Field
      as="textarea"
      name={name}
      rows={rows}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8]
      rounded-md px-4 py-2 border border-transparent
      focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);
