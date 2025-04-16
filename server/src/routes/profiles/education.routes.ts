import express from "express";
import EducationController from "../../controllers/profiles/education.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
import {
  validateEducationUpdate,
  validateEducationAdd,
} from "../../validation/profiles/education.validator";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = EducationController.getInstance();
import { role } from "../../utils/role";
const router = express.Router();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags: [Education]
 * definitions: Education Management Api
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EducationDTO:
 *       type: object
 *       required:
 *         - university
 *         - description
 *         - degree
 *         - major
 *         - startDate
 *         - endDate
 *         - gpa
 *       properties:
 *         university:
 *           type: string
 *           description: University name
 *           example: Cairo University
 *         description:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           description: Description of the education
 *           example: Studied computer science and software engineering.
 *         degree:
 *           type: string
 *           description: Degree achieved
 *           example: Bachelor's
 *         major:
 *           type: string
 *           description: Major subject
 *           example: Computer Science
 *         startDate:
 *           type: date
 *           format: date
 *           description: Start date
 *           example: 2018-09-01
 *         endDate:
 *           type: date
 *           format: date
 *           description: End date
 *           example: 2022-07-01
 *         gpa:
 *           type: number
 *           minLength: 1
 *           maxLength: 5
 *           description: Grade Point Average
 *           example: 3.8
 */

/**
 * @swagger
 * components:
 *   responses:
 *     EducationSuccess:
 *       description: Successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *               count:
 *                 type: number
 *               success:
 *                 type: boolean
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/EducationDTO'
 */

/**
 * @swagger
 * /education/add:
 *   post:
 *     tags: [Education]
 *     summary: Add education record
 *     description: Add a new education record for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EducationDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to add education record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateEducationAdd)),
  asyncHandler(controller.addEducation.bind(controller))
);

/**
 * @swagger
 * /education/get:
 *   get:
 *     tags: [Education]
 *     summary: Get education data for a user
 *     description: Retrieve the education record of a specific user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to fetch education data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /education/get/{educationId}:
 *   get:
 *     tags: [Education]
 *     summary: Get education data for a user
 *     description: Retrieve the education record of a specific user by id
 *     parameters:
 *       - in: path
 *         name: educationId
 *         required: true
 *         description: Get user education by id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to fetch education data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:educationId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getEducation.bind(controller))
);

/**
 * @swagger
 * /education/get-all:
 *   get:
 *     tags: [Education]
 *     summary: Get all education data for a user
 *     description: Get all education data for a user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to fetch educations data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get-all",
  ...commonMiddlewares,
  asyncHandler(controller.getAllEducations.bind(controller))
);

/**
 * @swagger
 * /education/update:
 *   put:
 *     tags: [Education]
 *     summary: Update education record
 *     description: Update current a user's education information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EducationDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to update education record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /education/update/{educationId}:
 *   put:
 *     tags: [Education]
 *     summary: Update education record
 *     description: Update specific a user's education information by id
 *     parameters:
 *       - in: path
 *         name: educationId
 *         required: true
 *         description: The education id of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EducationDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to update education record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:educationId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateEducationUpdate)),
  asyncHandler(controller.updateEducation.bind(controller))
);

/**
 * @swagger
 * /education/delete:
 *   delete:
 *     tags: [Education]
 *     summary: Delete education record
 *     description: Delete current a user's education information
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to delete education record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /education/delete/{educationId}:
 *   delete:
 *     tags: [Education]
 *     summary: Delete education record
 *     description: Delete specific a user's education information by id
 *     parameters:
 *       - in: path
 *         name: educationId
 *         required: true
 *         description: The education id of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationSuccess'
 *       400:
 *         description: Failed to delete education record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:educationId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.deleteEducation.bind(controller))
);
export default router;
