import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './backend/routes/authRoutes';
import postRoutes from './backend/routes/postRoutes';
import commentRoutes from './backend/routes/commentRoutes';
import adminRoutes from './backend/routes/adminRoutes';
import { db } from './backend/config/db';
import { seedDatabase } from './backend/seed/seedData';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS headers for API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    name: 'BlogSpace API',
    database: 'Connected (Persistent JSON/MongoDB)',
  });
});

// Reset & Seed database endpoint
app.post('/api/seed', (req: Request, res: Response) => {
  try {
    const data = seedDatabase();
    res.json({
      success: true,
      message: 'Database seeded successfully with sample users, posts, and comments!',
      stats: {
        users: data.users.length,
        posts: data.posts.length,
        comments: data.comments.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to seed database', error: error.message });
  }
});

// Mount REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// API 404 Fallback
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler for API
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Setup Vite / Static Asset Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BlogSpace server running on http://0.0.0.0:${PORT}`);
  });
}

start();
