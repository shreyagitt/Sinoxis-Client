// src/pages/LoginPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Topbar";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
  remember: Yup.boolean(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-gray-100 text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border border-gray-300 shadow-md";
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg =
    theme === "dark"
      ? "bg-[#1f233d] text-white border-white/20 placeholder-gray-300"
      : "bg-gray-100 text-[#020726] border-gray-300 placeholder-gray-500";

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        email: values.email.toLowerCase(),
        password: values.password,
      };

      const res = await fetch(`${baseUrl}/auth/client/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        navigate("/dashboard");
      } else {
        alert(data.error || "Invalid login credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 transition-all duration-300 ${pageBg}`}
    >
      {/* Logo */}
      <img
        src="/image/logo.webp"
        alt="Sinoxis Logo"
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 mb-6 sm:mb-8"
      />

      {/* Card */}
      <div
        className={`w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 ${cardBg}`}
      >
        <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-2">Login</h3>
        <p className={`text-center mb-6 sm:mb-8 ${subtleText}`}>
          Enter your credentials to access your account.
        </p>

        <Formik initialValues={{ email: "", password: "", remember: false }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-5 sm:space-y-6">

              {/* EMAIL */}
              <div>
                <label className={`block mb-1 text-sm sm:text-base font-medium ${labelColor}`}>Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full p-3 sm:p-3.5 rounded-lg outline-none border text-sm sm:text-base focus:ring-2 focus:ring-[#29B6F6] ${inputBg}`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* PASSWORD */}
              <div>
                <label className={`block mb-1 text-sm sm:text-base font-medium ${labelColor}`}>Password</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className={`w-full p-3 sm:p-3.5 rounded-lg outline-none border text-sm sm:text-base focus:ring-2 focus:ring-[#29B6F6] ${inputBg}`}
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* OPTIONS */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="remember" className="w-4 h-4 accent-[#29B6F6]" />
                  <label className={`text-sm sm:text-base ${labelColor}`}>Remember me</label>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className={`text-sm sm:text-base hover:underline ${labelColor}`}
                >
                  Register
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-3.5 rounded-lg text-white font-semibold text-sm sm:text-lg transition disabled:opacity-50"
                style={{ background: "linear-gradient(90deg, #29B6F6, #0288D1)" }}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
