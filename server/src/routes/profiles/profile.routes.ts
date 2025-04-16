import express from "express";
import ProfileController from "../../controllers/profiles/profile.controller";
import { asyncHandler } from "../../middleware/handleError";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
import { validateProfileUpdate } from "../../validation/profiles/profile.validator";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = ProfileController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags: [Profile]
 * description: Profile Management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user id
 *         about:
 *           type: string
 *           description: The user about
 *         jobTitle:
 *           type: string
 *           description: The user job title
 *         jobDescription:
 *           type: string
 *           description: The user job description
 *         jobLocation:
 *           type: string
 *           description: The user job location
 *         jobCompany:
 *           type: string
 *           description: The user job company
 *         jobType:
 *           type: string
 *           description: The user job type
 *           enum: ["full-time", "part-time", "freelance", ""]
 *           default: ""
 *         projectPreference:
 *           type: string
 *           description: The user project preference
 *           enum: ["Long-term", "Short-term", "both", ""]
 *           default: ""
 *         experienceLevel:
 *           type: string
 *           description: The user experience level
 *           enum: ["entry-level", "Intermediate", "expert", ""]
 *           default: ""
 *         categories:
 *           type: array
 *           description: The user categories
 *           items:
 *             type: string
 *         skills:
 *           type: array
 *           description: The user skills
 *           items:
 *             type: string
 *         languages:
 *           type: array
 *           description: The user languages
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 description: The user language
 *               level:
 *                 type: string
 *                 description: The user level
 *                 enum: ["beginner", "intermediate", "advanced", "fluent"]
 *                 default: fluent
 *         profileLink:
 *           type: string
 *           description: The user profileLink
 *           required: false
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ProfileSuccess:
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
 *                 $ref: '#/components/schemas/ProfileDTO'
 */

/**
 * @swagger
 * /profile/update:
 *    put:
 *     tags: [Profile]
 *     summary: Update profile
 *     description: Update profile for the currently authenticated user.
 *    requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDTO'
 *    responses:
 *     200:
 *       $ref: '#/components/responses/ProfileSuccess'
 *     400:
 *       description: Failed to update profile
 *     401:
 *       description: Unauthorized
 *     500:
 *       description: Internal Server Error
 * /profile/update/{profileId}:
 *    put:
 *     tags: [Profile]
 *     summary: Update profile by id
 *     description: Admin can update profile by specifying the profile id.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         description: The profile id
 *    requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDTO'
 *    responses:
 *     200:
 *       $ref: '#/components/responses/ProfileSuccess'
 *     400:
 *       description: Failed to update profile
 *     401:
 *       description: Unauthorized
 *     500:
 *       description: Internal Server Error
 */
router.put(
  "/update/:profileId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateProfileUpdate)),
  asyncHandler(controller.updateProfile.bind(controller))
);

/**
 * @swagger
 * /profile/get:
 *   get:
 *     tags: [Profile]
 *     summary: Get user profile
 *     description: Get profile for current user
 *     responses:
 *      200:
 *        $ref: '#/components/responses/AddressSuccess'
 *      400:
 *        description: Failed to get profile
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 * /profile/get/{profileId}:
 *   get:
 *     tags: [Profile]
 *     summary: Get profile by link
 *     description: Get profile by link
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         description: The user profile link
 *     responses:
 *      200:
 *        $ref: '#/components/responses/AddressSuccess'
 *      400:
 *        description: Failed to get profile
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 */
router.get(
  "/get/:profileId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getProfileByLink.bind(controller))
);
export default router;
