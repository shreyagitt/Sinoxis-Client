import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Yup validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
  remember: Yup.boolean(),
});

const LoginPage = () => {
  const handleSubmit = (values, { resetForm }) => {
    console.log("Login values:", values);
    alert("Login submitted!\n" + JSON.stringify(values, null, 2));
    resetForm();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <img
        src="/image/logo.webp"
        alt="Sinoxis Logo"
        className="w-24 h-24 object-contain mb-6"
      />
      
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h3 className="text-2xl font-semibold text-center mb-2">Login</h3>
        <p className="text-center text-gray-500 mb-6">
          Enter your credentials to access your account.
        </p>

        <Formik
          initialValues={{ email: "", password: "", remember: false }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <label className="block mb-1 font-medium" htmlFor="email">
                  Email or Username
                </label>
                <Field
                  name="email"
                  type="text"
                  placeholder="Enter email or username"
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email && touched.email
                      ? "border-red-500 ring-red-300"
                      : "border-gray-300 ring-red-500"
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-medium" htmlFor="password">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password && touched.password
                      ? "border-red-500 ring-red-300"
                      : "border-gray-300 ring-red-500"
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Remember Me */}
<div className="flex items-center gap-2">
  <Field
    type="checkbox"
    name="remember"
    className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-red-500 accent-red-500"
  />
  <label className="text-gray-700 text-sm">Remember me</label>
</div>


              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
