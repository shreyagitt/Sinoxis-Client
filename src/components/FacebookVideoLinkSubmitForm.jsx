import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

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

  return (
    <div className="min-h-screen bg-[#020726] flex flex-col pb-20">

      {/* Header */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">
          Facebook Video Link Submit Form
        </h1>
        <p className="text-sm text-white">
          Home <span className="text-[#29B6F6]">/ Facebook Video Link Submit Form</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="flex justify-start px-10">
        <div className="bg-[#0a1039] rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-white/10">

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
                console.error(err);
                toast.error("Submission failed!");
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">

                {/* Artist + Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup
                    label="Artist Name *"
                    name="artistNameFb"
                    placeholder="Enter artist name"
                  />
                  <FieldGroup
                    label="Label Name"
                    name="labelNameFb"
                    placeholder="Enter label name (optional)"
                  />
                </div>

                <FieldGroup
                  label="Facebook Video URL *"
                  name="facebookVideoUrl"
                  placeholder="https://www.facebook.com/.../videos/..."
                />

                <FieldGroup
                  label="ISRC Code *"
                  name="isrcCodeFb"
                  placeholder="USABC1234567"
                />

                {/* Claim Type */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Claim Type *
                  </label>

                  <Field
                    as="select"
                    name="claimTypeFb"
                    className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8]
                    border border-transparent rounded-md px-4 py-2
                    focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
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

                {/* Claim Details */}
                <TextAreaGroup
                  label="Claim Details"
                  name="claimDetailsFb"
                  rows={4}
                />

                {/* Screenshot */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Screenshot of Claim (optional)
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFieldValue("screenshotFb", e.target.files[0])
                    }
                    className="w-full bg-[#2c2f4a] text-white border border-transparent
                      rounded-md px-4 py-2 cursor-pointer file:bg-[#1c2340]
                      file:text-white file:px-3 file:py-1 file:rounded-md
                      hover:bg-[#2f3455]"
                  />
                </div>

                {/* Confirm */}
                <div className="flex items-start gap-2">
                  <Field
                    type="checkbox"
                    name="confirmFb"
                    className="mt-1 accent-[#29B6F6]"
                  />
                  <span className="text-sm text-white">
                    I confirm all information is accurate
                  </span>
                </div>
                <ErrorMessage
                  name="confirmFb"
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
                    hover:opacity-90 text-white px-5 py-2 rounded-md"
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


/* Reusable Fields */
const FieldGroup = ({ label, name, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">
      {label}
    </label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8]
      border border-transparent rounded-md px-4 py-2
      focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-400 text-xs mt-1"
    />
  </div>
);

const TextAreaGroup = ({ label, name, rows }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">
      {label}
    </label>
    <Field
      as="textarea"
      name={name}
      rows={rows}
      className="w-full bg-[#2c2f4a] text-white border border-transparent
      rounded-md px-4 py-2 placeholder-[#9bb6d8]
      focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-400 text-xs mt-1"
    />
  </div>
);
