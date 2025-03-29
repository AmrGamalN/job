import Security from "../../models/mongodb/security/security.model";
import {
  UserSecurityDto,
  UserSecurityUpdateDto,
  UserSecurityUpdateDtoType,
} from "../../dto/security/security.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import { auth } from "../../config/firebase";
import { sendVerificationEmail } from "../../utils/sendEmail";
import { generateVerificationToken } from "../../utils/generateCode";
import Otp from "./otp.model";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
const graphqlFields = require("graphql-fields");

class SecurityService {
  private static instanceService: SecurityService;
  public static getInstance(): SecurityService {
    if (!SecurityService.instanceService) {
      SecurityService.instanceService = new SecurityService();
    }
    return SecurityService.instanceService;
  }

  getSecurity = warpAsync(
    async (
      args: {
        userId: string;
      },
      info: any
    ): Promise<responseHandler> => {
      const selectedFields = Object.keys(graphqlFields(info).data || {}).join(
        " "
      );
      const getSecurity = await Security.findOne(args)
        .select(selectedFields)
        .lean();

      if (!getSecurity) {
        return {
          success: false,
          status: 404,
          message: "Security data not found",
        };
      }
      const parseSafeSecurity = validateAndFormatData(
        getSecurity,
        UserSecurityDto
      );
      if (!parseSafeSecurity.success) return parseSafeSecurity;

      return {
        success: true,
        status: 200,
        message: "Get security successfully",
        data: getSecurity,
      };
    }
  );

  // Get all Security model by using GraphQl to select any field is need
  getAllSecurities = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const pageNum = Math.max(args.page, 1);
      const limitNum = Math.max(args.limit, 10);
      const skip = (pageNum - 1) * limitNum;
      const selectedFields = Object.keys(graphqlFields(info).data || {}).join(
        " "
      );

      const getSecurities = await Security.find({})
        .skip(skip)
        .limit(limitNum)
        .select(selectedFields)
        .lean();

      if (!getSecurities.length) {
        return {
          success: false,
          status: 404,
          message: "Securities not found",
        };
      }

      const parseSafeSecurities = validateAndFormatData(
        getSecurities,
        UserSecurityDto,
        "getAll"
      );
      if (parseSafeSecurities.success === false) return parseSafeSecurities;

      const count = await this.countSecurity();
      if (count.count === 0) return count;

