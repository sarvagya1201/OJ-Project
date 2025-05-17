import express from "express";
import {
  addProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} from "../controllers/problemController.js";
import { upload } from "../middleware/upload.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
// Get all problems
router.get("/", getAllProblems);

// Get a single problem by ID
router.get("/:id", getProblemById);
router.post(
  "/add",
  protect,
  isAdmin,
  // Middleware to handle file uploads
  upload.fields([
    { name: "testInput", maxCount: 1 },
    { name: "testOutput", maxCount: 1 },
  ]),
  addProblem
);
router.put(
  "/:id",
  protect,
  isAdmin,
  upload.fields([{ name: "testInput" }, { name: "testOutput" }]),
  updateProblem
);
router.delete("/:id", protect, isAdmin, deleteProblem);

export default router;
