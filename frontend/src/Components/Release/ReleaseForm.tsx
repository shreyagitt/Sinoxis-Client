import React, { useState, useEffect } from "react";
import { Release } from "../../pages/Release";
import { X, Upload } from "lucide-react";

interface Props {
  initial: Release | null;
  onCancel: () => void;
  onCreate: (fd: FormData) => void;
  onUpdate: (id: string, fd: FormData) => void;
}

const ReleaseForm: React.FC<Props> = ({ initial, onCancel, onCreate, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [remarks, setRemarks] = useState("");

  const [cover, setCover] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setSubtitle(initial.subtitle || "");
      setRemarks(initial.remarks || "");
    } else {
      setTitle("");
      setSubtitle("");
      setRemarks("");
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("subtitle", subtitle);
    fd.append("remarks", remarks);

    if (cover) fd.append("coverImage", cover);
    if (audio) fd.append("audioFile", audio);

    if (initial) onUpdate(initial._id, fd);
    else onCreate(fd);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {initial ? "Edit Release" : "Create New Release"}
          </h2>
          <button onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            required
            placeholder="Title"
            className="border rounded px-3 py-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Subtitle"
            className="border rounded px-3 py-2 w-full"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <textarea
            placeholder="Remarks"
            className="border rounded px-3 py-2 w-full h-24"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <Upload size={18} />
            Upload Cover Image
            <input hidden type="file" onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Upload size={18} />
            Upload Audio File
            <input hidden type="file" onChange={(e) => setAudio(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            {initial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReleaseForm;
