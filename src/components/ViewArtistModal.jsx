import { X } from "lucide-react";

const ViewArtistModal = ({ open, onClose, artist, onEdit }) => {
  if (!open || !artist) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 relative">

        {/* Close Button (top right) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold border-b pb-3 mb-6">
          Artist Profile
        </h2>

        {/* Center Avatar */}
        <div className="text-center mb-4">
          <img
            src={artist.photo || "https://placehold.co/200"}
            alt="Artist"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />

          <h3 className="text-xl font-semibold mt-3">{artist.name}</h3>
          <p className="text-gray-500">{artist.genre}</p>
          <p className="text-teal-600 text-sm mt-1">
            {artist.followers} Followers
          </p>
        </div>

        {/* Info Section */}
        <div className="space-y-4 mt-6">

          <div>
            <h4 className="font-medium text-gray-800">About</h4>
            <p className="text-sm text-gray-600 mt-1">
              {artist.bio || "No bio available."}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800">Social</h4>
            <div className="mt-1 space-y-1 text-sm">
              {artist.spotify && (
                <a
                  href={artist.spotify}
                  target="_blank"
                  className="text-red-600 hover:underline block"
                >
                  Spotify
                </a>
              )}
              {artist.instagram && (
                <a
                  href={artist.instagram}
                  target="_blank"
                  className="text-red-600 hover:underline block"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onEdit(); // Opens the Edit Modal
            }}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewArtistModal;
