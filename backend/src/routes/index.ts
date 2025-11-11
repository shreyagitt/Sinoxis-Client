import { Router } from 'express';
import authRoutes from './auth';
import artistRoutes from './artistRoutes';
import releaseRoutes from './releaseRoutes'
import clientRouter from './client';   // ✅ Add this import
import { API_ENDPOINTS } from '../config/constants';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sinoxis Admin API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
  });
});

router.use(API_ENDPOINTS.AUTH, authRoutes);
router.use(API_ENDPOINTS.ARTIST, artistRoutes);
router.use(API_ENDPOINTS.RELEASE, releaseRoutes);

// ✅ Client-side routes
router.use('/client', clientRouter);

export default router;
