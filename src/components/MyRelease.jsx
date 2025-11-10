import React, { useState } from "react";
import CreateReleaseModal from "./CreateReleaseModal";
import ReleaseDetailsModal from "./ReleaseDetailsModal";

const MyReleases = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState(null);

  const releases = [
    { id: 1, title: "DEMO TUNE", subtitle: "Demo Song", status: "Pending" },
    { id: 2, title: "DEMO TUNE", subtitle: "Demo Song", status: "Pending" },
    { id: 3, title: "DEMO TUNE", subtitle: "Demo Song", status: "Pending" },
    { id: 4, title: "DEMO TUNE", subtitle: "Demo Song", status: "Action Required" },
    { id: 5, title: "DEMO TUNE", subtitle: "Demo Song", status: "Pending" },
    { id: 6, title: "DEMO TUNE", subtitle: "Demo Song", status: "Pending" },
    { id: 7, title: "DEMO TUNE", subtitle: "Demo Song", status: "Pending" },
    { id: 8, title: "DEMO TUNE", subtitle: "Demo Song", status: "Pending" },
  ];

  // 🧠 Filter state
  const [filter, setFilter] = useState("All");

  // 🔍 Filter logic
  const filteredReleases =
    filter === "All"
      ? releases
      : releases.filter((r) => r.status === filter);


  return (
    <div className="p-6 pl-10 min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 ">
        <h1 className="text-2xl font-semibold text-gray-800">My Releases</h1>
        <ol className="flex space-x-2 text-sm text-gray-500 mt-2 sm:mt-0">
          <li>Home</li>
          <li>/</li>
          <li className="text-red-700 font-medium">My Releases</li>
        </ol>
      </div>

      {/* Search + Create */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Type & Enter to search"
          className="flex-grow w-full sm:w-auto rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button 
         onClick={() => setIsModalOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2">
          Create
        </button>
      </div>

      <CreateReleaseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => console.log("✅ Release Submitted:", data)}
      />

       <ReleaseDetailsModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        release={selectedRelease}
      />

      {/* Release Count */}
      <div className="flex justify-between items-center mb-4">
        <h6 className="font-semibold text-gray-700">Release Count</h6>
        <div className="flex items-center gap-1 text-gray-600">
           <span>{filteredReleases.length}</span>/<span>{releases.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Approved", "Pending", "Action Required"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md border ${
              filter === tab
                ? "bg-red-600 text-white border-red-600"
                : "border-red-600 text-red-600 hover:bg-red-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredReleases.map((release) => (
          <div
            key={release.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src="https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
              alt="Release Cover"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <small className="text-gray-500">{release.subtitle}</small>
              <h5 className="font-bold text-lg mb-2 text-gray-800">
                {release.title}
              </h5>
              <div className="flex justify-between items-center">
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 text-xs font-semibold rounded-md">
                  {release.status}
                </span>
                <button 
                onClick={() => { setSelectedRelease(release); setViewModalOpen(true); }}
                className="border border-red-600 text-red-600 hover:bg-red-50 rounded-md px-3 py-1 text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReleases;
