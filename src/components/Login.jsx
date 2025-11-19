import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
  remember: Yup.boolean(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        email: values.email.toLowerCase(), // ⭐ FIXED
        password: values.password,
      };

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // save token
        localStorage.setItem("token", data.data.token);
        navigate("/dashboard");
      } else {
        alert(data.error || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-10 p-4">
      
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
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              
              {/* Email */}
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email && touched.email
                      ? "border-red-500 ring-red-300"
                      : "border-gray-300 ring-red-500"
                  }`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-medium">Password</label>
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
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Remember + Register */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Field type="checkbox" name="remember" className="w-4 h-4" />
                  <label className="text-gray-700 text-sm">Remember me</label>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-gray-700 text-sm hover:underline"
                >
                  Register
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
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

