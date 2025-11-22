import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [initialValues, setInitialValues] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    bankBranch: "",
    panNumber: "",
    confirm: false,
  });

  const [loading, setLoading] = useState(true);

  const fetchBankDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/client/bank/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success && data.data) {
        setInitialValues({ ...data.data, confirm: false });
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/client/bank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        alert("Bank details saved successfully!");
        fetchBankDetails();
      } else {
        alert(data.error || "Failed to save bank details");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("An error occurred while saving bank details.");
    }
  };

  if (loading)
    return <div className="p-10 text-center text-xl text-white">Loading…</div>;

  return (
    <div className="min-h-screen bg-[#020726] text-white p-8">

      {/* TITLE + BREADCRUMB */}
      <div className="flex justify-between mb-8 px-2">
        <h1 className="text-3xl font-semibold">Bank Details</h1>

        <p className="text-sm text-gray-300">
          Home / <span className="text-[#29B6F6]">Bank Details</span>
        </p>
      </div>

      {/* MAIN FORM CONTAINER */}
      <div className="bg-[#0a1039] rounded-xl shadow-2xl p-10 w-full max-w-5xl border border-white/10">

        <h2 className="text-xl font-semibold mb-1">Bank Details</h2>
        <p className="text-gray-300 mb-6">
          Provide your bank details accurately. All information is securely encrypted.
        </p>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={BankDetailsSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Account Holder Name */}
              <FieldBox
                label="Account Holder Name"
                name="accountName"
                placeholder="Enter account holder name"
              />

              {/* Account Number */}
              <FieldBox
                label="Account Number"
                name="accountNumber"
                placeholder="Enter account number"
              />

              {/* Bank Name */}
              <FieldBox
                label="Bank Name"
                name="bankName"
                placeholder="Enter bank name"
              />

              {/* IFSC Code */}
              <FieldBox
                label="IFSC Code"
                name="ifscCode"
                placeholder="Enter IFSC code"
                helper="Example: SBIN0001234"
              />

              {/* Bank Branch */}
              <FieldBox
                label="Bank Branch (Optional)"
                name="bankBranch"
                placeholder="Enter bank branch"
              />

              {/* PAN Number */}
              <FieldBox
                label="PAN Number (Optional)"
                name="panNumber"
                placeholder="Enter PAN number"
              />

              {/* CONFIRMATION CHECKBOX */}
              <div className="col-span-2 flex items-start gap-2 mt-3">
                <Field type="checkbox" name="confirm" className="mt-1 w-4 h-4 accent-[#29B6F6]" />
                <label className="text-sm text-gray-300">
                  I confirm that the above bank details are correct.
                </label>
              </div>
              <ErrorMessage name="confirm" component="div" className="text-red-400 text-sm" />

              {/* SUBMIT BUTTON */}
              <div className="col-span-2 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-white font-semibold rounded-md 
                  bg-gradient-to-r from-[#29B6F6] to-[#0288D1] hover:opacity-90"
                >
                  Submit
                </button>
              </div>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
};

export default BankDetails;

/* Reusable Input Component */
const FieldBox = ({ label, name, placeholder, helper }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-white">
      {label}
    </label>

    <Field
      name={name}
      placeholder={placeholder}
      className="w-full bg-[#2c2f4a] text-white placeholder-gray-400 
      border border-transparent rounded-md px-4 py-2
      focus:outline-none focus:ring-1 focus:ring-[#29B6F6]"
    />

    {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}

    <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
  </div>
);
