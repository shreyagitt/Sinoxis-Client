import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-[#020726] flex flex-col pb-20">

      {/* Header */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">
          Social Profile Links & Music ISRC Submit Form
        </h1>
        <p className="text-sm text-white">
          Home{" "}
          <span className="text-[#29B6F6]">
            / Social Profile Links & Music ISRC Submit Form
          </span>
        </p>
      </div>

      {/* Form Container */}
      <div className="flex justify-start px-10">
        <div className="bg-[#0a1039] rounded-xl shadow-2xl p-10 w-full max-w-4xl border border-white/10">

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup
                  label="Artist Name *"
                  name="artistNameSocial"
                  placeholder="Enter artist name"
                />
                <FieldGroup
                  label="Label Name"
                  name="labelName"
                  placeholder="Enter label name (if applicable)"
                />
              </div>

              {/* Facebook / Instagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup
                  label="Facebook Profile URL"
                  name="facebookLink"
                  placeholder="https://facebook.com/..."
                />
                <FieldGroup
                  label="Instagram Profile URL"
                  name="instagramLink"
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* Spotify / Apple */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup
                  label="Spotify Artist URL"
                  name="spotifyLink"
                  placeholder="https://open.spotify.com/artist/..."
                />
                <FieldGroup
                  label="Apple Music Artist URL"
                  name="appleMusicLink"
                  placeholder="https://music.apple.com/..."
                />
              </div>

              {/* ISRC */}
              <FieldGroup
                label="Music ISRC Code *"
                name="isrcCode"
                placeholder="Enter ISRC code (e.g., USABC1234567)"
              />

              <FieldGroup
                label="Track Title"
                name="trackTitleSocial"
                placeholder="Enter track title"
              />

              <FieldGroup
                label="Official YouTube Video (optional)"
                name="officialVideoUrlSocial"
                placeholder="https://www.youtube.com/watch?v=..."
              />

              {/* Confirm */}
              <div className="flex items-start gap-2">
                <Field
                  type="checkbox"
                  name="confirmSocial"
                  className="mt-1 accent-[#29B6F6]"
                />
                <span className="text-sm text-white">
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
                  className="border border-white/20 text-white px-5 py-2 rounded-md hover:bg-white/5"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] 
                  hover:opacity-90 text-white px-5 py-2 rounded-md font-medium"
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


// Reusable Field Component (THEMED)
const FieldGroup = ({ label, name, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">{label}</label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8]
      border border-transparent rounded-md px-4 py-2 
      focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);
