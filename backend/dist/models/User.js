"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../types/index");
/* ============================================================
   SCHEMA
   ============================================================ */
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    role: {
        type: String,
        enum: Object.values(index_1.UserRole),
        default: index_1.UserRole.CLIENT,
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tenant",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    balance: {
        type: Number,
        default: 0,
    },
    bankDetails: {
        accountHolder: String,
        accountNumber: String,
        bankName: String,
        routingNumber: String,
    },
    paypalDetails: {
        name: String,
        email: String,
        paypalId: String,
    },
    permissions: {
        /* ======================
           DASHBOARD
        ====================== */
        dashboard: { type: Boolean, default: false },
        /* ======================
           RELEASES
        ====================== */
        release: { type: Boolean, default: false },
        /* ======================
           ARTISTS / LABELS
        ====================== */
        artists: { type: Boolean, default: false },
        labels: { type: Boolean, default: false },
        /* ======================
           REVENUE REPORTS
        ====================== */
        revenueReports: { type: Boolean, default: false },
        revenueReportList: { type: Boolean, default: false },
        totalRevenue: { type: Boolean, default: false },
        requestPayment: { type: Boolean, default: false },
        /* ======================
           SERVICES
        ====================== */
        services: { type: Boolean, default: false },
        youtubeOACRequest: { type: Boolean, default: false },
        youtubeClaimRelease: { type: Boolean, default: false },
        socialMediaLinks: { type: Boolean, default: false },
        facebookClaimRelease: { type: Boolean, default: false },
        metadataUpdateRequest: { type: Boolean, default: false },
        /* ======================
           REQUESTS
        ====================== */
        requests: { type: Boolean, default: false },
        copyrightClaim: { type: Boolean, default: false },
        officialArtistChannel: { type: Boolean, default: false },
        /* ======================
           SETTINGS
        ====================== */
        settings: { type: Boolean, default: false },
        passwordChange: { type: Boolean, default: false },
        bankDetails: { type: Boolean, default: false },
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_, ret) {
            delete ret.password;
            return ret;
        },
    },
});
/* ============================================================
   INDEXES
   ============================================================ */
userSchema.index({ email: 1, tenantId: 1 }, { unique: true });
userSchema.index({ tenantId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
/* ============================================================
   HOOKS
   ============================================================ */
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
    }
    // Auto grant all permissions to admins
    if ([index_1.UserRole.ADMIN, index_1.UserRole.SUPERADMIN].includes(this.role)) {
        this.permissions = {
            dashboard: true,
            /* ======================
               RELEASES
            ====================== */
            release: true,
            /* ======================
               ARTISTS / LABELS
            ====================== */
            artists: true,
            labels: true,
            /* ======================
               REVENUE REPORTS
            ====================== */
            revenueReports: true,
            revenueReportList: true,
            totalRevenue: true,
            requestPayment: true,
            /* ======================
               SERVICES
            ====================== */
            services: true,
            youtubeOACRequest: true,
            youtubeClaimRelease: true,
            socialMediaLinks: true,
            facebookClaimRelease: true,
            metadataUpdateRequest: true,
            /* ======================
               REQUESTS
            ====================== */
            requests: true,
            copyrightClaim: true,
            officialArtistChannel: true,
            /* ======================
               SETTINGS
            ====================== */
            settings: true,
            passwordChange: true,
            bankDetails: true,
        };
    }
    next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        const salt = await bcryptjs_1.default.genSalt(12);
        update.password = await bcryptjs_1.default.hash(update.password, salt);
    }
    next();
});
/* ============================================================
   METHODS
   ============================================================ */
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
/* ============================================================
   STATICS
   ============================================================ */
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() });
};
userSchema.statics.findByEmailAndTenant = function (email, tenantId) {
    return this.findOne({ email: email.toLowerCase(), tenantId });
};
userSchema.statics.findByTenant = function (tenantId) {
    return this.find({ tenantId, isActive: true });
};
exports.User = mongoose_1.default.model("User", userSchema);
