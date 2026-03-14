import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Check,
  X,
  RefreshCcw,
  Trash2,
  Eye,
} from "lucide-react";
import { useAppSelector } from "../store/hook";

/* ================= TYPES ================= */

type ReleaseStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Inactive"
  | "Unfinished"
  | "Action Required";

interface Track {
  trackTitle: string;
  primaryArtist: string;
  publisher?: string;
  language?: string;
  isrc?: string;
  writers?: string[];
  composers?: string[];
  musicDirectors?: string[];
  producers?: string[];
  audioUrl?: string;
  audioName?: string;   
  lyrics?: string;
}

interface Release {
  _id: string;
  title: string;
  subtitle?: string;
  artist: string;
  genre?: string;
  subgenre?: string;
  label?: string;
  copyrightText?: string;
  productionYear?: number;
  originalReleaseDate?: string;
  digitalReleaseDate?: string;
  upc?: string;

  cover?: string;
  status: ReleaseStatus;
  currentStep: string;

  tracks: Track[];
  stores: string[];

  createdAt: string;
  userId?: {
    fullName?: string;
    email?: string;
  };
}

/* ================= COMPONENT ================= */

const AdminReleases: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] =
    useState<Release | null>(null);

  /* ================= FETCH ALL ================= */
  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/release`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReleases(res.data.data || []);
    } catch {
      toast.error("Failed to load releases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReleases();
  }, [token]);

  /* ================= CHANGE STATUS ================= */
  const changeStatus = async (
    id: string,
    status: ReleaseStatus
  ) => {
    try {
      await axios.patch(
        `${baseUrl}/release/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchReleases();
    } catch {
      toast.error("Status update failed");
    }
  };

  /* ================= DELETE ================= */
  const deleteRelease = async (id: string) => {
    if (
      !window.confirm(
        "This will permanently delete the release. Continue?"
      )
    )
      return;

    try {
      await axios.delete(`${baseUrl}/release/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Release deleted");
      fetchReleases();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= VIEW ================= */
  const viewRelease = (release: Release) => {
    setSelectedRelease(release);
    setViewOpen(true);
  };

const normalizeTracks = (tracks: any): Track[] => {
  if (!tracks) return [];

  if (Array.isArray(tracks)) return tracks;

  if (typeof tracks === "string") {
    try {
      const parsed = JSON.parse(tracks);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const tracks: Track[] = selectedRelease
  ? normalizeTracks(selectedRelease.tracks)
  : [];

  const STATUS_OPTIONS: ReleaseStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Inactive",
  "Unfinished",
  "Action Required",
];


  return (
    <div className="p-6 min-h-screen bg-white dark:bg-[#020726] text-[#020726] dark:text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Admin Release 
        </h1>

        <button
          onClick={fetchReleases}
          className="flex items-center gap-2 px-4 py-2 border rounded"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#111A3A]">
  <tr>
    <th className="px-4 py-3 text-center">Cover</th>
    <th className="px-4 py-3 text-left">Title</th>
    <th className="px-4 py-3 text-left">Artist</th>
    <th className="px-4 py-3 text-left">Label</th>
    <th className="px-4 py-3 text-left">User</th>
    <th className="px-4 py-3 text-center">Status</th>
    <th className="px-4 py-3 text-center">Actions</th>
  </tr>
</thead>


          <tbody>
            {releases.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3 align-middle">
                  <div className="flex justify-center items-center">
  <img
    src={r.cover || "https://via.placeholder.com/60"}
    className="w-12 h-12 rounded object-cover"
    alt="cover"
  />
</div>

                </td>

                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.artist}</td>
                <td className="px-4 py-3">
                  {r.label || "-"}
                </td>

                <td className="px-4 py-3">
                  <p className="font-medium">
                    {r.userId?.fullName}
                  </p>
                  <p className="text-xs opacity-70">
                    {r.userId?.email}
                  </p>
                </td>

               <td className="px-4 py-3 align-middle">
  <div className="flex justify-center">
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
        ${
          r.status === "Approved"
            ? "bg-green-100 text-green-700"
            : r.status === "Rejected"
            ? "bg-red-100 text-red-700"
            : r.status === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : r.status === "Action Required"
            ? "bg-orange-100 text-orange-700"
            : r.status === "Unfinished"
            ? "bg-gray-200 text-gray-700"
            : "bg-gray-100 text-gray-600" // ✅ fallback
        }`}
    >
      {r.status}
    </span>
  </div>
</td>



               <td className="px-4 py-3 align-middle">
  <div className="flex items-center justify-center gap-3">

    {/* View */}
    <button
      onClick={() => viewRelease(r)}
      className="flex items-center gap-1 px-3 py-1.5
                 bg-blue-600 hover:bg-blue-700
                 text-white text-xs rounded-md"
    >
      <Eye size={14} />
      View
    </button>

    {/* Status selector */}
    <select
      value={r.status}
      onChange={(e) =>
        changeStatus(r._id, e.target.value as ReleaseStatus)
      }
      className="px-3 py-1.5 text-xs rounded-md border
                 bg-white dark:bg-[#0B1029]
                 focus:outline-none focus:ring-1 focus:ring-sky-500"
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>

    {/* Delete */}
    <button
      onClick={() => deleteRelease(r._id)}
      className="p-2 rounded-md bg-black hover:bg-red-600 text-white"
      title="Delete"
    >
      <Trash2 size={14} />
    </button>

  </div>
</td>


              </tr>
            ))}

            {!loading && releases.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 opacity-70"
                >
                  No releases found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewOpen && selectedRelease && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0B1029] w-full max-w-5xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Release Full Details
              </h2>
              <button onClick={() => setViewOpen(false)}>
                ✕
              </button>
            </div>

            {/* RELEASE INFO */}
            <section className="mb-6">
  <h3 className="font-semibold mb-3 text-lg">Release</h3>
 <div className="border rounded p-4 text-sm bg-gray-50 dark:bg-[#111A3A]">
    <h4 className="font-semibold mb-2 text-sky-600 dark:text-sky-400">
      Release Details
    </h4>
  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
    <div><span className="font-medium">Title</span></div>
    <div>{selectedRelease.title || "-"}</div>

    <div><span className="font-medium">Artist</span></div>
    <div>{selectedRelease.artist || "-"}</div>

    <div><span className="font-medium">Genre</span></div>
    <div>{selectedRelease.genre || "-"}</div>

    <div><span className="font-medium">Subgenre</span></div>
    <div>{selectedRelease.subgenre || "-"}</div>

    <div><span className="font-medium">Label</span></div>
    <div>{selectedRelease.label || "-"}</div>
