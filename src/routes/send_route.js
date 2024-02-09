import express from "express";
import sendAndGeneratePDF from "../controllers/send_controller.js";
const router = express.Router();

router.post("/generate-and-send", sendAndGeneratePDF);

export default router;
