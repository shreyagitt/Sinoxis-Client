import { Request, Response } from "express";
import Release from "../models/Release";
import { asyncHandler } from "../middlewares/errorHandler";

/* ✅ GET ALL */
export const getAllReleases = asyncHandler(async (_req: Request, res: Response) => {
  const data = await Release.find().populate("userId", "fullName email");
  res.json({ success: true, data });
});

/* ✅ CHANGE STATUS */
export const updateReleaseStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  const updated = await Release.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json({ success: true, data: updated });
});
