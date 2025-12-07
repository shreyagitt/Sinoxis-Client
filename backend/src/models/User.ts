import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as UserType, UserRole } from '../types/index';

export interface UserDocument extends Omit<UserType, '_id'>, Document {
  _id: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByEmailAndTenant(email: string, tenantId: string): Promise<UserDocument | null>;
  findByTenant(tenantId: string): Promise<UserDocument[]>;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    role: {
  type: String,
  enum: Object.values(UserRole), // ⭐ safer
  default: UserRole.CLIENT,
},

    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: false, // Enforce tenant scoping
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


  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// ✅ Ensure unique email per tenant (not globally)
userSchema.index({ email: 1, tenantId: 1 }, { unique: true });
userSchema.index({ tenantId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 🔒 Hash password on findOneAndUpdate (security)
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as any;
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(12);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      next(error as Error);
    }
  }
  next();
});

// 🔐 Compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔍 Find user by email (global)
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// 🔍 Find user by email within a tenant (multi-tenant safe)
userSchema.statics.findByEmailAndTenant = function (email: string, tenantId: string) {
  return this.findOne({ email: email.toLowerCase(), tenantId });
};

// 🔍 Find all active users for a tenant
userSchema.statics.findByTenant = function (tenantId: string) {
  return this.find({ tenantId, isActive: true });
};

export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
