// src/pages/OfficialArtistChannel.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Topbar";

const sampleRequests = [
  {
    ytChannel: "https://www.youtube.com/Channel",
    topicChannel: "https://www.youtube.com/TopicChannel",
    artist: "Demo Artist",
    date: "05-11-2025, 06:25 PM",
    status: "Submitted",
  },
  {
    ytChannel: "https://www.youtube.com/Channel2",
    topicChannel: "https://www.youtube.com/Topic2",
    artist: "Demo Artist 2",
    date: "05-11-2025, 06:25 PM",
    status: "Submitted",
  },
];

// STATUS BADGE
const StatusPill = ({ status }) => {
  const bg =
    status === "Rejected"
      ? "bg-red-600 text-white"
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

  // THEME STYLES
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border border-white/10"
      : "bg-white border border-gray-300 shadow-md";
  const inputBg =
    theme === "dark"
      ? "bg-[#1b214d] text-white border-white/10"
      : "bg-gray-100 text-[#020726] border-gray-300";

  // Modal States
  const [openOACModal, setOpenOACModal] = useState(false);
  const [openAddSongModal, setOpenAddSongModal] = useState(false);

  // Forms
  const [oacForm, setOacForm] = useState({
    ytChannel: "",
    topicChannel: "",
    artistName: "",
  });

  const [songs, setSongs] = useState([]);
  const [tempSong, setTempSong] = useState({ title: "", isrc: "" });
  const [requests] = useState(sampleRequests);

  const handleAddSong = (e) => {
    e.preventDefault();
    if (!tempSong.title.trim()) return alert("Enter song title");
    if (!tempSong.isrc.trim()) return alert("Enter ISRC");

    setSongs([...songs, tempSong]);
    setTempSong({ title: "", isrc: "" });
    setOpenAddSongModal(false);
  };

  const handleRemoveSong = (i) =>
    setSongs(songs.filter((_, index) => index !== i));

  const handleOacSubmit = (e) => {
    e.preventDefault();
    alert("Submitted — Demo only");
    setSongs([]);
    setOacForm({ ytChannel: "", topicChannel: "", artistName: "" });
    setOpenOACModal(false);
  };

  const canSubmitOAC =
    songs.length >= 3 &&
    oacForm.ytChannel.trim() &&
    oacForm.artistName.trim();

  return (
    <div className={`min-h-screen px-4 sm:px-10 py-8 ${pageBg}`}>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-10">
        <h1 className="text-3xl font-semibold">Official Artist Channel</h1>
        <p className={`${subtleText}`}>
          Home <span className="text-[#29B6F6]">/ Official Artist Channel</span>
        </p>
      </div>

      {/* MAIN CARD */}
      <div className={`rounded-xl p-6 sm:p-10 border shadow-lg ${cardBg}`}>

        {/* CARD HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Official Artist Channel</h2>

          <button
            onClick={() => setOpenOACModal(true)}
            className={`px-5 py-2 rounded-full border transition ${
              theme === "dark"
                ? "border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/20"
                : "border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1] hover:text-white"
            }`}
          >
            Add Request
          </button>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            to="/requests/claim"
            className={`px-5 py-2 rounded-full border transition ${
              theme === "dark"
                ? "border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
                : "border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1] hover:text-white"
            }`}
          >
            Copyright Claims
          </Link>

          <Link
            to="/requests/artist"
            className={`px-5 py-2 rounded-full border transition ${
              theme === "dark"
                ? "border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
                : "border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1] hover:text-white"
            }`}
          >
            Official Artist Channel
          </Link>
        </div>

        {/* TABLE HEADER (Desktop Only) */}
        <div
          className={`hidden md:grid grid-cols-5 gap-6 font-semibold py-3 border-t ${subtleText} ${
    theme === "dark" ? "border-white/10" : "border-gray-300"
          }`}
        >
          <div>YouTube Channel</div>
          <div>Topic Channel</div>
          <div>Artist</div>
          <div>Requested At</div>
          <div>Status</div>
        </div>

        {/* TABLE ROWS */}
<div className="mt-4 space-y-4">
  {requests.map((row, i) => (
    <div
      key={i}
      className={`grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 p-4 rounded-lg border-b ${
        theme === "dark" ? "border-white/10" : "border-gray-300"
      }`}
    >
      {/* ==== YT CHANNEL ==== */}
      <div className="flex flex-col md:block break-all">
        <span className="text-xs text-gray-400 md:hidden">YouTube Channel</span>
        <a
          href={row.ytChannel}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:underline break-all"
        >
          {row.ytChannel}
        </a>
      </div>

      {/* ==== TOPIC CHANNEL ==== */}
      <div className="flex flex-col md:block break-all">
        <span className="text-xs text-gray-400 md:hidden">Topic Channel</span>
        <a
          href={row.topicChannel}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:underline break-all"
        >
          {row.topicChannel}
        </a>
      </div>

      {/* ==== ARTIST NAME ==== */}
      <div className="flex flex-col md:block">
        <span className="text-xs text-gray-400 md:hidden">Artist</span>
        {row.artist}
      </div>

      {/* ==== REQUESTED AT ==== */}
      <div className="flex flex-col md:block">
        <span className="text-xs text-gray-400 md:hidden">Requested At</span>
        {row.date}
      </div>

      {/* ==== STATUS ==== */}
      <div className="flex flex-col md:block">
        <span className="text-xs text-gray-400 md:hidden">Status</span>
        <StatusPill status={row.status} />
      </div>
    </div>
  ))}
</div>

      </div>

      {/* =============== OAC MODAL =============== */}
      {openOACModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-3 z-50">
          <div
            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6 border shadow-xl ${cardBg}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">YouTube Official Artist Channel</h3>
              <button
                onClick={() => setOpenOACModal(false)}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleOacSubmit}>
              {/* YouTube */}
              <div>
                <label>YouTube Channel Link *</label>
                <input
                  type="url"
                  value={oacForm.ytChannel}
                  onChange={(e) =>
                    setOacForm({ ...oacForm, ytChannel: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              {/* Topic */}
              <div>
                <label>Topic Channel Link</label>
                <input
                  type="url"
                  value={oacForm.topicChannel}
                  onChange={(e) =>
                    setOacForm({ ...oacForm, topicChannel: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${inputBg}`}
                />
              </div>

              {/* Artist */}
              <div>
                <label>Artist Name *</label>
                <input
                  type="text"
                  value={oacForm.artistName}
                  onChange={(e) =>
                    setOacForm({ ...oacForm, artistName: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              {/* ADD SONGS */}
              <div className="flex justify-between items-center">
                <span className={subtleText}>
                  Songs ({songs.length}) — Add minimum <b>3 songs</b>
                </span>

                <button
                  type="button"
                  onClick={() => setOpenAddSongModal(true)}
                  className="px-4 py-1 border rounded-lg text-[#29B6F6] border-[#29B6F6]"
                >
                  Add Song
                </button>
              </div>

              {/* SONG LIST */}
              <div
                className={`max-h-48 overflow-auto p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-[#11152b] border-white/10"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {songs.map((song, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 mb-2 rounded-lg ${
                      theme === "dark" ? "bg-[#0f1633]" : "bg-gray-200"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-xs text-gray-400">ISRC: {song.isrc}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSong(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {songs.length === 0 && (
                  <p className={subtleText}>No songs added</p>
                )}
              </div>

              {/* SUBMIT BUTTONS */}
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
                  disabled={!canSubmitOAC}
                  className={`px-5 py-2 rounded-lg text-white ${
                    canSubmitOAC
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

      {/* ADD SONG MODAL */}
      {openAddSongModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-3 z-50">
          <div
            className={`w-full max-w-md rounded-xl p-6 border shadow-xl ${cardBg}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Add Song</h3>
              <button
                onClick={() => setOpenAddSongModal(false)}
                className="text-gray-300 hover:text-red-500"
              >
                ✖
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleAddSong}>
              {/* Song Title */}
              <div>
                <label>Song Title</label>
                <input
                  type="text"
                  value={tempSong.title}
                  onChange={(e) =>
                    setTempSong({ ...tempSong, title: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              {/* ISRC */}
              <div>
                <label>ISRC</label>
                <input
                  type="text"
                  value={tempSong.isrc}
                  onChange={(e) =>
                    setTempSong({ ...tempSong, isrc: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              {/* MODAL FOOTER */}
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
                  className="px-4 py-2 rounded-lg text-white bg-[#29B6F6] hover:bg-[#0288D1]"
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

