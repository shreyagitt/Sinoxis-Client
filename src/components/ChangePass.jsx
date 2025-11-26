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
  const cardBorder = theme === "dark" ? "border border-white/10" : "border border-gray-200";
  const titleColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const subtitleColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#2c2f4a] text-white" : "bg-gray-50 text-[#020726]";
  const inputBorder = theme === "dark" ? "border border-transparent" : "border border-gray-200";
  const helperColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const buttonGradient = theme === "dark"
    ? "from-[#29B6F6] to-[#0288D1]" // keeps same gradient for both, looks good on light too
    : "from-[#29B6F6] to-[#0288D1]";

  return (
    <div className={`${pageBg} min-h-screen flex flex-col`}>

      {/* Breadcrumb */}
      <div className={`py-4 px-10 flex justify-between items-center ${theme === "dark" ? "" : ""}`}>
        <h2 className={`text-xl font-semibold ${titleColor}`}>Change Password</h2>
        <div className={`text-sm ${subtitleColor}`}>
          Home <span className="text-[#29B6F6]"> / Change Password</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="flex justify-start px-10 pb-16">
        <div className={`${cardBg} rounded-xl shadow-2xl p-10 w-full max-w-5xl ${cardBorder}`}>

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
                  helper={null}
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
                    helper={null}
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
                  helper={null}
                />

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 text-white font-semibold rounded-md hover:opacity-90 disabled:opacity-50`}
                  style={{
                    background: `linear-gradient(90deg,var(--sinoxis-blue-start),var(--sinoxis-blue-end))`,
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
const FieldGroup = ({ label, name, placeholder, type, inputBg, inputBorder, helper }) => (
  <div>
    <label className="block text-sm font-semibold mb-1" style={{ color: "inherit" }}>
      {label}
    </label>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className={`w-full ${inputBg} ${inputBorder} placeholder-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#29B6F6]`}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-400 text-xs mt-1"
    />
  </div>
);


