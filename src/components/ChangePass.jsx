// src/pages/ChangePassword.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar";

// ===============================
// VALIDATION SCHEMA
// ===============================
const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Must be at least 8 characters")
    .matches(/[0-9!@#$%^&*]/, "Must include a number or special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useTheme();

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const res = await fetch(`${baseUrl}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.details?.[0]?.msg || data.error || "Failed to change password");
        setSubmitting(false);
        return;
      }

      toast.success("Password changed successfully!");
      resetForm();

      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 1200);

    } catch (err) {
      console.error(err);
      toast.error("Server error! Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* THEME CLASSES */
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg = theme === "dark" ? "bg-[#0a1039]" : "bg-white";
  const cardBorder = theme === "dark" ? "border-white/10" : "border-gray-200";
  const titleColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const subtitleColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#2c2f4a] text-white" : "bg-gray-50 text-[#020726]";
  const inputBorder = theme === "dark" ? "border-transparent" : "border-gray-200";
  const helperColor = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`${pageBg} min-h-screen w-full`}>

      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className={`text-xl sm:text-2xl font-semibold ${titleColor}`}>
          Change Password
        </h2>

        <div className={`text-sm ${subtitleColor}`}>
          Home <span className="text-[#29B6F6]">/ Change Password</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full flex justify-center px-4 sm:px-6 lg:px-10 pb-16">
        <div
          className={`${cardBg} ${cardBorder} rounded-xl shadow-xl p-6 sm:p-8 lg:p-10 w-full max-w-4xl mx-auto border`}
        >
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={PasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">

                {/* CURRENT PASSWORD */}
                <FieldGroup
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Enter current password"
                  type="password"
                  inputBg={inputBg}
                  inputBorder={inputBorder}
                />

                {/* NEW PASSWORD */}
                <div>
                  <FieldGroup
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                    type="password"
                    inputBg={inputBg}
                    inputBorder={inputBorder}
                  />
                  <p className={`text-xs mt-1 ${helperColor}`}>
                    Must be at least 8 characters and include a number or special character.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <FieldGroup
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  type="password"
                  inputBg={inputBg}
                  inputBorder={inputBorder}
                />

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-white font-semibold rounded-md hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(90deg,#29B6F6,#0288D1)",
                  }}
                >
                  {isSubmitting ? "Updating..." : "Change Password"}
                </button>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

/* Reusable Field Component */
const FieldGroup = ({ label, name, placeholder, type, inputBg, inputBorder }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>

    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className={`w-full ${inputBg} ${inputBorder} rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#29B6F6]`}
    />

    <ErrorMessage
      name={name}
      component="div"
      className="text-red-400 text-xs mt-1"
    />
  </div>
);


