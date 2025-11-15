import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';

// Load environment variables
const app = express();

// =======================
// 🔹 Middleware Setup
// =======================
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// =======================
// 🔹 MongoDB Connection
// =======================
dotenv.config();
mongoose.connect(process.env.MONGO_URL!)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// =======================
// 🔹 Routes
// =======================
app.use(routes);

app.get("/", (req, res) => res.send("☁️ Cloudinary Media API Running"));

// =======================
// 🔹 Health Check
// =======================
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Sinoxis Admin API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

export default app;
