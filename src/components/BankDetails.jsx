import React, { useEffect, useState } from "react";
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

  // 🔥 GET BANK DETAILS
  const fetchBankDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/client/bank/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && data.data) {
        setInitialValues({
          ...data.data,
          confirm: false,
        });
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

  // 🔥 SUBMIT (UPSERT) BANK DETAILS
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
    return <div className="p-10 text-center text-xl">Loading Bank Details...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex justify-center p-5">
      <div className="w-full max-w-6xl">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Bank Details</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-2xl p-10 border">

          <h5 className="text-xl font-semibold mb-2 text-gray-500">Bank Details</h5>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={BankDetailsSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Account Holder Name */}
                <div>
                  <label className="block mb-2 font-medium">Account Holder Name</label>
                  <Field name="accountName" type="text" className="w-full p-3 border rounded-lg" />
                  <ErrorMessage name="accountName" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block mb-2 font-medium">Account Number</label>
                  <Field name="accountNumber" type="text" className="w-full p-3 border rounded-lg" />
                  <ErrorMessage name="accountNumber" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block mb-2 font-medium">Bank Name</label>
                  <Field name="bankName" type="text" className="w-full p-3 border rounded-lg" />
                  <ErrorMessage name="bankName" component="div" className="text-red-600 text-sm" />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block mb-2 font-medium">IFSC Code</label>
                  <Field name="ifscCode" type="text" className="w-full p-3 border rounded-lg" />
                  <ErrorMessage name="ifscCode" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Bank Branch */}
                <div>
                  <label className="block mb-2 font-medium">Bank Branch</label>
                  <Field name="bankBranch" type="text" className="w-full p-3 border rounded-lg" />
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block mb-2 font-medium">PAN Number</label>
                  <Field name="panNumber" type="text" className="w-full p-3 border rounded-lg" />
                </div>

                {/* Checkbox */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Field type="checkbox" name="confirm" className="w-4 h-4 accent-red-600" />
                    <label className="text-gray-700 text-sm">
                      I confirm that the above bank details are correct.
                    </label>
                  </div>
                  <ErrorMessage name="confirm" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Submit Button */}
                <div className="col-span-2">
                  <button type="submit" className="bg-red-600 text-white px-8 py-2 rounded-lg">
                    Save Details
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
