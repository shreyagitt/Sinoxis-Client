import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import { APP_CONFIG, SECURITY_CONFIG } from './config/constants';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/errorHandler';

dotenv.config();

const app = express();

// ---------------- SECURITY ----------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ---------------- CORS ----------------
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",")
.map(o=>o.trim().replace(/\/+$/,''));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed: " + origin));
      }
    },
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

app.options("*", cors());


// ---------------- STATIC FILES ----------------
app.use('/images', express.static(path.join(__dirname, '../uploads')));

// ---------------- RATE LIMIT ----------------
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins default
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 req per window
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ---------------- BODY PARSING ----------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------- COMPRESSION ----------------
app.use(compression());

// ---------------- LOGGING ----------------
if (APP_CONFIG.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use((req, res, next) => {
  if (APP_CONFIG.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  }
  next();
});

// ---------------- ROUTES ----------------
app.use('/', routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ---------------- START SERVER ----------------
const startServer = async () => {
  try {
    await connectDB();
    app.listen(APP_CONFIG.PORT, () => {
      console.log(`🚀 ${APP_CONFIG.NAME} running on port ${APP_CONFIG.PORT}`);
      console.log(`📊 Environment: ${APP_CONFIG.NODE_ENV}`);
      console.log(`🔗 API Version: ${APP_CONFIG.VERSION}`);
      console.log(`🌐 Health Check: http://localhost:${APP_CONFIG.PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle crashes
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start server
startServer();

export default app;
