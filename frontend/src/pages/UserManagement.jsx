import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminEditUser from "./AdminEditUser";

const Users = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // 🔹 Add User modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // 🔹 Edit User modal state
const [showEditModal, setShowEditModal] = useState(false);
const [editUser, setEditUser] = useState(null);

  /* ==========================
     FETCH USERS
  =========================== */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const clientUsers = (res.data.data || []).filter(
        (u) => u.role === "client" || u.isAdmin === false
      );

      setUsers(clientUsers);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ==========================
     ADD USER
  =========================== */
  const addUser = async () => {
    try {
      await axios.post(`${baseUrl}/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User added successfully");
      setShowAddModal(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      fetchUsers();
    } catch {
      toast.error("Failed to add user");
    }
  };

  /* ==========================
   UPDATE USER
=========================== */
const updateUser = async () => {
  try {
    // 1️⃣ Update profile
    await axios.put(
      `${baseUrl}/users/${editUser._id}`,
      {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 2️⃣ Update permissions
    await axios.put(
      `${baseUrl}/users/${editUser._id}/permissions`,
      {
        permissions: editUser.permissions,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("User updated successfully");
    setShowEditModal(false);
    setEditUser(null);
    fetchUsers();
  } catch {
    toast.error("Failed to update user");
  }
};

  /* ==========================
     BLOCK / UNBLOCK
  =========================== */
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

  /* ==========================
     DELETE USER
  =========================== */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Client User Management</h1>

        <div className="flex gap-2">
          {/* FILTERS */}
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

          {/* ADD USER BUTTON */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1 rounded-md bg-green-600 text-white text-xs"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* TABLE */}
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
                <tr key={u._id} className="border-t dark:border-[#1F2937]">
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
  onClick={() => {
    setEditUser({ ...u, permissions: u.permissions ?? {} });
    setShowEditModal(true);
  }}
  className="px-4 py-1 rounded-md bg-blue-600 text-white text-xs"
>
  Edit
</button>

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
                  No client users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0B1029] p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>

            {["firstName", "lastName", "email", "password"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field}
                value={newUser[field]}
                onChange={(e) =>
                  setNewUser({ ...newUser, [field]: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 border rounded-md text-sm dark:bg-[#020726] dark:border-[#1F2937]"
              />
            ))}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1 text-sm border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                className="px-4 py-1 text-sm bg-green-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
{showEditModal && editUser && (
  <AdminEditUser
    user={editUser}
    onClose={() => {
      setShowEditModal(false);
      setEditUser(null);
    }}
    onUpdated={fetchUsers}
  />
)}
    </div>
  );
};

export default Users;