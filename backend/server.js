import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import "./config/passport.js";

import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

app.set('io', io);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id role isActive');

    if (!user || !user.isActive) {
      return next(new Error('Invalid or inactive user'));
    }

    socket.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch {
    next(new Error('Socket authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`Authenticated socket connected: ${socket.id}`);

  socket.on('order:join', async (orderId) => {
    try {
      if (typeof orderId !== 'string' || orderId.length > 100) return;

      const order = await Order.findById(orderId).select('user');

      if (!order) return;

      const isOwner = order.user.toString() === socket.user.id;
      const isStaff = ['admin', 'manager'].includes(socket.user.role);

      if (!isOwner && !isStaff) {
        socket.emit('order:error', {
          message: 'You are not authorized to view this order.',
        });
        return;
      }

      socket.join(`order:${order._id}`);
      socket.emit('order:joined', { orderId: order._id.toString() });
    } catch (error) {
      console.error('Order room join failed:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// E-commerce API responses are user- and inventory-sensitive; avoid stale 304 responses.
app.set('etag', false);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
    
      if (req.originalUrl?.includes('/payments/webhook')) {
        req.rawBody = buf.toString('utf8');
      }
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',
    immutable: false,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Halla Bol API is running',
    version: 'v1',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
}, apiRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
};

start();

export default app;
