import express from 'express';

import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
// import { registerUser, loginUser, logoutUser, getProtected } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// router.get('/protected', protect, getProtected);

export default router;
