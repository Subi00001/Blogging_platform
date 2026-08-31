import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPostsAdmin,
  deletePostAdmin,
  getAllCommentsAdmin,
  deleteCommentAdmin,
} from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();

// All admin routes require protect + adminOnly
router.use(protect as any);
router.use(adminOnly as any);

router.get('/stats', getAdminStats as any);

// User management
router.get('/users', getAllUsers as any);
router.put('/users/:id/role', updateUserRole as any);
router.delete('/users/:id', deleteUser as any);

// Post management
router.get('/posts', getAllPostsAdmin as any);
router.delete('/posts/:id', deletePostAdmin as any);

// Comment management
router.get('/comments', getAllCommentsAdmin as any);
router.delete('/comments/:id', deleteCommentAdmin as any);

export default router;
