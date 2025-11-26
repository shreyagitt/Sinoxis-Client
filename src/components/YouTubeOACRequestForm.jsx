// src/pages/YouTubeOACRequestForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTheme } from "../components/Topbar";

const validationSchema = Yup.object({
  channelName: Yup.string().required("Channel name is required"),
  channelUrl: Yup.string().url("Enter a valid URL").required("Channel URL is required"),
  topicUrl: Yup.string().url("Enter a valid URL").nullable(),
  officialVideoUrl: Yup.string().url("Enter a valid URL").required("This field is required"),
});

const YouTubeOACRequestForm = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useTheme();

  // THEME-BASED UI CLASSES
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10 shadow-2xl text-white"
      : "bg-white border border-gray-200 shadow-md text-[#020726]";

  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border border-transparent"
      : "bg-gray-50 text-[#020726] placeholder-gray-500 border border-gray-300";

  const breadcrumbText = theme === "dark" ? "text-white" : "text-[#020726]";
  const hintText = theme === "dark" ? "text-[#9bb6d8]" : "text-gray-500";

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
    <div className={`min-h-screen pb-20 transition-colors duration-200 ${pageBg}`}>
      
      {/* HEADER */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${labelColor}`}>YouTube OAC Request Form</h2>

        <div className={`text-sm ${breadcrumbText}`}>
          Home <span className="text-[#29B6F6]"> / YouTube OAC Request Form</span>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="flex justify-start px-10">
        <div className={`rounded-xl p-10 w-full max-w-5xl ${cardBg}`}>
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

              {/* INPUTS */}
              <FieldGroup
                theme={theme}
                label="YouTube Channel Name"
                name="channelName"
                placeholder="Enter youtube channel name"
              />

              <FieldGroup
                theme={theme}
                label="YouTube Channel Url"
                name="channelUrl"
                placeholder="https://www.youtube.com/channel..."
              />

              <FieldGroup
                theme={theme}
                label="YouTube Topic Channel Url"
                name="topicUrl"
                placeholder="https://www.youtube.com/topic/..."
              />

              <FieldGroup
                theme={theme}
                label={
                  <>
                    URL of Official Video or Art Track distributed{" "}
                    <span className="text-red-400">*</span>
                  </>
                }
                name="officialVideoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
              />

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="bg-gradient-to-r from-[#29B6F6] to-[#0288D1] text-white font-semibold px-6 py-2 rounded-md hover:opacity-90 transition"
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

/* ---------------------- REUSABLE FIELD COMPONENT ---------------------- */

const FieldGroup = ({ theme, label, name, placeholder }) => {
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#2c2f4a] text-white placeholder-[#9bb6d8] border border-transparent"
      : "bg-white text-[#020726] placeholder-gray-500 border border-gray-300";

  return (
    <div>
      <label className={`block text-sm font-semibold mb-1 ${labelColor}`}>{label}</label>

      <Field
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`}
      />

      <ErrorMessage name={name} component="div" className="text-red-400 text-xs mt-1" />
    </div>
  );
};
