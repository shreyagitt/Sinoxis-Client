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
  const baseUrl = import.meta.env.VITE_API_BASE_URL; // 🔥 API BASE URL

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await fetch(`${baseUrl}/client/youtube-oac`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Breadcrumb Header */}
      <div className="bg-gray-100 py-3 px-10 flex justify-between items-center">
        <h2 className="text-base md:text-lg font-semibold text-gray-800">
          YouTube OAC Request Form
        </h2>
        <div className="text-sm text-gray-500">
          Home <span className="text-red-600"> / YouTube OAC Request Form</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex justify-start py-8 px-4 ml-10">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-gray-200">


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

              {/* Channel Name */}
              <FieldGroup
                label="YouTube Channel Name"
                name="channelName"
                placeholder="Enter YouTube channel name"
              />

              {/* Channel URL */}
              <FieldGroup
                label="YouTube Channel URL"
                name="channelUrl"
                placeholder="https://www.youtube.com/channel..."
              />

              {/* Topic URL */}
              <FieldGroup
                label="YouTube Topic Channel URL"
                name="topicUrl"
                placeholder="YouTube Topic Channel URL"
              />

              {/* Official Video URL */}
              <FieldGroup
                label={
                  <>
                    URL of Official Video or Art Track we distributed{" "}
                    <span className="text-red-600">*</span>
                  </>
                }
                name="officialVideoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-6 py-2 text-base transition"
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


// Reusable Field Group Component
const FieldGroup = ({ label, name, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 text-base"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-600 text-xs mt-1"
    />
  </div>
);
