import { Request, Response } from 'express';
import { db, DBComment } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { sanitizeUser } from './authController';

// Helper to populate user details on comments
const populateComment = (comment: DBComment) => {
  const user = db.getUserById(comment.user);
  return {
    ...comment,
    user: user
      ? sanitizeUser(user)
      : { _id: comment.user, name: 'Anonymous User', username: 'anonymous', profileImage: '', role: 'USER' },
  };
};

// @desc    Get comments for a specific post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const post = db.getPostById(postId);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const comments = db.getCommentsByPostId(postId);
    const populatedComments = comments.map(populateComment);

    // Sort newest comments first
    populatedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: populatedComments.length,
      comments: populatedComments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching comments', error: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to leave a comment' });
      return;
    }

    const { postId } = req.params;
    const { content } = req.body;

    const post = db.getPostById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Validation: Empty comments
    if (!content || content.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Comment cannot be empty' });
      return;
    }

    // Validation: Length limit
    if (content.trim().length > 1000) {
      res.status(400).json({ success: false, message: 'Comment is too long (maximum 1000 characters)' });
      return;
    }

    const newComment = db.createComment({
      post: postId,
      user: req.user._id,
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      comment: populateComment(newComment),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error posting comment', error: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (Owner or Admin)
export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const { content } = req.body;

    const comment = db.getCommentById(id);
    if (!comment) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    // Ownership or Admin check
    if (comment.user !== req.user._id && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own comments' });
      return;
    }

    if (!content || content.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Comment cannot be empty' });
      return;
    }

    if (content.trim().length > 1000) {
      res.status(400).json({ success: false, message: 'Comment exceeds max length of 1000 characters' });
      return;
    }

    const updated = db.updateComment(id, content.trim());

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment: updated ? populateComment(updated) : null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating comment', error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner or Admin)
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const comment = db.getCommentById(id);

    if (!comment) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    // Ownership or Admin check
    if (comment.user !== req.user._id && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own comments' });
      return;
    }

    db.deleteComment(id);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting comment', error: error.message });
  }
};
