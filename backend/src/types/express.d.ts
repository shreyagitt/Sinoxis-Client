import "express";

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: string;
      permissions?: Record<string, boolean>;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};