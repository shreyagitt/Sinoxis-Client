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
    <div className="min-h-screen bg-[#020726] flex flex-col pb-20">

      {/* Header */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">
          YouTube Claim Release
        </h1>

        <p className="text-sm text-white">
          Home <span className="text-[#29B6F6]">/ YouTube Claim Release</span>
        </p>
      </div>

      {/* Form Section */}
      <div className="flex justify-start px-10">
        <div className="bg-[#0a1039] rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-white/10">

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
                  <label className="block text-sm font-semibold text-white mb-1">
                    Claim Type *
                  </label>
                  <Field
                    as="select"
                    name="claimType"
                    className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8] 
                    border border-transparent rounded-md px-4 py-2 focus:ring-1 focus:ring-[#29B6F6]"
                  >
                    <option value="">Select claim type</option>
                    <option value="copyright">Copyright Claim</option>
                    <option value="content_id">Content ID Claim</option>
                    <option value="manual">Manual Claim</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="claimType" component="p" className="text-red-400 text-xs mt-1" />
                </div>

                {/* Claim Details */}
                <TextAreaGroup
                  label="Claim Details"
                  name="claimDetails"
                  placeholder="Explain the issue, timestamps, etc."
                />

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Screenshot
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("screenshot", e.target.files[0])}
                    className="w-full bg-[#2c2f4a] border border-[#2c2f4a] rounded-md px-4 py-2
                    file:bg-[#1f2238] file:text-white file:px-3 file:py-1 file:rounded-md 
                    text-white cursor-pointer"
                  />
                  <p className="text-xs text-[#9bb6d8] mt-1">
                    Upload screenshot of the claim (optional)
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
                  <Field type="checkbox" name="confirm" className="mt-1 accent-[#29B6F6]" />
                  <span className="text-sm text-white">
                    I confirm all information provided is accurate
                  </span>
                </div>
                <ErrorMessage name="confirm" component="p" className="text-red-400 text-xs" />

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="reset"
                    className="border border-white/20 text-white px-5 py-2 rounded-md"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] 
                    hover:opacity-90 text-white px-5 py-2 rounded-md"
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

/* Reusable Styled Components */
const FieldGroup = ({ label, name, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">{label}</label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8] 
      border border-transparent rounded-md px-4 py-2 focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);

const TextAreaGroup = ({ label, name, placeholder, rows = 4 }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">{label}</label>
    <Field
      as="textarea"
      name={name}
      rows={rows}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8]
      border border-transparent rounded-md px-4 py-2 focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);


