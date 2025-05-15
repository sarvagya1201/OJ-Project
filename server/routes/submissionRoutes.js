import express from 'express';
import { createSubmission } from '../controllers/submissionController.js';
import { protect, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/', protect, createSubmission);


export default router;
