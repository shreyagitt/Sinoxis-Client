import { Router } from 'express';
import { CLIENT_API_ENDPOINTS } from '../../config/constants';

import ArtistRoutes from './ArtistRoutes';
import ReleaseRoutes from './ReleaseRoute';
import BankRoutes from './BankRoutes';
import ApplyRoutes from './ApplyFormRoutes';
import FacebookVideoRoutes from './FacebookVideoRoutes';
import MetadataRoutes from './MetadataRoutes';
import SocialISRCRoutes from './SocialISRCRoutes';
import YouTubeClaimRoutes from './YouTubeClaimRoutes';
import YouTubeOACRoutes from './YouTubeOACRoutes';
import RevenueRoutes from './RevenueRoutes';
import RevenueReportRoutes from './RevenueReportRoutes';
import paymentRoutes from './PaymentRoutes';
import LabelRoutes from './LabelRoutes';
import CopyClaimRoutes from './CopyClaimRoutes';
import OACRequest from './oac.routes';



const clientRouter = Router();

// ------------------------------
// Mount routes (No Tenant Middleware)
// ------------------------------
clientRouter.use(CLIENT_API_ENDPOINTS.ARTIST, ArtistRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.RELEASE, ReleaseRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.BANK, BankRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.APPLY, ApplyRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.FACEBOOKVIDEO, FacebookVideoRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.METADATA, MetadataRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.SOCIALISRC, SocialISRCRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.YOUTUBECLAIM, YouTubeClaimRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.YOUTUBEOAC, YouTubeOACRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.REVENUE, RevenueRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.REVENUEREPORTS, RevenueReportRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.PAYMENT, paymentRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.LABEL, LabelRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.COPYRIGHTCLAIM, CopyClaimRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.OFFICIALARTIST, OACRequest);


export default clientRouter;

