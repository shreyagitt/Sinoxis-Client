import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FacebookVideoSchema = Yup.object({
  artistNameFb: Yup.string().required("Artist name is required"),
  labelNameFb: Yup.string().nullable(),
  facebookVideoUrl: Yup.string()
    .url("Enter a valid Facebook video URL")
    .required("Facebook video URL is required"),
  isrcCodeFb: Yup.string().required("ISRC code is required"),
  claimTypeFb: Yup.string().required("Please select a claim type"),
  claimDetailsFb: Yup.string().nullable(),
  confirmFb: Yup.bool().oneOf([true], "You must confirm the information"),
});

const FacebookVideoLinkSubmitForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-gray-100 py-3 px-10 flex justify-between items-center">
        <h1 className="text-base font-semibold text-gray-800">Facebook Video Link Submit Form</h1>
        <p className="text-sm text-gray-500">
          Home / <span className="text-red-500 font-medium">Facebook Video Link Submit Form</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="flex justify-start py-8 px-4 ml-14">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl border border-gray-200">

          <Formik
            initialValues={{
              artistNameFb: "",
              labelNameFb: "",
              facebookVideoUrl: "",
              isrcCodeFb: "",
              claimTypeFb: "",
              claimDetailsFb: "",
              screenshotFb: null,
              confirmFb: false,
            }}
            validationSchema={FacebookVideoSchema}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              alert("✅ Video Link Submitted Successfully!");
              resetForm();
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">

                {/* Artist + Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Artist Name *" name="artistNameFb" placeholder="Enter artist name" />
                  <FieldGroup label="Label Name" name="labelNameFb" placeholder="Enter label name (optional)" />
                </div>

                {/* Facebook Video URL */}
                <FieldGroup
                  label="Facebook Video URL *"
                  name="facebookVideoUrl"
                  placeholder="https://www.facebook.com/.../videos/..."
                  helper="Paste the full Facebook video URL that has the claim issue."
                />

                {/* ISRC */}
                <FieldGroup
                  label="Music ISRC Code *"
                  name="isrcCodeFb"
                  placeholder="Enter ISRC code (e.g., USABC1234567)"
                  helper="Provide the ISRC of the track involved in this claim."
                />

                {/* Claim Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Claim Type *</label>
                  <Field
                    as="select"
                    name="claimTypeFb"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  >
                    <option value="" disabled>Select claim type</option>
                    <option value="copyright">Copyright Claim</option>
                    <option value="monetization">Monetization Claim</option>
                    <option value="ownership">Ownership Claim</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="claimTypeFb" component="p" className="text-red-600 text-xs mt-1" />
                </div>

                {/* Claim Details */}
                <TextAreaGroup
                  label="Claim Details"
                  name="claimDetailsFb"
                  rows={4}
                  placeholder="Explain the issue, include timestamps if applicable"
                />

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Screenshot of Claim</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("screenshotFb", e.target.files[0])}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer file:cursor-pointer 
                 file:bg-gray-200 file:rounded-md file:px-3 file:py-1 file:border-0
                 hover:bg-gray-100 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional, but recommended for faster resolution
                  </p>
                </div>

                {/* Confirm Checkbox */}
                <div className="flex items-start gap-2">
                  <Field type="checkbox" name="confirmFb" className="mt-1 accent-red-500" />
                  <span className="text-sm text-gray-700">I confirm that all information provided is accurate</span>
                </div>
                <ErrorMessage name="confirmFb" component="p" className="text-red-500 text-xs" />

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="reset" className="border px-5 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50">
                    Reset Form
                  </button>
                  <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 text-sm rounded-md font-medium">
                    Submit Video Link
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

export default FacebookVideoLinkSubmitForm;


// ✅ Reusable Form Components
const FieldGroup = ({ label, name, placeholder, helper }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600"
    />
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);

const TextAreaGroup = ({ label, name, placeholder, rows }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <Field
      as="textarea"
      name={name}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600"
    />
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);
