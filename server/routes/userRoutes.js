import express from "express";
import {
  getAllUsers,
  makeAdmin,
  demoteAdmin,
  getUserDashboard,
} from "../controllers/userController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getAllUsers);
router.put('/:userId/make-admin', protect, isAdmin, makeAdmin);
router.put('/:userId/demote', protect, isAdmin, demoteAdmin);
router.get("/dashboard", protect, getUserDashboard);

export default router;
