import { Request, Response } from "express";
import Release from "../models/Release";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const releaseController = {

 list: asyncHandler(async (req: Request, res: Response) => {
  const releases = await Release.find().populate("userId", "firstName lastName email");

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: releases,
  });
}),


  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status, remarks } = req.body;
    const release = await Release.findByIdAndUpdate(req.params.id, { status, remarks }, { new: true });

    res.status(HTTP_STATUS.OK).json({ success: true, data: release, message: "Status updated" });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await Release.findByIdAndDelete(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, message: "Release deleted" });
  }),
};
