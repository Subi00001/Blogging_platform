import express from 'express';
import { updateComment, deleteComment } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/:id', protect as any, updateComment as any);
router.delete('/:id', protect as any, deleteComment as any);

export default router;
