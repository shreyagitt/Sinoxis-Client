// src/pages/FacebookVideoLinkSubmitForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar"; // ⭐ THEME IMPORT

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
  const { theme } = useTheme(); // ⭐ GET THEME

  // THEME-ADAPTIVE CLASSES
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-md";

  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-gray-300"
      : "bg-gray-100 text-[#020726] placeholder-gray-500 border-gray-300";

  return (
    <div className={`min-h-screen flex flex-col pb-20 transition-all duration-300 ${pageBg}`}>

      {/* HEADER */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Facebook Video Link Submit Form</h1>
        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Home <span className="text-[#29B6F6]">/ Facebook Video Link Submit Form</span>
        </p>
      </div>

      {/* CONTAINER */}
      <div className="flex justify-start px-10">
        <div className={`rounded-xl p-10 w-full max-w-5xl border transition-all duration-300 ${cardBg}`}>

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

                {/* OTHER FIELDS */}
                <FieldGroup
                  theme={theme}
                  label="Facebook Video URL *"
                  name="facebookVideoUrl"
                  placeholder="https://www.facebook.com/.../videos/..."
                />

                <FieldGroup
                  theme={theme}
                  label="ISRC Code *"
                  name="isrcCodeFb"
                  placeholder="USABC1234567"
                />

                {/* CLAIM TYPE */}
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
                    Claim Type *
                  </label>

                  <Field
                    as="select"
                    name="claimTypeFb"
                    className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] border 
                      ${inputBg}`}
                  >
                    <option value="">Select claim type</option>
                    <option value="copyright">Copyright Claim</option>
                    <option value="monetization">Monetization Claim</option>
                    <option value="ownership">Ownership Claim</option>
                    <option value="other">Other</option>
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
                  <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>
                    Screenshot of Claim (optional)
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("screenshotFb", e.target.files[0])}
                    className={`w-full rounded-md px-4 py-2 cursor-pointer border
                    file:px-3 file:py-1 file:rounded-md 
                    ${inputBg} file:bg-[#29B6F6] file:text-white`}
                  />
                </div>

                {/* CONFIRM */}
                <div className="flex items-start gap-2">
                  <Field
                    type="checkbox"
                    name="confirmFb"
                    className="mt-1 accent-[#29B6F6]"
                  />
                  <span className={`text-sm ${labelColor}`}>
                    I confirm all information is accurate
                  </span>
                </div>
                <ErrorMessage name="confirmFb" component="p" className="text-red-400 text-xs" />

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="reset"
                    className={`px-5 py-2 rounded-md border 
                      ${theme === "dark" ? "border-white/20 text-white hover:bg-white/5" : "border-gray-300 text-[#020726] hover:bg-gray-100"}`}
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90 text-white px-5 py-2 rounded-md"
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
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] border ${inputBg}`}
      />
      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};


const TextAreaGroup = ({ theme, label, name, rows }) => {
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
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] border ${inputBg}`}
      />

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};
