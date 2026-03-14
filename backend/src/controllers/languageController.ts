import { Request, Response } from "express";
import Language from "../models/Language";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminLanguageController = {

  /* LIST */
  list: asyncHandler(async (_req: Request, res: Response) => {

    const languages = await Language.find().sort({ name: 1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: languages,
    });

  }),

  /* CREATE */
  create: asyncHandler(async (req: Request, res: Response) => {

    const language = await Language.create({
      name: req.body.name,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Language created",
      data: language,
    });

  }),

  /* UPDATE */
  update: asyncHandler(async (req: Request, res: Response) => {

    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({
        success: false,
        error: "Language not found",
      });
    }

    language.name = req.body.name || language.name;

    await language.save();

    res.status(200).json({
      success: true,
      message: "Language updated",
      data: language,
    });

  }),

  /* TOGGLE */
  toggleActive: asyncHandler(async (req: Request, res: Response) => {

    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({
        success: false,
        error: "Language not found",
      });
    }

    language.isActive = !language.isActive;
    await language.save();

    res.status(200).json({
      success: true,
      data: language,
    });

  }),

  /* DELETE */
  delete: asyncHandler(async (req: Request, res: Response) => {

    await Language.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Language deleted",
    });

  }),

};