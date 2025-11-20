import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import AddArtist from "./AddArtist";
import ViewArtistModal from "./ViewArtistModal";
import EditArtistModal from "./EditArtistModal";

// ----------------------------
// API BASE URL
// ----------------------------
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ARTIST_API = `${BASE_URL}/client/artist`;

const Artist = () => {
  const [artists, setArtists] = useState([]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [showAddArtist, setShowAddArtist] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // ------------------------------------------------------------------
  // GET TOKEN
  // ------------------------------------------------------------------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // ------------------------------------------------------------------
  // FETCH ALL ARTISTS
  // ------------------------------------------------------------------
  const fetchArtists = async () => {
    try {
      const res = await axios.get(ARTIST_API, { headers: getAuthHeaders() });
      setArtists(res.data.data || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // ------------------------------------------------------------------
  // LOAD ARTIST
  // ------------------------------------------------------------------
  const loadArtist = async (id, action) => {
    try {
      const res = await axios.get(`${ARTIST_API}/${id}`, {
        headers: getAuthHeaders(),
      });

      setSelectedArtist(res.data.data);

      if (action === "view") setIsViewOpen(true);
      if (action === "edit") setIsEditOpen(true);
    } catch (error) {
      console.error("Error loading artist:", error);
    }
  };

  // ------------------------------------------------------------------
  // ADD ARTIST
  // ------------------------------------------------------------------
  const handleAddArtist = async (formDataValues) => {
    try {
      const fd = new FormData();
      Object.entries(formDataValues).forEach(([k, v]) => fd.append(k, v));

      await axios.post(ARTIST_API, fd, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      fetchArtists();
      setShowAddArtist(false);
    } catch (error) {
      console.error("Add Artist Error:", error);
      alert("Failed to add artist!");
    }
  };

  // ------------------------------------------------------------------
  // UPDATE ARTIST
  // ------------------------------------------------------------------
  const handleUpdateArtist = async (updatedData) => {
    try {
      const fd = new FormData();

      Object.entries(updatedData).forEach(([key, value]) => {
        if (key !== "_id") fd.append(key, value);
      });

      await axios.put(`${ARTIST_API}/${updatedData._id}`, fd, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      // fetch updated artist
      const fresh = await axios.get(`${ARTIST_API}/${updatedData._id}`, {
        headers: getAuthHeaders(),
      });

      // update UI list
      setArtists((prev) =>
        prev.map((a) => (a._id === updatedData._id ? fresh.data.data : a))
      );

      setSelectedArtist(fresh.data.data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Update Artist Error:", error);
      alert("Failed to update artist!");
    }
  };

  // ------------------------------------------------------------------
  // DELETE ARTIST
  // ------------------------------------------------------------------
  const deleteArtist = async (id) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;

    try {
      await axios.delete(`${ARTIST_API}/${id}`, {
        headers: getAuthHeaders(),
      });

      setArtists((prev) => prev.filter((artist) => artist._id !== id));
    } catch (error) {
      console.error("Delete Artist Error:", error);
      alert("Failed to delete artist!");
    }
  };

  // ------------------------------------------------------------------
  // FILTER + SEARCH
  // ------------------------------------------------------------------
  const filteredArtists = artists.filter((artist) => {
    const matchStatus =
      filter === "All" ? true : artist.status === filter;
    const matchSearch = artist.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------

  return (
    <div className="p-6 pl-10 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Artists</h1>
        <ol className="flex space-x-2 text-sm text-gray-500 mt-2 sm:mt-0">
          <li>Home</li>
          <li>/</li>
          <li className="text-red-600 font-medium">Artists</li>
        </ol>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow border border-gray-300 rounded-full px-4 py-2"
        />

        <button
          onClick={() => setShowAddArtist(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2"
        >
          Add Artist
        </button>
      </div>

      {/* Artist Count */}
      <div className="flex justify-between items-center mb-4">
        <h6 className="font-semibold text-gray-700">Artist Count</h6>
        <span>{filteredArtists.length}/{artists.length}</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Active", "Inactive"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md border transition ${
              filter === tab
                ? "bg-red-600 text-white border-red-600"
                : "border-red-600 text-red-600 hover:bg-red-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Artist List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArtists.map((artist) => (
          <div
            key={artist._id}
            className="bg-white border shadow-sm rounded-2xl text-center p-4"
          >
            <div className="relative inline-block mb-3">
              <img
                src={artist.artistImage || "https://placehold.co/150x150"}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <span
                className={`absolute bottom-0 right-1 w-4 h-4 border-2 border-white rounded-full ${
                  artist.status === "Active" ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>

            <h5 className="font-bold text-lg">{artist.name}</h5>
            <p className="text-sm text-gray-500">{artist.genre}</p>
            <p className="text-xs text-teal-600">{artist.followers} Followers</p>

            <div className="flex justify-center gap-2 mt-3">

              {/* VIEW */}
              <button
                onClick={() => loadArtist(artist._id, "view")}
                className="border px-3 py-1.5 rounded-md border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-1"
              >
                <Eye size={16} /> View
              </button>

              {/* EDIT */}
              <button
                onClick={() => loadArtist(artist._id, "edit")}
                className="border px-3 py-1.5 rounded-md border-green-600 text-green-600 hover:bg-green-600 hover:text-white flex items-center gap-1"
              >
                <Pencil size={16} /> Edit
              </button>

              {/* DELETE */}
              <button
                onClick={() => deleteArtist(artist._id)}
                className="border px-3 py-1.5 rounded-md border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredArtists.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No artists found.
        </div>
      )}

      {/* Add Artist Modal */}
      <AddArtist
        open={showAddArtist}
        onClose={() => setShowAddArtist(false)}
        onSubmit={handleAddArtist}
      />

      {/* View Artist Modal */}
      <ViewArtistModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        artist={selectedArtist}
        onEdit={() => loadArtist(selectedArtist?._id, "edit")}
      />

      {/* Edit Artist Modal */}
      <EditArtistModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        artist={selectedArtist}
        onSave={handleUpdateArtist}
      />
    </div>
  );
};

export default Artist;
