import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, DBUser } from '../config/db';
import { generateToken, AuthRequest } from '../middleware/authMiddleware';

// Sanitize user object (remove password)
export const sanitizeUser = (user: DBUser) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    // Validation: All fields required
    if (!name || !username || !email || !password) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    // Validation: Password match
    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match' });
      return;
    }

    // Validation: Password length
    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
      return;
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      return;
    }

    // Validation: Unique Email
    const existingEmail = db.getUserByEmail(email);
    if (existingEmail) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    // Validation: Unique Username
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      res.status(400).json({ success: false, message: 'Username must be at least 3 alphanumeric characters' });
      return;
    }

    const existingUsername = db.getUserByUsername(cleanUsername);
    if (existingUsername) {
      res.status(400).json({ success: false, message: 'This username is already taken. Please choose another.' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default avatar
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    // Create user
    const newUser = db.createUser({
      name: name.trim(),
      username: cleanUsername,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      profileImage: defaultAvatar,
      bio: 'New member at BlogSpace. Passionate about learning and sharing stories.',
      role: 'USER',
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password' });
      return;
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found with this email' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
      return;
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile with stats
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const posts = db.getPosts().filter((p) => p.author === req.user?._id);
    const comments = db.getComments().filter((c) => c.user === req.user?._id);

    res.json({
      success: true,
      user: sanitizeUser(req.user),
      stats: {
        totalPosts: posts.length,
        totalComments: comments.length,
        totalViews: posts.reduce((acc, curr) => acc + (curr.views || 0), 0),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { name, profileImage, bio } = req.body;

    const updates: Partial<DBUser> = {};
    if (name) updates.name = name.trim();
    if (profileImage !== undefined) updates.profileImage = profileImage;
    if (bio !== undefined) updates.bio = bio;

    // Normal users cannot update their role
    const updatedUser = db.updateUser(req.user._id, updates);

    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizeUser(updatedUser),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};

// @desc    Get current authenticated user info
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }
  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
};
