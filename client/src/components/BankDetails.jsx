// src/pages/BankDetails.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
//import { useTheme } from "../components/Topbar";

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
  //const { theme } = useTheme();

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
    return (
      <div className="p-10 text-center text-xl text-[#020726] dark:text-white">
        Loading…
      </div>
    );

  /* THEME CLASSES 
  const pageBg = theme === "dark" ? "bg-[#020726]" : "bg-white";
  const pageText = theme === "dark" ? "text-white" : "text-[#020726]";
  const cardBg = theme === "dark" ? "bg-[#0a1039]" : "bg-white";
  const cardBorder = theme === "dark" ? "border-white/10" : "border-gray-200";
  const titleColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const subText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#2c2f4a] text-white" : "bg-gray-50 text-[#020726]";
  const inputBorder = theme === "dark" ? "border-transparent" : "border-gray-200";
  const helperColor = theme === "dark" ? "text-gray-400" : "text-gray-500"; */
  const checkboxAccent = "accent-[#29B6F6]";

  return (
    <div className={`bg-white dark:bg-[#020726] text-[#020726] dark:text-white min-h-screen px-4 sm:px-6 md:px-10 py-6`}>
      
      {/* TITLE + BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-3 px-1">
        <h1 className={`text-2xl sm:text-3xl font-semibold text-[#020726] dark:text-white`}>Bank Details</h1>

        <p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-300`}>
          Home / <span className="text-[#29B6F6]">Bank Details</span>
        </p>
      </div>

      {/* MAIN FORM CARD */}
      
       <div className="rounded-xl shadow-xl p-5 sm:p-7 md:p-10 w-full max-w-5xl mx-auto border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a1039]">
      
        <h2 className={`text-lg sm:text-xl font-semibold mb-1 text-[#020726] dark:text-white`}>
          Bank Details
        </h2>
        <p className={`mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300`}>
          Provide your bank details accurately. All information is securely encrypted.
        </p>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={BankDetailsSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              <FieldBox label="Account Holder Name" name="accountName" placeholder="Enter account holder name"  />

              <FieldBox label="Account Number" name="accountNumber" placeholder="Enter account number"  />

              <FieldBox label="Bank Name" name="bankName" placeholder="Enter bank name"  />

              <FieldBox label="IFSC Code" name="ifscCode" placeholder="Enter IFSC code" helper="Example: SBIN0001234"  />

              <FieldBox label="Bank Branch (Optional)" name="bankBranch" placeholder="Enter bank branch"  />

              <FieldBox label="PAN Number (Optional)" name="panNumber" placeholder="Enter PAN number"  />

              {/* CONFIRMATION CHECKBOX */}
              <div className="col-span-1 sm:col-span-2 flex items-start gap-2 mt-1">
                <Field type="checkbox" name="confirm" className={`mt-1 w-4 h-4 ${checkboxAccent}`} />
                <label className={`text-xs sm:text-sm text-gray-600 dark:text-gray-300`}>
                  I confirm that the above bank details are correct.
                </label>
              </div>
              <ErrorMessage name="confirm" component="div" className="text-red-400 text-xs" />

              {/* SUBMIT BUTTON */}
              <div className="col-span-1 sm:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-md transition"
                  style={{ background: "linear-gradient(90deg,#29B6F6,#0288D1)" }}
                >
                  {isSubmitting ? "Saving..." : "Submit"}
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

/* Reusable Field Component */
const FieldBox = ({ label, name, placeholder, helper, inputBg, inputBorder, helperColor }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-1">{label}</label>

      <Field
        name={name}
        placeholder={placeholder}
        className={`w-full bg-gray-50 dark:bg-[#2c2f4a] text-[#020726] dark:text-white border border-gray-200 dark:border-white/10 placeholder-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none`}
      />

      {helper && <p className={`text-xs mt-1 text-gray-500 dark:text-gray-400`}>{helper}</p>}

      <ErrorMessage name={name} component="p" className="text-red-400 text-xs mt-1" />
    </div>
  );
};
