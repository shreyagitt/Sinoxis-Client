import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ✅ Validation schema
const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Must be at least 8 characters")
    .matches(/[0-9!@#$%^&*]/, "Must include a number or special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ChangePassword = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3 px-10 flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
        <div className="text-base text-gray-500">
          Home <span className="text-red-500"> / Change Password</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex justify-center items-center py-6">
        <div className="bg-white rounded-xl shadow-2xl p-12 w-full max-w-5xl">
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={PasswordSchema}
            onSubmit={(values, { resetForm }) => {
              console.log("Password Change Submitted", values);
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-base font-semibold text-gray-800 mb-2"
                  >
                    Current Password
                  </label>
                  <Field
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Enter current password"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 text-base"
                  />
                  <ErrorMessage
                    name="currentPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-base font-semibold text-gray-800 mb-2"
                  >
                    New Password
                  </label>
                  <Field
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter New password"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 text-base"
                  />
                  <small className="text-gray-500 text-xs">
                    Must be at least 8 characters long and include a number or special character.
                  </small>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-base font-semibold text-gray-800 mb-2"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 text-base"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-6 py-2 text-base transition duration-200"
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

