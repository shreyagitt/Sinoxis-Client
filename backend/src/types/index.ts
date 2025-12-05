// ======================
// User Role Enum
// ======================
export enum UserRole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  CLIENT = "client",
}


// ======================
// User types (MATCH schema EXACTLY)
// ======================
export interface User {
  _id?: string;
  email: string;
  password: string;          // ⭐ required for schema
  firstName: string;
  lastName: string;
  role: UserRole;            // ⭐ matches enum + schema
  tenantId?: string | null;  // ⭐ FIX: added to match schema
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ======================
// Tenant types for multi-tenancy
// ======================
export interface Tenant {
  _id: string;
  name: string;
  domain: string;
  organizationName: string;
  mobile: string;
  plan: SubscriptionPlan;
  website?: string;
  isActive: boolean;
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionPlan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export interface TenantSettings {
  features: string[];
  limits: {
    users: number;
    storage: number; // MB
    apiCalls: number;
  };
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

// ======================
// Authentication types
// ======================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, "password">;
  tenant?: Omit<Tenant, "settings">;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  // Multi-tenant optional fields
  organizationName?: string;
  mobile?: string;
  website?: string;
  tenantName?: string;

  // ⭐ FIX: role added
  role?: UserRole | "admin" | "client";
}

// ======================
// API Response types
// ======================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ======================
// Common types
// ======================
export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
}


