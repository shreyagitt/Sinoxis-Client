import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Release } from "../../pages/ReleaseTypes";

interface Props {
  releases: Release[];
  onEdit: (r: Release) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: Release["status"]) => void;
}

const ReleaseTable: React.FC<Props> = ({ releases, onEdit, onDelete, onChangeStatus }) => {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="py-3 px-4 text-left">Cover</th>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Artist</th>
            <th className="py-3 px-4 text-left">Label</th>
            <th className="py-3 px-4 text-left">ISRC</th>
            <th className="py-3 px-4 text-left">UPC</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {releases.length === 0 && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-gray-500">No releases found.</td>
            </tr>
          )}

          {releases.map((r) => (
            <tr key={r._id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">
                {r.cover ? (
                  <img src={r.cover} className="w-12 h-12 rounded object-cover border" />
                ) : "—"}
              </td>

              <td className="py-3 px-4 font-semibold">{r.title}</td>
              <td className="py-3 px-4">{r.artist}</td>
              <td className="py-3 px-4">{r.label || "—"}</td>
              <td className="py-3 px-4">{r.isrc || "—"}</td>
              <td className="py-3 px-4">{r.upc || "—"}</td>

              <td className="py-3 px-4">
                <select
                  value={r.status}
                  onChange={(e) => onChangeStatus(r._id, e.target.value as Release["status"])}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Unfinished">Unfinished</option>
                  <option value="Action Required">Action Required</option>
                </select>
              </td>

              <td className="py-3 px-4 flex gap-3 justify-center">
                <button onClick={() => onEdit(r)} className="text-blue-600"><Edit size={16} /></button>
                <button onClick={() => onDelete(r._id)} className="text-red-600"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReleaseTable;
