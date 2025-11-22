// src/pages/Artists.jsx
import React, { useState } from "react";
import { Edit3, Eye, Trash2, X, Music, Disc, Play } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

/* Default avatar placeholder (your uploaded image) */
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
    setArtists([newArtist, ...artists]);
    resetForm();
    setShowAddModal(false);
    setSubmitting(false);
  };

  /* Edit */
  const handleEdit = (values, { resetForm, setSubmitting }) => {
    setArtists((prev) =>
      prev.map((a) =>
        a.id === values.id
          ? { ...a, ...values }
          : a
      )
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

  return (
    <div className="min-h-screen bg-[#020726] text-white p-8">

      {/* Page Header */}
      <div className="flex justify-between mb-8 px-2">
        <h1 className="text-3xl font-semibold">Artist</h1>
        <p className="text-sm text-gray-300">
          Home / <span className="text-[#29B6F6]">Artist</span>
        </p>
      </div>

      {/* CARD HEADER: Manage Artists + Add Artist (side-by-side) */}
      <div className="bg-[#0f1b36] rounded-2xl p-6 border border-white/10 shadow-sm mb-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Manage Artists</h2>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 rounded-full text-white font-semibold"
            style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}
          >
            Add Artist
          </button>
        </div>

        {/* ARTISTS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="py-4 px-4">Artist Name</th>
                <th className="py-4 px-4">Mobile</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Spotify</th>
                <th className="py-4 px-4">Apple Music</th>
                <th className="py-4 px-4">YouTube</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {artists.map((artist) => (
                <tr
                  key={artist.id}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="py-5 px-4">
                    <div className="text-base">{artist.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {formatDate(artist.createdAt)}
                    </div>
                  </td>

                  <td className="py-5 px-4">{artist.mobile || "-"}</td>
                  <td className="py-5 px-4">{artist.email || "-"}</td>

                  <td className="py-5 px-4">
                    {artist.spotify ? (
                      <a
                        href={artist.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sky-400 hover:text-white"
                      >
                        <Music size={16} /> Open
                      </a>
                    ) : "—"}
                  </td>

                  <td className="py-5 px-4">
                    {artist.apple ? (
                      <a
                        href={artist.apple}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sky-400 hover:text-white"
                      >
                        <Disc size={16} /> Open
                      </a>
                    ) : "—"}
                  </td>

                  <td className="py-5 px-4">
                    {artist.youtube ? (
                      <a
                        href={artist.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sky-400 hover:text-white"
                      >
                        <Play size={16} /> Open
                      </a>
                    ) : "—"}
                  </td>

                  <td className="py-5 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openView(artist)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-sky-500 hover:bg-sky-500 group"
                      >
                        <Eye size={16} className="text-sky-400 group-hover:text-white" />
                      </button>

                      <button
                        onClick={() => openEdit(artist)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-amber-400 hover:bg-amber-400 group"
                      >
                        <Edit3 size={16} className="text-amber-300 group-hover:text-white" />
                      </button>

                      <button
                        onClick={() => handleDelete(artist.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-red-500 hover:bg-red-500 group"
                      >
                        <Trash2 size={16} className="text-red-400 group-hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
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

      {/* ---------------- VIEW MODAL (V2 Layout) ---------------- */}
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-6 overflow-y-auto">
      {children}
    </div>
  );
}

/* ---------------- VIEW MODAL ---------------- */
function ViewModal({ artist, onClose, onEdit }) {
  return (
    <div className="bg-[#0a1039] w-[920px] rounded-xl p-6 border border-white/10">

      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <h2 className="text-xl font-semibold">View Artist</h2>
        <button onClick={onClose}>
          <X className="text-gray-300 hover:text-white" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">

        {/* LEFT */}
        <div className="col-span-12 md:col-span-4">
          <p className="text-sm mb-1">Avatar</p>
          <div className="w-[220px] h-[220px] bg-gray-700 border border-white/5 rounded-lg overflow-hidden">
            <img
              src={artist.avatar || defaultAvatar}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* RIGHT → Two column layout */}
        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-2 gap-4">

            <Detail label="Artist Name" value={artist.name} />
            <Detail label="Mobile" value={artist.mobile} />

            <Detail label="Email" value={artist.email} />
            <Detail label="Spotify" value={artist.spotify} />

            <Detail label="Apple Music" value={artist.apple} />
            <Detail label="YouTube" value={artist.youtube} />

          </div>
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white"
        >
          Close
        </button>

        <button
          onClick={onEdit}
          className="px-6 py-2 rounded-full bg-amber-500/10 border border-amber-400 text-amber-300 hover:bg-amber-400"
        >
          Edit
        </button>
      </div>

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-300">{label}</p>
      <div className="mt-1 p-3 bg-[#111a3b] border border-white/10 rounded break-all">
        {value || "-"}
      </div>
    </div>
  );
}

/* ---------------- ADD / EDIT MODAL ---------------- */
function AddEditModal({ title, onClose, initialData, onSubmit }) {
  return (
    <div className="bg-[#0a1039] w-[920px] rounded-xl p-6 border border-white/10">

      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button onClick={onClose}>
          <X className="text-gray-300 hover:text-white" />
        </button>
      </div>

      <div className="mt-4">
        <Formik
          initialValues={initialData}
          enableReinitialize
          validationSchema={ArtistSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-12 gap-6">

                {/* Avatar column */}
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm">Avatar</label>

                  <div className="mt-2 flex flex-col items-center">
                    <div className="w-[220px] h-[220px] bg-gray-700 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={values.avatar || defaultAvatar}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      className="mt-4 text-gray-300 file:bg-[#1c2b57] file:px-3 file:py-2 file:rounded-lg"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const data = await readFileAsDataURL(file);
                        setFieldValue("avatar", data);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setFieldValue("avatar", null)}
                      className="mt-3 px-3 py-1 border border-white/10 text-gray-300 hover:text-white rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="col-span-12 md:col-span-8">
                  <div className="grid grid-cols-2 gap-4">

                    <FormField name="name" label="Artist Name" placeholder="Artist name" />
                    <FormField name="mobile" label="Mobile No" placeholder="+91xxxxxxxxxx" />

                    <FormField name="email" label="Email" placeholder="artist@email.com" />
                    <FormField name="spotify" label="Spotify Link" placeholder="https://..." />

                    <FormField name="apple" label="Apple Music Link" placeholder="https://..." />
                    <FormField name="youtube" label="YouTube Link" placeholder="https://..." />

                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-4 mt-6 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full text-white font-semibold"
                  style={{ background: "linear-gradient(90deg,#00AEEF,#007BFF)" }}
                >
                  {title.includes("Edit") ? "Save Changes" : "Add Artist"}
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </div>

    </div>
  );
}

function FormField({ name, label, placeholder }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <Field
        name={name}
        placeholder={placeholder}
        className="w-full mt-1 bg-[#111a3b] border border-white/10 px-4 py-3 rounded-lg"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-400 mt-1"
      />
    </div>
  );
}
