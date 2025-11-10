import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";

const ReleaseSchema = Yup.object({
  title: Yup.string().required("Release title is required"),
  artist: Yup.string().required("Primary artist name is required"),
  date: Yup.string().required("Release date is required"),
  genre: Yup.string().required("Genre is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const CreateReleaseModal = ({ open, onClose, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
          <X size={22} />
        </button>

        <h1 className="text-xl font-semibold mb-6">Release Application Form</h1>

        <Formik
          initialValues={{
            title: "",
            artist: "",
            date: "",
            genre: "",
            tracks: "",
            releasedBefore: "",
            previousLinks: "",
            email: "",
            phone: "",
            notes: "",
          }}
          validationSchema={ReleaseSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
            onClose();
          }}
        >
          {({ values }) => (
            <Form className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup label="Release Title" name="title" placeholder="Enter release title" />
                <FieldGroup label="Primary Artist" name="artist" placeholder="Artist name" />
                <FieldGroup label="Release Date" name="date" type="date" />
                <FieldGroup label="Genre" name="genre" placeholder="e.g. Pop, EDM" />
              </div>

              <FieldGroup label="Track Preview Link" name="tracks" placeholder="SoundCloud / Drive Link" />

              {/* Radio */}
              <div>
                <label className="text-sm text-gray-700 block mb-1">Have you released music before?</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <Field type="radio" name="releasedBefore" value="yes" className="cursor-pointer" /> Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <Field type="radio" name="releasedBefore" value="no" className="cursor-pointer" /> No
                  </label>
                </div>
              </div>

              {values.releasedBefore === "yes" && (
                <FieldGroup label="Previous Release Links" name="previousLinks" placeholder="https://..." />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup label="Contact Email" name="email" placeholder="you@example.com" />
                <FieldGroup label="Contact Phone" name="phone" placeholder="+91 98765 43210" />
              </div>

              <FieldGroup label="Short Notes / Bio" name="notes" as="textarea" rows="3" />

              {/* Submit */}
              <div className="flex justify-end">
                <button type="submit" className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700">
                  Submit Release
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateReleaseModal;

// Reusable Input Component
const FieldGroup = ({ label, name, placeholder, type = "text", as = "input", rows }) => (
  <div>
    <label className="text-sm text-gray-700 mb-1 block">{label}</label>
    <Field
      name={name}
      type={type}
      as={as}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
    />
    <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1" />
  </div>
);
