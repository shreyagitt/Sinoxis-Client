import React, { useState, useEffect } from "react";
import { Eye, Search, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAppSelector } from "../store/hook";

interface ClientApplication {
  _id: string;
  fullName: string;
  artistName: string;
  email: string;
  phone: string;
  instagram?: string;
  youtube?: string;
  labelName?: string;
  releasedBefore: boolean;
  heardAbout: string;
  status: "Pending" | "Approved" | "Rejected";
}

const ApplyFormManagement: React.FC = () => {
  const [applications, setApplications] = useState<ClientApplication[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { token } = useAppSelector((state) => state.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${baseUrl}/apply`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(res.data.data);
      } catch (error) {
        console.error("❌ Error Fetching:", error);
      }
    };

    fetchApplications();
  }, [token]);

  const filtered = applications.filter((a) =>
    a.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const visible = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const updateStatus = async (id: string, status: ClientApplication["status"]) => {
    try {
      await axios.patch(
        `${baseUrl}/apply/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );

      Swal.fire("Updated!", `Status changed to ${status}`, "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete this application?",
      text: "This cannot be undone.",
      icon: "warning",
      confirmButtonColor: "#d33",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/apply/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setApplications((prev) => prev.filter((a) => a._id !== id));

          Swal.fire("Deleted!", "Application removed.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete", "error");
        }
      }
    });
  };

  const handleView = (app: ClientApplication) => {
    Swal.fire({
      title: `<strong>${app.fullName}</strong>`,
      html: `
        <p><b>Artist Name:</b> ${app.artistName}</p>
        <p><b>Email:</b> ${app.email}</p>
        <p><b>Phone:</b> ${app.phone}</p>
        <p><b>Instagram:</b> ${app.instagram || "N/A"}</p>
        <p><b>YouTube:</b> ${app.youtube || "N/A"}</p>
        <p><b>Label:</b> ${app.labelName || "N/A"}</p>
        <p><b>Released Before:</b> ${app.releasedBefore ? "Yes" : "No"}</p>
        <p><b>Heard About:</b> ${app.heardAbout}</p>
        <p><b>Status:</b> ${app.status}</p>
      `,
      confirmButtonColor: "#29B6F6",
      background: "#020726",
      color: "#FFFFFF",
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white transition-colors duration-300">

      <h2 className="text-2xl font-semibold mb-6">Apply Form Submission</h2>

      {/* Search */}
      <div className="flex justify-between items-center mb-5">
        <div className="relative w-80">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search by Full Name"
            onChange={(e) => setSearch(e.target.value)}
            className="
              pl-10 pr-4 py-2 w-full rounded-xl border shadow-sm 
              bg-white dark:bg-[#0B1029] 
              text-[#020726] dark:text-white 
              border-gray-300 dark:border-gray-700
            "
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border shadow-md border-gray-300 dark:border-gray-700">
        <table className="w-full text-sm table-auto">
          <thead className="bg-[#0288D1] dark:bg-[#29B6F6] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Full Name</th>
              <th className="py-3 px-4 text-left">Artist Name</th>
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
                className={`border-t border-gray-300 dark:border-gray-700 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-[#0B1029]"
                    : "bg-[#E3F2FD] dark:bg-[#06102A]"
                }`}
              >
                <td className="py-3 px-4">{app.fullName}</td>
                <td className="py-3 px-4">{app.artistName}</td>
                <td className="py-3 px-4">{app.email}</td>
                <td className="py-3 px-4">{app.phone}</td>

                <td className="py-3 px-4">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${
                        app.status === "Approved"
                          ? "bg-green-200 text-green-900 dark:bg-green-700 dark:text-white"
                          : app.status === "Rejected"
                          ? "bg-red-200 text-red-900 dark:bg-red-700 dark:text-white"
                          : "bg-yellow-200 text-yellow-900 dark:bg-yellow-600 dark:text-white"
                      }
                    `}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex justify-center items-center gap-4">

                    <Eye
                      size={18}
                      className="text-[#0288D1] dark:text-[#29B6F6] cursor-pointer hover:scale-110 transition"
                      onClick={() => handleView(app)}
                    />

                    <CheckCircle
                      size={18}
                      className="text-green-600 dark:text-green-400 cursor-pointer hover:scale-110 transition"
                      onClick={() => updateStatus(app._id, "Approved")}
                    />

                    <XCircle
                      size={18}
                      className="text-yellow-600 dark:text-yellow-400 cursor-pointer hover:scale-110 transition"
                      onClick={() => updateStatus(app._id, "Rejected")}
                    />

                    <Trash2
                      size={18}
                      className="text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
                      onClick={() => handleDelete(app._id)}
                    />

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-[#020726] dark:text-white">
        <p>
          Showing {(page - 1) * itemsPerPage + 1}–
          {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="
              px-4 py-1 rounded-lg border shadow-sm
              bg-white dark:bg-[#0B1029]
              text-[#020726] dark:text-white
              border-gray-300 dark:border-gray-700
              disabled:opacity-50
            "
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="
              px-4 py-1 rounded-lg border shadow-sm
              bg-white dark:bg-[#0B1029]
              text-[#020726] dark:text-white
              border-gray-300 dark:border-gray-700
              disabled:opacity-50
            "
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default ApplyFormManagement;
