import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const ClaimSchema = Yup.object({
  artistName: Yup.string().required("Artist name is required"),
  trackTitle: Yup.string().required("Track title is required"),
  youtubeLink: Yup.string()
    .url("Enter a valid YouTube link")
    .required("YouTube link is required"),
  claimType: Yup.string().required("Please select a claim type"),
  claimDetails: Yup.string().nullable(),
  additionalInfo: Yup.string().nullable(),
  confirm: Yup.bool().oneOf([true], "You must confirm the information"),
});

const YouTubeClaimRelease = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "screenshot" && values.screenshot) {
          formData.append("screenshot", values.screenshot);
        } else {
          formData.append(key, values[key]);
        }
      });

      const res = await axios.post(`${baseUrl}/client/youtube-claim`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) toast.success("Claim submitted!");
      else toast.error("Something went wrong");

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting claim");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 py-3 px-10 flex justify-between items-center">
        <h1 className="text-base font-semibold text-gray-800">YouTube Claim Release</h1>
        <p className="text-sm text-gray-500">
          Home / <span className="text-red-600">YouTube Claim Release</span>
        </p>
      </div>

      {/* Form */}
      <div className="flex justify-start py-8 px-4 ml-10">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-gray-200">
          <Formik
            initialValues={{
              artistName: "",
              trackTitle: "",
              youtubeLink: "",
              claimType: "",
              claimDetails: "",
              screenshot: null,
              additionalInfo: "",
              confirm: false,
            }}
            validationSchema={ClaimSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">
                {/* Artist + Track */}
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

                {/* YouTube Link */}
                <FieldGroup
                  label="YouTube Video Link *"
                  name="youtubeLink"
                  placeholder="https://www.youtube.com/watch?v=..."
                />

                {/* Claim Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Claim Type *
                  </label>
                  <Field
                    as="select"
                    name="claimType"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500"
                  >
                    <option value="">Select claim type</option>
                    <option value="copyright">Copyright Claim</option>
                    <option value="content_id">Content ID Claim</option>
                    <option value="manual">Manual Claim</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="claimType"
                    component="p"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>

                {/* Claim Details */}
                <TextAreaGroup
                  label="Claim Details"
                  name="claimDetails"
                  placeholder="Explain the issue, timestamps, etc."
                />

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Screenshot</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("screenshot", e.target.files[0])}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload screenshot of the claim (optional but recommended)
                  </p>
                </div>

                {/* Additional Info */}
                <TextAreaGroup
                  label="Additional Information"
                  name="additionalInfo"
                  rows={3}
                  placeholder="Add more details if needed"
                />

                {/* Confirm */}
                <div className="flex items-start gap-2">
                  <Field type="checkbox" name="confirm" className="mt-1 accent-red-500" />
                  <span className="text-sm text-gray-700">
                    I confirm all information provided is accurate
                  </span>
                </div>
                <ErrorMessage name="confirm" component="p" className="text-red-600 text-xs" />

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button className="border px-5 py-2 rounded-md text-gray-700">
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-5 py-2 rounded-md"
                  >
                    Submit Claim
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

export default YouTubeClaimRelease;

/* -------------------------
   Reusable Components
------------------------- */
const FieldGroup = ({ label, name, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold">{label}</label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500"
    />
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);

const TextAreaGroup = ({ label, name, placeholder, rows = 4 }) => (
  <div>
    <label className="block text-sm font-semibold">{label}</label>
    <Field
      as="textarea"
      name={name}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500"
    />
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);
