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
exports.Tenant = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../types/index");
const tenantSettingsSchema = new mongoose_1.Schema({
    features: [{ type: String, default: [] }],
    limits: {
        users: { type: Number, default: 5 },
        storage: { type: Number, default: 1024 }, // MB
        apiCalls: { type: Number, default: 1000 },
    },
}, { _id: false });
const tenantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Tenant name is required'],
        trim: true,
        maxlength: [100, 'Tenant name cannot exceed 100 characters'],
    },
    organizationName: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true,
        maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid mobile number'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    website: {
        type: String,
        trim: true,
        default: '',
    },
    domain: {
        type: String,
        required: [true, 'Domain is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    plan: {
        type: String,
        enum: Object.values(index_1.SubscriptionPlan),
        default: index_1.SubscriptionPlan.FREE,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    settings: {
        type: tenantSettingsSchema,
        default: () => ({}),
    },
}, { timestamps: true });
// Indexes
tenantSchema.index({ domain: 1 }, { unique: true });
tenantSchema.index({ isActive: 1 });
tenantSchema.index({ plan: 1 });
// Hash password if changed
tenantSchema.pre('save', async function (next) {
    const tenant = this;
    if (tenant.isModified('password')) {
        const salt = await bcryptjs_1.default.genSalt(10);
        tenant.password = await bcryptjs_1.default.hash(tenant.password, salt);
    }
    // Assign default settings based on plan
    if (tenant.isModified('plan')) {
        switch (tenant.plan) {
            case index_1.SubscriptionPlan.FREE:
                tenant.settings.features = ['basic-auth', 'user-management'];
                tenant.settings.limits = { users: 5, storage: 1024, apiCalls: 1000 };
                break;
            case index_1.SubscriptionPlan.BASIC:
                tenant.settings.features = ['basic-auth', 'user-management', 'advanced-analytics'];
                tenant.settings.limits = { users: 25, storage: 10240, apiCalls: 10000 };
                break;
            case index_1.SubscriptionPlan.PRO:
                tenant.settings.features = ['user-management', 'analytics', 'api-access', 'branding'];
                tenant.settings.limits = { users: 100, storage: 102400, apiCalls: 100000 };
                break;
            case index_1.SubscriptionPlan.ENTERPRISE:
                tenant.settings.features = ['sso', 'priority-support', 'api-access', 'branding'];
                tenant.settings.limits = { users: -1, storage: -1, apiCalls: -1 };
                break;
        }
    }
    next();
});
// Compare password
tenantSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// Static: find all active tenants
tenantSchema.statics.findActive = function () {
    return this.find({ isActive: true });
};
// Static: find tenant by domain
tenantSchema.statics.findByDomain = function (domain) {
    return this.findOne({ domain: domain.toLowerCase() });
};
// Static: find tenant by either ID or domain (useful in middleware)
tenantSchema.statics.getByIdOrDomain = function (identifier) {
    if (mongoose_1.default.Types.ObjectId.isValid(identifier)) {
        return this.findById(identifier);
    }
    return this.findOne({ domain: identifier.toLowerCase() });
};
exports.Tenant = mongoose_1.default.model('Tenant', tenantSchema);
