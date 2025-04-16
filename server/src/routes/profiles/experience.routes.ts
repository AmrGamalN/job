import express from "express";
import ExperienceController from "../../controllers/profiles/experience.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import { expressValidator } from "../../middleware/validatorMiddleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = ExperienceController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();
import {
  validateExperienceUpdate,
  validateExperienceAdd,
} from "../../validation/profiles/experience.validator";
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags:
 *   name: Experience
 *   description: Experience management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ExperienceDTO:
 *       type: object
 *       required:
 *         - companyName
 *         - jobTitle
 *         - description
 *         - employmentType
 *         - location
 *         - locationType
 *         - startDate
 *         - endDate
 *         - currentlyWorking
 *       properties:
 *         companyName:
 *           type: string
 *           description: Company name
 *           example: "Tech Solutions Ltd"
 *         jobTitle:
 *           type: string
 *           description: Job title
 *           example: "Frontend Developer"
 *         description:
 *           type: string
 *           description: Job description
 *           example: "Developed UI components for a React app"
 *         employmentType:
 *           type: string
 *           description: Type of employment
 *           enum:
 *             - full-time
 *             - part-time
 *             - internship
 *             - freelance
 *             - self-employed
 *             - seasonal
 *             - apprenticeship
 *             - contract
 *           example: "full-time"
 *         location:
 *           type: string
 *           description: Work location (city or address)
 *           example: "Cairo, Egypt"
 *         locationType:
 *           type: string
 *           description: Location type
 *           enum:
 *             - remote
 *             - on-site
 *             - hybrid
 *           example: "remote"
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date
 *           example: "2022-01-01"
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date
 *           example: "2023-12-31"
 *         currentlyWorking:
 *           type: boolean
 *           description: Whether the user is currently working in this role
 *           example: false
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ExperienceSuccess:
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
 *                 $ref: '#/components/schemas/ExperienceDTO'
 */

/**
 * @swagger
 * /experience/add:
 *   post:
 *     summary: Add experience
 *     tags: [Experience]
 *     description: Add experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceSuccess'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized

 *       500:
 *         description: Internal server error
 */
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateExperienceAdd)),
  asyncHandler(controller.addExperience.bind(controller))
);

/**
 * @swagger
 * /experience/get:
 *   get:
 *     tags: [Experience]
 *     summary: Get experience data for a user
 *     description: Retrieve the experience record of a specific user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceSuccess'
 *       400:
 *         description: Failed to fetch experience data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /experience/get/{experienceId}:
 *   get:
 *     tags: [Experience]
 *     summary: Get experience data for a user
 *     description: Retrieve the experience record of a specific user by id
 *     parameters:
 *       - in: path
 *         name: experienceId
 *         required: true
 *         description: Get user experience by id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceSuccess'
 *       400:
 *         description: Failed to fetch experience data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:experienceId?",
  ...commonMiddlewares,
  asyncHandler(controller.getExperience.bind(controller))
);

/**
 * @swagger
 * /experience/get-all:
 *   get:
 *     tags: [Experience]
 *     summary: Get all experience data for a user
 *     description: Get all experience data for a user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceSuccess'
 *       400:
 *         description: Failed to fetch experiences data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get-all",
  ...commonMiddlewares,
  asyncHandler(controller.getAllExperiences.bind(controller))
);

/**
 * @swagger
 * /experience/update:
 *   put:
 *     tags: [Experience]
 *     summary: Update experience record
 *     description: Update current a user's experience information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceDTO'
 *       400:
 *         description: Failed to update experience record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /experience/update/{experienceId}:
 *   put:
 *     tags: [Experience]
 *     summary: Update experience record
 *     description: Update specific a user's experience information by id
 *     parameters:
 *       - in: path
 *         name: experienceId
 *         required: true
 *         description: The experience id of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceSuccess'
 *       400:
 *         description: Failed to update experience record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:experienceId?",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateExperienceUpdate)),
  asyncHandler(controller.updateExperience.bind(controller))
);

/**
 * @swagger
 * /experience/delete:
 *   delete:
 *     tags: [Experience]
 *     summary: Delete experience record
 *     description: Delete current a user's experience information
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceSuccess'
 *       400:
 *         description: Failed to delete experience record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /experience/delete/{experienceId}:
 *   delete:
 *     tags: [Experience]
 *     summary: Delete experience record
 *     description: Delete specific a user's experience information by id
 *     parameters:
 *       - in: path
 *         name: experienceId
 *         required: true
 *         description: The experience id of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceSuccess'
 *       400:
 *         description: Failed to delete experience record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:experienceId?",
  ...commonMiddlewares,
  asyncHandler(controller.deleteExperience.bind(controller))
);

export default router;
