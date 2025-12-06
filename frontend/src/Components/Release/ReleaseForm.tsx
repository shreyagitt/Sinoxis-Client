import React, { useState, useEffect } from "react";
import { Release } from "../../pages/ReleaseTypes";
import { X, Upload } from "lucide-react";

interface Props {
  initial: Release | null;
  onCancel: () => void;
  onCreate: (fd: FormData) => void;
  onUpdate: (id: string, fd: FormData) => void;
}

const ReleaseForm: React.FC<Props> = ({ initial, onCancel, onCreate, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [label, setLabel] = useState("");
  const [isrc, setIsrc] = useState("");
  const [upc, setUpc] = useState("");
  const [status, setStatus] = useState<Release["status"]>("Pending");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setArtist(initial.artist);
      setLabel(initial.label || "");
      setIsrc(initial.isrc || "");
      setUpc(initial.upc || "");
      setStatus(initial.status);
      setCoverPreview(initial.cover || "");
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append("title", title);
    fd.append("artist", artist);
    fd.append("label", label);
    fd.append("isrc", isrc);
    fd.append("upc", upc);
    fd.append("status", status);

    if (coverFile) fd.append("coverImage", coverFile);

    if (initial) onUpdate(initial._id, fd);
    else onCreate(fd);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">{initial ? "Edit Release" : "Create Release"}</h2>
          <button onClick={onCancel}><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="input" placeholder="Artist" value={artist} onChange={e => setArtist(e.target.value)} required />
          <input className="input" placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
          <input className="input" placeholder="ISRC" value={isrc} onChange={e => setIsrc(e.target.value)} />
          <input className="input" placeholder="UPC" value={upc} onChange={e => setUpc(e.target.value)} />

          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as Release["status"])}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Inactive">Inactive</option>
            <option value="Unfinished">Unfinished</option>
            <option value="Action Required">Action Required</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <Upload size={18} /> Upload Cover Image
            <input hidden type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0] || null;
              setCoverFile(file);
              if (file) setCoverPreview(URL.createObjectURL(file));
            }} />
          </label>

          {coverPreview && (
            <img src={coverPreview} className="w-32 h-32 object-cover rounded-md border" />
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{initial ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
};

export default ReleaseForm;

