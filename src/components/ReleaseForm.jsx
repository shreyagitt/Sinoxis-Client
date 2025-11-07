import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const STORAGE_KEY = "my_releases_v1";
const readFromStorage = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const writeToStorage = (arr) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const CoverPlaceholder =
  "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png";

const Schema = Yup.object().shape({
  title: Yup.string().required(),
  artist: Yup.string().required(),
  contactEmail: Yup.string().email(),
  confirm: Yup.boolean().oneOf([true], "You must confirm this information"),
});

export default function ReleaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      const updated = list.map((r) =>
        r.id === values.id ? { ...values } : r
      );
      writeToStorage(updated);
    } else {
      writeToStorage([{ ...values, id: Date.now() }, ...list]);
    }

    navigate("/releases");
  };

  return (
    <div className="min-h-screen bg-[#020726] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-semibold">
          {isEdit ? "Edit Release" : "Create Release"}
        </h1>
      </div>

      {/* FORM CARD */}
      <div className="bg-[#0a1039] rounded-2xl p-8 border border-white/10">

        <Formik
          initialValues={initial}
          enableReinitialize
          validationSchema={Schema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-2 gap-6">

              {/* LEFT SIDE */}
              <div>
                {/* Title */}
                <label className="text-sm">Release Title</label>
                <Field
                  name="title"
                  placeholder="Enter release title"
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
                />

                {/* Date */}
                <label className="text-sm mt-6">Release Date</label>
                <Field
                  name="releaseDate"
                  type="date"
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
                />

                {/* Released Before */}
                <label className="text-sm mt-6">
                  Have you released music before?
                </label>
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
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
                />

                {/* Notes */}
                <label className="text-sm mt-6">Short Notes / Bio</label>
                <Field
                  as="textarea"
                  name="notes"
                  rows="5"
                  placeholder="Tell us about the release or yourself..."
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
                />
              </div>

              {/* RIGHT SIDE */}
              <div>
                {/* Artist */}
                <label className="text-sm">Primary Artist</label>
                <Field
                  name="artist"
                  placeholder="Artist name"
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
                />

                {/* Preview Link */}
                <label className="text-sm mt-6">Tracks / Preview Link</label>
                <Field
                  name="tracksPreview"
                  placeholder="Link to preview (SoundCloud / Dropbox / Drive)"
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
                />

                {/* Email */}
                <label className="text-sm mt-6">Contact Email</label>
                <Field
                  name="contactEmail"
                  placeholder="you@example.com"
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
                />

                {/* Cover Upload */}
              <label className="text-sm mt-6">Cover Art</label>
<div className="flex items-center gap-4 mt-2">
  {/* Preview */}
  <div className="w-[90px] h-[90px] bg-[#1b254b] rounded-xl overflow-hidden border border-white/10">
    <img
      src={values.cover || CoverPlaceholder}
      className="w-full h-full object-cover"
    />
  </div>

  {/* Dark Styled File Upload */}
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setFieldValue("cover", reader.result);
      reader.readAsDataURL(file);
    }}
    className="
      text-sm text-gray-300
      file:bg-[#1c2b57]
      file:text-white
      file:border-0
      file:px-4
      file:py-2
      file:rounded-lg
      file:hover:bg-[#2a3d7a]
      cursor-pointer
    "
  />
</div>


                {/* Status */}
                <label className="text-sm mt-6">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="w-full bg-[#111a3b] mt-2 p-3 rounded-xl border border-white/10"
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
                  <label className="text-sm">
                    I confirm that the above information is accurate
                  </label>
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="col-span-2 flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/releases")}
                  className="px-6 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-10 py-3 rounded-full text-white font-semibold shadow"
                  style={{
                    background: "linear-gradient(90deg,#00AEEF,#007BFF)",
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
