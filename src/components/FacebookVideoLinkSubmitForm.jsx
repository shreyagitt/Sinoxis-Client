// src/pages/FacebookVideoLinkSubmitForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar";

// VALIDATION SCHEMA
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
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useTheme();

  // THEME CLASSES
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-md";

  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const hintColor = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-300 border border-transparent"
      : "bg-gray-100 text-[#020726] placeholder-gray-500 border border-gray-300";

  return (
    <div className={`min-h-screen flex flex-col pb-20 transition-all duration-300 ${pageBg}`}>

      {/* HEADER */}
      <div className="py-4 px-4 sm:px-8 lg:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h1 className="text-xl font-semibold">Facebook Video Link Submit Form</h1>
        <p className={`text-sm ${hintColor}`}>
          Home <span className="text-[#29B6F6]">/ Facebook Video Link Submit Form</span>
        </p>
      </div>

      {/* PAGE WRAPPER */}
      <div className="w-full flex justify-center px-4 sm:px-8 lg:px-10">
        <div className={`rounded-xl p-6 sm:p-8 md:p-10 w-full max-w-5xl border ${cardBg}`}>

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
            onSubmit={async (values, { resetForm }) => {
              try {
                const formData = new FormData();
                Object.keys(values).forEach((key) => {
                  formData.append(key, values[key]);
                });

                await axios.post(`${baseUrl}/client/facebook-video`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("Video Link Submitted Successfully!");
                resetForm();
              } catch (err) {
                toast.error("Submission failed!");
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup
                    theme={theme}
                    label="Artist Name *"
                    name="artistNameFb"
                    placeholder="Enter artist name"
                  />

                  <FieldGroup
                    theme={theme}
                    label="Label Name"
                    name="labelNameFb"
                    placeholder="Enter label name (optional)"
                  />
                </div>

                {/* FACEBOOK URL */}
                <FieldGroup
                  theme={theme}
                  label="Facebook Video URL *"
                  name="facebookVideoUrl"
                  placeholder="https://www.facebook.com/.../videos/..."
                />

                {/* ISRC */}
                <FieldGroup
                  theme={theme}
                  label="ISRC Code *"
                  name="isrcCodeFb"
                  placeholder="USABC1234567"
                />

                {/* CLAIM TYPE – FIXED, RESPONSIVE, CUSTOM DROPDOWN */}
<div className="w-full">
  <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
    Claim Type *
  </label>

  <Field name="claimTypeFb">
    {({ field, form }) => {
      const value = field.value;
      const setValue = (val) => form.setFieldValue("claimTypeFb", val);

      const options = [
        { value: "", label: "Select claim type" },
        { value: "copyright", label: "Copyright Claim" },
        { value: "monetization", label: "Monetization Claim" },
        { value: "ownership", label: "Ownership Claim" },
        { value: "other", label: "Other" },
      ];

      return (
        <Listbox value={value} onChange={setValue}>
          <div className="relative">
            <Listbox.Button
              className={`w-full rounded-md px-4 py-2 text-sm text-left border focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`}
            >
              <span>{options.find((o) => o.value === value)?.label}</span>

              <ChevronUpDownIcon
                className={`h-5 w-5 absolute right-2 top-1/2 -translate-y-1/2 ${
                  theme === "dark" ? "text-white" : "text-gray-600"
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
                      {selected && (
                        <CheckIcon className="h-4 w-4 text-white" />
                      )}
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
    name="claimTypeFb"
    component="p"
    className="text-red-400 text-xs mt-1"
  />
</div>



                {/* CLAIM DETAILS */}
                <TextAreaGroup
                  theme={theme}
                  label="Claim Details"
                  name="claimDetailsFb"
                  rows={4}
                />

                {/* SCREENSHOT */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                    Screenshot of Claim (optional)
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("screenshotFb", e.target.files[0])}
                    className={`w-full rounded-md px-4 py-2 border cursor-pointer 
                      file:px-3 file:py-1 file:rounded-md 
                      file:bg-[#29B6F6] file:text-white 
                      ${inputBg}
                    `}
                  />
                </div>

                {/* CONFIRM */}
                <div className="flex items-start gap-2">
                  <Field type="checkbox" name="confirmFb" className="mt-1 accent-[#29B6F6]" />
                  <span className={`text-sm ${labelColor}`}>
                    I confirm all information is accurate
                  </span>
                </div>
                <ErrorMessage
                  name="confirmFb"
                  component="p"
                  className="text-red-400 text-xs"
                />

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="reset"
                    className={`px-5 py-2 rounded-md border text-sm 
                      ${theme === "dark"
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-gray-300 text-[#020726] hover:bg-gray-100"
                      }`}
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90"
                  >
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

/* ---------------------- REUSABLE COMPONENTS ---------------------- */

const FieldGroup = ({ theme, label, name, placeholder }) => {
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputStyles =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-400 border border-transparent"
      : "bg-gray-100 text-[#020726] placeholder-gray-500 border border-gray-300";

  return (
    <div className="w-full">
      <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>{label}</label>

      <Field
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputStyles}`}
      />

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};

const TextAreaGroup = ({ theme, label, name, rows }) => {
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputStyles =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-400 border border-transparent"
      : "bg-gray-100 text-[#020726] placeholder-gray-500 border border-gray-300";

  return (
    <div className="w-full">
      <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>{label}</label>

      <Field
        as="textarea"
        name={name}
        rows={rows}
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputStyles}`}
      />

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};
