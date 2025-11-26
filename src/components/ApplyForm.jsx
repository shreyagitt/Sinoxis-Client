import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useTheme } from "../components/Topbar"; // ⭐ THEME

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
  const { theme } = useTheme(); // ⭐ GET THEME

  // 🎨 THEME COLORS
  const pageBg = theme === "dark" ? "bg-[#020726]" : "bg-white";
  const cardBg = theme === "dark" ? "bg-[#0a1039]" : "bg-[#F5F9FF]";
  const borderColor = theme === "dark" ? "border-white/10" : "border-gray-300";
  const labelColor = theme === "dark" ? "text-gray-300" : "text-[#020726]";
  const inputBg = theme === "dark" ? "bg-[#1f233d] text-white" : "bg-white text-[#020726]";
  const placeholderColor = theme === "dark" ? "placeholder-gray-400" : "placeholder-gray-500";
  const titleColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const subtitleColor = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
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
    <div className={`min-h-screen flex flex-col items-center p-6 ${pageBg}`}>

      {/* LOGO */}
      <img
        src="/image/logo.webp"
        alt="Sinoxis Logo"
        className="w-28 h-28 object-contain mb-4"
      />

      {/* FORM CARD */}
      <div className={`${cardBg} w-full max-w-4xl rounded-2xl p-10 shadow-xl border ${borderColor}`}>

        {/* TITLE */}
        <h1 className={`text-3xl font-semibold text-center ${titleColor}`}>Apply Form</h1>
        <p className={`text-center mt-2 mb-8 ${subtitleColor}`}>
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
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* FULL NAME */}
              <div>
                <label className={`text-sm ${labelColor}`}>Full Name</label>
                <Field
                  name="fullName"
                  placeholder="Enter your full name"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor} ${placeholderColor}`}
                />
                <ErrorMessage name="fullName" className="text-red-400 text-sm mt-1" component="div" />
              </div>

              {/* ARTIST NAME */}
              <div>
                <label className={`text-sm ${labelColor}`}>Artist Name</label>
                <Field
                  name="artistName"
                  placeholder="Enter your artist name"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor} ${placeholderColor}`}
                />
                <ErrorMessage name="artistName" className="text-red-400 text-sm mt-1" component="div" />
              </div>

              {/* EMAIL */}
              <div>
                <label className={`text-sm ${labelColor}`}>Email Address</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor} ${placeholderColor}`}
                />
                <ErrorMessage name="email" className="text-red-400 text-sm mt-1" component="div" />
              </div>

              {/* PHONE */}
              <div>
                <label className={`text-sm ${labelColor}`}>Phone Number</label>
                <Field
                  name="phone"
                  placeholder="Enter your phone number"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor} ${placeholderColor}`}
                />
                <ErrorMessage name="phone" className="text-red-400 text-sm mt-1" component="div" />
              </div>

              {/* INSTAGRAM */}
              <div>
                <label className={`text-sm ${labelColor}`}>Instagram Profile Link</label>
                <Field
                  name="instagram"
                  placeholder="Instagram Profile Link"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor}`}
                />
              </div>

              {/* YOUTUBE */}
              <div>
                <label className={`text-sm ${labelColor}`}>YouTube Channel Link</label>
                <Field
                  name="youtube"
                  placeholder="YouTube Channel Link"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor}`}
                />
              </div>

              {/* LABEL NAME */}
              <div className="md:col-span-2">
                <label className={`text-sm ${labelColor}`}>Label/Channel/Studio Name</label>
                <Field
                  name="labelName"
                  placeholder="Label/Channel/Studio Name"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor}`}
                />
              </div>

              {/* RELEASED BEFORE */}
              <div>
                <label className={`text-sm ${labelColor}`}>Have you released music before?</label>

                <div className={`flex gap-4 mt-2 ${labelColor}`}>
                  <label className="flex items-center gap-2">
                    <Field type="radio" value="Yes" name="releasedBefore" /> Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <Field type="radio" value="No" name="releasedBefore" /> No
                  </label>
                </div>

                <ErrorMessage name="releasedBefore" className="text-red-400 text-sm mt-1" component="div" />
              </div>

              {/* HEARD ABOUT US */}
              <div>
                <label className={`text-sm ${labelColor}`}>How did you hear about us?</label>
                <Field
                  as="select"
                  name="heardAbout"
                  className={`w-full p-3 mt-1 rounded-lg border outline-none ${inputBg} ${borderColor}`}
                >
                  <option value="">Select an option</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Friend">Friend</option>
                  <option value="Advertisement">Advertisement</option>
                </Field>

                <ErrorMessage name="heardAbout" className="text-red-400 text-sm mt-1" component="div" />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition"
                  style={{
                    background: "linear-gradient(90deg,#29B6F6,#0288D1)",
                  }}
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

export default ApplyForm;



