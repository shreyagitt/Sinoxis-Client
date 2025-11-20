import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddArtistSchema = Yup.object({
  artistName: Yup.string().required("Artist name is required"),
  artistGenre: Yup.string().nullable(),
  artistLabel: Yup.string().nullable(),
  artistFollowers: Yup.number()
    .typeError("Followers must be a number")
    .positive("Value must be positive")
    .nullable(),
  artistBio: Yup.string().nullable(),
  spotifyUrl: Yup.string().url("Invalid URL").nullable(),
  instagramUrl: Yup.string().url("Invalid URL").nullable(),
});

const AddArtist = ({ open, onClose, onSubmit }) => {
  const [preview, setPreview] = useState(
    "https://placehold.co/160x160/0d6efd/ffffff?text=Artist"
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Add Artist
        </h2>

        <Formik
          initialValues={{
            artistName: "",
            artistGenre: "",
            artistLabel: "",
            artistFollowers: "",
            artistBio: "",
            spotifyUrl: "",
            instagramUrl: "",
            artistStatus: "Active",
            artistPhoto: null,
          }}
          validationSchema={AddArtistSchema}
          onSubmit={(values) => {
            const payload = {
              name: values.artistName,
              genre: values.artistGenre,
              label: values.artistLabel,
              followers: values.artistFollowers,
              bio: values.artistBio,
              spotify: values.spotifyUrl,
              instagram: values.instagramUrl,
              status: values.artistStatus,
              artistImage: values.artistPhoto, // image file
            };

            onSubmit(payload);
            onClose();
          }}
        >
          {({ setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* IMAGE UPLOAD */}
              <div className="text-center">
                <img
                  src={preview}
                  className="rounded-full mx-auto mb-3 w-36 h-36 object-cover"
                />

                <label className="text-sm border px-3 py-2 rounded cursor-pointer hover:bg-gray-50">
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue("artistPhoto", file);
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="block text-sm text-red-600 mt-2"
                  onClick={() => {
                    setPreview(
                      "https://placehold.co/160x160/0d6efd/ffffff?text=Artist"
                    );
                    setFieldValue("artistPhoto", null);
                  }}
                >
                  Remove
                </button>
              </div>

              {/* FORM INPUTS */}
              <div className="md:col-span-2 space-y-4">

                <FieldGroup label="Artist Name *" name="artistName" />

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Genre" name="artistGenre" />
                  <FieldGroup label="Label" name="artistLabel" />
                </div>

                <FieldGroup
                  label="Followers"
                  name="artistFollowers"
                  placeholder="12345"
                />

                <FieldGroup
                  label="Bio"
                  name="artistBio"
                  as="textarea"
                  placeholder="Artist bio"
                />

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Spotify URL" name="spotifyUrl" />
                  <FieldGroup label="Instagram URL" name="instagramUrl" />
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Field
                    as="select"
                    name="artistStatus"
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Field>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-md"
                    onClick={onClose}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                  >
                    Add Artist
                  </button>
                </div>

              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddArtist;

const FieldGroup = ({ label, name, placeholder, as = "input" }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <Field
      as={as}
      name={name}
      placeholder={placeholder}
      className="w-full border rounded-md px-3 py-2 mt-1"
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-600 text-xs"
    />
  </div>
);
