import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTheme } from "../components/Topbar"; // ⭐ THEME SUPPORT

const STORAGE_KEY = "my_releases_v1";
const readFromStorage = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const writeToStorage = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const CoverPlaceholder =
  "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png";

const Schema = Yup.object().shape({
  title: Yup.string().required("Required"),
  artist: Yup.string().required("Required"),
  contactEmail: Yup.string().email("Invalid email"),
  confirm: Yup.boolean().oneOf([true], "You must confirm this information"),
});

export default function ReleaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme(); // ⭐ GET THEME (dark / light)

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
    confirm: false,
  });

  useEffect(() => {
    const list = readFromStorage();
    if (isEdit) {
      const found = list.find((r) => String(r.id) === String(id));
      if (found) setInitial({ ...found, confirm: false });
    }
  }, [id]);

  const handleSubmit = (values) => {
    const list = readFromStorage();

    if (isEdit) {
      const updated = list.map((r) => (r.id === values.id ? { ...values } : r));
      writeToStorage(updated);
    } else {
      writeToStorage([{ ...values, id: Date.now() }, ...list]);
    }

    navigate("/releases");
  };

  // THEME COLORS
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-300 shadow-xl";
  const inputBg =
    theme === "dark"
      ? "bg-[#111a3b] border-white/10 text-white placeholder-gray-400"
      : "bg-gray-100 border-gray-300 text-[#020726] placeholder-gray-500";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`min-h-screen p-8 transition-all duration-300 ${pageBg}`}>
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-semibold">
          {isEdit ? "Edit Release" : "Create Release"}
        </h1>
      </div>

      {/* FORM CARD */}
      <div className={`rounded-2xl p-8 border transition-all duration-300 ${cardBg}`}>
        <Formik
          initialValues={initial}
          enableReinitialize
          validationSchema={Schema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors }) => (
            <Form className="grid grid-cols-2 gap-6">

              {/* LEFT SIDE */}
              <div>
                {/* Title */}
                <label className="text-sm">Release Title</label>
                <Field
                  name="title"
                  placeholder="Enter release title"
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                />

                {/* Date */}
                <label className="text-sm mt-6">Release Date</label>
                <Field
                  name="releaseDate"
                  type="date"
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                />

                {/* Released Before */}
                <label className="text-sm mt-6">Have you released music before?</label>
                <div className="flex gap-6 mt-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={values.releasedBefore === true}
                      onChange={() => setFieldValue("releasedBefore", true)}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={values.releasedBefore === false}
                      onChange={() => setFieldValue("releasedBefore", false)}
                    />
                    No
                  </label>
                </div>

                {/* Phone */}
                <label className="text-sm mt-6">Contact Phone</label>
                <Field
                  name="contactPhone"
                  placeholder="+91 98765 43210"
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                />

                {/* Notes */}
                <label className="text-sm mt-6">Short Notes / Bio</label>
                <Field
                  as="textarea"
                  name="notes"
                  rows="5"
                  placeholder="Tell us about the release or yourself..."
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                />
              </div>

              {/* RIGHT SIDE */}
              <div>
                {/* Artist */}
                <label className="text-sm">Primary Artist</label>
                <Field
                  name="artist"
                  placeholder="Artist name"
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                />

                {/* Preview Link */}
                <label className="text-sm mt-6">Tracks / Preview Link</label>
                <Field
                  name="tracksPreview"
                  placeholder="SoundCloud / Drive / Dropbox link"
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                />

                {/* Email */}
                <label className="text-sm mt-6">Contact Email</label>
                <Field
                  name="contactEmail"
                  placeholder="you@example.com"
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                />

                {/* Cover Upload */}
                <label className="text-sm mt-6">Cover Art</label>
                <div className="flex items-center gap-4 mt-2">
                  <div
                    className={`w-[90px] h-[90px] rounded-xl overflow-hidden border ${
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

                  {/* File Upload */}
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
                    className={`text-sm cursor-pointer 
                    file:px-4 file:py-2 file:rounded-lg file:border-0 
                    ${
                      theme === "dark"
                        ? "text-gray-300 file:bg-[#1c2b57] file:text-white file:hover:bg-[#2a3d7a]"
                        : "text-gray-700 file:bg-gray-300 file:text-black file:hover:bg-gray-400"
                    }`}
                  />
                </div>

                {/* Status */}
                <label className="text-sm mt-6">Status</label>
                <Field
                  as="select"
                  name="status"
                  className={`w-full mt-2 p-3 rounded-xl border ${inputBg}`}
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Inactive</option>
                  <option>Unfinished</option>
                  <option>Action Required</option>
                </Field>

                {/* Confirm */}
                <div className="flex items-center gap-3 mt-6">
                  <Field type="checkbox" name="confirm" />
                  <label className="text-sm">I confirm the information is accurate</label>
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="col-span-2 flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/releases")}
                  className={`px-6 py-2 rounded-full border ${
                    theme === "dark"
                      ? "border-white/20 text-gray-300 hover:text-white"
                      : "border-gray-400 text-[#020726] hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-10 py-3 rounded-full text-white font-semibold shadow"
                  style={{
                    background: "linear-gradient(90deg,#29B6F6,#0288D1)",
                  }}
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

