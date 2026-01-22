import { Request, Response } from "express";
import Store from "../../models/Store";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientStoreController = {

  /**
   * 📋 List Active Stores (Client View)
   * GET /api/v1/client/stores
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await Store.find({ isActive: true }).sort({ name: 1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }),
};
