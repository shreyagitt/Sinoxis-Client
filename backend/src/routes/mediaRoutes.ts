import express, { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import upload from "../middlewares/upload";

const router = express.Router();

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ✅ Define a type-safe Request interface for Multer
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

/**
 * @desc Upload media (images or videos)
 * @route POST /api/media/upload
 */
router.post(
  "/upload",
  upload.array("files", 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = (req as MulterRequest).files;

      if (!files || files.length === 0) {
        res
          .status(400)
          .json({ success: false, message: "No files uploaded" });
        return;
      }

      const uploadResults: {
        url: string;
        public_id: string;
        resource_type: string;
      }[] = [];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "sinoxis_media",
          resource_type: file.mimetype.startsWith("video")
            ? "video"
            : "image",
        });

        uploadResults.push({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      }

      res.status(200).json({
        success: true,
        message: "Files uploaded successfully",
        files: uploadResults,
      });
    } catch (error: unknown) {
      console.error("❌ Upload error:", error);
      const err = error as Error;
      res.status(500).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }
  }
);

/**
 * @desc Fetch all media from Cloudinary
 * @route GET /api/media/list
 */
router.get("/list", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "sinoxis_media/",
      max_results: 30,
    });

    const mappedResources = result.resources.map((r: any) => ({
      public_id: r.public_id,
      url: r.secure_url,
      format: r.format,
      resource_type: r.resource_type,
    }));

    res.status(200).json({
      success: true,
      resources: mappedResources,
    });
  } catch (error: unknown) {
    console.error("❌ Fetch error:", error);
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.message || "Could not fetch media list",
    });
  }
});

/**
 * @desc Delete media by public_id
 * @route DELETE /api/media/delete/:public_id
 */
router.delete(
  "/delete/:public_id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { public_id } = req.params;

      const result = await cloudinary.uploader.destroy(public_id, {
        resource_type: "auto",
      });

      if (result.result === "not found") {
        res
          .status(404)
          .json({ success: false, message: "File not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "File deleted successfully",
        result,
      });
    } catch (error: unknown) {
      console.error("❌ Delete error:", error);
      const err = error as Error;
      res.status(500).json({
        success: false,
        message: err.message || "Failed to delete file",
      });
    }
  }
);

export default router;
