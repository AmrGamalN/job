import express from "express";
import UserController from "../../controllers/profiles/user.controller";
import { asyncHandler } from "../../middleware/handleError";
import { validateUserUpdate } from "../../validation/profiles/user.validator";
import {
  expressValidator,
  validateParamFirebaseMiddleware,
} from "../../middleware/validatorMiddleware";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = UserController.getInstance();
import { role } from "../../utils/role";
const router = express.Router();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags: [User]
 * description: User Management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user id
 *         userName:
 *           type: string
 *           description: The user user name
 *         firstName:
 *           type: string
 *           description: The user job firstName
 *         lastName:
 *           type: string
 *           description: The user lastName
 *         prefixS3:
 *           type: string
 *           description: The user job prefixS3
 *         profileImage:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               description: The user profile image url
 *             imageKey:
 *               type: string
 *               description: The user profile image key
 *         coverImage:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               description: The user cover image url
 *             imageKey:
 *               type: string
 *               description: The user cover image key
 *         account:
 *           type: string
 *           description: The user account
 *           enum: ["user", "admin", "manager"]
 *           default: "user"
 *         linkedIn:
 *           type: string
 *           description: The user linkedIn
 *         github:
 *           type: string
 *           description: The user github
 *         website:
 *           type: string
 *           description: The user website
 *         visibility:
 *           type: string
 *           description: The user account
 *           enum: ["connection", "public", "private"]
 *           default: "connection"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UserSuccess:
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
 *                 $ref: '#/components/schemas/UserDTO'
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     tags: [User]
 *     summary: Update user details
 *     description:  Update user for the currently authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The user's user name
 *                 example: "amr"
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *                 example: "Amr"
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *                 example: "Doe"
 *               linkedIn:
 *                 type: string
 *                 description: The user's LinkedIn profile URL
 *                 example: "https://linkedin.com/in/amr"
 *               github:
 *                 type: string
 *                 description: The user's GitHub profile URL
 *                 example: "https://github.com/amr"
 *               website:
 *                 type: string
 *                 description: The user's website URL
 *                 example: "https://amr.com"
 *               visibility:
 *                 type: string
 *                 description: The user's visibility setting
 *                 enum: ["connection", "public", "private"]
 *                 default: "connection"
 *                 example: "public"  # Example for visibility setting
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The user's profile image (file upload)
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: The user's cover image (file upload)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserSuccess'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 * /user/update/{userId}:
 *   put:
 *     tags: [User]
 *     summary: Update user details
 *     description: Admin can update user by specifying the user id.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The user's user name
 *                 example: "amr"
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *                 example: "Amr"
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *                 example: "Doe"
 *               linkedIn:
 *                 type: string
 *                 description: The user's LinkedIn profile URL
 *                 example: "https://linkedin.com/in/amr"
 *               github:
 *                 type: string
 *                 description: The user's GitHub profile URL
 *                 example: "https://github.com/amr"
 *               website:
 *                 type: string
 *                 description: The user's website URL
 *                 example: "https://amr.com"
 *               visibility:
 *                 type: string
 *                 description: The user's visibility setting
 *                 enum: ["connection", "public", "private"]
 *                 default: "connection"
 *                 example: "public"  # Example for visibility setting
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The user's profile image (file upload)
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: The user's cover image (file upload)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserSuccess'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:userId?",
  ...commonMiddlewares,
  asyncHandler(validateParamFirebaseMiddleware()),
  asyncHandler(expressValidator(validateUserUpdate)),
  asyncHandler(controller.updateUser.bind(controller))
);

export default router;
