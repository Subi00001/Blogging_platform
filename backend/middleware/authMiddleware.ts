import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, DBUser } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'blogspace_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: DBUser;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, access token is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.getUserById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
    return;
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = db.getUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
      // ignore optional auth errors
    }
  }

  next();
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};
