import express from "express";
import upload from "../middlewares/upload";
import {
  uploadMediaController,
  listMediaController,
  deleteMediaController,
} from "../controllers/mediaController";

const router = express.Router();

router.post("/upload", upload.array("files", 10), uploadMediaController);
router.get("/list", listMediaController);
router.delete("/delete/:public_id", deleteMediaController);

export default router;

