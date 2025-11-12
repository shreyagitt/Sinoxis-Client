import { Router } from "express";
import multer from "multer";
import { FacebookVideoController } from "../../controllers/client/FacebookVideoController";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("screenshotFb"),FacebookVideoController.submit);
router.get("/", FacebookVideoController.list);

export default router;
