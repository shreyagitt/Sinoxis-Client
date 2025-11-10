import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gray-100 py-3 px-10 flex justify-between items-center">
        <h1 className="text-base font-semibold text-gray-800">Metadata Update Form</h1>
        <p className="text-sm text-gray-500">
          Home / <span className="text-red-600">Metadata Update Form</span>
        </p>
      </div>

      {/* Form Card */}
      <div className="flex justify-start py-8 px-4 ml-12">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl border border-gray-200">

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
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              alert("✅ Metadata Updated Successfully!");
              resetForm();
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">

                {/* Artist & Track */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup 
  label={<>Artist Name <span className="text-red-500">*</span></>} 
  name="artistName" 
  placeholder="Enter artist name" 
/>
                  <FieldGroup label={<>Track Title <span className="text-red-500">*</span></>} name="trackTitle" placeholder="Enter track title" />
                </div>

                {/* Album & Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Album / Release" name="album" placeholder="Album or release name" />
                  <FieldGroup 
  label={<>Label Name <span className="text-red-500">*</span></>} 
  name="LabelName" 
  placeholder="Enter Label name" 
/>
                </div>

                {/* ISRC + UPC + Release Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldGroup 
  label={<>ISRC Code <span className="text-red-500">*</span></>} 
  name="isrc" 
  placeholder="Enter ISRC Code" 
/>
                  <FieldGroup label="UPC" name="upc" placeholder="Album/Release UPC" />
                  <FieldGroup label="Release Date" name="releaseDate" type="date" />
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
                <TextAreaGroup label="Lyrics (optional)" name="lyrics" rows={4} placeholder="Paste lyrics" />

                {/* Contact + Artwork Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Contact Email / Manager" name="contact" placeholder="contact@example.com" />

                  <div>
                    <label className="block text-sm font-semibold mb-1">Upload Artwork (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFieldValue("artwork", e.target.files[0])}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer file:cursor-pointer 
                 file:bg-gray-200 file:rounded-md file:px-3 file:py-1 file:border-0
                 hover:bg-gray-100 transition"
                    />
                    <p className="text-xs text-gray-500 mt-1">PNG/JPG (recommended 3000×3000px)</p>
                  </div>
                </div>

                {/* Explicit Content */}
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="explicit" className="accent-red-500" />
                  <span className="text-sm text-gray-700">Explicit Content</span>
                </div>

                {/* Confirm */}
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="confirm" className="accent-red-500" />
                  <span className="text-sm text-gray-700">I confirm that the metadata provided is correct</span>
                </div>
                <ErrorMessage name="confirm" component="p" className="text-red-600 text-xs" />

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="reset" className="border px-5 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50">
                    Reset Form
                  </button>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm rounded-md font-medium">
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


// Reusable Inputs
const FieldGroup = ({ label, name, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
    />
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);

const TextAreaGroup = ({ label, name, rows, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <Field
      as="textarea"
      name={name}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
    />
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);
