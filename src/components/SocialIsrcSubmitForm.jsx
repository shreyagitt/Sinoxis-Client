import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header / Breadcrumb */}
      <div className="bg-gray-100 py-3 px-10 flex justify-between items-center">
        <h1 className="text-base font-semibold text-gray-800">
          Social Profile Links & Music ISRC Submit Form
        </h1>
        <p className="text-sm text-gray-500">
          Home / <span className="text-red-600">Social Profile Links & Music ISRC Submit Form</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="flex justify-start py-8 px-4 ml-12">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl border border-gray-200">

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
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              alert("✅ Form Submitted Successfully!");
              resetForm();
            }}
          >
            <Form className="space-y-6">

              {/* Artist + Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Artist Name *" name="artistNameSocial" placeholder="Enter artist name" />
                <FieldGroup label="Label Name" name="labelName" placeholder="Enter label name (if applicable)" />
              </div>

              {/* Facebook / Instagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Facebook Profile URL" name="facebookLink" placeholder="https://facebook.com/..." />
                <FieldGroup label="Instagram Profile URL" name="instagramLink" placeholder="https://instagram.com/..." />
              </div>

              {/* Spotify / Apple */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Spotify Artist URL" name="spotifyLink" placeholder="https://open.spotify.com/artist/..." />
                <FieldGroup label="Apple Music Artist URL" name="appleMusicLink" placeholder="https://music.apple.com/..." />
              </div>

              {/* ISRC */}
              <FieldGroup
                label="Music ISRC Code *"
                name="isrcCode"
                placeholder="Enter ISRC code (e.g., USABC1234567)"
                helper="Provide a valid ISRC for your track"
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

              {/* Confirm Checkbox */}
              <div className="flex items-start gap-2">
                <Field type="checkbox" name="confirmSocial" className="mt-1 accent-red-500" />
                <span className="text-sm text-gray-700">I confirm that all information provided is accurate</span>
              </div>
              <ErrorMessage name="confirmSocial" component="p" className="text-red-600 text-xs" />

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="reset" className="border px-5 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50">
                  Reset Form
                </button>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-sm rounded-md font-medium">
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


// Reusable Fields
const FieldGroup = ({ label, name, placeholder, helper }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
    />
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);
