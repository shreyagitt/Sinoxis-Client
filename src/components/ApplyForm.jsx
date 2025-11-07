import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const ApplyFormSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  role: Yup.string().required("Role is required"),
  genre: Yup.string().required("Genre is required"),
  musicLink: Yup.string().url("Invalid URL").required("Music link is required"),
  bio: Yup.string().required("Bio is required"),
  agree: Yup.boolean()
    .oneOf([true], "You must agree before submitting")
    .required("Agreement is required"),
});

const ApplyForm = () => {
  const handleSubmit = (values, { resetForm }) => {
    alert("Form submitted!\n" + JSON.stringify(values, null, 2));
    resetForm();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/image/logo.webp"
          alt="Sinoxis Logo"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-xl p-8">
        <h3 className="text-2xl font-semibold text-center mb-2">Apply Form</h3>
        <p className="text-center text-gray-500 mb-6">
          Fill out the details below to apply to Sinoxis Music Group.
        </p>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            role: "",
            genre: "",
            musicLink: "",
            bio: "",
            agree: false,
          }}
          validationSchema={ApplyFormSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block mb-1 font-medium">Full Name</label>
                  <Field
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.fullName && touched.fullName
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 ring-purple-500"
                    }`}
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 font-medium">Email Address</label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email && touched.email
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 ring-purple-500"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-1 font-medium">Phone Number</label>
                  <Field
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone && touched.phone
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 ring-purple-500"
                    }`}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block mb-1 font-medium">Role</label>
                  <Field
                    as="select"
                    name="role"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.role && touched.role
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 ring-purple-500"
                    }`}
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="Artist">Artist</option>
                    <option value="Producer">Producer</option>
                    <option value="Songwriter">Songwriter</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="block mb-1 font-medium">Primary Genre</label>
                  <Field
                    name="genre"
                    type="text"
                    placeholder="e.g. Hip-Hop, Pop, EDM"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.genre && touched.genre
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 ring-purple-500"
                    }`}
                  />
                  <ErrorMessage
                    name="genre"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Portfolio / Music Link */}
                <div>
                  <label className="block mb-1 font-medium">Portfolio / Music Link</label>
                  <Field
                    name="musicLink"
                    type="url"
                    placeholder="Enter your music link"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.musicLink && touched.musicLink
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 ring-purple-500"
                    }`}
                  />
                  <ErrorMessage
                    name="musicLink"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block mb-1 font-medium">Short Bio</label>
                <Field
                  as="textarea"
                  name="bio"
                  rows="3"
                  placeholder="Tell us about yourself..."
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.bio && touched.bio
                      ? "border-red-500 ring-red-300"
                      : "border-gray-300 ring-purple-500"
                  }`}
                />
                <ErrorMessage
                  name="bio"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="agree"
                  className={`w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 ${
                    errors.agree && touched.agree
                      ? "ring-red-300 border-red-500"
                      : "ring-purple-500 border-gray-300"
                  }`}
                />
                <label className="text-gray-700 text-sm">
                  I confirm that the above information is accurate.
                </label>
              </div>
              <ErrorMessage
                name="agree"
                component="div"
                className="text-red-500 text-sm mt-1"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Submit Application
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ApplyForm;
