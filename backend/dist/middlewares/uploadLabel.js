"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
/* =========================================
   Ensure uploads folder exists
========================================= */
const uploadDir = "uploads";
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
/* =========================================
   STORAGE
========================================= */
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
        cb(null, uniqueName);
    },
});
/* =========================================
   SAFE IMAGE FILE FILTER
========================================= */
const fileFilter = (_req, file, cb) => {
    console.log("Uploaded file mimetype:", file.mimetype);
    // Allow ALL image types
    if (!file.mimetype.startsWith("image/")) {
        return cb(Object.assign(new Error("Only image files are allowed"), {
            code: "LIMIT_FILE_TYPE",
        }), false);
    }
    cb(null, true);
};
/* =========================================
   MULTER CONFIG
========================================= */
const uploadLabel = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
});
exports.default = uploadLabel;
