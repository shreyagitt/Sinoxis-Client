import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Detect file type automatically
    const resourceType = file.mimetype.startsWith("video")
      ? "video"
      : file.mimetype.startsWith("image")
      ? "image"
      : "raw"; // for other files like pdf, zip, etc.

    return {
      folder: "sinoxis_media", // Folder name in Cloudinary
      resource_type: resourceType,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi", "mkv", "pdf", "zip"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // unique file name
    };
  },
});

// Multer setup
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/mov",
      "video/avi",
      "application/pdf",
      "application/zip",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Allowed: images, videos, pdf, zip."));
    }
    cb(null, true);
  },
});

// Export configured uploader
export default upload;

