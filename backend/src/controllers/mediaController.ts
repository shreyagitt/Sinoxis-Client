import { Request, Response } from "express";
import { uploadMedia, listMedia, deleteMedia } from "../services/mediaService";

interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

/**
 * Upload controller
 */
export const uploadMediaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = (req as MulterRequest).files;
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: "No files uploaded" });
      return;
    }

    const results = await uploadMedia(files);

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: results,
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
};

/**
 * List controller
 */
export const listMediaController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const resources = await listMedia();
    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error: any) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Could not fetch media list",
    });
  }
};

/**
 * Delete controller
 */
export const deleteMediaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { public_id } = req.params;
    const result = await deleteMedia(public_id);

    if (result.result === "not found") {
      res.status(404).json({ success: false, message: "File not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      result,
    });
  } catch (error: any) {
    console.error("❌ Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete file",
    });
  }
};
