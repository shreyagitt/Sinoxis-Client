import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";

const EditArtistSchema = Yup.object({
  name: Yup.string().required("Required"),
  genre: Yup.string().nullable(),
  bio: Yup.string().nullable(),
  spotify: Yup.string().url("Invalid URL").nullable(),
  instagram: Yup.string().url("Invalid URL").nullable(),
  status: Yup.string().oneOf(["Active", "Inactive"]).required(),
});

const EditArtistModal = ({ open, onClose, artist, onSave }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (artist) {
      setPreview(artist.artistImage || "https://placehold.co/200");
    }
  }, [artist]);

  if (!open || !artist) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-lg font-semibold border-b pb-3 mb-6">
          Edit Artist Profile
        </h2>

        <Formik
          initialValues={{
            name: artist.name,
            genre: artist.genre,
            followers: artist.followers,
            bio: artist.bio || "",
            spotify: artist.spotify || "",
            instagram: artist.instagram || "",
            status: artist.status || "Active",
            artistImage: null,
          }}
          validationSchema={EditArtistSchema}
          onSubmit={(values) => {
            const payload = {
              ...artist,
              ...values,
              artistImage: values.artistImage, // file
            };
            onSave(payload); // send back to parent
          }}
        >
          {({ setFieldValue }) => (
            <Form className="grid grid-cols-3 gap-8">

              {/* LEFT - IMAGE */}
              <div className="col-span-1 text-center border-r pr-6">
                <img
                  src={preview}
                  className="w-36 h-36 rounded-full object-cover mx-auto mb-4"
                />

                <label className="border px-4 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-100 inline-block">
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                        setFieldValue("artistImage", file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* RIGHT - FORM FIELDS */}
              <div className="col-span-2 space-y-4">

                <FieldGroup label="Name" name="name" />
                <FieldGroup label="Genre" name="genre" />

                <div>
                  <label className="text-sm font-medium">Followers</label>
                  <Field
                    name="followers"
                    readOnly
                    className="w-full border bg-gray-100 text-gray-600 rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <FieldGroup as="textarea" label="Bio" name="bio" rows="3" />

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Spotify URL" name="spotify" />
                  <FieldGroup label="Instagram URL" name="instagram" />
                </div>

                {/* 🔥 STATUS DROPDOWN */}
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="p"
                    className="text-red-600 text-xs"
                  />
                </div>

              </div>

              {/* FOOTER */}
              <div className="col-span-3 flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
};

export default EditArtistModal;

const FieldGroup = ({ label, name, as = "input", ...rest }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <Field
      as={as}
      name={name}
      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
      {...rest}
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-600 text-xs"
    />
  </div>
);
