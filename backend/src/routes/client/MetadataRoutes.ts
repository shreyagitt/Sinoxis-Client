import { Router } from "express";
import multer from "multer";
import { MetadataController } from "../../controllers/client/MetadataController";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("artwork"), MetadataController.submit);
router.get("/",MetadataController.list);

export default router;
