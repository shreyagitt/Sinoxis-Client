// src/pages/ReleaseForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useTheme } from "../components/Topbar"; // ⭐ THEME SUPPORT

/* -------------------------------------------------------------------------- */
/* LOCAL STORAGE HELPERS                                                      */
/* -------------------------------------------------------------------------- */
const STORAGE_KEY = "my_releases_v1";
const readFromStorage = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const writeToStorage = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

/* COVER PLACEHOLDER */
const CoverPlaceholder =
  "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png";

/* FORM VALIDATION */
const Schema = Yup.object().shape({
  title: Yup.string().required("Required"),
  artist: Yup.string().required("Required"),
  contactEmail: Yup.string().email("Invalid email"),
  confirm: Yup.boolean().oneOf([true], "You must confirm this information"),
});

/* -------------------------------------------------------------------------- */
/* CUSTOM FORM LISTBOX (SELECT) COMPONENT                                    */
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
          {/* BUTTON */}
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

          {/* DROPDOWN OPTIONS */}
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
/* MAIN COMPONENT: RELEASE FORM                                               */
/* -------------------------------------------------------------------------- */
export default function ReleaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

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

  /* LOAD EDIT DATA */
  useEffect(() => {
    const list = readFromStorage();
    if (isEdit) {
      const found = list.find((r) => String(r.id) === String(id));
      if (found) setInitial({ ...found, confirm: false });
    }
  }, [id]);

  /* FORM SUBMIT */
  const handleSubmit = (values) => {
    const list = readFromStorage();

    if (isEdit) {
      const updated = list.map((r) =>
        String(r.id) === String(values.id) ? { ...values } : r
      );
      writeToStorage(updated);
    } else {
      writeToStorage([{ ...values, id: Date.now() }, ...list]);
    }

    navigate("/releases");
  };

  /* THEME CLASSES */
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
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */

  return (
    <div className={`min-h-screen p-6 md:p-8 ${pageBg}`}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">
          {isEdit ? "Edit Release" : "Create Release"}
        </h1>
      </div>

      {/* FORM CARD */}
      <div className={`rounded-2xl p-6 md:p-8 border ${cardBg}`}>
        <Formik
          initialValues={initial}
          enableReinitialize
          validationSchema={Schema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LEFT SIDE ------------------------------------------------ */}
              <div className="space-y-4">

                {/* Title */}
                <div>
                  <label>Release Title</label>
                  <Field
                    name="title"
                    placeholder="Enter release title"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* Release Date */}
                <div>
                  <label>Release Date</label>
                  <Field
                    type="date"
                    name="releaseDate"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* Released Before (Listbox) */}
                <FormikListbox
                  label="Have you released music before?"
                  name="releasedBefore"
                  options={yesNoOptions}
                  values={values}
                  setFieldValue={setFieldValue}
                  theme={theme}
                />

                {/* Phone */}
                <div>
                  <label>Contact Phone</label>
                  <Field
                    name="contactPhone"
                    placeholder="+91 98765 43210"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label>Short Notes / Bio</label>
                  <Field
                    as="textarea"
                    name="notes"
                    rows="5"
                    placeholder="Tell us about the release..."
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>
              </div>

              {/* RIGHT SIDE ----------------------------------------------- */}
              <div className="space-y-4">

                {/* Artist */}
                <div>
                  <label>Primary Artist</label>
                  <Field
                    name="artist"
                    placeholder="Artist name"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* Track preview */}
                <div>
                  <label>Tracks / Preview Link</label>
                  <Field
                    name="tracksPreview"
                    placeholder="Drive / Dropbox / SoundCloud"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label>Contact Email</label>
                  <Field
                    name="contactEmail"
                    placeholder="you@example.com"
                    className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* Cover Upload */}
                <div>
                  <label>Cover Art</label>
                  <div className="flex gap-4 items-center mt-2 flex-col sm:flex-row">
                    {/* Preview */}
                    <div
                      className={`w-[90px] h-[90px] rounded-xl overflow-hidden border flex-shrink-0
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

                    {/* Input */}
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

                {/* Status */}
                <FormikListbox
                  label="Status"
                  name="status"
                  options={statusOptions}
                  values={values}
                  setFieldValue={setFieldValue}
                  theme={theme}
                />

                {/* Confirm */}
                <div className="flex items-center gap-3 mt-2">
                  <Field type="checkbox" name="confirm" />
                  <label>I confirm the information is accurate</label>
                </div>
                {errors.confirm && (
                  <div className="text-xs text-red-400">{errors.confirm}</div>
                )}
              </div>

              {/* FOOTER BUTTONS ------------------------------------------- */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
