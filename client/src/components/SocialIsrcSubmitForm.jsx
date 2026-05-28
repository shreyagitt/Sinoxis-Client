/// src/pages/SocialIsrcSubmitForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
//import { useTheme } from "../components/Topbar";

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
  //const { theme } = useTheme();
/*
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10 shadow-xl"
      : "bg-white border border-gray-200 shadow-sm";

  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border-transparent"
      : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-300";

  const smallHint = theme === "dark" ? "text-[#9bb6d8]" : "text-gray-600";*/

  const handleSubmit = async (values, { resetForm }) => {
  try {
    const token = localStorage.getItem("token"); // ⭐ Get stored token

    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    const res = await axios.post(
      `${baseUrl}/client/social`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ⭐ REQUIRED
          "Content-Type": "application/json",
        },
      }
    );

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
    <div className="min-h-screen pb-20 transition-all duration-300
bg-white dark:bg-[#020726]
text-[#020726] dark:text-white">

      {/* Header */}
      <div className="py-4 px-4 sm:px-6 md:px-10 flex flex-col md:flex-row justify-between gap-2">
        <h1 className={`text-lg sm:text-xl font-semibold text-[#020726] dark:text-white`}>
          Social Profile Links & Music ISRC Submit Form
        </h1>
        <p className={`text-xs sm:text-sm text-gray-600 dark:text-[#9bb6d8]`}>
          Home <span className="text-[#29B6F6]">/ Social ISRC Submit Form</span>
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full flex justify-center px-4 sm:px-6 md:px-10">
        <div className={`rounded-xl p-6 sm:p-8 md:p-10 w-full max-w-4xl bg-white dark:bg-[#0a1039]
border border-gray-200 dark:border-white/10
shadow-sm dark:shadow-xl`}>

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
            <Form className="space-y-6">

              {/* Artist + Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup
                  
                  label="Artist Name *"
                  name="artistNameSocial"
                  placeholder="Enter artist name"
                />
                <FieldGroup
                  
                  label="Label Name"
                  name="labelName"
                  placeholder="Enter label name (optional)"
                />
              </div>

              {/* Facebook + Instagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup
                  
                  label="Facebook Profile URL"
                  name="facebookLink"
                  placeholder="https://facebook.com/artist..."
                />
                <FieldGroup
                  
                  label="Instagram Profile URL"
                  name="instagramLink"
                  placeholder="https://instagram.com/artist..."
                />
              </div>

              {/* Spotify + Apple */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup
                  
                  label="Spotify Artist URL"
                  name="spotifyLink"
                  placeholder="https://open.spotify.com/artist/..."
                />
                <FieldGroup
                  
                  label="Apple Music Artist URL"
                  name="appleMusicLink"
                  placeholder="https://music.apple.com/artist/..."
                />
              </div>

              {/* ISRC */}
              <FieldGroup
                
                label="Music ISRC Code *"
                name="isrcCode"
                placeholder="Enter ISRC code"
              />

              {/* Track Title */}
              <FieldGroup
                
                label="Track Title"
                name="trackTitleSocial"
                placeholder="Enter track title"
              />

              {/* Official Video */}
              <FieldGroup
                
                label="Official YouTube Video"
                name="officialVideoUrlSocial"
                placeholder="https://www.youtube.com/watch?v=..."
              />

              {/* Confirm */}
              <div className="flex items-start gap-3">
                <Field
                  type="checkbox"
                  name="confirmSocial"
                  className="mt-1 accent-[#29B6F6]"
                />
                <span className={`text-sm text-[#020726] dark:text-white`}>
                  I confirm that all information provided is accurate
                </span>
              </div>
              <ErrorMessage
                name="confirmSocial"
                component="p"
                className="text-red-400 text-xs"
              />

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
                <button
                  type="reset"
                  className="px-5 py-2 rounded-md text-sm border
border-gray-300 dark:border-white/20
text-[#020726] dark:text-white
hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90"
                >
                  Submit Details
                </button>
              </div>
            </Form>
          </Formik>

        </div>
      </div>
    </div>
  );
};

export default SocialIsrcSubmitForm;

/* ---------------------- REUSABLE FIELD COMPONENT ---------------------- */
const FieldGroup = ({ label, name, placeholder }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-1 text-[#020726] dark:text-white">
        {label}
      </label>

      <Field
        name={name}
        placeholder={placeholder}
        className="w-full rounded-md px-4 py-2 text-sm
        bg-white dark:bg-[#2c2f4a]
        text-[#020726] dark:text-white
        placeholder-gray-500 dark:placeholder-[#9bb6d8]
        border border-gray-300 dark:border-transparent
        focus:ring-1 focus:ring-[#29B6F6]"
      />

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-400 text-xs mt-1"
      />
    </div>
  );
};