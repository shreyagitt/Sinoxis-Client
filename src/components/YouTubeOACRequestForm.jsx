import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  channelName: Yup.string().required("Channel name is required"),
  channelUrl: Yup.string().url("Enter a valid URL").required("Channel URL is required"),
  topicUrl: Yup.string().url("Enter a valid URL").nullable(),
  officialVideoUrl: Yup.string().url("Enter a valid URL").required("This field is required"),
});

const YouTubeOACRequestForm = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await fetch(`${baseUrl}/client/youtube-oac`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "❌ Failed to submit!");
        return;
      }

      alert("✅ Request Submitted Successfully!");
      resetForm();

    } catch (error) {
      console.error(error);
      alert("❌ Server error! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020726] flex flex-col pb-20">

      {/* Breadcrumb Header */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          YouTube OAC Request Form
        </h2>

        <div className="text-sm text-white">
          Home <span className="text-[#29B6F6]"> / YouTube OAC Request Form</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex justify-start px-10">
        <div className="bg-[#0a1039] rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-white/10">

          <Formik
            initialValues={{
              channelName: "",
              channelUrl: "",
              topicUrl: "",
              officialVideoUrl: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-6">

              <FieldGroup
                label="YouTube Channel Name"
                name="channelName"
                placeholder="Enter youtube channel name"
              />

              <FieldGroup
                label="YouTube Channel Url"
                name="channelUrl"
                placeholder="https://www.youtube.com/channel..."
              />

              <FieldGroup
                label="YouTube Topic Channel Url"
                name="topicUrl"
                placeholder="YouTube Topic Channel Url"
              />

              <FieldGroup
                label={
                  <>
                    URL of Official Video or Art Track we distributed{" "}
                    <span className="text-red-400">*</span>
                  </>
                }
                name="officialVideoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90 text-white font-semibold rounded-md px-6 py-2 text-base transition"
              >
                Submit Request
              </button>

            </Form>
          </Formik>

        </div>
      </div>
    </div>
  );
};

export default YouTubeOACRequestForm;

/* Reusable Field Group Component */
const FieldGroup = ({ label, name, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1">{label}</label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border border-transparent rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-400 text-xs mt-1"
    />
  </div>
);
