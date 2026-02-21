import multer from "multer";
import path from "path";
import fs from "fs";

/* =========================================
   Ensure uploads folder exists
========================================= */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* =========================================
   STORAGE
========================================= */
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});

/* =========================================
   SAFE IMAGE FILE FILTER
========================================= */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  console.log("Uploaded file mimetype:", file.mimetype);

  // Allow ALL image types
  if (!file.mimetype.startsWith("image/")) {
    return cb(
      Object.assign(new Error("Only image files are allowed"), {
        code: "LIMIT_FILE_TYPE",
      }) as any,
      false
    );
  }

  cb(null, true);
};
/* =========================================
   MULTER CONFIG
========================================= */
const uploadLabel = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

export default uploadLabel;