// src/components/Release/ReleaseTable.tsx
import React from "react";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Release } from "../../pages/Release";

type Props = {
  releases: Release[];
  onEdit: (r: Release) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, status: Release["status"]) => void;
};

const ReleaseTable: React.FC<Props> = ({ releases, onEdit, onDelete, onChangeStatus }) => {
  return (
    <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Artist</th>
            <th className="py-3 px-4 text-left">Label</th>
            <th className="py-3 px-4 text-left">Release Date</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {releases.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                No releases found.
              </td>
            </tr>
          ) : (
            releases.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{r.title}</td>
                <td className="py-3 px-4">{r.artist}</td>
                <td className="py-3 px-4">{r.label || "—"}</td>
                <td className="py-3 px-4">{r.releaseDate || "—"}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : r.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : r.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : r.status === "Unfinished"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-center space-x-2">
                  <button onClick={() => onEdit(r)} title="Edit" className="p-2 rounded hover:bg-gray-100">
                    <Edit size={16} />
                  </button>

                  <button onClick={() => onChangeStatus(r.id, "Approved")} title="Approve" className="p-2 rounded hover:bg-gray-100 text-green-600">
                    <CheckCircle size={16} />
                  </button>

                  <button onClick={() => onChangeStatus(r.id, "Rejected")} title="Reject" className="p-2 rounded hover:bg-gray-100 text-red-600">
                    <XCircle size={16} />
                  </button>

                  <button onClick={() => onDelete(r.id)} title="Delete" className="p-2 rounded hover:bg-gray-100 text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReleaseTable;
