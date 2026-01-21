import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Users = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | active | blocked

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id) => {
    try {
      await axios.patch(
        `${baseUrl}/users/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user permanently?")) return;

    try {
      await axios.delete(`${baseUrl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredUsers =
    filter === "all"
      ? users
      : filter === "active"
      ? users.filter((u) => u.isActive)
      : users.filter((u) => !u.isActive);

  return (
    <div className="p-6 min-h-screen bg-[#FFFFFF] dark:bg-[#020726] text-[#020726] dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2">
          {["all", "active", "blocked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-md text-xs font-medium border ${
                filter === f
                  ? "bg-[#29B6F6] text-white border-[#29B6F6]"
                  : "bg-transparent border-gray-300 dark:border-[#1F2937]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#0B1029] rounded-xl border border-gray-200 dark:border-[#1F2937]">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#020726]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading &&
              filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-gray-200 dark:border-[#1F2937]"
                >
                  <td className="p-3">
                    {u.firstName} {u.lastName}
                  </td>

                  <td className="p-3">{u.email}</td>

                  <td className="p-3 text-center">
                    {u.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                        Blocked
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => toggleBlock(u._id)}
                      className={`px-4 py-1 rounded-md text-white text-xs ${
                        u.isActive ? "bg-orange-500" : "bg-green-600"
                      }`}
                    >
                      {u.isActive ? "Block" : "Unblock"}
                    </button>

                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-4 py-1 rounded-md bg-red-600 text-white text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
