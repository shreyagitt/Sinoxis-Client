import { X } from "lucide-react";

const ViewArtistModal = ({ open, onClose, artist, onEdit }) => {
  if (!open || !artist) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold border-b pb-3 mb-6">
          Artist Profile
        </h2>

        <div className="text-center mb-4">
          <img
            src={artist.artistImage || "https://placehold.co/200"}
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />

          <h3 className="text-xl font-semibold mt-3">{artist.name}</h3>
          <p className="text-gray-500">{artist.genre}</p>

          <p className="text-teal-600 text-sm mt-1">
            {artist.followers} Followers
          </p>
        </div>

        <div className="space-y-4 mt-6">

          <div>
            <h4 className="font-medium">About</h4>
            <p className="text-sm text-gray-600 mt-1">
              {artist.bio || "No bio available."}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Social Links</h4>
            <div className="text-sm mt-2 space-y-1">
              {artist.spotify && (
                <a href={artist.spotify} target="_blank" className="text-red-600">
                  Spotify
                </a>
              )}
              {artist.instagram && (
                <a href={artist.instagram} target="_blank" className="text-red-600">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewArtistModal;
