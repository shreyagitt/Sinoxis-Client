// src/pages/Labels.jsx
import React, { useState } from "react";
import { Eye, X, Edit3 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

/**
 * Reference screenshot files (embedded hidden)
 * Your environment/tool will transform these local paths to usable URLs.
 */
const refScreenshot1 = "/mnt/data/f09cc21d-4389-4f0b-ad92-6d4ad2b212f7.png";
const refScreenshot2 = "/mnt/data/787fa7b9-b418-4141-b9e8-dd43afa56821.png";
const refScreenshotA = "/mnt/data/b5d532c3-6fbf-4590-9325-0f27abb93a88.png";
const refScreenshotB = "/mnt/data/ec35233f-1d75-4f80-85bc-52bc8c480664.png";
const refScreenshotC = "/mnt/data/66583bfc-b614-4e1d-a972-83c127b432cd.png";

const placeholderImage =
  "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg";

/* format date helper */
function formatDisplayDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return d.toLocaleDateString("en-GB", options);
}

/* Status styles map (kept for table display only) */
const STATUS_STYLES = {
  Active: {
    bg: "#22e788",   // bright green
    color: "#073b1d", 
  },
  Pending: {
    bg: "#ffd626",   // bright yellow
    color: "#5b4600",
  },
  Rejected: {
    bg: "#ff2d2d",   // bold red
    color: "#4d0000",
  },
  Inactive: {
    bg: "#4c8df6",   // bright blue
    color: "#001b4d",
  },
};


/* ----------------- YUP SCHEMA (Medium Validation) -----------------
  - Full Name: required, min 3
  - Label Name: required, min 3
  - Email: optional, must be valid if present
  - Phone: required, 10 digits Indian (no prefix)
  - YouTube: optional, must be URL if present
  - Language: required
  - Images: optional
-------------------------------------------------------------------*/
const LabelSchema = Yup.object().shape({
  fullName: Yup.string().min(3, "At least 3 characters").required("Full name is required"),
  labelName: Yup.string().min(3, "At least 3 characters").required("Label name is required"),
  email: Yup.string().email("Enter a valid email").nullable(),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  youtube: Yup.string().url("Enter a valid URL").nullable(),
  language: Yup.string().required("Song language is required"),
  aadharFront: Yup.mixed().nullable(),
  aadharBack: Yup.mixed().nullable(),
});

