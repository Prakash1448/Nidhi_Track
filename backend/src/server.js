import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Config
import config from './config/config.js';
import connectDB from './config/db.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import institutionRoutes from './routes/institutions.js';
import fdrRoutes from './routes/fdrs.js';
import requestRoutes from './routes/requests.js';
import dashboardRoutes from './routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (logs all requests)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Log request body for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Hide password in logs
    if (sanitizedBody.password) sanitizedBody.password = '***';
    console.log(`   Body:`, JSON.stringify(sanitizedBody));
  }
  
  // Log query params if present
  if (Object.keys(req.query).length > 0) {
    console.log(`   Query:`, req.query);
  }
  
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/fdrs', fdrRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AICTE FDR Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AICTE FDR Command Center API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      institutions: '/api/institutions',
      fdrs: '/api/fdrs',
      requests: '/api/requests',
      dashboard: '/api/dashboard',
      health: '/api/health'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 AICTE FDR Command Center - Backend API             ║
║                                                           ║
║   Status: ✅ Server is running                           ║
║   Port: ${PORT}                                            ║
║   Environment: ${config.nodeEnv}                         ║
║   API Base: http://localhost:${PORT}                      ║
║                                                           ║
║   📖 API Documentation: http://localhost:${PORT}/api      ║
║   ❤️  Health Check: http://localhost:${PORT}/api/health  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
