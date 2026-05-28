import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PERMISSIONS_CONFIG } from "../config/permissions.config";

/* ============================
   TYPES
============================ */
interface AdminEditUserProps {
  user: any; // you can replace with User type later
  onClose: () => void;
  onUpdated: () => void;
}

const AdminEditUser: React.FC<AdminEditUserProps> = ({
  user,
  onClose,
  onUpdated,
}) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    permissions: { ...user.permissions },
  });

  const togglePermission = (key: string, value: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: value,
      },
    }));
  };

  const saveUser = async () => {
    try {
      // Update profile
      await axios.put(
        `${baseUrl}/users/${user._id}`,
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update permissions
      await axios.put(
        `${baseUrl}/users/${user._id}/permissions`,
        { permissions: form.permissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User updated successfully");
      onUpdated();
      onClose();
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0B1029] p-6 rounded-xl w-[520px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        {/* BASIC INFO */}
        {(["firstName", "lastName", "email"] as const).map((field) => (
          <input
            key={field}
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
            placeholder={field}
            className="w-full mb-3 px-3 py-2 border rounded-md text-sm"
          />
        ))}

        {/* PERMISSIONS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Permissions</h3>

          {PERMISSIONS_CONFIG.map((section) => (
            <div key={section.key} className="border rounded-lg p-3 mb-3">
              <label className="flex items-center justify-between">
                <span className="font-medium">{section.label}</span>
                <input
                  type="checkbox"
                  checked={form.permissions?.[section.key] || false}
                  onChange={(e) =>
                    togglePermission(section.key, e.target.checked)
                  }
                />
              </label>

              {section.children?.map((child) => (
                <label
                  key={child.key}
                  className="flex items-center justify-between ml-6 mt-2 text-sm"
                >
                  <span>{child.label}</span>
                  <input
                    type="checkbox"
                    checked={form.permissions?.[child.key] || false}
                    onChange={(e) =>
                      togglePermission(child.key, e.target.checked)
                    }
                  />
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={saveUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUser;