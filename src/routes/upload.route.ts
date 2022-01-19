import express from "express";
import { uploadImage } from "../controllers/upload.controller";
import { authAdmin } from "../middleware/authAdmin";

const router = express.Router();

router.post("/", uploadImage);
export = router;
