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

  // ===============================
  // SUBMIT HANDLER (NO TYPESCRIPT)
  // ===============================
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Submitting values:", values);
      console.log("Using token:", token);

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
      console.log("Backend Response:", data); // IMPORTANT — shows exact 400 reason

      if (!data.success) {
        toast.error(data.details?.[0]?.msg || data.error || "Failed to change password");
        setSubmitting(false);
        return;
      }

      toast.success("Password changed successfully!");
      resetForm();

      // Auto logout
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 1200);

    } catch (err) {
      console.error("Server Error:", err);
      toast.error("Server error! Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3 px-10 flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
        <div className="text-base text-gray-500">
          Home <span className="text-red-500"> / Change Password</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="flex justify-start py-8 px-4 ml-10">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-gray-200">

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
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Current Password
                  </label>
                  <Field
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <ErrorMessage
                    name="currentPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* NEW PASSWORD */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <small className="text-gray-500 text-xs">
                    Must be at least 8 characters and include a number or special character.
                  </small>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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

