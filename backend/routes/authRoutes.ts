import express from 'express';
import { register, login, getProfile, updateProfile, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect as any, getProfile as any);
router.put('/profile', protect as any, updateProfile as any);
router.get('/me', protect as any, getMe as any);

export default router;
