// src/pages/Labels.jsx
import React, { useState } from "react";
import { Eye, X, Edit3 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
  language: Yup.string().required("Song language is required"),
  aadharFront: Yup.mixed().nullable(),
  aadharBack: Yup.mixed().nullable(),
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

  // Theme adaptive vars
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-md";

  const tableText = theme === "dark" ? "text-white" : "text-[#020726]";
  const headerSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const inputBg =
    theme === "dark"
      ? "bg-[#111a3b] border-white/10 text-white placeholder-gray-400"
      : "bg-gray-100 border-gray-300 text-[#020726] placeholder-gray-500";

  // Demo data
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
        youtube: "https://youtube.com/universal",
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
  ]);

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [viewTab, setViewTab] = useState("details");

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

  const [initialFormValues, setInitialFormValues] = useState({ ...emptyValues });

  // Open Add Modal
  const openAddModal = () => {
    setInitialFormValues({ ...emptyValues });
    setEditMode(false);
    setEditingId(null);
    setShowAddModal(true);
  };

  // Open Edit
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
  };

  // Open View
  const openView = (label) => {
    setSelectedLabel(label);
    setViewTab("details");
    setShowViewModal(true);
  };

  // Delete
  const handleDelete = (id) => {
    if (!confirm("Delete this label?")) return;
    setLabels((prev) => prev.filter((l) => l.id !== id));
    setShowViewModal(false);
  };

  // Submit
  const onSubmit = async (values, { resetForm }) => {
    if (editMode) {
      setLabels((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                name: values.labelName,
                meta: { ...values },
              }
            : row
        )
      );
    } else {
      const createdIso = new Date().toISOString();
      const expiryIso = new Date(
        new Date().setFullYear(new Date().getFullYear() + 5)
      ).toISOString();

      setLabels((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: values.labelName,
          created: createdIso,
          expiry: expiryIso,
          status: "Active",
          meta: { ...values },
        },
      ]);
    }

    resetForm();
    setShowAddModal(false);
    setEditMode(false);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-all duration-300 ${pageBg}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Labels</h1>
        <p className={`text-sm ${headerSecondary}`}>Home / <span className="text-[#29B6F6]">Labels</span></p>
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
        <div className={`hidden md:grid grid-cols-12 py-3 px-2 font-semibold border-b ${theme === "dark" ? "border-white/10 text-gray-300" : "border-gray-200 text-gray-700"}`}>
          <div className="col-span-4">Label Name</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Expires</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        {/* Rows: on small screens become stacked cards */}
        <div className="mt-3 space-y-3">
          {labels.map((l) => {
            const st = STATUS_STYLES(theme)[l.status];
            return (
              <div
                key={l.id}
                className={`bg-transparent rounded-lg overflow-hidden ${theme === "dark" ? "hover:bg-white/4" : "hover:bg-gray-50"} border ${theme === "dark" ? "border-white/5" : "border-gray-200"}`}
              >
                {/* MD+ grid row */}
                <div className="hidden md:grid grid-cols-12 items-center py-4 px-3">
                  <div className="col-span-4">{l.name}</div>
                  <div className="col-span-2">{formatDisplayDate(l.created)}</div>
                  <div className="col-span-2">{formatDisplayDate(l.expiry)}</div>
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
                    <button
                      onClick={() => openView(l)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${theme === "dark" ? "border-sky-500 hover:bg-sky-500/10" : "border-sky-400 hover:bg-sky-100"}`}
                      title="View"
                    >
                      <Eye size={18} className={theme === "dark" ? "text-sky-400" : "text-sky-600"} />
                    </button>

                    <button
                      onClick={() => openEdit(l)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${theme === "dark" ? "border-amber-400 hover:bg-amber-400/10" : "border-amber-500 hover:bg-amber-100"}`}
                      title="Edit"
                    >
                      <Edit3 size={16} className={theme === "dark" ? "text-amber-300" : "text-amber-700"} />
                    </button>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="md:hidden p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-medium">{l.name}</p>
                      <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Created: {formatDisplayDate(l.created)}</p>
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
                        <button
                          onClick={() => openView(l)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${theme === "dark" ? "border-sky-500 hover:bg-sky-500/10" : "border-sky-400 hover:bg-sky-100"}`}
                          title="View"
                        >
                          <Eye size={16} className={theme === "dark" ? "text-sky-400" : "text-sky-600"} />
                        </button>

                        <button
                          onClick={() => openEdit(l)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${theme === "dark" ? "border-amber-400 hover:bg-amber-400/10" : "border-amber-500 hover:bg-amber-100"}`}
                          title="Edit"
                        >
                          <Edit3 size={14} className={theme === "dark" ? "text-amber-300" : "text-amber-700"} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Expires: {formatDisplayDate(l.expiry)}</p>
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
            onSubmit={onSubmit}
            initialFormValues={initialFormValues}
            inputBg={inputBg}
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
            onEdit={() => openEdit(selectedLabel)}
            onDelete={() => handleDelete(selectedLabel.id)}
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
}) {
  const modalBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-xl";

  return (
    <div className={`w-full max-w-2xl rounded-xl p-4 sm:p-6 border ${modalBg} mx-auto`}>
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
                <FieldBox
                  theme={theme}
                  label="Full Name"
                  name="fullName"
                  placeholder="Full Name"
                  inputBg={inputBg}
                />

                <FieldBox
                  theme={theme}
                  label="Email"
                  name="email"
                  placeholder="label@example.com"
                  inputBg={inputBg}
                />

                <FieldBox
                  theme={theme}
                  label="YouTube"
                  name="youtube"
                  placeholder="YouTube link"
                  inputBg={inputBg}
                />

                {/* Aadhar Front */}
                <FileUploadPreview
                  theme={theme}
                  label="Aadhar - Front Photo"
                  value={values.aadharFront}
                  onChange={async (file) => {
                    const dataUrl = await readFileAsDataURL(file);
                    setFieldValue("aadharFront", dataUrl);
                  }}
                />
              </div>

              {/* RIGHT */}
              <div className="space-y-3">
                <FieldBox
                  theme={theme}
                  label="Label Name"
                  name="labelName"
                  placeholder="Label Name"
                  inputBg={inputBg}
                />

                <FieldBox
                  theme={theme}
                  label="Phone Number"
                  name="phone"
                  placeholder="XXXXXXXXXX"
                  inputBg={inputBg}
                />

                <FieldBox
                  theme={theme}
                  label="Language"
                  name="language"
                  placeholder="Hindi / English"
                  inputBg={inputBg}
                />

                {/* Aadhar Back */}
                <FileUploadPreview
                  theme={theme}
                  label="Aadhar - Back Photo"
                  value={values.aadharBack}
                  onChange={async (file) => {
                    const dataUrl = await readFileAsDataURL(file);
                    setFieldValue("aadharBack", dataUrl);
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-300/10">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-full ${theme === "dark" ? "border border-white/20 text-gray-300 hover:bg-white/10" : "border border-gray-300 text-[#020726] hover:bg-gray-100"}`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[#29B6F6] to-[#0288D1]"
              >
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
function ViewModal({
  theme,
  selectedLabel,
  viewTab,
  setViewTab,
  onClose,
  onEdit,
  onDelete,
}) {
  const modalBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-200 shadow-xl";

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
      {viewTab === "details" && (
        <DetailsTab selectedLabel={selectedLabel} theme={theme} />
      )}

      {/* FORM VIEW */}
      {viewTab === "form" && (
        <FormTab selectedLabel={selectedLabel} theme={theme} />
      )}

      {/* IMAGES */}
      {viewTab === "images" && (
        <ImagesTab selectedLabel={selectedLabel} theme={theme} />
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-300/10">
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-full ${theme === "dark" ? "border border-white/20 text-gray-300 hover:bg-white/10" : "border border-gray-300 text-[#020726] hover:bg-gray-100"}`}
        >
          Close
        </button>

        <button
          onClick={onEdit}
          className="px-4 py-2 rounded-full flex items-center gap-2 bg-amber-500/10 border border-amber-400 text-amber-600"
        >
          <Edit3 size={14} /> Edit
        </button>

        <button
          onClick={onDelete}
          className="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-red-500 to-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------------------- COMPONENTS ---------------------- */

function FieldBox({ theme, label, name, placeholder, inputBg }) {
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";

  return (
    <div>
      <label className={`text-sm font-semibold ${labelColor}`}>{label}</label>
      <Field
        name={name}
        placeholder={placeholder}
        className={`w-full mt-1 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#29B6F6] ${inputBg}`}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 mt-1"
      />
    </div>
  );
}

function FileUploadPreview({ theme, label, value, onChange }) {
  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";

  return (
    <div className="mt-2">
      <label className={`text-sm font-semibold ${labelColor}`}>{label}</label>

      <input
        type="file"
        accept="image/*"
        className={`mt-2 text-sm block w-full text-left ${theme === "dark" ? "text-gray-300 file:bg-[#1c2b57]" : "text-[#020726] file:bg-gray-300"} file:px-3 file:py-1 file:rounded-md`}
        onChange={(e) => onChange(e.target?.files?.[0])}
      />

      <div className="mt-2 w-full max-w-[240px] h-[140px] bg-gray-200 rounded-lg overflow-hidden border">
        <img
          src={value || placeholderImage}
          className="w-full h-full object-cover"
          alt="preview"
        />
      </div>
    </div>
  );
}

function Tabs({ theme, viewTab, setViewTab }) {
  return (
    <div
      className={`flex rounded-full p-1 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}
    >
      {["details", "form", "images"].map((t) => (
        <button
          key={t}
          onClick={() => setViewTab(t)}
          className={`px-3 py-1 rounded-full capitalize text-xs ${
            viewTab === t
              ? theme === "dark"
                ? "bg-[#111a3b] text-white"
                : "bg-white text-[#020726] shadow-sm"
              : theme === "dark"
              ? "text-gray-300"
              : "text-gray-600"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* DETAILS TAB */
function DetailsTab({ selectedLabel, theme }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <DetailBox theme={theme} label="Full Name" value={selectedLabel.meta.fullName} />
      <DetailBox theme={theme} label="Label Name" value={selectedLabel.name} />

      <DetailBox theme={theme} label="Email" value={selectedLabel.meta.email} />
      <DetailBox theme={theme} label="Phone" value={selectedLabel.meta.phone} />

      <DetailBox theme={theme} label="Language" value={selectedLabel.meta.language} />

      <DetailImage theme={theme} label="Aadhar Front" src={selectedLabel.meta.aadharFront} />
      <DetailImage theme={theme} label="Aadhar Back" src={selectedLabel.meta.aadharBack} />
    </div>
  );
}

/* FORM VIEW (READONLY) */
function FormTab({ selectedLabel, theme }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <DetailBox theme={theme} label="Full Name" value={selectedLabel.meta.fullName} />
      <DetailBox theme={theme} label="Label Name" value={selectedLabel.name} />

      <DetailBox theme={theme} label="Email" value={selectedLabel.meta.email} />
      <DetailBox theme={theme} label="Phone" value={selectedLabel.meta.phone} />

      <DetailBox theme={theme} label="Language" value={selectedLabel.meta.language} />

      <DetailImageLarge theme={theme} label="Aadhar Front" src={selectedLabel.meta.aadharFront} />
      <DetailImageLarge theme={theme} label="Aadhar Back" src={selectedLabel.meta.aadharBack} />
    </div>
  );
}

/* IMAGES TAB */
function ImagesTab({ selectedLabel, theme }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <DetailImageLarge theme={theme} label="Aadhar Front" src={selectedLabel.meta.aadharFront} />
      <DetailImageLarge theme={theme} label="Aadhar Back" src={selectedLabel.meta.aadharBack} />
    </div>
  );
}

/* SMALL BOX */
function DetailBox({ theme, label, value }) {
  const card =
    theme === "dark"
      ? "bg-[#111a3b] border border-white/10 text-white"
      : "bg-gray-100 border border-gray-200 text-[#020726]";

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
    <div>
      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{label}</p>
      <img
        src={src || placeholderImage}
        className="w-full max-w-[220px] h-[120px] rounded-lg object-cover border mt-2"
        alt={label}
      />
    </div>
  );
}

/* LARGE IMAGE */
function DetailImageLarge({ theme, label, src }) {
  return (
    <div>
      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{label}</p>
      <div className="mt-2 rounded-lg border overflow-hidden bg-gray-50">
        <img
          src={src || placeholderImage}
          className="w-full h-[260px] object-contain bg-white"
          alt={label}
        />
      </div>
    </div>
  );
}

