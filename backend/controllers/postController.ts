import { Request, Response } from 'express';
import { db, DBPost } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { sanitizeUser } from './authController';

// Helper to populate author and comments count on a post
const populatePost = (post: DBPost) => {
  const author = db.getUserById(post.author);
  const comments = db.getCommentsByPostId(post._id);

  return {
    ...post,
    author: author ? sanitizeUser(author) : { _id: post.author, name: 'Unknown Author', username: 'unknown' },
    commentsCount: comments.length,
  };
};

// @desc    Get all posts with search, category filtering, sorting, and pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search = '',
      category = '',
      tag = '',
      author = '',
      sort = 'latest',
      page = '1',
      limit = '9',
    } = req.query;

    let posts = db.getPosts();

    // Search filter: title, content, description, author name
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      posts = posts.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const contentMatch = p.content.toLowerCase().includes(q);
        const authorObj = db.getUserById(p.author);
        const authorMatch = authorObj
          ? authorObj.name.toLowerCase().includes(q) || authorObj.username.toLowerCase().includes(q)
          : false;
        return titleMatch || descMatch || contentMatch || authorMatch;
      });
    }

    // Category filter
    if (category && typeof category === 'string' && category.trim() !== '' && category.toLowerCase() !== 'all') {
      posts = posts.filter((p) => p.category.toLowerCase() === category.trim().toLowerCase());
    }

    // Tag filter
    if (tag && typeof tag === 'string' && tag.trim() !== '') {
      posts = posts.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.trim().toLowerCase())
      );
    }

    // Author ID filter
    if (author && typeof author === 'string' && author.trim() !== '') {
      posts = posts.filter((p) => p.author === author.trim());
    }

    // Calculate category counts
    const allPosts = db.getPosts();
    const categoryCounts: { [key: string]: number } = {};
    allPosts.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    // Populate posts with author & commentsCount before sorting
    const populatedPosts = posts.map(populatePost);

    // Sorting
    if (sort === 'oldest') {
      populatedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'comments') {
      populatedPosts.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    } else if (sort === 'views') {
      populatedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      // Default: latest
      populatedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 9);
    const totalPosts = populatedPosts.length;
    const totalPages = Math.ceil(totalPosts / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedPosts = populatedPosts.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      posts: paginatedPosts,
      totalPosts,
      currentPage: pageNum,
      totalPages,
      categories: categoryCounts,
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving posts', error: error.message });
  }
};

// @desc    Get single post by ID (and increment view count)
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = db.getPostById(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Increment views count
    db.incrementPostViews(id);
    post.views = (post.views || 0) + 1;

    res.json({
      success: true,
      post: populatePost(post),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving post', error: error.message });
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { title, description, content, image, category, tags } = req.body;

    // Validation
    if (!title || !description || !content || !category) {
      res.status(400).json({
        success: false,
        message: 'Title, category, description, and blog content are required',
      });
      return;
    }

    if (title.trim().length < 5) {
      res.status(400).json({ success: false, message: 'Title must be at least 5 characters long' });
      return;
    }

    if (content.trim().length < 20) {
      res.status(400).json({ success: false, message: 'Content must be at least 20 characters long' });
      return;
    }

    // Default image if none provided
    const fallbackImages: { [key: string]: string } = {
      Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      Programming: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      Education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      Travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      Lifestyle: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      Health: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      Entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      Other: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    };

    const finalImage = image && image.trim() !== '' ? image.trim() : fallbackImages[category] || fallbackImages['Other'];

    // Normalize tags
    let processedTags: string[] = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t: string) => t.trim().replace(/^#/, '')).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    }

    const newPost = db.createPost({
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      image: finalImage,
      category: category.trim(),
      tags: processedTags.length > 0 ? processedTags : [category],
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Blog post published successfully',
      post: populatePost(newPost),
    });
  } catch (error: any) {
    console.error('Create Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating post', error: error.message });
  }
};

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private (Owner or Admin)
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const post = db.getPostById(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Ownership or Admin check
    if (post.author !== req.user._id && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own posts' });
      return;
    }

    const { title, description, content, image, category, tags } = req.body;

    const updates: Partial<DBPost> = {};
    if (title) updates.title = title.trim();
    if (description) updates.description = description.trim();
    if (content) updates.content = content.trim();
    if (image !== undefined) updates.image = image.trim();
    if (category) updates.category = category.trim();

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        updates.tags = tags.map((t: string) => t.trim().replace(/^#/, '')).filter(Boolean);
      } else if (typeof tags === 'string') {
        updates.tags = tags
          .split(',')
          .map((t) => t.trim().replace(/^#/, ''))
          .filter(Boolean);
      }
    }

    const updatedPost = db.updatePost(id, updates);

    res.json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost ? populatePost(updatedPost) : null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating post', error: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Owner or Admin)
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const post = db.getPostById(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Ownership or Admin check
    if (post.author !== req.user._id && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own posts' });
      return;
    }

    db.deletePost(id);

    res.json({
      success: true,
      message: 'Post deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting post', error: error.message });
  }
};

// @desc    Get posts created by the logged-in user
// @route   GET /api/posts/user/my-posts
// @access  Private
export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const userPosts = db.getPosts().filter((p) => p.author === req.user?._id);
    const populated = userPosts.map(populatePost);

    // Sort latest first
    populated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      posts: populated,
      totalPosts: populated.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching your posts', error: error.message });
  }
};
