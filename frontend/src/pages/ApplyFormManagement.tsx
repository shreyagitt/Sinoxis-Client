import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAppSelector } from "../store/hook";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  genre: string;
  musicLink: string;
  bio: string;
  agree: boolean;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
}

const ApplyFormManagement: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { token } = useAppSelector((state) => state.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // =======================================================
  // ⬇️ FETCH APPLICATIONS
  // =======================================================
  useEffect(() => {
    axios
      .get(`${baseUrl}/apply`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.data)) {
          setApplications(res.data.data);
        }
      });
  }, [token]);

  // =======================================================
  // 🔎 SEARCH FILTER
  // =======================================================
  const filtered = applications.filter((a) =>
    a.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const visible = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // =======================================================
  // 🔄 UPDATE STATUS
  // =======================================================
  const updateStatus = async (id: string, status: Application["status"]) => {
    await axios.patch(
      `${baseUrl}/apply/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    );

    Swal.fire("Updated!", `Status changed to ${status}`, "success");
  };

  // =======================================================
  // ❌ DELETE APPLICATION
  // =======================================================
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete this application?",
      text: "This action cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.delete(`${baseUrl}/apply/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications((prev) => prev.filter((a) => a._id !== id));

        Swal.fire("Deleted!", "Application removed.", "success");
      }
    });
  };

  // =======================================================
  // 👁 VIEW DETAILS
  // =======================================================
  const handleView = (app: Application) => {
    Swal.fire({
      title: `<strong>${app.fullName}</strong>`,
      html: `
        <p><b>Email:</b> ${app.email}</p>
        <p><b>Phone:</b> ${app.phone}</p>
        <p><b>Role:</b> ${app.role}</p>
        <p><b>Genre:</b> ${app.genre}</p>
        <p><b>Music Link:</b> <a href="${app.musicLink}" target="_blank">${app.musicLink}</a></p>
        <p><b>Bio:</b> ${app.bio}</p>
        <p><b>Agree:</b> ${app.agree ? "Yes" : "No"}</p>
        <p><b>Status:</b> ${app.status}</p>
      `,
      confirmButtonColor: "#16a34a",
    });
  };

  // =======================================================
  // ➕ ADD NEW APPLICANT
  // =======================================================
  const handleCreate = () => {
  Swal.fire({
    title: "Add New Applicant",
    html: `
      <input id="swal-fullName" class="swal2-input" placeholder="Full Name" />
      <input id="swal-email" class="swal2-input" placeholder="Email" />
      <input id="swal-phone" class="swal2-input" placeholder="Phone" />
      <input id="swal-role" class="swal2-input" placeholder="Role" />
      <input id="swal-genre" class="swal2-input" placeholder="Genre" />
      <input id="swal-musicLink" class="swal2-input" placeholder="Music Link" />
    `,
    showCancelButton: true,
    confirmButtonText: "Create",

    preConfirm: () => {
      const fullName = (document.getElementById("swal-fullName") as HTMLInputElement).value;
      const email = (document.getElementById("swal-email") as HTMLInputElement).value;
      const phone = (document.getElementById("swal-phone") as HTMLInputElement).value;
      const role = (document.getElementById("swal-role") as HTMLInputElement).value;
      const genre = (document.getElementById("swal-genre") as HTMLInputElement).value;
      const musicLink = (document.getElementById("swal-musicLink") as HTMLInputElement).value;

      if (!fullName || !email || !phone || !role || !genre || !musicLink) {
        Swal.showValidationMessage("All fields are required!");
        return;
      }

      return { fullName, email, phone, role, genre, musicLink };
    },
  }).then(async (res) => {
    if (res.isConfirmed) {
      const payload = {
        ...res.value,
        bio: "New applicant",
        agree: true,
        status: "Pending",
      };

      const response = await axios.post(
        `${baseUrl}/apply`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications((prev) => [...prev, response.data.data]);

      Swal.fire("Added!", "Applicant created successfully", "success");
    }
  });
};


  // =======================================================
  // ✏️ EDIT APPLICANT
  // =======================================================
  const handleEdit = (app: Application) => {
    Swal.fire({
      title: "Edit Applicant",
      html: `
        <input id="fullName" class="swal2-input" value="${app.fullName}" />
        <input id="email" class="swal2-input" value="${app.email}" />
        <input id="phone" class="swal2-input" value="${app.phone}" />
        <input id="role" class="swal2-input" value="${app.role}" />
        <input id="genre" class="swal2-input" value="${app.genre}" />
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => ({
        fullName: (document.getElementById("fullName") as any).value,
        email: (document.getElementById("email") as any).value,
        phone: (document.getElementById("phone") as any).value,
        role: (document.getElementById("role") as any).value,
        genre: (document.getElementById("genre") as any).value,
      }),
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.patch(
          `${baseUrl}/apply/${app._id}`,
          res.value,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setApplications((prev) =>
          prev.map((a) =>
            a._id === app._id ? { ...a, ...res.value } : a
          )
        );

        Swal.fire("Updated!", "Applicant updated successfully.", "success");
      }
    });
  };

  // =======================================================
  // UI
  // =======================================================
  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">Apply Form Management</h2>

      {/* Search + Add */}
      <div className="flex justify-between items-center mb-5">
        <div className="relative w-80">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-xl border shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700"
        >
          <Plus size={18} /> Add Applicant
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border shadow-md">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-green-600 text-white rounded-t-xl">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((app, index) => (
              <tr
                key={app._id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-green-50"
                }`}
              >
                <td className="py-3 px-4">{app.fullName}</td>
                <td className="py-3 px-4">{app.role}</td>
                <td className="py-3 px-4">{app.email}</td>
                <td className="py-3 px-4">{app.phone}</td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === "Accepted"
                        ? "bg-green-200 text-green-800"
                        : app.status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : app.status === "Reviewed"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 flex gap-3 justify-center">
                  <Eye
                    size={18}
                    className="text-blue-600 cursor-pointer hover:scale-110"
                    onClick={() => handleView(app)}
                  />

                  <Edit
                    size={18}
                    className="text-green-600 cursor-pointer hover:scale-110"
                    onClick={() => handleEdit(app)}
                  />

                  <CheckCircle
                    size={18}
                    className="text-green-500 cursor-pointer hover:scale-110"
                    onClick={() => updateStatus(app._id, "Accepted")}
                  />

                  <XCircle
                    size={18}
                    className="text-yellow-600 cursor-pointer hover:scale-110"
                    onClick={() => updateStatus(app._id, "Rejected")}
                  />

                  <Trash2
                    size={18}
                    className="text-red-600 cursor-pointer hover:scale-110"
                    onClick={() => handleDelete(app._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p>
          Showing {(page - 1) * itemsPerPage + 1}–
          {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-1 rounded-lg border shadow-sm bg-white disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-1 rounded-lg border shadow-sm bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyFormManagement;
