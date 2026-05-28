import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Power } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hook";

type SubGenre = {
  _id: string;
  name: string;
  isActive: boolean;
};

type Props = {
  genreId: string;
  genreName: string;
  onClose: () => void;
};

export default function SubGenreModal({ genreId, genreName, onClose }: Props) {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [subGenres, setSubGenres] = useState<SubGenre[]>([]);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    _id: "",
    name: "",
  });

  /* FETCH SUBGENRES */

  const fetchSubGenres = async () => {
    try {
      const res = await axios.get(`${baseUrl}/subgenre/genre/${genreId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setSubGenres(res.data.data);
    } catch {
      toast.error("Failed to load subgenres");
    }
  };

  useEffect(() => {
    fetchSubGenres();
  }, []);

  /* ADD SUBGENRE */

  const openAdd = () => {
    setEditing(false);
    setForm({ _id: "", name: "" });
  };

  /* EDIT SUBGENRE */

  const openEdit = (sg: SubGenre) => {
    setEditing(true);
    setForm({
      _id: sg._id,
      name: sg.name,
    });
  };

  /* SAVE */

  const saveSubGenre = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing) {
       await axios.patch(`${baseUrl}/subgenre/${form._id}`,
          { name: form.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Subgenre updated");
      } else {
        await axios.post(`${baseUrl}/subgenre/genre/${genreId}`, { name: form.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Subgenre added");
      }

      fetchSubGenres();
      setForm({ _id: "", name: "" });
      setEditing(false);
    } catch {
      toast.error("Save failed");
    }
  };

  /* DELETE */

  const deleteSubGenre = async (id: string) => {
    if (!confirm("Delete this subgenre?")) return;

    try {
      await axios.delete(`${baseUrl}/subgenre/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted");
      setSubGenres((prev) => prev.filter((s) => s._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* TOGGLE STATUS */

  const toggleActive = async (id: string) => {
    try {
      await axios.patch(`${baseUrl}/subgenre/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSubGenres();
      toast.success("Status updated");
    } catch {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">

      <div className="bg-white dark:bg-[#0B1029] rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-[#1A2347] p-6">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-lg font-semibold text-[#020726] dark:text-white">
            SubGenres - {genreName}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500"
          >
            ✕
          </button>

        </div>

        {/* ADD FORM */}

        <form onSubmit={saveSubGenre} className="flex gap-2 mb-4">

          <input
            required
            placeholder="Subgenre name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="flex-1 border rounded px-3 py-2 text-sm bg-white dark:bg-[#111A3A] dark:text-white"
          />

          <button
            className="flex items-center gap-1 bg-[#0288D1] hover:bg-[#29B6F6] text-white px-3 py-2 rounded"
          >
            <Plus size={14} />
            {editing ? "Update" : "Add"}
          </button>

        </form>

        {/* SUBGENRE LIST */}

        <div className="space-y-2 max-h-[300px] overflow-y-auto">

          {subGenres.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No subgenres yet
            </p>
          ) : (
            subGenres.map((sg) => (
              <div
                key={sg._id}
                className="flex items-center justify-between bg-gray-50 dark:bg-[#111A3A] p-3 rounded-md"
              >

                <span className="text-sm font-medium">
                  {sg.name}
                </span>

                <div className="flex gap-2">

                  <button
                    onClick={() => toggleActive(sg._id)}
                    className="p-2 bg-yellow-50 rounded hover:bg-yellow-100"
                  >
                    <Power size={14} className="text-yellow-600" />
                  </button>

                  <button
                    onClick={() => openEdit(sg)}
                    className="p-2 bg-blue-50 rounded hover:bg-blue-100"
                  >
                    <Edit size={14} className="text-blue-600" />
                  </button>

                  <button
                    onClick={() => deleteSubGenre(sg._id)}
                    className="p-2 bg-red-50 rounded hover:bg-red-100"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}