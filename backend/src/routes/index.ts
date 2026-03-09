import { Router } from 'express';
import authRoutes from './auth';
import artistRoutes from './artistRoutes';
import releaseRoutes from './releaseRoutes';
import bankRoutes from './bankRoutes';
import applyRoutes from './applyFormRoutes';
import facebookVideoRoutes from './facebookVideoRoutes';
import metadataRoutes from './metadataRoutes';
import socialISRCRoutes from './socialISRCRoutes';
import youTubeClaimRoutes from './youTubeClaimRoutes';
import youTubeOACRoutes from './youTubeOACRoutes';
import revenueRoutes from './revenueRoutes';
import revenueReportRoutes from './revenueReportRoutes';
import paymentRoutes from './paymentRoutes';
import labelRoutes from './labelRoutes';
import copyClaimRoutes from './copyClaimRoutes';
import clientRouter from './client';   // ✅ Add this import
import { API_ENDPOINTS } from '../config/constants';
import OACRequest from './Oac.routes';
import notificationRoutes from './notificationRoutes';
import userRoutes from './userRoutes';
import storeRoutes from './storeRoutes';
import genreRoutes from "./genreRoutes";
import subGenreRoutes from "./subGenreRoutes"

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
router.use(API_ENDPOINTS.BANK, bankRoutes);
router.use(API_ENDPOINTS.APPLY, applyRoutes);
router.use(API_ENDPOINTS.FACEBOOKVIDEO, facebookVideoRoutes);
router.use(API_ENDPOINTS.METADATA, metadataRoutes);
router.use(API_ENDPOINTS.SOCIALISRC, socialISRCRoutes);
router.use(API_ENDPOINTS.YOUTUBECLAIM, youTubeClaimRoutes);
router.use(API_ENDPOINTS.YOUTUBEOAC, youTubeOACRoutes);
router.use(API_ENDPOINTS.REVENUE, revenueRoutes);
router.use(API_ENDPOINTS.REVENUEREPORTS, revenueReportRoutes);
router.use(API_ENDPOINTS.PAYMENT, paymentRoutes);
router.use(API_ENDPOINTS.LABEL, labelRoutes);
router.use(API_ENDPOINTS.COPYRIGHTCLAIM, copyClaimRoutes);
router.use(API_ENDPOINTS.OFFICIALARTIST, OACRequest);
router.use(API_ENDPOINTS.NOTIFICATION, notificationRoutes);
router.use(API_ENDPOINTS.USERS, userRoutes);
router.use(API_ENDPOINTS.STORE, storeRoutes);
router.use(API_ENDPOINTS.GENRE, genreRoutes);
router.use(API_ENDPOINTS.SUBGENRE, subGenreRoutes);



// ✅ Client-side routes
router.use('/api/v1/client', clientRouter);

export default router;
