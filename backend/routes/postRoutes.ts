import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from '../controllers/postController';
import { getCommentsByPost, createComment } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// User specific posts (must be before /:id)
router.get('/user/my-posts', protect as any, getMyPosts as any);

// Comments nested under posts
router.get('/:postId/comments', getCommentsByPost);
router.post('/:postId/comments', protect as any, createComment as any);

// Posts CRUD
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect as any, createPost as any);
router.put('/:id', protect as any, updatePost as any);
router.delete('/:id', protect as any, deletePost as any);

export default router;
