// src/pages/YouTubeClaimRelease.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChevronDownIcon ,CheckIcon} from "@heroicons/react/20/solid";
import { Listbox } from "@headlessui/react";

import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar";

/* ---------------------- Yup Validation ---------------------- */
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

/* ======================================================================= */
/*                           MAIN COMPONENT                                */
/* ======================================================================= */
const YouTubeClaimRelease = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useTheme();

  /* ---------------------- Theme-Based Styles ---------------------- */
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10 shadow-xl"
      : "bg-white border border-gray-300 shadow-md";

  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const hintColor = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const inputBase =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-400 border border-white/10"
      : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-300";

  /* ---------------------- Submit Handler ---------------------- */
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (key === "screenshot" && val) {
          formData.append("screenshot", val);
        } else {
          formData.append(key, val ?? "");
        }
      });

      const res = await axios.post(`${baseUrl}/client/youtube-claim`, formData);

      if (res.data.success) {
        toast.success("Claim submitted successfully!");
        resetForm();
      } else {
        toast.error(res.data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while submitting claim");
    }
  };

  /* ---------------------- Render ---------------------- */
  return (
    <div className={`min-h-screen pb-20 transition-all duration-300 ${pageBg}`}>
      {/* ---------------- File Button Scoped Styling ---------------- */}
      <style>{`
        .custom-file-input::file-selector-button,
        .custom-file-input::-webkit-file-upload-button {
          background: #29B6F6;
          color: white;
          border: none;
          padding: 6px 12px;
          margin-right: 10px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .custom-file-input::file-selector-button:hover,
        .custom-file-input::-webkit-file-upload-button:hover {
          filter: brightness(0.95);
        }
        @media (max-width: 420px) {
          .custom-file-input::file-selector-button,
          .custom-file-input::-webkit-file-upload-button {
            padding: 5px 8px;
            border-radius: 6px;
          }
        }
      `}</style>

      {/* ---------------- Header ---------------- */}
      <div className="px-4 sm:px-8 lg:px-10 py-4 flex flex-col md:flex-row justify-between gap-2 md:items-center">
        <h1 className={`text-xl font-semibold ${labelColor}`}>YouTube Claim Release</h1>

        <p className={`text-sm ${hintColor}`}>
          Home <span className="text-[#29B6F6]">/ YouTube Claim Release</span>
        </p>
      </div>

      {/* ---------------- Form Wrapper ---------------- */}
      <div className="px-4 sm:px-8 lg:px-10 w-full flex justify-center">
        <div className={`rounded-xl p-6 sm:p-8 md:p-10 max-w-5xl w-full ${cardBg}`}>
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
              <Form className="space-y-6 w-full">

                {/* ---------------- Artist + Track ---------------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldGroup
                    label="Artist Name *"
                    name="artistName"
                    placeholder="Enter artist name"
                    inputBase={inputBase}
                    labelColor={labelColor}
                  />

                  <FieldGroup
                    label="Track Title *"
                    name="trackTitle"
                    placeholder="Enter track title"
                    inputBase={inputBase}
                    labelColor={labelColor}
                  />
                </div>

                {/* ---------------- YouTube Link ---------------- */}
                <FieldGroup
                  label="YouTube Video Link *"
                  name="youtubeLink"
                  placeholder="https://www.youtube.com/watch?v=..."
                  inputBase={inputBase}
                  labelColor={labelColor}
                />

           {/* ---------------- Claim Type (Fully Corrected Responsive + Heroicon) ---------------- */}
{/* ---------------- Claim Type (Headless UI Version — Same as Facebook) ---------------- */}
<div className="w-full">
  <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
    Claim Type *
  </label>

  <Field name="claimType">
    {({ field, form }) => {
      const value = field.value;
      const setValue = (val) => form.setFieldValue("claimType", val);

      const options = [
        { value: "", label: "Select claim type" },
        { value: "copyright", label: "Copyright Claim" },
        { value: "content_id", label: "Content ID Claim" },
        { value: "manual", label: "Manual Claim" },
        { value: "other", label: "Other" },
      ];

      return (
        <Listbox value={value} onChange={setValue}>
          <div className="relative">
            <Listbox.Button
              className={`w-full rounded-md px-4 py-2 text-left border focus:ring-1 focus:ring-[#29B6F6] ${inputBase}`}
            >
              <span>{options.find((o) => o.value === value)?.label}</span>

              <ChevronDownIcon
                className={`h-5 w-5 absolute right-2 top-1/2 -translate-y-1/2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </Listbox.Button>

            <Listbox.Options
              className={`
                absolute mt-1 w-full max-h-60 overflow-auto rounded-md shadow-lg border z-50
                ${theme === "dark" ? "bg-[#1e2347] text-white" : "bg-white text-black"}
              `}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 text-sm ${
                      active ? "bg-[#29B6F6] text-white" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center gap-2">
                      {selected && <CheckIcon className="h-4 w-4 text-white" />}
                      {option.label}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      );
    }}
  </Field>

  <ErrorMessage
    name="claimType"
    component="p"
    className="text-red-400 text-xs mt-1"
  />
</div>




                {/* ---------------- Claim Details ---------------- */}
                <TextAreaGroup
                  label="Claim Details"
                  name="claimDetails"
                  placeholder="Explain timestamps, claim details, etc."
                  inputBase={inputBase}
                  labelColor={labelColor}
                />

                {/* ---------------- Screenshot Upload ---------------- */}
                <div className="w-full">
                  <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                    Screenshot (optional)
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("screenshot", e.target.files?.[0] || null)}
                    className={`w-full rounded-md px-4 py-2 custom-file-input cursor-pointer ${inputBase}`}
                  />

                  <p className={`text-xs mt-1 ${hintColor}`}>
                    Upload a screenshot of the claim (optional)
                  </p>
                </div>

                {/* ---------------- Additional Info ---------------- */}
                <TextAreaGroup
                  label="Additional Information"
                  name="additionalInfo"
                  rows={3}
                  placeholder="Add more details if required"
                  inputBase={inputBase}
                  labelColor={labelColor}
                />

                {/* ---------------- Confirm Checkbox ---------------- */}
                <div className="flex items-start gap-3">
                  <Field type="checkbox" name="confirm" className="mt-1 accent-[#29B6F6]" />
                  <span className={`text-sm ${labelColor}`}>
                    I confirm all information provided is accurate
                  </span>
                </div>
                <ErrorMessage name="confirm" component="p" className="text-red-400 text-xs" />

                {/* ---------------- Buttons ---------------- */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <button
                    type="reset"
                    className={`px-5 py-2 rounded-md text-sm font-medium border ${
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

/* ======================================================================= */
/*                     REUSABLE INPUT COMPONENTS                           */
/* ======================================================================= */

const FieldGroup = ({ label, name, placeholder, inputBase, labelColor }) => (
  <div className="w-full">
    <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>{label}</label>

    <Field
      name={name}
      placeholder={placeholder}
      className={`w-full rounded-md px-4 py-2 focus:ring-1 focus:ring-[#29B6F6] ${inputBase}`}
    />

    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);

const TextAreaGroup = ({ label, name, placeholder, rows = 4, inputBase, labelColor }) => (
  <div className="w-full">
    <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>{label}</label>

    <Field
      as="textarea"
      name={name}
      rows={rows}
      placeholder={placeholder}
      className={`w-full rounded-md px-4 py-2 focus:ring-1 focus:ring-[#29B6F6] ${inputBase}`}
    />

    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);


