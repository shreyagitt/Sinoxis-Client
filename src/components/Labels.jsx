// src/pages/Labels.jsx
import React, { useEffect, useState } from "react";
import { Eye, X, Edit3, Trash2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../components/Topbar";

// Placeholder image for Aadhar previews
const placeholderImage =
  "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg";

// Format date
function formatDisplayDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Status styles (light + dark)
const STATUS_STYLES = (theme) => ({
  Active: {
    bg: theme === "dark" ? "#22e788" : "#d1fae5",
    color: theme === "dark" ? "#073b1d" : "#065f46",
  },
  Pending: {
    bg: theme === "dark" ? "#ffd626" : "#fef3c7",
    color: theme === "dark" ? "#5b4600" : "#92400e",
  },
  Rejected: {
    bg: theme === "dark" ? "#ff2d2d" : "#fee2e2",
    color: theme === "dark" ? "#4d0000" : "#b91c1c",
  },
  Inactive: {
    bg: theme === "dark" ? "#4c8df6" : "#dbeafe",
    color: theme === "dark" ? "#001b4d" : "#1e40af",
  },
});

// Validation schema
const LabelSchema = Yup.object().shape({
  fullName: Yup.string().min(3).required("Full name is required"),
  labelName: Yup.string().min(3).required("Label name is required"),
  email: Yup.string().email().nullable(),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  youtube: Yup.string().url("Invalid URL").nullable(),
  language: Yup.string().required("Language is required"),
  // aadharFront/back are handled separately
});

// Utility to read file as DataURL
const readFileAsDataURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

export default function Labels() {
  const { theme } = useTheme();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Theme adaptive vars
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-md";

  const inputBg =
    theme === "dark"
      ? "bg-[#111a3b] border-white/10 text-white placeholder-gray-400"
      : "bg-gray-100 border-gray-300 text-[#020726] placeholder-gray-500";

  // State
  const [labels, setLabels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [viewTab, setViewTab] = useState("details");
  const [loading, setLoading] = useState(false);

  // For form previews & files
  const emptyValues = {
    fullName: "",
    labelName: "",
    email: "",
    phone: "",
    youtube: "",
    language: "",
    // preview URLs (either remote url or dataURL)
    aadharFrontPreview: null,
    aadharBackPreview: null,
    // actual File objects (not part of Formik initialValues because easier to manage here)
  };

  const [initialFormValues, setInitialFormValues] = useState({ ...emptyValues });
  const [aadharFrontFile, setAadharFrontFile] = useState(null);
  const [aadharBackFile, setAadharBackFile] = useState(null);

  // Token helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch list (client labels)
  const fetchLabels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/client/labels`, {
        headers: { ...getAuthHeaders() },
      });
      if (res.data?.success) {
        setLabels(res.data.data);
      } else {
        toast.error(res.data?.message || "Failed to fetch labels");
      }
    } catch (err) {
      console.error("fetchLabels error:", err);
      toast.error("Failed to fetch labels");
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setInitialFormValues({ ...emptyValues });
    setAadharFrontFile(null);
    setAadharBackFile(null);
    setEditMode(false);
    setEditingId(null);
    setShowAddModal(true);
  };

  // Open Edit: populate form with server data
  const openEdit = (label) => {
    setInitialFormValues({
      fullName: label.fullName || "",
      labelName: label.labelName || "",
      email: label.email || "",
      phone: label.phone || "",
      youtube: label.youtube || "",
      language: label.language || "",
      aadharFrontPreview: label.aadharFront || null,
      aadharBackPreview: label.aadharBack || null,
    });
    setAadharFrontFile(null);
    setAadharBackFile(null);
    setEditMode(true);
    setEditingId(label._id);
    setShowAddModal(true);
  };

  // Open View modal
  const openView = (label) => {
    setSelectedLabel(label);
    setViewTab("details");
    setShowViewModal(true);
  };

  // Delete label
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this label?")) return;
    try {
      const res = await axios.delete(`${baseUrl}/client/labels/${id}`, {
        headers: { ...getAuthHeaders() },
      });
      if (res.data?.success) {
        setLabels((prev) => prev.filter((l) => l._id !== id));
        toast.success("Label deleted");
        setShowViewModal(false);
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Failed to delete label");
    }
  };

  // Create / Update handler — uses multipart/form-data
  const handleCreateOrUpdate = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      // append all text fields
      formData.append("fullName", values.fullName ?? "");
      formData.append("labelName", values.labelName ?? "");
      formData.append("email", values.email ?? "");
      formData.append("phone", values.phone ?? "");
      formData.append("youtube", values.youtube ?? "");
      formData.append("language", values.language ?? "");

      // append files only if user selected new files
      if (aadharFrontFile) formData.append("aadharFront", aadharFrontFile);
      if (aadharBackFile) formData.append("aadharBack", aadharBackFile);

      let res;
      if (editMode && editingId) {
        res = await axios.put(`${baseUrl}/client/labels/${editingId}`, formData, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await axios.post(`${baseUrl}/client/labels`, formData, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (res.data?.success) {
        toast.success(editMode ? "Label updated" : "Label created");
        // refresh list
        await fetchLabels();
        setShowAddModal(false);
        resetForm();
        setAadharFrontFile(null);
        setAadharBackFile(null);
      } else {
        toast.error(res.data?.message || "Operation failed");
      }
    } catch (err) {
      console.error("save error:", err);
      toast.error("Failed to save label");
    }
  };

  // When file chosen in modal: set File and preview
  const handleAadharFrontChange = async (file, setFieldValue) => {
    if (!file) {
      setAadharFrontFile(null);
      setFieldValue("aadharFrontPreview", null);
      return;
    }
    setAadharFrontFile(file);
    const dataUrl = await readFileAsDataURL(file);
    setFieldValue("aadharFrontPreview", dataUrl);
  };

  const handleAadharBackChange = async (file, setFieldValue) => {
    if (!file) {
      setAadharBackFile(null);
      setFieldValue("aadharBackPreview", null);
      return;
    }
    setAadharBackFile(file);
    const dataUrl = await readFileAsDataURL(file);
    setFieldValue("aadharBackPreview", dataUrl);
  };

  // JSX
  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-all duration-300 ${pageBg}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Labels</h1>
        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Home / <span className="text-[#29B6F6]">Labels</span>
        </p>
      </div>

      <div className={`rounded-2xl p-4 sm:p-6 border ${cardBg}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-medium">Manage Labels</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="px-4 sm:px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[#29B6F6] to-[#0288D1]"
            >
              Add Label
            </button>
          </div>
        </div>

        {/* Table header for md+ */}
        <div
          className={`hidden md:grid grid-cols-12 py-3 px-2 font-semibold border-b ${
            theme === "dark" ? "border-white/10 text-gray-300" : "border-gray-200 text-gray-700"
          }`}
        >
          <div className="col-span-4">Label Name</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Expires</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        {/* Rows */}
        <div className="mt-3 space-y-3">
          {loading && <div className="p-4 text-center">Loading...</div>}

          {!loading &&
            labels.map((l) => {
              const st = STATUS_STYLES(theme)[l.status || "Pending"] || STATUS_STYLES(theme).Pending;
              return (
                <div
                  key={l._id}
                  className={`bg-transparent rounded-lg overflow-hidden ${
                    theme === "dark" ? "hover:bg-white/4" : "hover:bg-gray-50"
                  } border ${theme === "dark" ? "border-white/5" : "border-gray-200"}`}
                >
                  {/* MD+ grid row */}
                  <div className="hidden md:grid grid-cols-12 items-center py-4 px-3">
                    <div className="col-span-4">{l.labelName}</div>
                    <div className="col-span-2">{formatDisplayDate(l.createdAt)}</div>
                    <div className="col-span-2">{formatDisplayDate(l.expires)}</div>
                    <div className="col-span-2">
                      <span
                        className="px-4 py-1 rounded-full text-sm font-semibold"
                        style={{
                          background: st.bg,
                          color: st.color,
                        }}
                      >
                        {l.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center gap-3">
                      {/*<button
                        onClick={() => openView(l)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
                          theme === "dark" ? "border-sky-500 hover:bg-sky-500/10" : "border-sky-400 hover:bg-sky-100"
                        }`}
                        title="View"
                      >
                        <Eye size={18} className={theme === "dark" ? "text-sky-400" : "text-sky-600"} />
                      </button>*/}

                      {l.status !== "Active" && (
  <button
    onClick={() => openEdit(l)}
    className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
      theme === "dark"
        ? "border-amber-400 hover:bg-amber-400/10"
        : "border-amber-500 hover:bg-amber-100"
    }`}
    title="Edit"
  >
    <Edit3
      size={16}
      className={theme === "dark" ? "text-amber-300" : "text-amber-700"}
    />
  </button>
)}
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="md:hidden p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-medium">{l.labelName}</p>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                          Created: {formatDisplayDate(l.created)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={{
                            background: st.bg,
                            color: st.color,
                          }}
                        >
                          {l.status}
                        </span>

                        <div className="flex gap-2">
                          {/*<button
                            onClick={() => openView(l)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${
                              theme === "dark" ? "border-sky-500 hover:bg-sky-500/10" : "border-sky-400 hover:bg-sky-100"
                            }`}
                            title="View"
                          >
                            <Eye size={16} className={theme === "dark" ? "text-sky-400" : "text-sky-600"} />
                          </button>
*/}
                          {l.status !== "Active" && (
  <button
    onClick={() => openEdit(l)}
    className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${
      theme === "dark"
        ? "border-amber-400 hover:bg-amber-400/10"
        : "border-amber-500 hover:bg-amber-100"
    }`}
    title="Edit"
  >
    <Edit3
      size={14}
      className={theme === "dark" ? "text-amber-300" : "text-amber-700"}
    />
  </button>
)}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        Expires: {formatDisplayDate(l.expiry)}
                      </p>
                      <div className="text-xs text-gray-400">{/* reserved for any extra info */}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <ModalWrapper>
          <AddEditModal
            theme={theme}
            title={editMode ? "Edit Label" : "Add Label"}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleCreateOrUpdate}
            initialFormValues={initialFormValues}
            inputBg={inputBg}
            aadharFrontFile={aadharFrontFile}
            aadharBackFile={aadharBackFile}
            setAadharFrontFile={setAadharFrontFile}
            setAadharBackFile={setAadharBackFile}
            handleAadharFrontChange={handleAadharFrontChange}
            handleAadharBackChange={handleAadharBackChange}
          />
        </ModalWrapper>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedLabel && (
        <ModalWrapper>
          <ViewModal
            theme={theme}
            selectedLabel={selectedLabel}
            viewTab={viewTab}
            setViewTab={setViewTab}
            onClose={() => setShowViewModal(false)}
            onEdit={() => {
              openEdit(selectedLabel);
              setShowViewModal(false);
            }}
            onDelete={() => handleDelete(selectedLabel._id)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}

/* ========================= MODAL WRAPPER ========================= */
function ModalWrapper({ children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto py-8 px-4">
      {children}
    </div>
  );
}

/* ========================= ADD / EDIT MODAL ========================= */
function AddEditModal({
  theme,
  title,
  onClose,
  onSubmit,
  initialFormValues,
  inputBg,
  // file handlers
  handleAadharFrontChange,
  handleAadharBackChange,
}) {
  return (
    <div className={`w-full max-w-2xl rounded-xl p-4 sm:p-6 border ${theme === "dark" ? "bg-[#0a1039] border-white/10" : "bg-white border-gray-200 shadow-xl"} mx-auto`}>
      <div className="flex justify-between items-center border-b border-gray-300/10 pb-2">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="p-1">
          <X className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialFormValues}
        validationSchema={LabelSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* LEFT */}
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Full Name</label>
                  <Field name="fullName" placeholder="Full Name" className={`w-full mt-1 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`} />
                  <ErrorMessage name="fullName" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Email</label>
                  <Field name="email" placeholder="label@example.com" className={`w-full mt-1 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`} />
                  <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>YouTube</label>
                  <Field name="youtube" placeholder="YouTube link" className={`w-full mt-1 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`} />
                  <ErrorMessage name="youtube" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Aadhar Front */}
                <div className="mt-2">
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Aadhar - Front Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`mt-2 text-sm block w-full text-left ${theme === "dark" ? "text-gray-300 file:bg-[#1c2b57]" : "text-[#020726] file:bg-gray-300"} file:px-3 file:py-1 file:rounded-md`}
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      await handleAadharFrontChange(f, setFieldValue);
                    }}
                  />
                  <div className="mt-2 w-full max-w-[240px] h-[140px] bg-gray-200 rounded-lg overflow-hidden border">
                    <img src={values.aadharFrontPreview || placeholderImage} className="w-full h-full object-cover" alt="front preview" />
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Label Name</label>
                  <Field name="labelName" placeholder="Label Name" className={`w-full mt-1 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`} />
                  <ErrorMessage name="labelName" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Phone Number</label>
                  <Field name="phone" placeholder="XXXXXXXXXX" className={`w-full mt-1 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`} />
                  <ErrorMessage name="phone" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Language</label>
                  <Field name="language" placeholder="Hindi / English" className={`w-full mt-1 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`} />
                  <ErrorMessage name="language" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Aadhar Back */}
                <div className="mt-2">
                  <label className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-[#020726]"}`}>Aadhar - Back Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`mt-2 text-sm block w-full text-left ${theme === "dark" ? "text-gray-300 file:bg-[#1c2b57]" : "text-[#020726] file:bg-gray-300"} file:px-3 file:py-1 file:rounded-md`}
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      await handleAadharBackChange(f, setFieldValue);
                    }}
                  />
                  <div className="mt-2 w-full max-w-[240px] h-[140px] bg-gray-200 rounded-lg overflow-hidden border">
                    <img src={values.aadharBackPreview || placeholderImage} className="w-full h-full object-cover" alt="back preview" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-300/10">
              <button type="button" onClick={onClose} className={`px-4 py-2 rounded-full ${theme === "dark" ? "border border-white/20 text-gray-300 hover:bg-white/10" : "border border-gray-300 text-[#020726] hover:bg-gray-100"}`}>
                Cancel
              </button>

              <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[#29B6F6] to-[#0288D1]">
                {title.includes("Edit") ? "Save Changes" : "Submit Request"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

/* ========================= VIEW MODAL ========================= */
function ViewModal({ theme, selectedLabel, viewTab, setViewTab, onClose, onEdit, onDelete }) {
  const modalBg = theme === "dark" ? "bg-[#0a1039] border-white/10" : "bg-white border-gray-200 shadow-xl";

  return (
    <div className={`w-full max-w-2xl rounded-xl p-4 sm:p-6 border ${modalBg} mx-auto`}>
      <div className="flex justify-between items-center border-b border-gray-300/10 pb-2">
        <h2 className="text-lg sm:text-xl font-semibold">View Label</h2>

        <div className="flex items-center gap-2">
          <Tabs theme={theme} viewTab={viewTab} setViewTab={setViewTab} />
          <button onClick={onClose} className="p-1">
            <X className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>

      {/* DETAILS */}
      {viewTab === "details" && <DetailsTab selectedLabel={selectedLabel} theme={theme} />}

      {/* FORM VIEW */}
      {viewTab === "form" && <FormTab selectedLabel={selectedLabel} theme={theme} />}

      {/* IMAGES */}
      {viewTab === "images" && <ImagesTab selectedLabel={selectedLabel} theme={theme} />}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-300/10">
        <button onClick={onClose} className={`px-4 py-2 rounded-full ${theme === "dark" ? "border border-white/20 text-gray-300 hover:bg-white/10" : "border border-gray-300 text-[#020726] hover:bg-gray-100"}`}>
          Close
        </button>

        <button onClick={onEdit} className="px-4 py-2 rounded-full flex items-center gap-2 bg-amber-500/10 border border-amber-400 text-amber-600">
          <Edit3 size={14} /> Edit
        </button>

        <button onClick={onDelete} className="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-red-500 to-red-700">
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------------------- COMPONENTS ---------------------- */

function Tabs({ theme, viewTab, setViewTab }) {
  return (
    <div className={`flex rounded-full p-1 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}>
      {["details", "form", "images"].map((t) => (
        <button key={t} onClick={() => setViewTab(t)} className={`px-3 py-1 rounded-full capitalize text-xs ${viewTab === t ? (theme === "dark" ? "bg-[#111a3b] text-white" : "bg-white text-[#020726] shadow-sm") : (theme === "dark" ? "text-gray-300" : "text-gray-600")}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

/* DETAILS / FORM / IMAGES TABS */
function DetailsTab({ selectedLabel, theme }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      <DetailBox theme={theme} label="Full Name" value={selectedLabel.fullName} />
      <DetailBox theme={theme} label="Label Name" value={selectedLabel.labelName} />

      <DetailBox theme={theme} label="Email" value={selectedLabel.email} />
      <DetailBox theme={theme} label="Phone" value={selectedLabel.phone} />

      <DetailBox theme={theme} label="Language" value={selectedLabel.language} />

      {/* IMAGES */}
      <DetailImage theme={theme} label="Aadhar Front" src={selectedLabel.aadharFront} />
      <DetailImage theme={theme} label="Aadhar Back" src={selectedLabel.aadharBack} />

    </div>
  );
}


function FormTab({ selectedLabel, theme }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      <DetailBox theme={theme} label="Full Name" value={selectedLabel.fullName} />
      <DetailBox theme={theme} label="Label Name" value={selectedLabel.labelName} />

      <DetailBox theme={theme} label="Email" value={selectedLabel.email} />
      <DetailBox theme={theme} label="Phone" value={selectedLabel.phone} />

      <DetailBox theme={theme} label="Language" value={selectedLabel.language} />

      {/* IMAGES */}
      <DetailImageLarge theme={theme} label="Aadhar Front" src={selectedLabel.aadharFront} />
      <DetailImageLarge theme={theme} label="Aadhar Back" src={selectedLabel.aadharBack} />

    </div>
  );
}


function ImagesTab({ selectedLabel, theme }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <DetailImageLarge theme={theme} label="Aadhar Front" src={selectedLabel.aadharFront} />
      <DetailImageLarge theme={theme} label="Aadhar Back" src={selectedLabel.aadharBack} />
    </div>
  );
}


/* SMALL BOX */
function DetailBox({ theme, label, value }) {
  const card = theme === "dark" ? "bg-[#111a3b] border border-white/10 text-white" : "bg-gray-100 border border-gray-200 text-[#020726]";
  return (
    <div>
      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{label}</p>
      <div className={`p-3 rounded mt-1 ${card}`}>{value || "-"}</div>
    </div>
  );
}

/* SMALL IMAGE */
function DetailImage({ theme, label, src }) {
  return (
    <div className="flex flex-col">
      <p
        className={`text-sm ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {label}
      </p>

      <div
        className="
          mt-2 
          w-full 
          h-[180px] 
          bg-gray-200 
          rounded-lg 
          border 
          flex 
          justify-center 
          items-center 
          overflow-hidden
        "
      >
        <img
          src={src || placeholderImage}
          className="max-h-full max-w-full object-contain"
          alt={label}
        />
      </div>
    </div>
  );
}

/* LARGE IMAGE */
function DetailImageLarge({ theme, label, src }) {
  return (
    <div className="flex flex-col">
      <p
        className={`text-sm ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {label}
      </p>

      <div
        className="
          mt-2 
          w-full 
          h-[260px] 
          bg-gray-200 
          rounded-lg 
          border 
          flex 
          justify-center 
          items-center 
          overflow-hidden
        "
      >
        <img
          src={src || placeholderImage}
          className="max-h-full max-w-full object-contain"
          alt={label}
        />
      </div>
    </div>
  );
}
