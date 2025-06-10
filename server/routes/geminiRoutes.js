import express from "express";
import { reviewCode } from "../controllers/geminiController.js";
import {analyzeTimeComplexity } from "../controllers/timeComplexityController.js";
const router = express.Router();

router.post("/review", reviewCode);
router.post("/time_comp", analyzeTimeComplexity);

export default router;
