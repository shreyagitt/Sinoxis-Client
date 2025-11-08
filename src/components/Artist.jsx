import React, { useState } from "react";
import { Eye, Pencil } from "lucide-react";

const Artist = () => {
  // Sample artist data
  const [artists, setArtists] = useState([
    { id: 1, name: "Ava Stone", genre: "Pop / R&B", followers: "12K", status: "Active" },
    { id: 2, name: "Liam Grey", genre: "Indie / Rock", followers: "8K", status: "Inactive" },
    { id: 3, name: "Mia Luna", genre: "Hip-Hop", followers: "15K", status: "Active" },
    { id: 4, name: "Ethan Ray", genre: "Jazz", followers: "10K", status: "Inactive" },
    { id: 5, name: "Zoe Heart", genre: "Pop", followers: "22K", status: "Active" },
  ]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Filter + Search logic
  const filteredArtists = artists.filter((artist) => {
    const matchesFilter =
      filter === "All" ? true : artist.status === filter;
    const matchesSearch = artist.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 pl-10 min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 ">
        <h1 className="text-2xl font-semibold text-gray-800">Artists</h1>
        <ol className="flex space-x-2 text-sm text-gray-500 mt-2 sm:mt-0">
          <li>Home</li>
          <li>/</li>
          <li className="text-red-600 font-medium">Artists</li>
        </ol>
      </div>

      {/* Search + Create */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 w-full sm:w-auto">
          Add Artist
        </button>
      </div>

      {/* Artist Count */}
      <div className="flex justify-between items-center mb-4">
        <h6 className="font-semibold text-gray-700">Artist Count</h6>
        <div className="flex items-center gap-1 text-gray-600">
          <span>{filteredArtists.length}</span>/<span>{artists.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Active", "Inactive"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md border transition-all duration-200 ${
              filter === tab
                ? "bg-red-600 text-white border-red-600"
                : "border-red-600 text-red-600 hover:bg-red-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Artist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            className="bg-white border border-gray-200 shadow-sm rounded-2xl text-center p-4 hover:shadow-md transition-all"
          >
            <div className="relative inline-block mb-3">
              <img
                src="https://t3.ftcdn.net/jpg/02/21/36/46/360_F_221364612_g7V74caMhrOe5AF7kM0NLAzBKvz0eQFB.jpg"
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <span
                className={`absolute bottom-0 right-1 w-4 h-4 border-2 border-white rounded-full ${
                  artist.status === "Active" ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>
            <h5 className="font-bold text-lg text-gray-800 mb-1">
              {artist.name}
            </h5>
            <p className="text-sm text-gray-500 mb-1">{artist.genre}</p>
            <p 
            style={{
      borderColor: "#007F6E",
      color: "#007F6E",
    }}
            className="text-xs text-gray-400 mb-3">
              {artist.followers} Followers
            </p>

<div className="flex items-center justify-center gap-2">
  {/* View Button */}
  <button
    className="border px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors duration-200 
               border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
  >
    <Eye size={16} className="text-current" />
    View
  </button>

  {/* Edit Button */}
  <button
    className="border px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors duration-200"
    style={{
      borderColor: "#007F6E",
      color: "#007F6E",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#007F6E";
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#007F6E";
    }}
  >
    <Pencil size={16} style={{ color: "currentColor" }} />
    Edit
  </button>
</div>




          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredArtists.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No artists found.
        </div>
      )}
    </div>
  );
};

export default Artist;
