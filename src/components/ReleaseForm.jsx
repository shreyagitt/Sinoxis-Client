// src/pages/ReleaseForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useTheme } from "../components/Topbar";
import toast from "react-hot-toast";

/* -------------------------------------------------------------------------- */
/* PLACEHOLDER COVER                                                          */
/* -------------------------------------------------------------------------- */
const CoverPlaceholder =
  "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png";

/* -------------------------------------------------------------------------- */
/* FORM VALIDATION                                                            */
/* -------------------------------------------------------------------------- */
const Schema = Yup.object().shape({
  title: Yup.string().required("Required"),
  artist: Yup.string().required("Required"),
  contactEmail: Yup.string().email("Invalid email"),
  confirm: Yup.boolean().oneOf([true], "You must confirm this information"),
});

/* -------------------------------------------------------------------------- */
/* LISTBOX SELECT COMPONENT                                                   */
/* -------------------------------------------------------------------------- */
function FormikListbox({ label, name, options, values, setFieldValue, theme }) {
  const currentVal = values[name];

  return (
    <div className="w-full">
      <label
        className={`text-sm mb-2 block ${
          theme === "dark" ? "text-gray-300" : "text-[#020726]"
        }`}
      >
        {label}
      </label>

      <Listbox value={currentVal} onChange={(val) => setFieldValue(name, val)}>
        <div className="relative">
          <Listbox.Button
            className={`w-full px-4 py-3 rounded-xl flex items-center justify-between border text-left
              ${
                theme === "dark"
                  ? "bg-[#0a1039] border-white/10 text-gray-100"
                  : "bg-white border-gray-200 text-[#020726]"
              }
            `}
          >
            <span className="truncate">
              {options.find((o) => o.value === currentVal)?.label || "Select"}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 ${
                theme === "dark" ? "text-gray-300" : "text-gray-500"
              }`}
            />
          </Listbox.Button>

          {/* DROPDOWN */}
          <Listbox.Options
            className={`absolute z-50 w-full mt-2 rounded-xl shadow-lg max-h-52 overflow-auto py-1
              ${
                theme === "dark"
                  ? "bg-[#0a1039] border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
          >
            {options.map((opt, idx) => (
              <Listbox.Option
                key={idx}
                value={opt.value}
                className={({ active }) =>
                  `cursor-pointer px-4 py-2 flex items-center justify-between ${
                    active
                      ? theme === "dark"
                        ? "bg-white/5"
                        : "bg-gray-100"
                      : ""
                  }`
                }
              >
                <span
                  className={`truncate ${
                    currentVal === opt.value ? "font-semibold" : ""
                  }`}
                >
                  {opt.label}
                </span>
                {currentVal === opt.value && (
                  <CheckIcon
                    className={`w-5 h-5 ${
                      theme === "dark" ? "text-[#29B6F6]" : "text-[#0288D1]"
                    }`}
                  />
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN FORM                                                                  */
/* -------------------------------------------------------------------------- */
export default function ReleaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const isEdit = Boolean(id);

  const [initial, setInitial] = useState({
    title: "",
    artist: "",
    tracksPreview: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
    releasedBefore: false,
    cover: "",
    status: "Pending",
    releaseDate: "",
    confirm: false,
  });

  /* ---------------------------------------------------------------------- */
  /* FETCH RELEASE FOR EDIT MODE                                            */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!isEdit) return;

    const fetchRelease = async () => {
      try {
        const res = await axios.get(`${baseUrl}/client/release/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setInitial({
          ...res.data.data,
          confirm: false,
        });
      } catch (err) {
        toast.error("Failed to load release");
      }
    };

    fetchRelease();
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* SUBMIT HANDLER: CREATE OR UPDATE                                       */
  /* ---------------------------------------------------------------------- */
  const handleSubmit = async (values) => {
  try {
    const fd = new FormData();

    fd.append("title", values.title);
    fd.append("artist", values.artist);
    fd.append("label", values.label);      // ✅ ADDED
    fd.append("isrc", values.isrc);        // ✅ ADDED
    fd.append("upc", values.upc);          // ✅ ADDED
    fd.append("tracksPreview", values.tracksPreview || "");
    fd.append("contactEmail", values.contactEmail || "");
    fd.append("contactPhone", values.contactPhone || "");
    fd.append("notes", values.notes || "");
    fd.append("releaseDate", values.releaseDate || "");
    fd.append("status", values.status);
    fd.append("releasedBefore", String(values.releasedBefore));
    fd.append("confirm", String(values.confirm));

    if (values.cover instanceof File) {
      fd.append("cover", values.cover);
    }

    if (isEdit) {
      await axios.put(`${baseUrl}/client/release/${id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Release updated!");
    } else {
      await axios.post(`${baseUrl}/client/release`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Release created!");
    }

    navigate("/releases/myRelease");
  } catch (err) {
    console.error(err);
    toast.error("Submit failed");
  }
};



  /* ---------------------------------------------------------------------- */
  /* THEME STYLES                                                            */
  /* ---------------------------------------------------------------------- */
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-300 shadow-xl";
  const inputBg =
    theme === "dark"
      ? "bg-[#111a3b] border-white/10 text-white"
      : "bg-gray-100 border-gray-300 text-[#020726]";

  /* LISTBOX OPTIONS */
  const yesNoOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
    { label: "Inactive", value: "Inactive" },
    { label: "Unfinished", value: "Unfinished" },
    { label: "Action Required", value: "Action Required" },
  ];

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <div className={`min-h-screen p-6 md:p-8 ${pageBg}`}>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-semibold">
          {isEdit ? "Edit Release" : "Create Release"}
        </h1>
      </div>

      <div className={`rounded-2xl p-8 border ${cardBg}`}>
        <Formik
          initialValues={initial}
          enableReinitialize
          validationSchema={Schema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-4">
                <div>
                  <label>Release Title</label>
                  <Field
                    name="title"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                <div>
                  <label>Release Date</label>
                  <Field
                    type="date"
                    name="releaseDate"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                <FormikListbox
                  label="Released Before?"
                  name="releasedBefore"
                  options={yesNoOptions}
                  values={values}
                  setFieldValue={setFieldValue}
                  theme={theme}
                />

                <div>
                  <label>Contact Phone</label>
                  <Field
                    name="contactPhone"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                <div>
                  <label>Short Notes / Bio</label>
                  <Field
                    as="textarea"
                    rows="5"
                    name="notes"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

{/* COVER UPLOAD */}
                <div>
                  <label>Cover Art</label>

                  <div className="flex gap-4 mt-2 items-center">
                    <div
                      className={`w-[90px] h-[90px] rounded-xl overflow-hidden border
                        ${
                          theme === "dark"
                            ? "bg-[#1b254b] border-white/10"
                            : "bg-gray-200 border-gray-300"
                        }`}
                    >
                      <img
                        src={values.cover || CoverPlaceholder}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setFieldValue("cover", reader.result);
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                </div>

              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <div>
                  <label>Artist</label>
                  <Field
                    name="artist"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* LABEL */}
<div>
  <label>Label</label>
  <Field
    name="label"
    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
  />
</div>

{/* ISRC */}
<div>
  <label>ISRC</label>
  <Field
    name="isrc"
    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
  />
</div>

{/* UPC */}
<div>
  <label>UPC</label>
  <Field
    name="upc"
    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
  />
</div>


                <div>
                  <label>Tracks / Preview Link</label>
                  <Field
                    name="tracksPreview"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                <div>
                  <label>Email</label>
                  <Field
                    name="contactEmail"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                

                <FormikListbox
                  label="Status"
                  name="status"
                  options={statusOptions}
                  values={values}
                  setFieldValue={setFieldValue}
                  theme={theme}
                />

                {/* Confirm */}
                <div className="flex items-center gap-3">
                  <Field type="checkbox" name="confirm" />
                  <label>I confirm the information is accurate</label>
                </div>
                {errors.confirm && (
                  <div className="text-xs text-red-400">{errors.confirm}</div>
                )}
              </div>

              {/* FOOTER BUTTONS */}
              <div className="md:col-span-2 flex justify-end mt-6 gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/releases")}
                  className="px-6 py-2 rounded-full border border-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-full text-white font-bold"
                  style={{ background: "linear-gradient(90deg,#29B6F6,#0288D1)" }}
                >
                  {isEdit ? "Save Changes" : "Submit Release"}
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
