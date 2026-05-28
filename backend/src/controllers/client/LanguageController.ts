import { Request, Response } from "express";
import Language from "../../models/Language";
import { asyncHandler } from "../../middlewares/errorHandler";

export const ClientLanguageController = {

  list: asyncHandler(async (_req: Request, res: Response) => {

    const languages = await Language.find({
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: languages,
    });

  }),

};