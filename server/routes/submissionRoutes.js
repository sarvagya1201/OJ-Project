import express from "express";
import {
  createSubmission,
  mySubmissions,
  getSubmissionById,
} from "../controllers/submissionController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect, createSubmission);
router.get("/my-submissions", protect, mySubmissions);
router.get("/:id", protect, getSubmissionById);

export default router;
