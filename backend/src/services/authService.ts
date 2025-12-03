import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type * as ms from "ms";
import { User } from "../models/User";
import { JWT_CONFIG, ERROR_MESSAGES } from "../config/constants";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User as UserType,
  UserRole,
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
  const options: SignOptions = {
    expiresIn: expiresIn as ms.StringValue,
  };

  return jwt.sign(payload, JWT_CONFIG.SECRET as Secret, options);
}

  /**
   * 🔁 Generate access & refresh tokens
   */
  private static generateTokens(user: UserType): {
    token: string;
    refreshToken: string;
  } {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
 // ⭐ ROLE INCLUDED
    };

    return {
      token: this.generateToken(payload, JWT_CONFIG.EXPIRES_IN),
      refreshToken: this.generateToken(payload, JWT_CONFIG.REFRESH_EXPIRES_IN),
    };
  }


//Login method with role-based access control

 static async login(loginData: LoginRequest, expectedRole?: UserRole): Promise<LoginResponse> {
  const { email, password } = loginData;

  // 1️⃣ Find user
  const user = await User.findOne({ email });
  if (!user) throw createError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);

  // 2️⃣ Check if active
  if (!user.isActive) throw createError("Account is deactivated", 401);

  // 3️⃣ Role-based login rules
  if (expectedRole) {
    if (expectedRole === UserRole.ADMIN) {
      // ⭐ Allow ADMIN and SUPERADMIN
      if (![UserRole.ADMIN, UserRole.SUPERADMIN].includes(user.role)) {
        throw createError("Unauthorized: Only Admin or Superadmin can login here", 403);
      }
    } else if (user.role !== expectedRole) {
      // Normal strict match (client login)
      throw createError(`Unauthorized: Only ${expectedRole} can login here`, 403);
    }
  }

  // 4️⃣ Validate password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw createError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);

  // 5️⃣ Update lastLogin
  user.lastLogin = new Date();
  await user.save();

  // 6️⃣ Issue JWT
  const { token, refreshToken } = this.generateTokens(user);

  return {
    user: {
      _id: user._id!,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
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
   * 📝 Register new user (RBAC safe)
   */
  static async register(registerData: RegisterRequest): Promise<LoginResponse> {
    const { email, password, firstName, lastName, role } = registerData;

    // 1️⃣ Prevent duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) throw createError(ERROR_MESSAGES.USER_EXISTS, 409);

    // 2️⃣ Create new user (default CLIENT)
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || UserRole.CLIENT, // ⭐ DEFAULT CLIENT
      isActive: true,
    });

    await newUser.save();

    // 3️⃣ Generate tokens
    const { token, refreshToken } = this.generateTokens(newUser);

    return {
      user: {
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isActive: newUser.isActive,
        lastLogin: newUser.lastLogin,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
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
      const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET as Secret) as any;

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      return {
        token: this.generateToken(
          { userId: user._id, email: user.email, role: user.role },
          JWT_CONFIG.EXPIRES_IN
        ),
      };
    } catch {
      throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }
  }

  /**
   * 🔎 Verify access token
   */
  static async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET as Secret) as any;

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      return decoded; // contains userId, email, role
    } catch {
      throw createError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }
  }
}