      return {
        success: true,
        status: 200,
        message: "Get Securities successfully",
        data: getSecurities,
        count: count.count,
      };
    }
  );

  // Update Security
  updateSecurity = warpAsync(
    async (
      SecurityData: UserSecurityUpdateDtoType,
      userId: string
    ): Promise<responseHandler> => {
      if (Object.keys(SecurityData).length === 0) {
        return {
          success: false,
          status: 400,
          message: "No data provided for update",
        };
      }

      const parseSafe = validateAndFormatData(
        SecurityData,
        UserSecurityUpdateDto
      );
      if (!parseSafe.success) return parseSafe;

      const updateSecurity = await Security.findOneAndUpdate(
        { userId },
        {
          $set: {
            ...SecurityData,
          },
        },
        {
          new: true,
        }
      ).lean();

      if (!updateSecurity) {
        return {
          success: false,
          status: 404,
          message: "Security not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update Security successfully",
        data: updateSecurity,
      };
    }
  );

  // Count all Security
  countSecurity = warpAsync(async (): Promise<responseHandler> => {
    const countSecurities = await Security.countDocuments();
    if (countSecurities === 0) {
      return {
        success: false,
        status: 404,
        message: "Securities not found",
      };
    }
    return {
      success: true,
      status: 200,
      message: "Count Security successfully",
      count: countSecurities,
    };
  });

  deleteBlockUser = warpAsync(
    async (userId: string, processType: object): Promise<responseHandler> => {
      const getUser = await Security.findOneAndUpdate(
        { userId },
        {
          $set: processType,
        },
        {
          new: true,
        }
      );

      if (!getUser) {
        return {
          success: false,
          status: 404,
          message: "User not found",
        };
      }
      return {
        success: true,
        status: 200,
        message: "User process updated successfully.",
      };
    }
  );

  resetPassword = warpAsync(async (email: string): Promise<responseHandler> => {
    const passwordResetLink = await auth.generatePasswordResetLink(email);
    if (!passwordResetLink) {
      return {
        success: false,
        status: 404,
        message: "Invalid email ,User not found",
      };
    }
    const sendLink = await sendVerificationEmail(
      email,
      passwordResetLink,
      "Reset password",
      "The link to reset your password:"
    );

    if (!sendLink.success) {
      return {
        success: false,
        status: 400,
        message: "Something error Please try aging",
      };
    }
    return {
      success: true,
      status: 200,
      message:
        "Send link to your email ,Please check your email to reset password",
    };
  });

  updatePassword = warpAsync(
    async (userId: string, newPassword: string): Promise<responseHandler> => {
      const updatedUser = await auth.updateUser(userId, {
        password: newPassword,
      });
      if (!updatedUser) {
        return {
          success: false,
          status: 404,
          message: "User not found",
        };
      }
      return {
        success: true,
        status: 200,
        message: "Password updated successfully",
      };
    }
  );

  sendVerificationEmail = warpAsync(
    async (email: string): Promise<responseHandler> => {
      const token = await this.generateUniqueToken();
      const existingOtp = await Otp.findOne({ email }).lean();

      if (existingOtp) {
        return {
          success: false,
          status: 400,
          message:
            "verification link already exists or the email already register but not verify. Please check your email",
        };
      } else {
        await Otp.create({
          email,
          token,
          expiresAt: new Date(Date.now() + 20 * 60 * 1000),
        });
      }

      // If not verify and not exist in firebase so send verification link
      const verificationLink = `${process.env.BACKEND_URL}/api/v1/security/send/${token}`;
      const resultSendEmail = await sendVerificationEmail(
        String(email),
        verificationLink,
        "Verify Your Email",
        "Please verify your email by clicking the following link."
      );
      if (!resultSendEmail.success) return resultSendEmail;

      return {
        success: true,
        status: 200,
        message: `Otp sended successfully please check your email ${email}`,
      };
    }
  );

  // Create unique token
  private async generateUniqueToken(): Promise<string> {
    let token;
    do {
      token = generateVerificationToken();
    } while (await Otp.exists({ token }));
    return token;
  }

  // Generate secret code and qrcode
  generateTwoFactorAuth = warpAsync(
    async (userId: string): Promise<responseHandler> => {
      const secret = speakeasy.generateSecret({
        name: `Job ${userId}`,
        length: 20,
      });

      const updatedUser = await Security.findOneAndUpdate(
        { userId, isTwoFactorAuth: { $ne: true } },
        { $set: { twoFactorCode: secret.base32 } },
        { new: true, upsert: false }
      ).lean();

      if (!updatedUser || !secret.otpauth_url) {
        return {
          success: false,
          status: 400,
          message:
            "Error creating two-factor authentication or 2FA already enable.",
        };
      }

      const generateQrCode = await QRCode.toBuffer(secret.otpauth_url);

      return {
        success: true,
        status: 201,
        message:
          "Scan the QR code to set up 2FA. After scanning, enter the 6-digit code to complete verification.",
        data: {
          qrCode: generateQrCode,
        },
      };
    }
  );

  // Verify two factor auth
  verifyTwoFactorAuth = warpAsync(
    async (userId: string, twoFactorCode: string): Promise<responseHandler> => {
      const userSecurity = await Security.findOne({
        userId,
      })
        .select({
          twoFactorCode: 1,
          isTwoFactorAuth: 1,
        })
        .lean();

      if (userSecurity && userSecurity.isTwoFactorAuth === true) {
        return {
          success: false,
          status: 400,
          message: "Two factor already enable",
        };
      }

      if (!userSecurity || !userSecurity.isTwoFactorAuth === false) {
        return {
          success: false,
          status: 400,
          message: "Error: Invalid user or 2FA not enabled",
        };
      }

      const verified = speakeasy.totp.verify({
        secret: String(userSecurity.twoFactorCode),
        token: twoFactorCode,
        encoding: "base32",
        window: 1,
      });

      if (!verified) {
        return {
          success: false,
          status: 400,
          message: "Invalid or expired 2FA code",
        };
      }

      await Security.findOneAndUpdate(
        { userId },
        { $set: { isTwoFactorAuth: true } }
      );

      return {
        success: true,
        status: 200,
        message: "2FA verification successful",
      };
    }
  );
}

export default SecurityService;