export default function Labels() {
  // ---------- Demo data (3 items) ----------
  const [labels, setLabels] = useState([
    {
      id: 1,
      name: "Universal Music",
      created: "2025-01-10",
      expiry: "2030-01-10",
      status: "Active",
      meta: {
        fullName: "John Doe",
        email: "john@example.com",
        phone: "9888888888",
        youtube: "https://youtube.com/universalmusic",
        language: "English",
        aadharFront: null,
        aadharBack: null,
      },
    },
    {
      id: 2,
      name: "Sony Records",
      created: "2025-02-18",
      expiry: "2030-02-18",
      status: "Pending",
      meta: {
        fullName: "Emma Watson",
        email: "emma@sony.com",
        phone: "9191919191",
        youtube: "",
        language: "Hindi",
        aadharFront: null,
        aadharBack: null,
      },
    },
    {
      id: 3,
      name: "Demo Label",
      created: "2025-03-01",
      expiry: "2030-03-01",
      status: "Inactive",
      meta: {
        fullName: "",
        email: "",
        phone: "",
        youtube: "",
        language: "",
        aadharFront: null,
        aadharBack: null,
      },
    },
  ]);

  // ---------- UI state ----------
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  // view modal tab: "details" | "form" | "images"
  const [viewTab, setViewTab] = useState("details");

  // initial values for formik
  const emptyValues = {
    fullName: "",
    labelName: "",
    email: "",
    phone: "",
    youtube: "",
    language: "",
    aadharFront: null,
    aadharBack: null,
  };

  // for form initial state (used with enableReinitialize)
  const [initialFormValues, setInitialFormValues] = useState({ ...emptyValues });

  /* -------- helpers for file -> dataURL for previews -------- */
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("File read error"));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  /* ---------- Open Add Modal (fresh form) ---------- */
  const openAddModal = () => {
    setInitialFormValues({ ...emptyValues });
    setEditMode(false);
    setEditingId(null);
    setShowAddModal(true);
  };

  /* ---------- Open Edit (prefill form with chosen label's data) ---------- */
  const openEdit = (label) => {
    setInitialFormValues({
      fullName: label.meta.fullName || "",
      labelName: label.name || "",
      email: label.meta.email || "",
      phone: label.meta.phone || "",
      youtube: label.meta.youtube || "",
      language: label.meta.language || "",
      aadharFront: label.meta.aadharFront || null,
      aadharBack: label.meta.aadharBack || null,
    });
    setEditMode(true);
    setEditingId(label.id);
    setShowAddModal(true);
    setShowViewModal(false);
  };

  /* ---------- Open View ---------- */
  const openView = (label) => {
    setSelectedLabel(label);
    setViewTab("details");
    setShowViewModal(true);
  };

  /* ---------- Delete ---------- */
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this label?")) return;
    setLabels((s) => s.filter((x) => x.id !== id));
    setShowViewModal(false);
  };

  /* ---------- On submit (Formik) ---------- */
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editMode && editingId) {
        // update
        setLabels((prev) =>
          prev.map((row) =>
            row.id === editingId
              ? {
                  ...row,
                  name: values.labelName || row.name,
                  meta: {
                    fullName: values.fullName || "",
                    email: values.email || "",
                    phone: values.phone || "",
                    youtube: values.youtube || "",
                    language: values.language || "",
                    aadharFront: values.aadharFront || row.meta.aadharFront,
                    aadharBack: values.aadharBack || row.meta.aadharBack,
                  },
                }
              : row
          )
        );
      } else {
        // add
        const createdIso = new Date().toISOString();
        const expiryIso = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString();

        const newLabel = {
          id: Date.now(),
          name: values.labelName || "Untitled Label",
          created: createdIso,
          expiry: expiryIso,
          status: "Active",
          meta: {
            fullName: values.fullName || "",
            email: values.email || "",
            phone: values.phone || "",
            youtube: values.youtube || "",
            language: values.language || "",
            aadharFront: values.aadharFront,
            aadharBack: values.aadharBack,
          },
        };
        setLabels((s) => [...s, newLabel]);
      }

      // reset + close
      resetForm();
      setShowAddModal(false);
      setEditMode(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05071a] text-white p-8">
      {/* hidden reference screenshots for environment transform */}
      <img src={refScreenshot1} alt="ref1" className="hidden" />
      <img src={refScreenshot2} alt="ref2" className="hidden" />
      <img src={refScreenshotA} alt="refA" className="hidden" />
      <img src={refScreenshotB} alt="refB" className="hidden" />
      <img src={refScreenshotC} alt="refC" className="hidden" />

      {/* Header */}
      <div className="flex justify-between mb-8">
        <h1 className="text-xl font-semibold">Labels</h1>
        <span className=" ">
          Home / <span className="text-sky-400">Labels</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-[#0f1b36] rounded-2xl p-8 border border-white/10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-medium">Manage Labels</h2>
          <button
            onClick={openAddModal}
            className="px-5 py-2 rounded-full text-white font-semibold"
            style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}
          >
            Add Label
          </button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 py-4 px-3 text-gray-10 border-b border-white/10 font-bold">
          <div className="col-span-4">Label Name</div>
          <div className="col-span-2">Created Date</div>
          <div className="col-span-2">Expire Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 flex justify-center">Action</div>
        </div>

        {/* Rows */}
        {labels.map((l) => {
          const st = STATUS_STYLES[l.status] || STATUS_STYLES.Active;
          return (
            <div
              key={l.id}
              className="grid grid-cols-12 py-4 px-3 items-center border-b border-white/5 hover:bg-white/5"
            >
              <div className="col-span-4">{l.name}</div>
              <div className="col-span-2">{formatDisplayDate(l.created)}</div>
              <div className="col-span-2">{formatDisplayDate(l.expiry)}</div>

              <div className="col-span-2">
                <span className="px-4 py-1 rounded-full text-sm font-semibold" style={{ background: st.bg, color: st.color }}>
                  {l.status}
                </span>
              </div>

              <div className="col-span-2 flex justify-center gap-3">
                <button
                  onClick={() => openView(l)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-sky-500 hover:bg-sky-500 group transition"
                  title="View"
                >
                  <Eye className="text-sky-400 group-hover:text-white" size={18} />
                </button>

                <button
                  onClick={() => openEdit(l)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-amber-400 hover:bg-amber-400 group transition"
                  title="Edit"
                >
                  <Edit3 className="text-amber-300 group-hover:text-white" size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------ Add / Edit Modal (Formik) ------------------ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto py-10">
          <div className="bg-[#0a1039] w-[920px] rounded-xl p-6 border border-white/10">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <h2 className="text-xl font-semibold">{editMode ? "Edit Label" : "Add Label"}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditMode(false);
                  setEditingId(null);
                  setInitialFormValues({ ...emptyValues });
                }}
              >
                <X className="text-gray-300 hover:text-white" />
              </button>
            </div>

            {/* Formik form with enableReinitialize so initialFormValues prefill on edit */}
            <Formik initialValues={initialFormValues} enableReinitialize validationSchema={LabelSchema} onSubmit={onSubmit}>
              {({ values, setFieldValue, isSubmitting, isValid }) => (
                <Form>
                  {/* Fixed aligned two-column form */}
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    {/* LEFT */}
                    <div>
                      <label className="text-sm text-gray-300">Full Name</label>
                      <Field name="fullName" placeholder="Full Name" className="w-full mt-1 bg-[#111a3b] border border-white/10 px-4 py-3 rounded-lg text-white" />
                      <ErrorMessage name="fullName" component="div" className="text-xs text-red-400 mt-1" />

                      <label className="text-sm text-gray-300 mt-4">Email</label>
                      <Field name="email" placeholder="label@example.com" className="w-full mt-1 bg-[#111a3b] border border-white/10 px-4 py-3 rounded-lg text-white" />
                      <ErrorMessage name="email" component="div" className="text-xs text-red-400 mt-1" />

                      <label className="text-sm text-gray-300 mt-4">YouTube Channel Link</label>
                      <Field name="youtube" placeholder="https://www.youtube.com/channel/..." className="w-full mt-1 bg-[#111a3b] border border-white/10 px-4 py-3 rounded-lg text-white" />
                      <ErrorMessage name="youtube" component="div" className="text-xs text-red-400 mt-1" />

                      {/* Aadhar Front - file input + preview under it */}
                      <label className="text-sm text-gray-300 mt-4 block">Aadhar - Front Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await readFileAsDataURL(file);
                          setFieldValue("aadharFront", dataUrl);
                        }}
                        className="mt-1 text-gray-300 file:bg-[#1c2b57] file:px-4 file:py-2 file:rounded-lg file:border-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">Optional. JPG/PNG</p>

                      {/* Preview directly under front input */}
                      <div className="mt-3 w-[150px] h-[115px] bg-gray-300 rounded-lg overflow-hidden">
                        <img src={values.aadharFront || placeholderImage} className="w-full h-full object-cover" alt="aadhar-front" />
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                      <label className="text-sm text-gray-300">Label Name</label>
                      <Field name="labelName" placeholder="Label Name" className="w-full mt-1 bg-[#111a3b] border border-white/10 px-4 py-3 rounded-lg text-white" />
                      <ErrorMessage name="labelName" component="div" className="text-xs text-red-400 mt-1" />

                      <label className="text-sm text-gray-300 mt-4">Phone Number</label>
                      <Field name="phone" placeholder="+91xxxxxxxxxx" className="w-full mt-1 bg-[#111a3b] border border-white/10 px-4 py-3 rounded-lg text-white" />
                      <ErrorMessage name="phone" component="div" className="text-xs text-red-400 mt-1" />

                      <label className="text-sm text-gray-300 mt-4">Song Language</label>
                      <Field name="language" placeholder="e.g., Hindi / English" className="w-full mt-1 bg-[#111a3b] border border-white/10 px-4 py-3 rounded-lg text-white" />
                      <ErrorMessage name="language" component="div" className="text-xs text-red-400 mt-1" />

                      {/* Aadhar Back - file input + preview under it */}
                      <label className="text-sm text-gray-300 mt-4 block">Aadhar - Back Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await readFileAsDataURL(file);
                          setFieldValue("aadharBack", dataUrl);
                        }}
                        className="mt-1 text-gray-300 file:bg-[#1c2b57] file:px-4 file:py-2 file:rounded-lg file:border-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">&nbsp;</p>

                      {/* Preview directly under back input */}
                      <div className="mt-3 w-[150px] h-[115px] bg-gray-300 rounded-lg overflow-hidden">
                        <img src={values.aadharBack || placeholderImage} className="w-full h-full object-cover" alt="aadhar-back" />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-4 mt-10 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditMode(false);
                        setEditingId(null);
                        setInitialFormValues({ ...emptyValues });
                      }}
                      className="px-6 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className={`px-6 py-2 rounded-full text-white font-semibold ${isSubmitting || !isValid ? "opacity-60 cursor-not-allowed" : ""}`}
                      style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}
                    >
                      {editMode ? "Save Changes" : "Submit Request"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* ------------------ View Modal (3 modes) ------------------ */}
      {showViewModal && selectedLabel && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto py-10">
          <div className="bg-[#0a1039] w-[920px] rounded-xl p-6 border border-white/10">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h2 className="text-xl font-semibold">View Label</h2>
              <div className="flex items-center gap-3">
                {/* tabs */}
                <div className="flex bg-white/5 rounded-full p-1">
                  <button
                    onClick={() => setViewTab("details")}
                    className={`px-3 py-1 rounded-full ${viewTab === "details" ? "bg-[#111a3b] text-white" : "text-gray-300"}`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setViewTab("form")}
                    className={`px-3 py-1 rounded-full ${viewTab === "form" ? "bg-[#111a3b] text-white" : "text-gray-300"}`}
                  >
                    Form View
                  </button>
                  <button
                    onClick={() => setViewTab("images")}
                    className={`px-3 py-1 rounded-full ${viewTab === "images" ? "bg-[#111a3b] text-white" : "text-gray-300"}`}
                  >
                    Images
                  </button>
                </div>

                <button onClick={() => setShowViewModal(false)}>
                  <X className="text-gray-300 hover:text-white" />
                </button>
              </div>
            </div>

            {/* DETAILS TAB (A) */}
            {viewTab === "details" && (
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-300">Full Name</p>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.fullName || "-"}</div>

                  <p className="text-sm text-gray-300 mt-4">Email</p>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.email || "-"}</div>

                  <p className="text-sm text-gray-300 mt-4">YouTube</p>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1 break-all">{selectedLabel.meta.youtube || "-"}</div>

                  <p className="text-sm text-gray-300 mt-4">Aadhar Front</p>
                  <img src={selectedLabel.meta.aadharFront || placeholderImage} className="w-40 h-24 rounded-lg object-cover mt-2" alt="aadhar-front" />
                </div>

                <div>
                  <p className="text-sm text-gray-300">Label Name</p>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.name}</div>

                  <p className="text-sm text-gray-300 mt-4">Phone</p>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.phone || "-"}</div>

                  <p className="text-sm text-gray-300 mt-4">Language</p>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.language || "-"}</div>

                  <p className="text-sm text-gray-300 mt-4">Aadhar Back</p>
                  <img src={selectedLabel.meta.aadharBack || placeholderImage} className="w-40 h-24 rounded-lg object-cover mt-2" alt="aadhar-back" />
                </div>
              </div>
            )}

            {/* FORM VIEW TAB (B) - read-only fields styled like form */}
            {viewTab === "form" && (
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-300">Full Name</label>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.fullName || "-"}</div>

                  <label className="text-sm text-gray-300 mt-4">Email</label>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.email || "-"}</div>

                  <label className="text-sm text-gray-300 mt-4">YouTube Channel</label>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1 break-all">{selectedLabel.meta.youtube || "-"}</div>

                  <label className="text-sm text-gray-300 mt-4">Aadhar Front</label>
                  <div className="mt-2">
                    <img src={selectedLabel.meta.aadharFront || placeholderImage} className="w-48 h-28 rounded-lg object-cover" alt="aadhar-front" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-300">Label Name</label>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.name}</div>

                  <label className="text-sm text-gray-300 mt-4">Phone</label>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.phone || "-"}</div>

                  <label className="text-sm text-gray-300 mt-4">Song Language</label>
                  <div className="p-3 bg-[#111a3b] border border-white/10 rounded-lg mt-1">{selectedLabel.meta.language || "-"}</div>

                  <label className="text-sm text-gray-300 mt-4">Aadhar Back</label>
                  <div className="mt-2">
                    <img src={selectedLabel.meta.aadharBack || placeholderImage} className="w-48 h-28 rounded-lg object-cover" alt="aadhar-back" />
                  </div>
                </div>
              </div>
            )}

            {/* IMAGES TAB (C) - large image focus */}
            {viewTab === "images" && (
              <div className="mt-6 grid grid-cols-2 gap-6 items-start">
                <div>
                  <p className="text-sm text-gray-300">Aadhar Front (Large)</p>
                  <div className="mt-2 bg-[#0b1730] p-3 rounded-lg border border-white/5">
                    <img src={selectedLabel.meta.aadharFront || placeholderImage} className="w-full h-[360px] object-contain rounded" alt="aadhar-front-large" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Aadhar Back (Large)</p>
                  <div className="mt-2 bg-[#0b1730] p-3 rounded-lg border border-white/5">
                    <img src={selectedLabel.meta.aadharBack || placeholderImage} className="w-full h-[360px] object-contain rounded" alt="aadhar-back-large" />
                  </div>
                </div>
              </div>
            )}

            {/* Footer with Edit + Delete + Close */}
            <div className="flex justify-end gap-3 mt-8 border-t border-white/10 pt-4">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white">Close</button>

              <button onClick={() => openEdit(selectedLabel)} className="px-6 py-2 rounded-full flex items-center gap-2 bg-amber-500/10 border border-amber-400 text-amber-300 hover:bg-amber-400">
                <Edit3 size={14} /> Edit
              </button>

              <button onClick={() => handleDelete(selectedLabel.id)} className="px-6 py-2 rounded-full text-white font-semibold" style={{ background: "linear-gradient(90deg,#FF4B4B,#CC0000)" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
