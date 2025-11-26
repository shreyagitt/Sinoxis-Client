// src/pages/YouTubeClaimRelease.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar";

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
  const { theme } = useTheme();

  // theme-aware classes
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10 shadow-2xl text-white"
      : "bg-white border border-gray-200 shadow-sm text-[#020726]";
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBase =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border border-transparent"
      : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-200";
  const hintColor = theme === "dark" ? "text-[#9bb6d8]" : "text-gray-500";
  const errorColor = "text-red-400";

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "screenshot" && values.screenshot) {
          formData.append("screenshot", values.screenshot);
        } else {
          formData.append(key, values[key] ?? "");
        }
      });

      const res = await axios.post(`${baseUrl}/client/youtube-claim`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("✅ Claim submitted!");
        resetForm();
      } else {
        toast.error(res.data?.error || "❌ Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error submitting claim");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-20 ${pageBg}`}>
      {/* Scoped CSS for the file-button styling */}
      <style>{`
        /* Scope only to our custom-file-input to avoid global side-effects */
        .custom-file-input::file-selector-button {
          background: #29B6F6; /* sky blue */
          color: white;
          border: none;
          padding: 6px 12px;
          margin-right: 8px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        /* WebKit vendor prefix */
        .custom-file-input::-webkit-file-upload-button {
          background: #29B6F6;
          color: white;
          border: none;
          padding: 6px 12px;
          margin-right: 8px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        /* Hover states */
        .custom-file-input::file-selector-button:hover,
        .custom-file-input::-webkit-file-upload-button:hover {
          filter: brightness(0.93);
        }
        /* Make the "filename" part visually consistent for light theme */
        .custom-file-input {
          /* ensure file input background & text are consistent */
        }
        /* small responsiveness: reduce padding on very small screens */
        @media (max-width: 420px) {
          .custom-file-input::file-selector-button,
          .custom-file-input::-webkit-file-upload-button {
            padding: 5px 8px;
            border-radius: 6px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="py-4 px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className={`text-xl font-semibold ${labelColor}`}>YouTube Claim Release</h1>
        <p className={`text-sm ${hintColor}`}>
          Home <span className="text-[#29B6F6]">/ YouTube Claim Release</span>
        </p>
      </div>

      {/* Form Section */}
      <div className="flex justify-start px-10">
        <div className={`rounded-xl p-8 md:p-10 w-full max-w-5xl ${cardBg}`}>
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
                    theme={theme}
                    label="Artist Name *"
                    name="artistName"
                    placeholder="Enter artist name"
                    inputBase={inputBase}
                    labelColor={labelColor}
                  />
                  <FieldGroup
                    theme={theme}
                    label="Track Title *"
                    name="trackTitle"
                    placeholder="Enter track title"
                    inputBase={inputBase}
                    labelColor={labelColor}
                  />
                </div>

                {/* YouTube Link */}
                <FieldGroup
                  theme={theme}
                  label="YouTube Video Link *"
                  name="youtubeLink"
                  placeholder="https://www.youtube.com/watch?v=..."
                  inputBase={inputBase}
                  labelColor={labelColor}
                />

                {/* Claim Type */}
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
                    Claim Type *
                  </label>
                  <Field
                    as="select"
                    name="claimType"
                    className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBase}`}
                  >
                    <option value="">Select claim type</option>
                    <option value="copyright">Copyright Claim</option>
                    <option value="content_id">Content ID Claim</option>
                    <option value="manual">Manual Claim</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="claimType" component="p" className={`${errorColor} text-xs mt-1`} />
                </div>

                {/* Claim Details */}
                <TextAreaGroup
                  theme={theme}
                  label="Claim Details"
                  name="claimDetails"
                  placeholder="Explain the issue, timestamps, etc."
                  inputBase={inputBase}
                  labelColor={labelColor}
                />

                {/* Screenshot Upload — CUSTOM FILE INPUT */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>Screenshot</label>

                  {/* NOTE: className 'custom-file-input' used so our CSS targets only this input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("screenshot", e.currentTarget.files?.[0] ?? null)}
                    className={`w-full rounded-md px-4 py-2 ${inputBase} text-sm cursor-pointer custom-file-input`}
                  />
                  <p className={`text-xs mt-1 ${hintColor}`}>Upload screenshot of the claim (optional)</p>
                </div>

                {/* Additional Info */}
                <TextAreaGroup
                  theme={theme}
                  label="Additional Information"
                  name="additionalInfo"
                  rows={3}
                  placeholder="Add more details if needed"
                  inputBase={inputBase}
                  labelColor={labelColor}
                />

                {/* Confirm */}
                <div className="flex items-start gap-2">
                  <Field type="checkbox" name="confirm" className="mt-1 accent-[#29B6F6]" />
                  <span className={`text-sm ${labelColor}`}>I confirm all information provided is accurate</span>
                </div>
                <ErrorMessage name="confirm" component="p" className={`${errorColor} text-xs`} />

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="reset"
                    className={`rounded-md px-5 py-2 text-sm font-medium ${theme === "dark" ? "border border-white/20 text-white hover:bg-white/5" : "border border-gray-200 text-[#020726] hover:bg-gray-50"}`}
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90 text-white px-5 py-2 rounded-md text-sm font-medium"
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

/* ---------------------- Reusable Styled Components ---------------------- */

const FieldGroup = ({ theme, label, name, placeholder, inputBase, labelColor }) => {
  const inputCls = inputBase ?? (theme === "dark"
    ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border border-transparent"
    : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-200");

  const lbl = labelColor ?? (theme === "dark" ? "text-white" : "text-[#020726']");

  return (
    <div>
      <label className={`block text-sm font-semibold mb-1 ${lbl}`}>{label}</label>
      <Field
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputCls}`}
      />
      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};

const TextAreaGroup = ({ theme, label, name, placeholder, rows = 4, inputBase, labelColor }) => {
  const inputCls = inputBase ?? (theme === "dark"
    ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border border-transparent"
    : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-200");

  const lbl = labelColor ?? (theme === "dark" ? "text-white" : "text-[#020726']");

  return (
    <div>
      <label className={`block text-sm font-semibold mb-1 ${lbl}`}>{label}</label>
      <Field
        as="textarea"
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputCls}`}
      />
      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};