<div><span className="font-medium">Original Release Date</span></div>
<div>
  {selectedRelease.originalReleaseDate
    ? new Date(selectedRelease.originalReleaseDate).toLocaleDateString()
    : "-"}
</div>

<div><span className="font-medium">Digital Release Date</span></div>
<div>
  {selectedRelease.digitalReleaseDate
    ? new Date(selectedRelease.digitalReleaseDate).toLocaleDateString()
    : "-"}
</div>

    <div><span className="font-medium">UPC</span></div>
    <div>{selectedRelease.upc || "-"}</div>

    <div><span className="font-medium">Status</span></div>
    <div>{selectedRelease.status}</div>
  </div>
  </div>
</section>


            {/* TRACKS */}
            <section className="mb-6">
  <h3 className="font-semibold mb-2">Tracks</h3>

  {tracks.length ? (
    tracks.map((t, i) => (
      <div
        key={i}
        className="border rounded p-4 mb-4 text-sm bg-gray-50 dark:bg-[#111A3A]"
      >
        <h4 className="font-semibold mb-2 text-sky-600 dark:text-sky-400">
          Track {i + 1}
        </h4>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <p><b>Track Title:</b> {t.trackTitle || "-"}</p>
          <p><b>Primary Artist:</b> {t.primaryArtist || "-"}</p>

          <p><b>Publisher:</b> {t.publisher || "-"}</p>
          <p><b>Language:</b> {t.language || "-"}</p>

          <p><b>ISRC:</b> {t.isrc || "-"}</p>

<div className="col-span-2">
  <b>Track Audio:</b>

  {t.audioUrl ? (
  <div className="mt-2 space-y-2">

    <audio
      controls
      src={t.audioUrl}
      preload="metadata"
      className="w-full max-w-md"
    />

    <div className="flex gap-3">

      <a
        href={t.audioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
      >
        Open
      </a>

      <a
        href={t.audioUrl}
        download
        className="px-3 py-1 bg-green-600 text-white text-xs rounded"
      >
        Download
      </a>

    </div>

  </div>
) : (
  <p>No audio uploaded</p>
)}
</div>

          <p className="col-span-2">
            <b>Writers:</b> {t.writers?.length ? t.writers.join(", ") : "-"}
          </p>

          <p className="col-span-2">
            <b>Composers:</b> {t.composers?.length ? t.composers.join(", ") : "-"}
          </p>

          <p className="col-span-2">
            <b>Music Directors:</b>{" "}
            {t.musicDirectors?.length ? t.musicDirectors.join(", ") : "-"}
          </p>

          <p className="col-span-2">
            <b>Producers:</b>{" "}
            {t.producers?.length ? t.producers.join(", ") : "-"}
          </p>

          <p className="col-span-2">
            <b>Lyrics:</b>{" "}
            {t.lyrics ? (
              <span className="block mt-1 whitespace-pre-wrap">
                {t.lyrics}
              </span>
            ) : (
              "-"
            )}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm opacity-70">No tracks added</p>
  )}
</section>


            {/* STORES */}
            <section>
              <h3 className="font-semibold mb-2">
                Stores
              </h3>
              {selectedRelease.stores.length ? (
                <div className="flex gap-2 flex-wrap">
                  {selectedRelease.stores.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-70">
                  No stores selected
                </p>
              )}
            </section>

          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-6">
          Loading...
        </div>
      )}
    </div>
  );
};

export default AdminReleases;
