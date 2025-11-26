// src/pages/OfficialArtistChannel.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Topbar"; // ⭐ THEME SUPPORT

const sampleRequests = [
  {
    ytChannel: "www.youtube.com/Channel",
    topicChannel: "www.youtube.com/Channel",
    artist: "Demo artist",
    date: "05-11-2025, 06:25 PM",
    status: "Submitted",
  },
  {
    ytChannel: "www.youtube.com/Channel",
    topicChannel: "www.youtube.com/Channel",
    artist: "Demo artist",
    date: "05-11-2025, 06:25 PM",
    status: "Submitted",
  },
];

const StatusPill = ({ status = "Submitted" }) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center 
        px-3 py-1 rounded-full text-sm font-semibold
      `}
      style={{
        width: "fit-content",
        background:
          status === "Pending" || status === "Submitted"
            ? "#F4C20D"
            : status === "Rejected"
            ? "#DB0000"
            : "#00C851",
        color:
          status === "Rejected" || status === "Released"
            ? "white"
            : "black",
      }}
    >
      {status}
    </span>
  );
};


export default function OfficialArtistChannel() {
  const { theme } = useTheme(); // ⭐ GET THEME

  // THEME COLORS
  const pageBg = theme === "dark" ? "bg-[#020726] text-white" : "bg-white text-[#020726]";
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-300 shadow-md";

  const labelColor = theme === "dark" ? "text-white" : "text-[#020726]";
  const inputBg =
    theme === "dark"
      ? "bg-[#1b214d] border-white/10 text-white"
      : "bg-gray-100 border-gray-300 text-[#020726]";

  const modalBg =
    theme === "dark"
      ? "bg-[#0a1039] border-white/10"
      : "bg-white border-gray-300";

  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const [openOACModal, setOpenOACModal] = useState(false);
  const [openAddSongModal, setOpenAddSongModal] = useState(false);

  const [oacForm, setOacForm] = useState({
    ytChannel: "",
    topicChannel: "",
    artistName: "",
  });

  const [songs, setSongs] = useState([]);
  const [tempSong, setTempSong] = useState({ title: "", isrc: "" });

  const [requests] = useState(sampleRequests);

  const oacCanSubmit =
    songs.length >= 3 &&
    oacForm.ytChannel.trim() &&
    oacForm.artistName.trim();

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
    alert("Submitted (Demo)");
    setSongs([]);
    setOacForm({ ytChannel: "", topicChannel: "", artistName: "" });
    setOpenOACModal(false);
  };

  return (
    <div className={`min-h-screen px-10 py-8 transition-all duration-300 ${pageBg}`}>

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold">Official Artist Channel</h1>
        <p className={subtleText}>
          Home <span className="text-[#29B6F6]"> / Official Artist Channel</span>
        </p>
      </div>

      {/* MAIN CARD */}
      <div className={`rounded-xl p-10 border shadow-lg transition-all duration-300 ${cardBg}`}>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Official Artist Channel</h2>

          <button
            onClick={() => setOpenOACModal(true)}
            className={`px-5 py-2 rounded-full border ${
              theme === "dark"
                ? "border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/20"
                : "border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1] hover:text-white"
            }`}
          >
            Add Request
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 my-6">
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

        {/* TABLE HEADER */}
        <div
          className={`grid grid-cols-5 gap-6 font-semibold py-3 border-t ${
            theme === "dark" ? "border-white/10" : "border-gray-300"
          } ${subtleText}`}
        >
          <div>YouTube Channel Link</div>
          <div>Topic Channel Link</div>
          <div>Artist Name</div>
          <div>Requested at</div>
          <div>Status</div>
        </div>

        {/* TABLE ROWS */}
        <div className="mt-4 space-y-4">
          {requests.map((item, i) => (
            <div
              key={i}
              className={`grid grid-cols-5 gap-6 py-4 border-b ${
                theme === "dark" ? "border-white/10" : "border-gray-300"
              }`}
            >
              <div>{item.ytChannel}</div>
              <div>{item.topicChannel}</div>
              <div>{item.artist}</div>
              <div>{item.date}</div>
              <StatusPill status={item.status} theme={theme} />
            </div>
          ))}
        </div>
      </div>

      {/* OAC REQUEST MODAL */}
      {openOACModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className={`w-full max-w-3xl rounded-xl p-6 border shadow-xl ${modalBg}`}>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">YouTube Official Artist Channel</h3>
              <button
                onClick={() => setOpenOACModal(false)}
                className={`${subtleText} hover:text-red-500 text-xl`}
              >
                ✖
              </button>
            </div>

            <div className={`mb-4 ${subtleText}`}>
              Songs Added: <span className="font-semibold">{songs.length}</span>
            </div>

            <form onSubmit={handleOacSubmit} className="space-y-5">

              {/* YouTube Channel */}
              <div>
                <label className={`text-sm ${labelColor}`}>YouTube Channel Link *</label>
                <input
                  type="url"
                  value={oacForm.ytChannel}
                  onChange={(e) => setOacForm({ ...oacForm, ytChannel: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              {/* Topic Channel */}
              <div>
                <label className={`text-sm ${labelColor}`}>Topic Channel Link</label>
                <input
                  type="url"
                  value={oacForm.topicChannel}
                  onChange={(e) => setOacForm({ ...oacForm, topicChannel: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                />
              </div>

              {/* Artist Name */}
              <div>
                <label className={`text-sm ${labelColor}`}>Artist Name *</label>
                <input
                  type="text"
                  value={oacForm.artistName}
                  onChange={(e) => setOacForm({ ...oacForm, artistName: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              {/* SONGS AREA */}
              <div className="flex justify-between items-center">
                <div className={`text-sm ${subtleText}`}>
                  Songs ({songs.length}) — Add minimum <b>3 songs</b>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenAddSongModal(true)}
                  className={`px-4 py-1 rounded-md border ${
                    theme === "dark"
                      ? "border-[#29B6F6] text-[#29B6F6]"
                      : "border-[#0288D1] text-[#0288D1]"
                  }`}
                >
                  Add Song
                </button>
              </div>

              <div
                className={`max-h-48 overflow-auto rounded-lg p-3 border ${
                  theme === "dark"
                    ? "bg-[#11152b] border-white/10"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {songs.length === 0 && (
                  <div className={`${subtleText} text-sm`}>No songs added</div>
                )}

                {songs.map((song, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 my-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-[#0f1633]"
                        : "bg-gray-200"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-xs text-gray-400">ISRC: {song.isrc}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSong(i)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* SUBMIT / CANCEL */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpenOACModal(false)}
                  className={`px-5 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "border-gray-400 text-gray-300"
                      : "border-gray-400 text-[#020726]"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!oacCanSubmit}
                  className={`px-5 py-2 rounded-lg text-white ${
                    oacCanSubmit
                      ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1]"
                      : "bg-gray-400 opacity-60 cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className={`w-full max-w-md rounded-xl p-6 border shadow-xl ${modalBg}`}>

            <div className="flex justify-between items-center mb-5">
              <h4 className="text-lg font-semibold">Add Song</h4>
              <button
                onClick={() => setOpenAddSongModal(false)}
                className={`${subtleText} hover:text-red-500`}
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleAddSong} className="space-y-5">

              <div>
                <label className={`text-sm ${labelColor}`}>Song Title</label>
                <input
                  type="text"
                  value={tempSong.title}
                  onChange={(e) => setTempSong({ ...tempSong, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              <div>
                <label className={`text-sm ${labelColor}`}>ISRC</label>
                <input
                  type="text"
                  value={tempSong.isrc}
                  onChange={(e) => setTempSong({ ...tempSong, isrc: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenAddSongModal(false)}
                  className={`px-4 py-2 border rounded-md ${
                    theme === "dark"
                      ? "border-gray-500 text-gray-300"
                      : "border-gray-500 text-[#020726]"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-[#29B6F6] hover:bg-[#0288D1]"
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
