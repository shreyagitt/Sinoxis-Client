import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const bodyData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <img src="/image/logo.webp" className="w-24 h-24 mb-6" />

      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h3 className="text-2xl font-semibold text-center mb-2">Register</h3>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">

              {/* First name */}
              <div>
                <label>First Name</label>
                <Field name="firstName" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="firstName" className="text-red-500 text-sm" component="div" />
              </div>

              {/* Last name */}
              <div>
                <label>Last Name</label>
                <Field name="lastName" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="lastName" className="text-red-500 text-sm" component="div" />
              </div>

              {/* Email */}
              <div>
                <label>Email</label>
                <Field name="email" type="email" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="email" className="text-red-500 text-sm" component="div" />
              </div>

              {/* Password */}
              <div>
                <label>Password</label>
                <Field name="password" type="password" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="password" className="text-red-500 text-sm" component="div" />
              </div>

              {/* Confirm password */}
              <div>
                <label>Confirm Password</label>
                <Field name="confirmPassword" type="password" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="confirmPassword" className="text-red-500 text-sm" component="div" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              <p className="text-center mt-2 text-sm">
                Already have an account?{" "}
                <span
                  className="text-red-600 cursor-pointer"
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
