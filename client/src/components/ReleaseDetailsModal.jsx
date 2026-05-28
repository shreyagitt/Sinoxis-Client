import { X } from "lucide-react";
import { useTheme } from "../components/Topbar"; // ⭐ THEME SUPPORT

const ReleaseDetailsModal = ({ open, onClose, release }) => {
  const { theme } = useTheme();

  if (!open || !release) return null;

  // THEME COLORS
  const cardBg =
    theme === "dark"
      ? "bg-[#0a1039] text-white border-white/10"
      : "bg-white text-[#020726] border-gray-300";

  const subtleText = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const statusColor = {
    Pending:
      theme === "dark"
        ? "bg-yellow-400 text-black"
        : "bg-yellow-300 text-yellow-900",
    "Action Required":
      theme === "dark"
        ? "bg-red-500 text-white"
        : "bg-red-300 text-red-800",
    Approved:
      theme === "dark"
        ? "bg-green-400 text-black"
        : "bg-green-300 text-green-900",
  };

  return (
    <div className=" inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* MODAL WRAPPER - scrollable */}
      <div
        className={`
          w-full max-w-xl max-h-[90vh] 
          overflow-y-auto rounded-lg shadow-xl p-6 border relative 
          transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-500/30 scrollbar-track-transparent 
          ${cardBg}
        `}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${
            theme === "dark"
              ? "text-gray-300 hover:text-red-400"
              : "text-gray-600 hover:text-red-600"
          }`}
        >
          <X size={22} />
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
          Release Details
        </h2>

        {/* COVER + TITLE */}
        <div className="flex flex-col items-center mb-5">
          <img
            src={
              release.cover ||
              "https://www.mixcloud.com/blog/wp-content/uploads/2023/11/Collage-1-2.png"
            }
            alt="Cover"
            className="w-32 h-32 rounded-lg object-cover mb-3"
          />

          <h3 className="text-lg font-bold text-center">{release.title}</h3>
          <p className={`${subtleText} text-center`}>
            {release.subtitle || "No subtitle"}
          </p>

          {/* STATUS */}
          <span
            className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
              statusColor[release.status] || statusColor.Pending
            }`}
          >
            {release.status}
          </span>
        </div>

        {/* DETAILS */}
        <div className={`border-t pt-4 text-sm space-y-2 ${subtleText}`}>
          <p>
            <span className="font-semibold">Release Date:</span>{" "}
            {release.releaseDate || "Not provided"}
          </p>
          <p>
            <span className="font-semibold">Primary Artist:</span>{" "}
            {release.artist || "Not provided"}
          </p>
          <p>
            <span className="font-semibold">Genre:</span>{" "}
            {release.genre || "Not provided"}
          </p>
          <p className="break-all">
            <span className="font-semibold">Track Link:</span>{" "}
            {release.tracksPreview || "Not provided"}
          </p>
        </div>

        {/* CLOSE BUTTON */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md font-medium transition ${
              theme === "dark"
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-gray-200 text-[#020726] hover:bg-gray-300"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReleaseDetailsModal;
