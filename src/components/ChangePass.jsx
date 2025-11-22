import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
      toast.error("Server error! Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020726] text-white flex flex-col">

      {/* Breadcrumb */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <div className="text-sm text-gray-300">
          Home <span className="text-[#29B6F6]"> / Change Password</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="flex justify-start px-10 pb-16">
        <div className="bg-[#0a1039] rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-white/10">

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
                />

                {/* NEW PASSWORD */}
                <div>
                  <FieldGroup
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                    type="password"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Must be at least 8 characters and include a number or special character.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <FieldGroup
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  type="password"
                />

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-[#29B6F6] to-[#0288D1] 
                  text-white font-semibold rounded-md hover:opacity-90 disabled:opacity-50"
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
const FieldGroup = ({ label, name, placeholder, type }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-white">
      {label}
    </label>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-gray-400 
      border border-transparent rounded-md px-4 py-2
      focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-400 text-xs mt-1"
    />
  </div>
);


