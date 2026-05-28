import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole } from "../types/index";

/* ============================================================
   PERMISSIONS TYPE
   ============================================================ */
export interface UserPermissions {
  /* ======================
     DASHBOARD
  ====================== */
  dashboard: boolean;

  /* ======================
     RELEASES
  ====================== */
  release: boolean;

  /* ======================
     ARTISTS / LABELS
  ====================== */
  artists: boolean;
  labels: boolean;

  /* ======================
     REVENUE REPORTS
  ====================== */
  revenueReports: boolean;
  revenueReportList: boolean;
  totalRevenue: boolean;
  requestPayment: boolean;

  /* ======================
     SERVICES
  ====================== */
  services: boolean;
  youtubeOACRequest: boolean;
  youtubeClaimRelease: boolean;
  socialMediaLinks: boolean;
  facebookClaimRelease: boolean;
  metadataUpdateRequest: boolean;

  /* ======================
     REQUESTS
  ====================== */
  requests: boolean;
  copyrightClaim: boolean;
  officialArtistChannel: boolean;

  /* ======================
     SETTINGS
  ====================== */
  settings: boolean;
  passwordChange: boolean;
  bankDetails: boolean;
}

/* ============================================================
   USER DOCUMENT (DB MODEL)
   ============================================================ */
export interface UserDocument extends Document {
  _id: string;

  email: string;
  password: string;

  firstName: string;
  lastName: string;

  role: UserRole;
  tenantId?: mongoose.Types.ObjectId;

  isActive: boolean;
  lastLogin: Date | null;
  balance: number;

  bankDetails?: {
    accountHolder?: string;
    accountNumber?: string;
    bankName?: string;
    routingNumber?: string;
  };

  paypalDetails?: {
    name?: string;
    email?: string;
    paypalId?: string;
  };

  permissions: UserPermissions;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

/* ============================================================
   MODEL INTERFACE
   ============================================================ */
export interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByEmailAndTenant(
    email: string,
    tenantId: string
  ): Promise<UserDocument | null>;
  findByTenant(tenantId: string): Promise<UserDocument[]>;
}

/* ============================================================
   SCHEMA
   ============================================================ */
const userSchema = new Schema<UserDocument>(
  {
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
      enum: Object.values(UserRole),
      default: UserRole.CLIENT,
    },

    tenantId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: {
  transform(_, ret) {
    delete (ret as any).password;
    return ret;

},
    },
  }
);

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
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Auto grant all permissions to admins
  if ([UserRole.ADMIN, UserRole.SUPERADMIN].includes(this.role)) {
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
  const update = this.getUpdate() as any;
  if (update.password) {
    const salt = await bcrypt.genSalt(12);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

/* ============================================================
   METHODS
   ============================================================ */
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ============================================================
   STATICS
   ============================================================ */
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByEmailAndTenant = function (
  email: string,
  tenantId: string
) {
  return this.findOne({ email: email.toLowerCase(), tenantId });
};

userSchema.statics.findByTenant = function (tenantId: string) {
  return this.find({ tenantId, isActive: true });
};

export const User = mongoose.model<UserDocument, UserModel>(
  "User",
  userSchema
);