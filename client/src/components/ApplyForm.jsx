// src/pages/ApplyForm.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
//import { useTheme } from "../components/Topbar";

// VALIDATION SCHEMA
const ApplyFormSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  artistName: Yup.string().required("Artist Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone Number is required"),
  instagram: Yup.string().url("Invalid URL"),
  youtube: Yup.string().url("Invalid URL"),
  labelName: Yup.string(),
  releasedBefore: Yup.boolean().required("Required"),
  heardAbout: Yup.string().required("Required"),
});

const ApplyForm = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  //const { theme } = useTheme();

  /* 🎨 THEME COLORS
  const pageBg = theme === "dark" ? "bg-[#020726]" : "bg-white";
  const cardBg = theme === "dark" ? "bg-[#0a1039]" : "bg-[#F5F9FF]";
  const borderColor = theme === "dark" ? "border-white/10" : "border-gray-300";
  const labelColor = theme === "dark" ? "text-gray-300" : "text-[#020726]";
  const inputBg = theme === "dark" ? "bg-[#1f233d] text-white" : "bg-white text-[#020726]";
  const placeholderColor = theme === "dark" ? "placeholder-gray-400" : "placeholder-gray-500";
  const titleColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const subtitleColor = theme === "dark" ? "text-gray-400" : "text-gray-600"; */

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    // Convert Yes/No string → boolean
    values.releasedBefore = values.releasedBefore === "true";

    try {
      await axios.post(`${baseUrl}/client/apply`, values);
      alert("Application submitted successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-4 sm:p-6 lg:p-10 bg-white dark:bg-[#020726]`}>

      {/* LOGO */}
    <div className="mb-6">
  {/* Light Logo */}
  <img
    src="/logo3.png"
    alt="Sinoxis Logo"
    className="w-20 sm:w-24 md:w-28 h-auto object-contain dark:hidden"
  />

  {/* Dark Logo */}
  <img
    src="/image/logo.webp"
    alt="Sinoxis Logo"
    className="w-20 sm:w-24 md:w-28 h-auto object-contain hidden dark:block"
  />
</div>

      {/* FORM CARD */}
      <div
        className={`bg-[#F5F9FF] dark:bg-[#0a1039] w-full max-w-4xl rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-300 dark:border-white/10`}
      >
        <h1 className={`text-2xl sm:text-3xl font-semibold text-center text-[#020726] dark:text-white`}>
          Apply Form
        </h1>

        <p className={`text-center mt-2 mb-6 sm:mb-10 text-sm sm:text-base text-gray-600 dark:text-gray-400`}>
          Fill out the details below to apply to Sinoxis Digital.
        </p>

        <Formik
          initialValues={{
            fullName: "",
            artistName: "",
            email: "",
            phone: "",
            instagram: "",
            youtube: "",
            labelName: "",
            releasedBefore: "",
            heardAbout: "",
          }}
          validationSchema={ApplyFormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              {/* FULL NAME */}
              <FormField label="Full Name" name="fullName" />

              {/* ARTIST NAME */}
              <FormField label="Artist Name" name="artistName" />

              {/* EMAIL */}
              <FormField label="Email" name="email" type="email" />

              {/* PHONE */}
              <FormField label="Phone Number" name="phone" />

              {/* INSTAGRAM */}
              <FormField label="Instagram Profile Link" name="instagram" />

              {/* YOUTUBE */}
              <FormField label="YouTube Channel Link" name="youtube" />

              {/* LABEL NAME (Full Width) */}
              <div className="sm:col-span-2">
                <FormField label="Label/Studio Name" name="labelName"  />
              </div>

              {/* RELEASED BEFORE — FIXED BOOLEAN HANDLING */}
              <div>
                <label className={`text-sm text-[#020726] dark:text-gray-300`}>Have you released music before?</label>

                <div className={`flex gap-4 mt-2 text-[#020726] dark:text-gray-300`}>
                  <label className="flex items-center gap-2">
                    <Field type="radio" value="true" name="releasedBefore" /> Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <Field type="radio" value="false" name="releasedBefore" /> No
                  </label>
                </div>

                <ErrorMessage name="releasedBefore" className="text-red-400 text-sm" component="div" />
              </div>

              {/* HEARD ABOUT US */}
              <div>
                <label className={`text-sm text-[#020726] dark:text-gray-300`}>How did you hear about us?</label>
                <Field
                  as="select"
                  name="heardAbout"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none bg-white dark:bg-[#1f233d]
  text-[#020726] dark:text-white
  border-gray-300 dark:border-white/10`}
                >
                  <option value="">Select an option</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Friend">Friend</option>
                  <option value="Advertisement">Advertisement</option>
                </Field>
                <ErrorMessage name="heardAbout" className="text-red-400 text-sm" component="div" />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="sm:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg transition"
                  style={{ background: "linear-gradient(90deg,#29B6F6,#0288D1)" }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// ⭐ Reusable Form Field Component
const FormField = ({ label, name, type = "text" }) => (
  <div>
    <label className={`text-sm text-[#020726] dark:text-gray-300`}>{label}</label>
    <Field
      name={name}
      type={type}
      placeholder={`Enter ${label.toLowerCase()}`}
      className={`w-full p-3 mt-1 rounded-lg border outline-none bg-white dark:bg-[#1f233d]
text-[#020726] dark:text-white
placeholder-gray-500 dark:placeholder-gray-400
border-gray-300 dark:border-white/10`}
    />
    <ErrorMessage name={name} className="text-red-400 text-sm mt-1" component="div" />
  </div>
);

export default ApplyForm;
