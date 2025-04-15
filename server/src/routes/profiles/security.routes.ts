import express from "express";
import SecurityController from "../../controllers/profiles/security.controller";
import { expressValidator } from "../../middleware/validatorMiddleware";
import { asyncHandler } from "../../middleware/handleError";
import {
  validateUserSecurityUpdate,
  validateSecurityEmail,
  validateSecurityUpdatePass,
  validateSecurityStatus,
  validateCode2AF,
} from "../../validation/profiles/security.validator";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = SecurityController.getInstance();
const role = ["admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(["admin", "manager"])),
];

/**
 * @swagger
 * tags: [Security]
 * description: Security Management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SecurityDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ObjectId of the user
 *           example: "661c3a36f1d26e6a8f87cbe9"
 *         userId:
 *           type: string
 *           example: "usr_123"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+201001112233"
 *         password:
 *           type: string
 *           format: password
 *           example: "StrongPassword123!"
 *         role:
 *           type: string
 *           enum: [user, admin, manager]
 *           default: user
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: inactive
 *         isEmailVerified:
 *           type: boolean
 *           default: false
 *         isPasswordReset:
 *           type: boolean
 *           default: false
 *         isAccountBlocked:
 *           type: boolean
 *           default: false
 *         isAccountDeleted:
 *           type: boolean
 *           default: false
 *         isTwoFactorAuth:
 *           type: boolean
 *           default: false
 *         twoFactorCode:
 *           type: string
 *           default: ""
 *         numberLogin:
 *           type: number
 *           default: 0
 *         lastFailedLoginTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         dateToJoin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         sign_up_provider:
 *           type: string
 *           default: ""
 *         sign_in_provider:
 *           type: string
 *           default: ""
 *         terms:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * components:
 *   responses:
 *     SecuritySuccess:
 *       description: Successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *               success:
 *                 type: boolean
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/SecurityDTO'
 */

/**
 * @swagger
 * /user/update/{userId}:
 *   put:
 *     tags: [User]
 *     summary: Update user security
 *     description: Update user's password or other security information.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 example: NewPassword456!
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SecuritySuccess'
 *       400:
 *         description: Bad request (e.g. validation error)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateUserSecurityUpdate)),
  asyncHandler(controller.updateSecurity.bind(controller))
);

/**
 * @swagger
 * /security/count:
 *   get:
 *     tags: [Security]
 *     summary: Get count of user security records
 *     description: Returns the total count of user security records in the system.
 *     responses:
 *       200:
 *         description: Count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Count fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                       example: 152
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/count",
  ...commonMiddlewares,
  asyncHandler(controller.countSecurity.bind(controller))
);

/**
 * @swagger
 * /security/block-delete/{userId}:
 *   post:
 *     tags: [Security]
 *     summary: Block or delete user account
 *     description: Block or mark a user account as deleted by user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to block or delete
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAccountBlocked:
 *                 type: boolean
 *                 example: true
 *               isAccountDeleted:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SecuritySuccess'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/block-delete/:userId",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateSecurityStatus)),
  asyncHandler(controller.deleteBlockUser.bind(controller))
);

/**
 * @swagger
 * /security/reset:
 *   post:
 *     tags: [Security]
 *     summary: Request password reset
 *     description: Send a password reset email to the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: amr5179520@gmail.com
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SecuritySuccess'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Email not found
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/reset",
  asyncHandler(expressValidator(validateSecurityEmail)),
  asyncHandler(controller.resetPassword.bind(controller))
);

/**
 * @swagger
 * /security/update-password:
 *   post:
 *     tags: [Security]
 *     summary: Update the user's password
 *     description: Update the password of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword456
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SecuritySuccess'
 *       400:
 *         description: Invalid request or validation failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/update-password",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(expressValidator(validateSecurityUpdatePass)),
  asyncHandler(controller.updatePassword.bind(controller))
);

/**
 * @swagger
 * /security/request-email-verification:
 *   post:
 *     tags: [Security]
 *     summary: Send email verification
 *     description: Send a verification email to confirm the user's email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: amr5179520@gmail.com
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SecuritySuccess'
 *       400:
 *         description: Invalid email
 *       404:
 *         description: Email not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/request-email-verification",
  asyncHandler(expressValidator(validateSecurityEmail)),
  asyncHandler(controller.sendVerificationEmail.bind(controller))
);

/**
 * @swagger
 * /security/generate/2fa:
 *   post:
 *     tags: [Security]
 *     summary: Generate Two-Factor Authentication QR code
 *     description: Generate a QR code for setting up Two-Factor Authentication (2FA).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     qrCode:
 *                       type: string
 *                       format: byte
 *                       description: Base64 encoded PNG image of the QR code
 *                       example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/generate/2fa",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(controller.generateTwoFactorAuth.bind(controller))
);

/**
 * @swagger
 * /security/confirm/2fa:
 *   post:
 *     tags: [Security]
 *     summary: Confirm Two-Factor Authentication (2FA) code
 *     description: Verify the 2FA code entered by the user after scanning the QR code.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SecuritySuccess'
 *       400:
 *         description: Invalid code
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/confirm/2fa",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(expressValidator(validateCode2AF)),
  asyncHandler(controller.verifyTwoFactorAuth.bind(controller))
);
export default router;
