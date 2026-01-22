import { Request, Response } from "express";
import Store from "../models/Store";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminStoreController = {

  /**
   * 🧾 List all stores
   * GET /api/v1/stores
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await Store.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  }),

  /**
   * ➕ Create Store
   * POST /api/v1/stores
   */
  create: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    let uploadResult;

    if (file) {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "sinoxis/stores",
      });
      fs.unlinkSync(file.path);
    }

    const store = await Store.create({
      name: req.body.name,
      platform: req.body.platform,
      icon: uploadResult?.secure_url,
      iconId: uploadResult?.public_id,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Store created successfully",
      data: store,
    });
  }),

  /**
   * ✏ Update Store
   * PATCH /api/v1/stores/:id
   */
  update: asyncHandler(async (req: Request, res: Response) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Store not found",
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(store.iconId);

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "sinoxis/stores",
      });

      fs.unlinkSync(req.file.path);
      store.icon = upload.secure_url;
      store.iconId = upload.public_id;
    }

    store.name = req.body.name || store.name;
    store.platform = req.body.platform || store.platform;
    await store.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Store updated",
      data: store,
    });
  }),

  /**
   * 🔄 Toggle Store Active
   * PATCH /api/v1/stores/:id/toggle
   */
  toggleActive: asyncHandler(async (req: Request, res: Response) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Store not found",
      });
    }

    store.isActive = !store.isActive;
    await store.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Store ${store.isActive ? "activated" : "deactivated"}`,
      data: store,
    });
  }),

  /**
   * ❌ Delete Store
   * DELETE /api/v1/stores/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Store not found",
      });
    }

    await cloudinary.uploader.destroy(store.iconId);
    await store.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Store deleted successfully",
    });
  }),
};
