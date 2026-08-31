import { Request, Response } from 'express';
import { db } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { sanitizeUser } from './authController';

// @desc    Get high-level platform stats for admin
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = db.getUsers();
    const posts = db.getPosts();
    const comments = db.getComments();

    // Active users: created a post or comment in last 30 days
    const activeUserIds = new Set<string>();
    posts.forEach((p) => activeUserIds.add(p.author));
    comments.forEach((c) => activeUserIds.add(c.user));

    // Build recent activity timeline
    const activity: {
      type: 'post' | 'comment' | 'user';
      description: string;
      timestamp: string;
      link?: string;
    }[] = [];

    posts.slice(-5).forEach((p) => {
      const author = db.getUserById(p.author);
      activity.push({
        type: 'post',
        description: `"${p.title}" was published by ${author?.name || 'User'}`,
        timestamp: p.createdAt,
        link: `/posts/${p._id}`,
      });
    });

    comments.slice(-5).forEach((c) => {
      const commenter = db.getUserById(c.user);
      const post = db.getPostById(c.post);
      activity.push({
        type: 'comment',
        description: `${commenter?.name || 'User'} commented on "${post?.title || 'a post'}"`,
        timestamp: c.createdAt,
        link: `/posts/${c.post}`,
      });
    });

    users.slice(-3).forEach((u) => {
      activity.push({
        type: 'user',
        description: `New member ${u.name} (@${u.username}) joined BlogSpace`,
        timestamp: u.createdAt,
      });
    });

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalPosts: posts.length,
        totalComments: comments.length,
        activeUsers: activeUserIds.size,
        recentActivity: activity.slice(0, 10),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving admin stats', error: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin Only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = db.getUsers().map(sanitizeUser);
    const posts = db.getPosts();
    const comments = db.getComments();

    const usersWithStats = users.map((u) => ({
      ...u,
      postsCount: posts.filter((p) => p.author === u._id).length,
      commentsCount: comments.filter((c) => c.user === u._id).length,
    }));

    res.json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving users', error: error.message });
  }
};

// @desc    Update a user role (USER / ADMIN)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin Only)
export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || (role !== 'USER' && role !== 'ADMIN')) {
      res.status(400).json({ success: false, message: 'Valid role (USER or ADMIN) is required' });
      return;
    }

    const user = db.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Safety: prevent admin from demoting themselves if they are the only admin
    if (req.user?._id === id && role === 'USER') {
      const admins = db.getUsers().filter((u) => u.role === 'ADMIN');
      if (admins.length <= 1) {
        res.status(400).json({ success: false, message: 'Cannot demote the only remaining Admin account' });
        return;
      }
    }

    const updated = db.updateUser(id, { role });

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: updated ? sanitizeUser(updated) : null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating user role', error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?._id === id) {
      res.status(400).json({ success: false, message: 'Admin cannot delete their own account' });
      return;
    }

    const user = db.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    db.deleteUser(id);

    res.json({
      success: true,
      message: 'User and all associated content deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
};

// @desc    Get all posts for admin table
// @route   GET /api/admin/posts
// @access  Private (Admin Only)
export const getAllPostsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = db.getPosts();
    const formatted = posts.map((p) => {
      const author = db.getUserById(p.author);
      const comments = db.getCommentsByPostId(p._id);
      return {
        ...p,
        author: author ? sanitizeUser(author) : { _id: p.author, name: 'Unknown', username: 'unknown' },
        commentsCount: comments.length,
      };
    });

    formatted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: formatted.length,
      posts: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving posts for admin', error: error.message });
  }
};

// @desc    Delete any post (Admin)
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin Only)
export const deletePostAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = db.getPostById(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    db.deletePost(id);

    res.json({
      success: true,
      message: 'Post deleted successfully by Admin',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting post', error: error.message });
  }
};

// @desc    Get all comments across all posts (Admin)
// @route   GET /api/admin/comments
// @access  Private (Admin Only)
export const getAllCommentsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comments = db.getComments();
    const formatted = comments.map((c) => {
      const user = db.getUserById(c.user);
      const post = db.getPostById(c.post);
      return {
        ...c,
        user: user ? sanitizeUser(user) : { _id: c.user, name: 'Unknown', username: 'unknown' },
        post: post ? { _id: post._id, title: post.title } : { _id: c.post, title: 'Deleted Post' },
      };
    });

    formatted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: formatted.length,
      comments: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving comments for admin', error: error.message });
  }
};

// @desc    Delete any comment (Admin)
// @route   DELETE /api/admin/comments/:id
// @access  Private (Admin Only)
export const deleteCommentAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = db.getCommentById(id);

    if (!comment) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    db.deleteComment(id);

    res.json({
      success: true,
      message: 'Comment removed successfully by Admin',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting comment', error: error.message });
  }
};
