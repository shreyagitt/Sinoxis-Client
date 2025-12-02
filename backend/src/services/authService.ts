import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { JWT_CONFIG, ERROR_MESSAGES } from "../config/constants";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User as UserType,
} from "../types/index";

// Unified error creator
export const createError = (message: string, statusCode: number = 400) => {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  return error;
};

export class AuthService {
  /**
   * 🔐 Generate a JWT token
   */
  private static generateToken(payload: any, expiresIn: string): string {
    return jwt.sign(payload, JWT_CONFIG.SECRET, {
      expiresIn,
    } as jwt.SignOptions);
  }

  /**
   * 🔁 Generate access and refresh tokens
   */
  private static generateTokens(user: UserType): {
    token: string;
    refreshToken: string;
  } {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role, // ⭐ ROLE INCLUDED IN JWT
    };

    const token = this.generateToken(payload, JWT_CONFIG.EXPIRES_IN);
    const refreshToken = this.generateToken(
      payload,
      JWT_CONFIG.REFRESH_EXPIRES_IN
    );

    return { token, refreshToken };
  }

  /**
   * 🧭 Login user
   */
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) throw createError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);

    // 2️⃣ Check if active
    if (!user.isActive)
      throw createError("Account is deactivated", 401);

    // 3️⃣ Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      throw createError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);

    // 4️⃣ Update last login
    user.lastLogin = new Date();
    await user.save();

    // 5️⃣ Generate tokens
    const { token, refreshToken } = this.generateTokens(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role, // ⭐ ROLE RETURNED TO FRONTEND
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };
  }

  /**
   * 🧾 Register new user (UPDATED FOR RBAC)
   */
  static async register(registerData: RegisterRequest): Promise<LoginResponse> {
    const { email, password, firstName, lastName, role } = registerData;

    // 1️⃣ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw createError(ERROR_MESSAGES.USER_EXISTS, 409);

    // 2️⃣ Create new user with role
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || "client", // ⭐ DEFAULT ROLE (IMPORTANT)
      isActive: true,
    });

    await user.save();

    // 3️⃣ Generate tokens
    const { token, refreshToken } = this.generateTokens(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role, // ⭐ ROLE SENT TO FRONTEND
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };
  }

  /**
   * ♻️ Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET) as any;

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive)
        throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const payload = {
        userId: user._id,
        email: user.email,
        role: user.role, // ⭐ ROLE INCLUDED
      };

      const token = this.generateToken(payload, JWT_CONFIG.EXPIRES_IN);
      return { token };
    } catch (error) {
      throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }
  }

  /**
   * 🔎 Verify access token
   */
  static async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as any;

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive)
        throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      return decoded; // ⭐ Contains userId, email, role
    } catch (error) {
      throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }
  }
}
