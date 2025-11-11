import { Router } from 'express';
import { CLIENT_API_ENDPOINTS } from '../../config/constants';

import ArtistRoutes from './ArtistRoutes';
import ReleaseRoutes from './ReleaseRoute'


const clientRouter = Router();

// ------------------------------
// Mount routes (No Tenant Middleware)
// ------------------------------
clientRouter.use(CLIENT_API_ENDPOINTS.ARTIST, ArtistRoutes);
clientRouter.use(CLIENT_API_ENDPOINTS.RELEASE, ReleaseRoutes);

export default clientRouter;

