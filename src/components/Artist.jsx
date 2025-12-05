// src/pages/Artists.jsx
import React, { useState } from "react";
import { Edit3, Eye, Trash2, X, Music, Disc, Play } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTheme } from "../components/Topbar";

/* Default avatar placeholder - keep or replace with your asset path */
const defaultAvatar = "/mnt/data/c0a07c60-5433-4b57-8c23-032a981b2c43.png";

/* Helper: file → dataURL */
const readFileAsDataURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

/* Date formatter */
function formatDate(d) {
  if (!d) return "-";
  const dd = new Date(d);
  return dd.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* Yup validation schema */
const ArtistSchema = Yup.object().shape({
  name: Yup.string().min(2).required("Artist name is required"),
  mobile: Yup.string().nullable(),
  email: Yup.string().nullable().email("Enter a valid email"),
  spotify: Yup.string().nullable().url("Invalid URL"),
  apple: Yup.string().nullable().url("Invalid URL"),
  youtube: Yup.string().nullable().url("Invalid URL"),
  avatar: Yup.string().nullable(),
});

export default function Artists() {
  const { theme } = useTheme();

  const [artists, setArtists] = useState([
    {
      id: 1,
      name: "Demo Artist A",
      mobile: "+910000000000",
      email: "xyz@gmail.com",
      spotify: "https://open.spotify.com/artist/demo",
      apple: "https://music.apple.com/artist/demo",
      youtube: "https://youtube.com/demo",
      avatar: null,
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      name: "Demo Artist B",
      mobile: "+910000000001",
      email: "xyz2@gmail.com",
      spotify: "",
      apple: "",
      youtube: "",
      avatar: null,
      createdAt: "2025-02-18",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  /* Add */
  const handleAdd = (values, { resetForm, setSubmitting }) => {
    const newArtist = {
      id: Date.now(),
      name: values.name,
      mobile: values.mobile || "",
      email: values.email || "",
      spotify: values.spotify || "",
      apple: values.apple || "",
      youtube: values.youtube || "",
      avatar: values.avatar || null,
      createdAt: new Date().toISOString(),
    };
    setArtists((prev) => [newArtist, ...prev]);
    resetForm();
    setShowAddModal(false);
    setSubmitting(false);
  };

  /* Edit */
  const handleEdit = (values, { resetForm, setSubmitting }) => {
    setArtists((prev) =>
      prev.map((a) => (a.id === values.id ? { ...a, ...values } : a))
    );
    resetForm();
    setShowEditModal(false);
    setSelectedArtist(null);
    setSubmitting(false);
  };

  /* Delete */
  const handleDelete = (id) => {
    if (!confirm("Delete this artist?")) return;
    setArtists((p) => p.filter((a) => a.id !== id));
  };

  const openView = (artist) => {
    setSelectedArtist(artist);
    setShowViewModal(true);
  };

  const openEdit = (artist) => {
    setSelectedArtist(artist);
    setShowEditModal(true);
  };

  /* THEME STYLES */
  const pageBg =
    theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const headerText = theme === "dark" ? "text-white" : "text-[#020726]";
  const subText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const tableRowHover = theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50";
  const buttonGradient =
    theme === "dark"
      ? { background: "linear-gradient(90deg,#00AEEF,#007BFF)" }
      : { background: "linear-gradient(90deg,#29B6F6,#0288D1)" };

  const iconTextColor = theme === "dark" ? "text-sky-400 group-hover:text-white" : "text-[#0288D1] hover:text-white";

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors ${pageBg}`}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className={`text-2xl md:text-3xl font-semibold ${headerText}`}>Artists</h1>
        <p className={`text-sm ${subText}`}>Home / <span className="text-[#29B6F6]">Artist</span></p>
      </div>

      {/* CARD: Manage Artists */}
      <div className={`${cardBg} rounded-2xl p-4 sm:p-6 shadow-sm mb-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className={`text-lg sm:text-xl font-medium ${headerText}`}>Manage Artists</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 sm:px-5 py-2 rounded-full text-white font-semibold"
              style={buttonGradient}
            >
              Add Artist
            </button>
          </div>
        </div>

        {/* Desktop table (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} text-left`}>
                <th className="py-3 px-4">Artist Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Spotify</th>
                <th className="py-3 px-4">Apple Music</th>
                <th className="py-3 px-4">YouTube</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {artists.map((artist) => (
                <tr
                  key={artist.id}
                  className={`${tableRowHover} border-t ${theme === "dark" ? "border-white/5" : "border-gray-100"}`}
                >
                  <td className="py-4 px-4 align-top">
                    <div className="text-base font-medium">{artist.name}</div>
                    <div className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      Created: {formatDate(artist.createdAt)}
                    </div>
                  </td>

                  <td className="py-4 px-4 align-top">{artist.mobile || "-"}</td>
                  <td className="py-4 px-4 align-top">{artist.email || "-"}</td>

                  <td className="py-4 px-4 align-top">
                    {artist.spotify ? (
                      <a href={artist.spotify} target="_blank" rel="noreferrer" className={`flex items-center gap-2 ${iconTextColor}`}>
                        <Music size={14} /> Open
                      </a>
                    ) : "—"}
                  </td>

                  <td className="py-4 px-4 align-top">
                    {artist.apple ? (
                      <a href={artist.apple} target="_blank" rel="noreferrer" className={`flex items-center gap-2 ${iconTextColor}`}>
                        <Disc size={14} /> Open
                      </a>
                    ) : "—"}
                  </td>

                  <td className="py-4 px-4 align-top">
                    {artist.youtube ? (
                      <a href={artist.youtube} target="_blank" rel="noreferrer" className={`flex items-center gap-2 ${iconTextColor}`}>
                        <Play size={14} /> Open
                      </a>
                    ) : "—"}
                  </td>

                  <td className="py-4 px-4 text-center align-top">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openView(artist)}
                        title="View"
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${theme === "dark" ? "border-sky-500" : "border-[#29B6F6]"} group`}
                      >
                        <Eye size={16} className={theme === "dark" ? "text-sky-400 group-hover:text-white" : "text-[#0288D1] group-hover:text-white"} />
                      </button>

                      <button
                        onClick={() => openEdit(artist)}
                        title="Edit"
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${theme === "dark" ? "border-amber-400" : "border-amber-400"} group`}
                      >
                        <Edit3 size={16} className={theme === "dark" ? "text-amber-300 group-hover:text-white" : "text-amber-500 group-hover:text-white"} />
                      </button>

                      <button
                        onClick={() => handleDelete(artist.id)}
                        title="Delete"
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${theme === "dark" ? "border-red-500" : "border-red-500"} group`}
                      >
                        <Trash2 size={16} className={theme === "dark" ? "text-red-400 group-hover:text-white" : "text-red-600 group-hover:text-white"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards (sm & xs) */}
        <div className="md:hidden mt-3 space-y-3">
          {artists.map((artist) => (
            <article
              key={artist.id}
              className={`rounded-lg p-4 border ${theme === "dark" ? "border-white/5 bg-transparent" : "border-gray-200 bg-transparent"} ${tableRowHover}`}
            >
              <div className="flex flex-col gap-3">
                {/* Top row: name + actions */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="text-base font-medium">{artist.name}</div>
                    <div className={`text-xs mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Created: {formatDate(artist.createdAt)}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openView(artist)}
                      title="View"
                      className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme === "dark" ? "border-sky-500" : "border-[#29B6F6]"} group`}
                    >
                      <Eye size={14} className={theme === "dark" ? "text-sky-400 group-hover:text-white" : "text-[#0288D1] group-hover:text-white"} />
                    </button>

                    <button
                      onClick={() => openEdit(artist)}
                      title="Edit"
                      className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme === "dark" ? "border-amber-400" : "border-amber-400"} group`}
                    >
                      <Edit3 size={14} className={theme === "dark" ? "text-amber-300 group-hover:text-white" : "text-amber-500 group-hover:text-white"} />
                    </button>

                    <button
                      onClick={() => handleDelete(artist.id)}
                      title="Delete"
                      className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme === "dark" ? "border-red-500" : "border-red-500"} group`}
                    >
                      <Trash2 size={14} className={theme === "dark" ? "text-red-400 group-hover:text-white" : "text-red-600 group-hover:text-white"} />
                    </button>
                  </div>
                </div>

                {/* Details rows: label left, value right (two-column feeling) */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-xs text-gray-500">Mobile</div>
                  <div className="text-xs">{artist.mobile || "-"}</div>

                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-xs break-all">{artist.email || "-"}</div>

                  <div className="text-xs text-gray-500">Spotify</div>
                  <div className="text-xs">
                    {artist.spotify ? (
                      <a href={artist.spotify} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${iconTextColor}`}>
                        <Music size={12} /> Open
                      </a>
                    ) : "—"}
                  </div>

                  <div className="text-xs text-gray-500">Apple</div>
                  <div className="text-xs">
                    {artist.apple ? (
                      <a href={artist.apple} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${iconTextColor}`}>
                        <Disc size={12} /> Open
                      </a>
                    ) : "—"}
                  </div>

                  <div className="text-xs text-gray-500">YouTube</div>
                  <div className="text-xs">
                    {artist.youtube ? (
                      <a href={artist.youtube} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${iconTextColor}`}>
                        <Play size={12} /> Open
                      </a>
                    ) : "—"}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ---------------- ADD MODAL ---------------- */}
      {showAddModal && (
        <ModalWrapper>
          <AddEditModal
            title="Add Artist"
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
            initialData={{
              name: "",
              mobile: "",
              email: "",
              spotify: "",
              apple: "",
              youtube: "",
              avatar: null,
            }}
          />
        </ModalWrapper>
      )}

      {/* ---------------- VIEW MODAL ---------------- */}
      {showViewModal && selectedArtist && (
        <ModalWrapper>
          <ViewModal
            artist={selectedArtist}
            onClose={() => setShowViewModal(false)}
            onEdit={() => {
              openEdit(selectedArtist);
              setShowViewModal(false);
            }}
          />
        </ModalWrapper>
      )}

      {/* ---------------- EDIT MODAL ---------------- */}
      {showEditModal && selectedArtist && (
        <ModalWrapper>
          <AddEditModal
            title="Edit Artist"
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
            initialData={selectedArtist}
          />
        </ModalWrapper>
      )}
    </div>
  );
}

/* ---------------- MODAL WRAPPER ---------------- */
function ModalWrapper({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 sm:p-6 overflow-y-auto">
      {children}
    </div>
  );
}

/* ---------------- VIEW MODAL ---------------- */
function ViewModal({ artist, onClose, onEdit }) {
  const { theme } = useTheme();
  const modalBg =
    theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const labelColor = theme === "dark" ? "text-gray-300" : "text-[#020726]";

  return (
    <div className={`${modalBg} w-full max-w-2xl rounded-xl p-4 sm:p-6 mx-auto`}>
      <div className="flex justify-between items-center border-b border-gray-300/10 pb-2">
        <h2 className="text-lg sm:text-xl font-semibold">View Artist</h2>
        <button onClick={onClose} className="p-1">
          <X className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* LEFT */}
        <div className="md:col-span-4 flex flex-col items-center">
          <p className={`text-sm mb-2 ${labelColor}`}>Avatar</p>
          <div className="w-full max-w-[220px] h-[220px] rounded-lg overflow-hidden">
            <div className={`${theme === "dark" ? "bg-gray-700 border border-white/5" : "bg-gray-100 border border-gray-200"} w-full h-full`}>
              <img src={artist.avatar || defaultAvatar} className="object-cover w-full h-full" alt="avatar" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Detail label="Artist Name" value={artist.name} />
            <Detail label="Mobile" value={artist.mobile} />
            <Detail label="Email" value={artist.email} />
            <Detail label="Spotify" value={artist.spotify} />
            <Detail label="Apple Music" value={artist.apple} />
            <Detail label="YouTube" value={artist.youtube} />
            <Detail label="Created" value={formatDate(artist.createdAt)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-300/10">
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-full border ${theme === "dark" ? "border-white/20 text-gray-300 hover:bg-white/5" : "border-gray-200 text-[#020726] hover:bg-gray-50"}`}
        >
          Close
        </button>

        <button
          onClick={onEdit}
          className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400 text-amber-500 hover:bg-amber-400/10"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  const { theme } = useTheme();
  const labelColor = theme === "dark" ? "text-sm text-gray-300" : "text-sm text-[#020726]";
  const boxBg = theme === "dark" ? "mt-1 p-3 bg-[#111a3b] border border-white/10 rounded break-all" : "mt-1 p-3 bg-gray-50 border border-gray-200 rounded break-all";

  return (
    <div>
      <p className={labelColor}>{label}</p>
      <div className={boxBg}>{value || "-"}</div>
    </div>
  );
}

/* ---------------- ADD / EDIT MODAL ---------------- */
function AddEditModal({ title, onClose, initialData, onSubmit }) {
  const { theme } = useTheme();

  const modalBg =
    theme === "dark" ? "bg-[#0a1039] border border-white/10" : "bg-white border border-gray-200";
  const labelColor = theme === "dark" ? "text-gray-300" : "text-[#020726]";

  return (
    <div className={`${modalBg} w-full max-w-2xl rounded-xl p-4 sm:p-6 mx-auto`}>
      <div className="flex justify-between items-center border-b border-gray-300/10 pb-2">
        <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="p-1">
          <X className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="mt-3">
        <Formik initialValues={initialData} enableReinitialize validationSchema={ArtistSchema} onSubmit={onSubmit}>
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Avatar column */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <label className={`text-sm mb-2 ${labelColor}`}>Avatar</label>

                  <div className={`w-full max-w-[220px] h-[220px] rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-700 border border-white/5" : "bg-gray-100 border border-gray-200"}`}>
                    <img src={values.avatar || defaultAvatar} alt="avatar" className="object-cover w-full h-full" />
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className={`mt-3 file:px-3 file:py-2 file:rounded-lg ${theme === "dark" ? "file:bg-[#1c2b57] file:text-white" : "file:bg-gray-100 file:text-[#020726]"} w-full text-sm`}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const data = await readFileAsDataURL(file);
                      setFieldValue("avatar", data);
                    }}
                  />

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setFieldValue("avatar", null)}
                      className={`px-3 py-1 rounded-md ${theme === "dark" ? "border border-white/10 text-gray-300 hover:text-white" : "border border-gray-200 text-[#020726] hover:text-white"}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Form fields column */}
                <div className="md:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField name="name" label="Artist Name" placeholder="Artist name" />
                    <FormField name="mobile" label="Mobile No" placeholder="+91xxxxxxxxxx" />
                    <FormField name="email" label="Email" placeholder="artist@email.com" />
                    <FormField name="spotify" label="Spotify Link" placeholder="https://..." />
                    <FormField name="apple" label="Apple Music Link" placeholder="https://..." />
                    <FormField name="youtube" label="YouTube Link" placeholder="https://..." />
                  </div>

                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-300/10">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`px-4 py-2 rounded-full border ${theme === "dark" ? "border-white/20 text-gray-300 hover:bg-white/5" : "border-gray-200 text-[#020726] hover:bg-gray-50"}`}
                    >
                      Cancel
                    </button>

                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full text-white font-semibold" style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}>
                      {title.includes("Edit") ? "Save Changes" : "Add Artist"}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function FormField({ name, label, placeholder }) {
  const { theme } = useTheme();
  const labelCls = theme === "dark" ? "text-sm text-gray-300" : "text-sm text-[#020726]";
  const inputCls =
    theme === "dark"
      ? "w-full mt-1 bg-[#111a3b] border border-white/10 px-3 py-2 rounded-lg text-white"
      : "w-full mt-1 bg-white border border-gray-200 px-3 py-2 rounded-lg text-[#020726]";

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <Field name={name} placeholder={placeholder} className={inputCls} />
      <ErrorMessage name={name} component="div" className="text-xs text-red-400 mt-1" />
    </div>
  );
}

