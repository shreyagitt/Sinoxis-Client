// ======================
// User types
// ======================
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId?: string; // Required for tenant users, optional for super admin
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user'
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
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
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
  user: Omit<User, 'password'>;
  tenant?: Omit<Tenant, 'settings'>; // optional tenant info
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // Tenant fields for new tenant creation (optional if user joins existing tenant)
  organizationName?: string;
  mobile?: string;
  website?: string;
  tenantName?: string;
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
  order?: 'asc' | 'desc';
}


