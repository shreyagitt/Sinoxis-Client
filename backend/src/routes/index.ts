import { Router } from 'express';
import authRoutes from './auth';
import mediaRoutes from './mediaRoutes'
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
router.use(API_ENDPOINTS.MEDIA, mediaRoutes);

export default router;