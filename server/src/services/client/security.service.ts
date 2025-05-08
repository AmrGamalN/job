import Otp from "../../models/mongodb/client/otp.model";
import Security from "../../models/mongodb/client/security.model";
import {
  SecurityDto,
  SecurityDtoType,
  UserSecurityUpdateDto,
  UserSecurityUpdateDtoType,
} from "../../dto/client/security.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { sendEmail } from "../../utils/sendEmail.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { generateVerificationToken } from "../../utils/generateCode.util";
import { resetEmail, sendVerifyEmail } from "../../utils/emailMessage.util";
import { ServiceResponseType } from "../../types/response.type";
import QRCode from "qrcode";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { GraphQLResolveInfo } from "graphql";
import { auth } from "../../config/firebase";

class SecurityService {
  private static instanceService: SecurityService;
  public static getInstance(): SecurityService {
    if (!SecurityService.instanceService) {
      SecurityService.instanceService = new SecurityService();
    }
    return SecurityService.instanceService;
  }

  getSecurity = warpAsync(
    async (data: SecurityDtoType): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: SecurityDto,
      });
    }
  );

  getAllSecurities = warpAsync(
    async (
      queries: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<ServiceResponseType> => {
      return await generatePagination({
        model: Security,
        userDto: SecurityDto,
        totalCount: (await this.countSecurity()).count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        graphqlInfo: info,
      });
    }
  );

  updateSecurity = warpAsync(
    async (
      data: UserSecurityUpdateDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: UserSecurityUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateSecurity = await Security.updateOne(
        { userId },
        {
          $set: {
            ...data,
          },
        }
      );
      return serviceResponse({
        data: updateSecurity.modifiedCount,
      });
    }
  );

  countSecurity = warpAsync(async (): Promise<ServiceResponseType> => {
    return serviceResponse({
      count: await Security.countDocuments(),
    });
  });

  deleteBlockUser = warpAsync(
    async (
      userId: string,
      processType: object
    ): Promise<ServiceResponseType> => {
      const getUser = await Security.findOneAndUpdate(
        { userId },
        {
          $set: processType,
        },
        {
          new: true,
        }
      );
      return serviceResponse({
        data: getUser,
      });
    }
  );

  resetPassword = warpAsync(
    async (email: string): Promise<ServiceResponseType> => {
      const passwordResetLink = await auth.generatePasswordResetLink(email);
      if (!passwordResetLink)
        return serviceResponse({
          message: "Email not found",
        });
      const sendLink = await sendEmail(
        email,
        "Reset password",
        resetEmail(passwordResetLink, email)
      );

      if (!sendLink.success)
        return serviceResponse({
          statusText: "BadRequest",
          message: "Something error Please try aging",
        });

      return serviceResponse({
        statusText: "OK",
        message:
          "Send link to your email ,Please check your email to reset password",
      });
    }
  );

  updatePassword = warpAsync(
    async (userId: string, body: any): Promise<ServiceResponseType> => {
      const getUser = await Security.findOne({ userId })
        .lean()
        .select({ password: 1 });
      if (!getUser)
        return serviceResponse({
          statusText: "NotFound",
        });

      const compare = await bcrypt.compare(
        body.oldPassword,
        getUser?.password!
      );
      if (compare)
        return serviceResponse({
          statusText: "BadRequest",
          message: "New password must be different from the old password",
        });

      await Promise.all([
        auth.updateUser(userId, {
          password: body.newPassword,
        }),
        Security.updateOne(
          { userId },
          {
            password: await bcrypt.hash(body.newPassword, 10),
          }
        ),
      ]);
      return serviceResponse({
        statusText: "OK",
        message: "Password updated successfully",
      });
    }
  );

  sendEmail = warpAsync(async (email: string): Promise<ServiceResponseType> => {
    const token = await this.generateUniqueToken();
    const existingOtp = await Otp.findOne({ email }).lean();

    if (existingOtp) {
      return serviceResponse({
        statusText: "BadRequest",
        message:
          "verification link already exists or the email already register but not verify. Please check your email",
      });
    } else {
      await Otp.create({
        email,
        token,
        expiresAt: new Date(Date.now() + 20 * 60 * 1000),
      });
    }

    // If not verify and not exist in firebase so send verification link
    const verificationLink = `${process.env.BACKEND_URL}/api/v1/security/send/${token}`;
    const resultSendEmail = await sendEmail(
      email!,
      "Verify Your Email",
      sendVerifyEmail(verificationLink, email)
    );
    if (!resultSendEmail.success) return resultSendEmail;

    return serviceResponse({
      statusText: "OK",
      message: `Otp sended successfully please check your email ${email}`,
    });
  });

  private async generateUniqueToken(): Promise<string> {
    let token;
    do {
      token = generateVerificationToken();
    } while (await Otp.exists({ token }));
    return token;
  }

  generateTwoFactorAuth = warpAsync(
    async (userId: string): Promise<ServiceResponseType> => {
      const secret = speakeasy.generateSecret({
        name: `Job ${userId}`,
        length: 20,
      });

      const updatedUser = await Security.findOneAndUpdate(
        { userId, isTwoFactorAuth: { $ne: true } },
        { $set: { twoFactorCode: secret.base32 } },
        { new: true, upsert: false }
      ).lean();

      if (!updatedUser || !secret.otpauth_url)
        return serviceResponse({
          statusText: "BadRequest",
          message:
            "Error creating two-factor authentication or 2FA already enable.",
        });

      const generateQrCode = await QRCode.toBuffer(secret.otpauth_url);
      return serviceResponse({
        statusText: "Created",
        message:
          "Scan the QR code to set up 2FA. After scanning, enter the 6-digit code to complete verification.",
        data: {
          qrCode: generateQrCode,
        },
      });
    }
  );

  verifyTwoFactorAuth = warpAsync(
    async (
      userId: string,
      twoFactorCode: string
    ): Promise<ServiceResponseType> => {
      const userSecurity = await Security.findOne({
        userId,
      })
        .select({
          twoFactorCode: 1,
          isTwoFactorAuth: 1,
        })
        .lean();

      if (userSecurity && userSecurity.isTwoFactorAuth === true)
        return serviceResponse({
          statusText: "Conflict",
          message: "Two factor already enable",
        });

      if (!userSecurity || !userSecurity.isTwoFactorAuth === false)
        return serviceResponse({
          statusText: "BadRequest",
          message: "Error: Invalid user or 2FA not enabled",
        });

      const verified = speakeasy.totp.verify({
        secret: String(userSecurity.twoFactorCode),
        token: twoFactorCode,
        encoding: "base32",
        window: 1,
      });

      if (!verified)
        return serviceResponse({
          statusText: "BadRequest",
          message: "Invalid or expired 2FA code",
        });

      await Security.findOneAndUpdate(
        { userId },
        { $set: { isTwoFactorAuth: true } }
      );
      return serviceResponse({
        statusText: "OK",
        message: "2FA verification successful",
      });
    }
  );
}

export default SecurityService;
