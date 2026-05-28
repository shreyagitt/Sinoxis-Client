import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType: "image" | "video" = "video";

    if (file.fieldname === "cover") {
      resourceType = "image";
    }

    return {
      folder: "sinoxis_media",
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
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
      // 🔥 AUDIO
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/ogg",
    "audio/flac",
      "application/pdf",
      "application/zip",
    ];

   if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      Object.assign(new Error("Invalid file type"), {
        code: "LIMIT_FILE_TYPE",
      }) as any,
      false
    );
  }

  cb(null, true);
  },
});

// Export configured uploader
export default upload;

