// src/pages/RegisterPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar"; // ⭐ THEME CONTEXT

// Validation schema
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().min(2, "Too short").required("First name is required"),
  lastName: Yup.string().min(2, "Too short").required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .matches(/[A-Z]/, "Must contain uppercase letter")
    .matches(/[a-z]/, "Must contain lowercase letter")
    .matches(/\d/, "Must contain a number")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // ⭐ GET THEME
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // THEME COLORS
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-gray-100 text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border border-gray-300 shadow-lg";
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#1f233d] text-white border-white/20 placeholder-gray-300"
      : "bg-gray-100 text-[#020726] border-gray-300 placeholder-gray-500";

  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const bodyData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 transition-all duration-300 ${pageBg}`}>
      
      {/* LOGO */}
      <img src="/image/logo.webp" className="w-24 h-24 mb-6" />

      {/* CARD */}
      <div className={`rounded-xl w-full max-w-md p-8 transition-all duration-300 ${cardBg}`}>

        <h3 className="text-3xl font-semibold text-center mb-2">Register</h3>
        <p className={`text-center mb-6 ${subtleText}`}>Create your account</p>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">

              {/* FIRST NAME */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${labelColor}`}>
                  First Name
                </label>
                <Field
                  name="firstName"
                  className={`w-full p-3 rounded-lg outline-none border ${inputBg}`}
                />
                <ErrorMessage name="firstName" className="text-red-500 text-sm" component="div" />
              </div>

              {/* LAST NAME */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${labelColor}`}>
                  Last Name
                </label>
                <Field
                  name="lastName"
                  className={`w-full p-3 rounded-lg outline-none border ${inputBg}`}
                />
                <ErrorMessage name="lastName" className="text-red-500 text-sm" component="div" />
              </div>

              {/* EMAIL */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${labelColor}`}>
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className={`w-full p-3 rounded-lg outline-none border ${inputBg}`}
                />
                <ErrorMessage name="email" className="text-red-500 text-sm" component="div" />
              </div>

              {/* PASSWORD */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${labelColor}`}>
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className={`w-full p-3 rounded-lg outline-none border ${inputBg}`}
                />
                <ErrorMessage name="password" className="text-red-500 text-sm" component="div" />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${labelColor}`}>
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className={`w-full p-3 rounded-lg outline-none border ${inputBg}`}
                />
                <ErrorMessage name="confirmPassword" className="text-red-500 text-sm" component="div" />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg text-white font-semibold transition-all"
                style={{
                  background: "linear-gradient(90deg, #29B6F6, #0288D1)",
                }}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              {/* LOGIN LINK */}
              <p className={`text-center mt-2 text-sm ${subtleText}`}>
                Already have an account?{" "}
                <span
                  className="text-[#29B6F6] cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;

