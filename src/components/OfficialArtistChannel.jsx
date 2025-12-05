// src/pages/OfficialArtistChannel.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Topbar";

const StatusPill = ({ status }) => {
  const bg =
    status === "Rejected"
      ? "bg-red-600 text-white"
      : status === "Approved"
      ? "bg-blue-600 text-white"
      : status === "Released"
      ? "bg-green-600 text-white"
      : "bg-yellow-400 text-black";

  return (
    <span className={`px-4 py-1 rounded-full text-sm w-max ${bg}`}>
      {status}
    </span>
  );
};

export default function OfficialArtistChannel() {
  const { theme } = useTheme();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [openOACModal, setOpenOACModal] = useState(false);
  const [openAddSongModal, setOpenAddSongModal] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [oacForm, setOacForm] = useState({
    ytChannel: "",
    topicChannel: "",
    artistName: "",
  });

  const [songs, setSongs] = useState([]);
  const [tempSong, setTempSong] = useState({ title: "", isrc: "" });

  // --------------------------
  // FETCH OAC REQUESTS
  // --------------------------
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/client/official-artist`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        const formatted = data.data.map((r) => ({
          ytChannel: r.ytChannel,
          topicChannel: r.topicChannel || "—",
          artist: r.artistName,
          date: new Date(r.createdAt).toLocaleString(),
          status: r.status,
        }));

        setRequests(formatted);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --------------------------
  // ADD SONG HANDLERS
  // --------------------------
  const handleAddSong = (e) => {
    e.preventDefault();
    if (!tempSong.title.trim()) return alert("Title missing");
    if (!tempSong.isrc.trim()) return alert("ISRC missing");

    setSongs([...songs, tempSong]);
    setTempSong({ title: "", isrc: "" });
    setOpenAddSongModal(false);
  };

  const handleRemoveSong = (i) =>
    setSongs(songs.filter((_, idx) => idx !== i));

  // --------------------------
  // SUBMIT OAC REQUEST
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (songs.length < 3) {
      alert("At least 3 songs required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/client/official-artist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...oacForm,
          songs,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("OAC Request Submitted!");

        setRequests((prev) => [
          {
            ytChannel: data.data.ytChannel,
            topicChannel: data.data.topicChannel || "—",
            artist: data.data.artistName,
            date: new Date(data.data.createdAt).toLocaleString(),
            status: data.data.status,
          },
          ...prev,
        ]);

        // Reset form
        setOacForm({ ytChannel: "", topicChannel: "", artistName: "" });
        setSongs([]);
        setOpenOACModal(false);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Server error");
    }
  };

  // --------------------------
  // THEME STYLES
  // --------------------------
  const pageBg =
    theme === "dark"
      ? "bg-[#020726] text-white"
      : "bg-white text-[#020726]";

  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10"
      : "bg-white border border-gray-300 shadow-md";

  const subtleText =
    theme === "dark" ? "text-gray-300" : "text-gray-600";

  const inputBg =
    theme === "dark"
      ? "bg-[#1b214d] text-white border-white/10"
      : "bg-gray-100 text-[#020726] border-gray-300";

  return (
    <div className={`min-h-screen px-4 sm:px-10 py-8 ${pageBg}`}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-10">
        <h1 className="text-3xl font-semibold">Official Artist Channel</h1>
        <p className={subtleText}>
          Home <span className="text-[#29B6F6]">/ Official Artist Channel</span>
        </p>
      </div>

      {/* MAIN CARD */}
      <div className={`rounded-xl p-6 sm:p-10 border shadow-lg ${cardBg}`}>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Official Artist Channel</h2>

          <button
            onClick={() => setOpenOACModal(true)}
            className={`px-5 py-2 rounded-full border ${
              theme === "dark"
                ? "border-[#29B6F6] text-[#29B6F6]"
                : "border-[#0288D1] text-[#0288D1]"
            }`}
          >
            Add Request
          </button>
        </div>

        {/* Table Header */}
        <div
          className={`hidden md:grid grid-cols-5 gap-6 font-semibold py-3 border-t ${subtleText}`}
        >
          <div>YouTube Channel</div>
          <div>Topic Channel</div>
          <div>Artist</div>
          <div>Requested At</div>
          <div>Status</div>
        </div>

        {/* Table Rows */}
        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-400">No requests yet.</p>
          ) : (
            requests.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-lg border-b ${
                  theme === "dark" ? "border-white/10" : "border-gray-300"
                }`}
              >
                <a
                  href={row.ytChannel}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {row.ytChannel}
                </a>

                <div>{row.topicChannel}</div>
                <div>{row.artist}</div>
                <div>{row.date}</div>

                <StatusPill status={row.status} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= ADD REQUEST MODAL ================= */}
      {openOACModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-3 z-50">
          <div className={`w-full max-w-3xl rounded-xl p-6 border shadow-xl ${cardBg}`}>
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-semibold">YouTube Official Artist Channel</h3>
              <button
                onClick={() => setOpenOACModal(false)}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* YouTube */}
              <input
                type="url"
                required
                placeholder="YouTube Channel Link *"
                value={oacForm.ytChannel}
                onChange={(e) => setOacForm({ ...oacForm, ytChannel: e.target.value })}
                className={`w-full p-3 rounded-lg border ${inputBg}`}
              />

              {/* Topic */}
              <input
                type="url"
                placeholder="Topic Channel Link"
                value={oacForm.topicChannel}
                onChange={(e) =>
                  setOacForm({ ...oacForm, topicChannel: e.target.value })
                }
                className={`w-full p-3 rounded-lg border ${inputBg}`}
              />

              {/* Artist */}
              <input
                type="text"
                required
                placeholder="Artist Name *"
                value={oacForm.artistName}
                onChange={(e) =>
                  setOacForm({ ...oacForm, artistName: e.target.value })
                }
                className={`w-full p-3 rounded-lg border ${inputBg}`}
              />

              {/* Song Section */}
              <div className="flex justify-between items-center">
                <span className={subtleText}>
                  Songs ({songs.length}) — Add minimum <b>3</b>
                </span>

                <button
                  type="button"
                  onClick={() => setOpenAddSongModal(true)}
                  className="px-4 py-1 border rounded-lg text-[#29B6F6]"
                >
                  Add Song
                </button>
              </div>

              {/* Songs List */}
              <div
                className={`max-h-48 overflow-auto p-3 rounded-lg border ${
                  theme === "dark" ? "bg-[#11152b] border-white/10" : "bg-gray-100"
                }`}
              >
                {songs.length === 0 ? (
                  <p className={subtleText}>No songs added</p>
                ) : (
                  songs.map((s, i) => (
                    <div
                      key={i}
                      className={`flex justify-between p-3 mb-2 rounded-lg ${
                        theme === "dark" ? "bg-[#0f1633]" : "bg-gray-200"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-gray-400">ISRC: {s.isrc}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSong(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenOACModal(false)}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={songs.length < 3}
                  className={`px-5 py-2 rounded-lg text-white ${
                    songs.length >= 3
                      ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1]"
                      : "bg-gray-500 opacity-50 cursor-not-allowed"
                  }`}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD SONG MODAL ================= */}
      {openAddSongModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-3 z-50">
          <div className={`w-full max-w-md rounded-xl p-6 border shadow-xl ${cardBg}`}>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Song</h3>
              <button
                onClick={() => setOpenAddSongModal(false)}
                className="text-gray-300 hover:text-red-500"
              >
                ✖
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAddSong}>
              <input
                type="text"
                required
                placeholder="Song Title"
                value={tempSong.title}
                onChange={(e) =>
                  setTempSong({ ...tempSong, title: e.target.value })
                }
                className={`w-full p-3 rounded-lg border ${inputBg}`}
              />

              <input
                type="text"
                required
                placeholder="ISRC"
                value={tempSong.isrc}
                onChange={(e) =>
                  setTempSong({ ...tempSong, isrc: e.target.value })
                }
                className={`w-full p-3 rounded-lg border ${inputBg}`}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenAddSongModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#29B6F6] text-white rounded-lg"
                >
                  Add Song
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
