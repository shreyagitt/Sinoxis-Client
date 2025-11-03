import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Search,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";

interface Applicant {
  id: number;
  name: string;
  artistName: string;
  email: string;
  phone: string;
  instagram: string;
  youtube: string;
  releasedBefore: boolean;
  links?: string;
  hearAboutUs: string;
  status: "Pending" | "Approved" | "Rejected";
}

const ApplyFormManagement: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(
    null
  );
  const itemsPerPage = 5;

  useEffect(() => {
    // Demo mock data
    const mockData: Applicant[] = [
      {
        id: 1,
        name: "John Doe",
        artistName: "JD Beats",
        email: "john@example.com",
        phone: "9876543210",
        instagram: "@jdbeats",
        youtube: "youtube.com/jdbeats",
        releasedBefore: true,
        links: "spotify.com/jdbeats",
        hearAboutUs: "YouTube",
        status: "Pending",
      },
      {
        id: 2,
        name: "Emma Watson",
        artistName: "EWat",
        email: "emma@example.com",
        phone: "9988776655",
        instagram: "@ewatmusic",
        youtube: "youtube.com/ewatmusic",
        releasedBefore: false,
        hearAboutUs: "Friend",
        status: "Approved",
      },
    ];
    setApplicants(mockData);
  }, []);

  // 🔍 Search filter
  const filtered = applicants.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.artistName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase())
  );

  // 🔢 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ✅ Approve
  const handleApprove = (id: number) => {
    Swal.fire({
      title: "Approve this application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
    }).then((res) => {
      if (res.isConfirmed) {
        setApplicants((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "Approved" } : a))
        );
        Swal.fire("Approved!", "Application approved successfully.", "success");
      }
    });
  };

  // ❌ Reject
  const handleReject = (id: number) => {
    Swal.fire({
      title: "Reject this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Reject",
    }).then((res) => {
      if (res.isConfirmed) {
        setApplicants((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a))
        );
        Swal.fire("Rejected!", "Application rejected successfully.", "info");
      }
    });
  };

  // 🗑 Delete
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Delete application?",
      text: "This cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
    }).then((res) => {
      if (res.isConfirmed) {
        setApplicants((prev) => prev.filter((a) => a.id !== id));
        Swal.fire("Deleted!", "Application removed.", "success");
      }
    });
  };

  // 👁️ View Details
  const handleView = (app: Applicant) => {
    Swal.fire({
      title: `<strong>${app.name} (${app.artistName})</strong>`,
      html: `
        <p><b>Email:</b> ${app.email}</p>
        <p><b>Phone:</b> ${app.phone}</p>
        <p><b>Instagram:</b> ${app.instagram}</p>
        <p><b>YouTube:</b> ${app.youtube}</p>
        <p><b>Released Before:</b> ${app.releasedBefore ? "Yes" : "No"}</p>
        ${app.links ? `<p><b>Links:</b> ${app.links}</p>` : ""}
        <p><b>Heard About Us:</b> ${app.hearAboutUs}</p>
        <p><b>Status:</b> ${app.status}</p>
      `,
      confirmButtonColor: "#16a34a",
    });
  };

  // ✏️ Edit Applicant
  const handleEdit = (app: Applicant) => {
    setEditingApplicant(app);
  };

  const handleEditSave = () => {
    if (editingApplicant) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === editingApplicant.id ? editingApplicant : a))
      );
      Swal.fire("Updated!", "Applicant details updated successfully.", "success");
      setEditingApplicant(null);
    }
  };

  // ➕ Create New Applicant
  const handleCreate = () => {
    Swal.fire({
      title: "Add New Applicant",
      html: `
        <input id="name" class="swal2-input" placeholder="Name" />
        <input id="artistName" class="swal2-input" placeholder="Artist Name" />
        <input id="email" class="swal2-input" placeholder="Email" />
        <input id="phone" class="swal2-input" placeholder="Phone" />
      `,
      showCancelButton: true,
      confirmButtonText: "Create",
      preConfirm: () => {
        const name = (
          document.getElementById("name") as HTMLInputElement
        )?.value;
        const artistName = (
          document.getElementById("artistName") as HTMLInputElement
        )?.value;
        const email = (
          document.getElementById("email") as HTMLInputElement
        )?.value;
        const phone = (
          document.getElementById("phone") as HTMLInputElement
        )?.value;

        if (!name || !artistName || !email || !phone) {
          Swal.showValidationMessage("Please fill all fields!");
          return;
        }

        return { name, artistName, email, phone };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newApp: Applicant = {
          id: applicants.length + 1,
          name: result.value.name,
          artistName: result.value.artistName,
          email: result.value.email,
          phone: result.value.phone,
          instagram: "",
          youtube: "",
          releasedBefore: false,
          hearAboutUs: "Other",
          status: "Pending",
        };
        setApplicants((prev) => [...prev, newApp]);
        Swal.fire("Added!", "New applicant created successfully.", "success");
      }
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
        Apply Form Management
      </h2>

      {/* Top Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, artist, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} /> Add Applicant
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-100">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Artist Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((app) => (
              <tr key={app.id} className="border-t hover:bg-green-50">
                <td className="py-3 px-4">{app.name}</td>
                <td className="py-3 px-4">{app.artistName}</td>
                <td className="py-3 px-4">{app.email}</td>
                <td className="py-3 px-4">{app.phone}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : app.status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleView(app)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(app)}
                    className="text-green-600 hover:text-green-800"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="text-green-500 hover:text-green-700"
                    title="Approve"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Reject"
                  >
                    <XCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)}{" "}
          of {filtered.length} entries
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded-lg text-sm hover:bg-green-100 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded-lg text-sm hover:bg-green-100 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingApplicant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-bold text-green-700 mb-4">Edit Applicant</h3>
            <div className="flex flex-col gap-2">
              <input
                className="border rounded-lg p-2"
                value={editingApplicant.name}
                onChange={(e) =>
                  setEditingApplicant({
                    ...editingApplicant,
                    name: e.target.value,
                  })
                }
                placeholder="Name"
              />
              <input
                className="border rounded-lg p-2"
                value={editingApplicant.artistName}
                onChange={(e) =>
                  setEditingApplicant({
                    ...editingApplicant,
                    artistName: e.target.value,
                  })
                }
                placeholder="Artist Name"
              />
              <input
                className="border rounded-lg p-2"
                value={editingApplicant.email}
                onChange={(e) =>
                  setEditingApplicant({
                    ...editingApplicant,
                    email: e.target.value,
                  })
                }
                placeholder="Email"
              />
              <input
                className="border rounded-lg p-2"
                value={editingApplicant.phone}
                onChange={(e) =>
                  setEditingApplicant({
                    ...editingApplicant,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingApplicant(null)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyFormManagement;

