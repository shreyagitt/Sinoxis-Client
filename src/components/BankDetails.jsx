import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const BankDetailsSchema = Yup.object().shape({
  accountName: Yup.string().required("Account holder name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  bankName: Yup.string().required("Bank name is required"),
  ifscCode: Yup.string().required("IFSC code is required"),
  bankBranch: Yup.string(),
  panNumber: Yup.string(),
  confirm: Yup.boolean().oneOf([true], "You must confirm your bank details"),
});

const BankDetails = () => {
  const handleSubmit = (values, { resetForm }) => {
    console.log("Bank Details submitted:", values);
    alert("Bank Details Submitted!\n" + JSON.stringify(values, null, 2));
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex justify-center p-5">
      <div className="w-full max-w-6xl ">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Bank Details</h1>
          </div>
          <ol className="flex text-gray-800 text-sm space-x-2">
            <li>Home</li>
            <li>/</li>
            <li className="text-red-600 font-medium">Bank Details</li>
          </ol>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-gray-200">

          <h5 className="text-xl font-semibold mb-2 text-gray-500">Bank Details</h5>
          <p className="text-gray-500 mb-8">
            Provide your bank details accurately. All information is securely encrypted.
          </p>

          <Formik
            initialValues={{
              accountName: "",
              accountNumber: "",
              bankName: "",
              ifscCode: "",
              bankBranch: "",
              panNumber: "",
              confirm: false,
            }}
            validationSchema={BankDetailsSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Holder Name */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <Field
                    type="text"
                    name="accountName"
                    placeholder="Enter account holder name"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.accountName && touched.accountName
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 focus:ring-red-500"
                    }`}
                  />
                  <ErrorMessage
                    name="accountName"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Account Number
                  </label>
                  <Field
                    type="text"
                    name="accountNumber"
                    placeholder="Enter account number"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.accountNumber && touched.accountNumber
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 focus:ring-red-500"
                    }`}
                  />
                  <ErrorMessage
                    name="accountNumber"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Bank Name
                  </label>
                  <Field
                    type="text"
                    name="bankName"
                    placeholder="Enter bank name"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.bankName && touched.bankName
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 focus:ring-red-500"
                    }`}
                  />
                  <ErrorMessage
                    name="bankName"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <Field
                    type="text"
                    name="ifscCode"
                    placeholder="Enter IFSC code"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.ifscCode && touched.ifscCode
                        ? "border-red-500 ring-red-300"
                        : "border-gray-300 focus:ring-red-500"
                    }`}
                  />
                  <small className="text-gray-400 text-sm block mt-1">
                    Example: SBIN0001234
                  </small>
                  <ErrorMessage
                    name="ifscCode"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Bank Branch (Optional) */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Bank Branch (Optional)
                  </label>
                  <Field
                    type="text"
                    name="bankBranch"
                    placeholder="Enter bank branch"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* PAN Number (Optional) */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    PAN Number (Optional)
                  </label>
                  <Field
                    type="text"
                    name="panNumber"
                    placeholder="Enter PAN number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Checkbox */}
                <div className="col-span-1 md:col-span-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Field
                      type="checkbox"
                      name="confirm"
                      className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-red-500 accent-red-600"
                    />
                    <label className="text-gray-700 text-sm">
                      I confirm that the above bank details are correct.
                    </label>
                  </div>
                  <ErrorMessage
                    name="confirm"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <div className="col-span-1 md:col-span-2">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-8 rounded-lg transition w-32"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;



