// src/pages/SocialIsrcSubmitForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar"; // theme provider

const SocialISRCschema = Yup.object({
  artistNameSocial: Yup.string().required("Artist name is required"),
  labelName: Yup.string().nullable(),
  facebookLink: Yup.string().url("Enter a valid URL").nullable(),
  instagramLink: Yup.string().url("Enter a valid URL").nullable(),
  spotifyLink: Yup.string().url("Enter a valid URL").nullable(),
  appleMusicLink: Yup.string().url("Enter a valid URL").nullable(),
  isrcCode: Yup.string().required("ISRC code is required"),
  trackTitleSocial: Yup.string().nullable(),
  officialVideoUrlSocial: Yup.string().url("Enter a valid YouTube link").nullable(),
  confirmSocial: Yup.bool().oneOf([true], "You must confirm the information"),
});

const SocialIsrcSubmitForm = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useTheme();

  // theme-aware classes
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10 shadow-2xl"
      : "bg-white border border-gray-200 shadow-sm";
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border-transparent"
      : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-200";
  const smallHint = theme === "dark" ? "text-[#9bb6d8]" : "text-gray-500";

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await axios.post(`${baseUrl}/client/social`, values, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.success) {
        toast.success("Form Submitted Successfully!");
        resetForm();
      } else {
        toast.error(res.data?.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error!");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-20 ${pageBg}`}>
      {/* Header */}
      <div className="py-4 px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className={`text-xl font-semibold ${labelColor}`}>
          Social Profile Links & Music ISRC Submit Form
        </h1>
        <p className={`text-sm ${smallHint}`}>
          Home{" "}
          <span className="text-[#29B6F6]">
            / Social Profile Links & Music ISRC Submit Form
          </span>
        </p>
      </div>

      {/* Form Container */}
      <div className="flex justify-start px-6 md:px-10">
        <div className={`rounded-xl p-8 md:p-10 w-full max-w-4xl ${cardBg}`}>
          <Formik
            initialValues={{
              artistNameSocial: "",
              labelName: "",
              facebookLink: "",
              instagramLink: "",
              spotifyLink: "",
              appleMusicLink: "",
              isrcCode: "",
              trackTitleSocial: "",
              officialVideoUrlSocial: "",
              confirmSocial: false,
            }}
            validationSchema={SocialISRCschema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                {/* Artist + Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup
                    theme={theme}
                    label="Artist Name *"
                    name="artistNameSocial"
                    placeholder="Enter artist name"
                  />
                  <FieldGroup
                    theme={theme}
                    label="Label Name"
                    name="labelName"
                    placeholder="Enter label name (if applicable)"
                  />
                </div>

                {/* Facebook / Instagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup
                    theme={theme}
                    label="Facebook Profile URL"
                    name="facebookLink"
                    placeholder="https://facebook.com/..."
                  />
                  <FieldGroup
                    theme={theme}
                    label="Instagram Profile URL"
                    name="instagramLink"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                {/* Spotify / Apple */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup
                    theme={theme}
                    label="Spotify Artist URL"
                    name="spotifyLink"
                    placeholder="https://open.spotify.com/artist/..."
                  />
                  <FieldGroup
                    theme={theme}
                    label="Apple Music Artist URL"
                    name="appleMusicLink"
                    placeholder="https://music.apple.com/..."
                  />
                </div>

                {/* ISRC */}
                <FieldGroup
                  theme={theme}
                  label="Music ISRC Code *"
                  name="isrcCode"
                  placeholder="Enter ISRC code (e.g., USABC1234567)"
                />

                <FieldGroup
                  theme={theme}
                  label="Track Title"
                  name="trackTitleSocial"
                  placeholder="Enter track title"
                />

                <FieldGroup
                  theme={theme}
                  label="Official YouTube Video (optional)"
                  name="officialVideoUrlSocial"
                  placeholder="https://www.youtube.com/watch?v=..."
                />

                {/* Confirm */}
                <div className="flex items-start gap-2">
                  <Field
                    type="checkbox"
                    name="confirmSocial"
                    className={`mt-1 ${theme === "dark" ? "accent-[#29B6F6]" : "accent-[#29B6F6]"}`}
                  />
                  <span className={`text-sm ${labelColor}`}>
                    I confirm that all information provided is accurate
                  </span>
                </div>
                <ErrorMessage
                  name="confirmSocial"
                  component="p"
                  className="text-red-400 text-xs"
                />

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="reset"
                    className={`border rounded-md px-5 py-2 ${theme === "dark" ? "border-white/20 text-white hover:bg-white/5" : "border-gray-200 text-[#020726] hover:bg-gray-50"}`}
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90 text-white px-5 py-2 rounded-md font-medium"
                  >
                    Submit Details
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

export default SocialIsrcSubmitForm;

/* ---------------------- Reusable Field Component (THEMED) ---------------------- */

const FieldGroup = ({ theme, label, name, placeholder }) => {
  // input classes depend on theme
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border border-transparent"
      : "bg-white text-[#020726] placeholder-gray-400 border border-gray-200";

  const hintColor = theme === "dark" ? "text-[#9bb6d8]" : "text-gray-500";

  return (
    <div>
      <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>{label}</label>
      <Field
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`}
      />
      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};
