import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Tenant as TenantType, SubscriptionPlan } from '../types/index';

export interface TenantDocument extends Omit<TenantType, '_id'>, Document {
  _id: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface TenantModel extends Model<TenantDocument> {
  findActive(): Promise<TenantDocument[]>;
  findByDomain(domain: string): Promise<TenantDocument | null>;
  getByIdOrDomain(identifier: string): Promise<TenantDocument | null>;
}

const tenantSettingsSchema = new Schema(
  {
    features: [{ type: String, default: [] }],
    limits: {
      users: { type: Number, default: 5 },
      storage: { type: Number, default: 1024 }, // MB
      apiCalls: { type: Number, default: 1000 },
    },
  },
  { _id: false }
);

const tenantSchema = new Schema<TenantDocument>(
  {
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
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      type: tenantSettingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Indexes
tenantSchema.index({ domain: 1 }, { unique: true });
tenantSchema.index({ isActive: 1 });
tenantSchema.index({ plan: 1 });

// Hash password if changed
tenantSchema.pre('save', async function (next) {
  const tenant = this as TenantDocument;

  if (tenant.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    tenant.password = await bcrypt.hash(tenant.password, salt);
  }

  // Assign default settings based on plan
  if (tenant.isModified('plan')) {
    switch (tenant.plan) {
      case SubscriptionPlan.FREE:
        tenant.settings.features = ['basic-auth', 'user-management'];
        tenant.settings.limits = { users: 5, storage: 1024, apiCalls: 1000 };
        break;
      case SubscriptionPlan.BASIC:
        tenant.settings.features = ['basic-auth', 'user-management', 'advanced-analytics'];
        tenant.settings.limits = { users: 25, storage: 10240, apiCalls: 10000 };
        break;
      case SubscriptionPlan.PRO:
        tenant.settings.features = ['user-management', 'analytics', 'api-access', 'branding'];
        tenant.settings.limits = { users: 100, storage: 102400, apiCalls: 100000 };
        break;
      case SubscriptionPlan.ENTERPRISE:
        tenant.settings.features = ['sso', 'priority-support', 'api-access', 'branding'];
        tenant.settings.limits = { users: -1, storage: -1, apiCalls: -1 };
        break;
    }
  }

  next();
});

// Compare password
tenantSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static: find all active tenants
tenantSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static: find tenant by domain
tenantSchema.statics.findByDomain = function (domain: string) {
  return this.findOne({ domain: domain.toLowerCase() });
};

// Static: find tenant by either ID or domain (useful in middleware)
tenantSchema.statics.getByIdOrDomain = function (identifier: string) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return this.findById(identifier);
  }
  return this.findOne({ domain: identifier.toLowerCase() });
};

export const Tenant = mongoose.model<TenantDocument, TenantModel>('Tenant', tenantSchema);
