"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const artistRoutes_1 = __importDefault(require("./artistRoutes"));
const releaseRoutes_1 = __importDefault(require("./releaseRoutes"));
const bankRoutes_1 = __importDefault(require("./bankRoutes"));
const applyFormRoutes_1 = __importDefault(require("./applyFormRoutes"));
const facebookVideoRoutes_1 = __importDefault(require("./facebookVideoRoutes"));
const metadataRoutes_1 = __importDefault(require("./metadataRoutes"));
const socialISRCRoutes_1 = __importDefault(require("./socialISRCRoutes"));
const youTubeClaimRoutes_1 = __importDefault(require("./youTubeClaimRoutes"));
const youTubeOACRoutes_1 = __importDefault(require("./youTubeOACRoutes"));
const revenueRoutes_1 = __importDefault(require("./revenueRoutes"));
const revenueReportRoutes_1 = __importDefault(require("./revenueReportRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const labelRoutes_1 = __importDefault(require("./labelRoutes"));
const copyClaimRoutes_1 = __importDefault(require("./copyClaimRoutes"));
const client_1 = __importDefault(require("./client")); // ✅ Add this import
const constants_1 = require("../config/constants");
const Oac_routes_1 = __importDefault(require("./Oac.routes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const storeRoutes_1 = __importDefault(require("./storeRoutes"));
const genreRoutes_1 = __importDefault(require("./genreRoutes"));
const subGenreRoutes_1 = __importDefault(require("./subGenreRoutes"));
const languageRoutes_1 = __importDefault(require("./languageRoutes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Sinoxis Admin API is running',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1',
    });
});
router.use(constants_1.API_ENDPOINTS.AUTH, auth_1.default);
router.use(constants_1.API_ENDPOINTS.ARTIST, artistRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.RELEASE, releaseRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.BANK, bankRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.APPLY, applyFormRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.FACEBOOKVIDEO, facebookVideoRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.METADATA, metadataRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.SOCIALISRC, socialISRCRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.YOUTUBECLAIM, youTubeClaimRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.YOUTUBEOAC, youTubeOACRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.REVENUE, revenueRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.REVENUEREPORTS, revenueReportRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.PAYMENT, paymentRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.LABEL, labelRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.COPYRIGHTCLAIM, copyClaimRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.OFFICIALARTIST, Oac_routes_1.default);
router.use(constants_1.API_ENDPOINTS.NOTIFICATION, notificationRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.USERS, userRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.STORE, storeRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.GENRE, genreRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.SUBGENRE, subGenreRoutes_1.default);
router.use(constants_1.API_ENDPOINTS.LANGUAGE, languageRoutes_1.default);
// ✅ Client-side routes
router.use('/api/v1/client', client_1.default);
exports.default = router;
