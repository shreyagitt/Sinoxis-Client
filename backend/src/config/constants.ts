// src/config/constants.ts
export const APP_CONFIG = {
  NAME: 'Sinoxis Admin API',
  VERSION: process.env.API_VERSION || 'v1',
  PORT: parseInt(process.env.PORT || '5000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback-secret-key',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
} as const;

export const SECURITY_CONFIG = {
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
} as const;

export const CORS_CONFIG = {
  ORIGINS: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
} as const;

export const API_ENDPOINTS = {
 AUTH: '/api/v1/auth',
 USERS: '/api/v1/users',
  TENANTS: '/api/v1/tenants',
  HEALTH: '/api/v1/health',
  MEDIA:'/api/v1/media',
  ARTIST:'/api/v1/artist',
  RELEASE:'/api/v1/release'
} as const;

export const CLIENT_API_ENDPOINTS = {
  ARTIST:'/artist',
  RELEASE:'/release'
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation Error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User already exists',
  TENANT_EXISTS: 'Tenant already exists',
  TENANT_NOT_FOUND: 'Tenant not found',
} as const;
