import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";

const EditArtistSchema = Yup.object({
  name: Yup.string().required("Required"),
  genre: Yup.string().nullable(),
  bio: Yup.string().nullable(),
  spotify: Yup.string().url("Invalid Spotify URL").nullable(),
  instagram: Yup.string().url("Invalid Instagram URL").nullable(),
});

const EditArtistModal = ({ open, onClose, artist, onSave }) => {
  const [preview, setPreview] = useState(artist?.photo);

  if (!open || !artist) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl p-6 relative">

        {/* Close Button */}
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
          }}
          validationSchema={EditArtistSchema}
          onSubmit={(values) => {
            onSave({ ...artist, ...values, photo: preview });
            onClose();
          }}
        >
          {({ setFieldValue }) => (
            <Form className="grid grid-cols-3 gap-8">

              {/* Left - Photo Section */}
              <div className="col-span-1 text-center border-r pr-6">
                <img
                  src={preview || "https://placehold.co/200x200"}
                  alt="Artist"
                  className="w-36 h-36 rounded-full object-cover mx-auto mb-4"
                />

                <label className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-100 inline-block">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>

                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 1:1, 300x300
                </p>
              </div>

              {/* Right - Form Fields */}
              <div className="col-span-2 space-y-4">

                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Field
                    name="name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Genre</label>
                  <Field
                    name="genre"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Followers</label>
                  <Field
                    name="followers"
                    readOnly
                    className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 mt-1 text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Field
                    as="textarea"
                    name="bio"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Spotify URL</label>
                    <Field
                      name="spotify"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Instagram URL</label>
                    <Field
                      name="instagram"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="col-span-3 flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border text-gray-600 border-gray-400 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
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

