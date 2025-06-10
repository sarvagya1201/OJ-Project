import express from "express";
import { compileHandler } from "../controllers/customCompilerController.js";

const router = express.Router();

router.post("/", compileHandler);

export default router;
