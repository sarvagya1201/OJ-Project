import express from 'express';
import { addProblem, getAllProblems, getProblemById } from '../controllers/problemController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post(
  '/add',
  upload.fields([
    { name: 'testInput', maxCount: 1 },
    { name: 'testOutput', maxCount: 1 }
  ]),
  addProblem
);

// Get all problems
router.get('/', getAllProblems);

// Get a single problem by ID
router.get('/:id', getProblemById);

export default router;
