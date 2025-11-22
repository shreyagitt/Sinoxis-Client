// src/pages/OfficialArtistChannel.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
  const map = {
    Submitted: "bg-yellow-400 text-black",
    Pending: "bg-yellow-400 text-black",
    Rejected: "bg-red-600 text-white",
    Released: "bg-green-500 text-white",
  };
  return (
    <span className={`px-4 py-1 rounded-full text-sm ${map[status] || map.Submitted}`}>
      {status}
    </span>
  );
};

export default function OfficialArtistChannel() {
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
    <div className="min-h-screen bg-[#020726] text-white px-10 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold">Official Artist Channel</h1>
        <p className="text-gray-300">
          Home <span className="text-[#29B6F6]"> / Official Artist Channel</span>
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-[#0a1039] border border-white/10 rounded-xl p-10 shadow-lg">

        {/* Title + Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Official Artist Channel</h2>

          <button
            onClick={() => setOpenOACModal(true)}
            className="px-5 py-2 rounded-full border border-[#29B6F6] text-[#29B6F6] hover:bg-[#29B6F6]/20"
          >
            Add Request
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 my-6">
          <Link
            to="/requests/claim"
            className="px-5 py-2 border border-[#29B6F6] rounded-full text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
          >
            Copyright Claims
          </Link>

          <Link
            to="/requests/artist"
            className="px-5 py-2 border border-[#29B6F6] rounded-full text-[#29B6F6] hover:bg-[#29B6F6] hover:text-white"
          >
            Official Artist Channel
          </Link>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-5 gap-6 text-gray-10 font-semibold py-3 border-t border-white/10">
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
              className="grid grid-cols-5 gap-6 py-4 border-b border-white/10"
            >
              <div>{item.ytChannel}</div>
              <div>{item.topicChannel}</div>
              <div>{item.artist}</div>
              <div>{item.date}</div>
              <div><StatusPill status={item.status} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------------------------- */}
      {/*                         OAC REQUEST MODAL (FIXED STRUCTURE)                     */}
      {/* -------------------------------------------------------------------------------- */}

      {openOACModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-[#0a1039] w-full max-w-3xl border border-white/10 rounded-xl shadow-xl p-6">

            {/* HEADER FIXED */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">YouTube Official Artist Channel</h3>

              <button
                onClick={() => setOpenOACModal(false)}
                className="text-gray-300 hover:text-white text-xl"
              >
                ✖
              </button>
            </div>

            {/* SONG COUNT */}
            <div className="mb-4 text-gray-300">
              Songs Added: <span className="font-semibold">{songs.length}</span>
            </div>

            {/* FORM */}
            <form onSubmit={handleOacSubmit} className="space-y-5">

              <div>
                <label className="text-sm">YouTube Channel Link *</label>
                <input
                  type="url"
                  value={oacForm.ytChannel}
                  onChange={(e) => setOacForm({ ...oacForm, ytChannel: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b214d] text-white border border-white/10 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Topic Channel Link</label>
                <input
                  type="url"
                  value={oacForm.topicChannel}
                  onChange={(e) => setOacForm({ ...oacForm, topicChannel: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b214d] text-white border border-white/10 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm">Artist Name *</label>
                <input
                  type="text"
                  value={oacForm.artistName}
                  onChange={(e) => setOacForm({ ...oacForm, artistName: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b214d] text-white border border-white/10 rounded-lg"
                  required
                />
              </div>

              {/* SONGS AREA */}
              <div className="flex justify-between items-center">
                <div className="text-gray-300 text-sm">
                  Songs ({songs.length}) - Add minimum <b>3 songs</b>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenAddSongModal(true)}
                  className="px-4 py-1 rounded-md border border-[#29B6F6] text-[#29B6F6]"
                >
                  Add Song
                </button>
              </div>

              <div className="max-h-48 overflow-auto bg-[#11152b] rounded-lg p-3 border border-white/10">
                {songs.length === 0 && (
                  <div className="text-gray-400 text-sm">No songs added</div>
                )}

                {songs.map((song, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-[#0f1633] p-3 my-2 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-xs text-gray-400">ISRC: {song.isrc}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSong(i)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* SUBMIT / CANCEL BUTTONS */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenOACModal(false)}
                  className="px-5 py-2 border border-gray-400 rounded-lg text-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!oacCanSubmit}
                  className={`px-5 py-2 rounded-lg text-white ${
                    oacCanSubmit
                      ? "bg-gradient-to-r from-[#29B6F6] to-[#0288D1]"
                      : "bg-gray-600 opacity-50 cursor-not-allowed"
                  }`}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/*                                ADD SONG MODAL                                     */}
      {/* -------------------------------------------------------------------------------- */}
      {openAddSongModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-[#0a1039] w-full max-w-md p-6 border border-white/10 rounded-xl shadow-xl">

            <div className="flex justify-between items-center mb-5">
              <h4 className="text-lg font-semibold">Add Song</h4>
              <button
                onClick={() => setOpenAddSongModal(false)}
                className="text-gray-300 hover:text-white"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleAddSong} className="space-y-5">

              <div>
                <label className="text-sm">Song Title</label>
                <input
                  type="text"
                  value={tempSong.title}
                  onChange={(e) => setTempSong({ ...tempSong, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b214d] text-white border border-white/10 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm">ISRC</label>
                <input
                  type="text"
                  value={tempSong.isrc}
                  onChange={(e) => setTempSong({ ...tempSong, isrc: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b214d] text-white border border-white/10 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenAddSongModal(false)}
                  className="px-4 py-2 border border-gray-500 text-gray-300 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#29B6F6] hover:bg-[#0288D1] text-white rounded-md"
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
