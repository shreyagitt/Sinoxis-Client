import { X } from "lucide-react";

const ReleaseDetailsModal = ({ open, onClose, release }) => {
  if (!open || !release) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Release Details</h2>

        <div className="flex flex-col items-center mb-5">
          <img
            src="https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
            alt="Cover"
            className="w-32 h-32 rounded-lg object-cover mb-3"
          />
          <h3 className="text-lg font-bold text-gray-800">{release.title}</h3>
          <p className="text-gray-500">{release.subtitle}</p>
          <span
            className={`mt-2 text-xs font-semibold px-2 py-1 rounded-md ${
              release.status === "Pending"
                ? "bg-yellow-200 text-yellow-800"
                : release.status === "Action Required"
                ? "bg-red-200 text-red-700"
                : "bg-green-200 text-green-700"
            }`}
          >
            {release.status}
          </span>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Release Date:</span> Not provided</p>
          <p><span className="font-semibold">Primary Artist:</span> Not provided</p>
          <p><span className="font-semibold">Genre:</span> Not provided</p>
          <p><span className="font-semibold">Track Link:</span> Not provided</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReleaseDetailsModal;
