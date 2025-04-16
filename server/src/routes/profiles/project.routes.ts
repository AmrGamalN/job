import express from "express";
import ProjectController from "../../controllers/profiles/project.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = ProjectController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();
import {
  validateProjectUpdate,
  validateProjectAdd,
} from "../../validation/profiles/project.validator";
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectDTO:
 *       type: object
 *       required:
 *         - projectName
 *         - companyName
 *         - description
 *         - status
 *         - technologies
 *         - startDate
 *         - endDate
 *         - projectUrl
 *         - repositoryUrl
 *       properties:
 *         projectName:
 *           type: string
 *           example: "AI Resume Builder"
 *           description: "Name of the project"
 *         companyName:
 *           type: string
 *           example: "TechStars Inc."
 *           description: "Company or organization name"
 *         description:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: "This project automates resume generation using AI."
 *           description: "Brief overview of the project"
 *         status:
 *           type: string
 *           enum: [active, completed, pending, archived]
 *           default: active
 *           example: "active"
 *           description: "Current status of the project"
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Node.js", "React", "MongoDB"]
 *           description: "Technologies used in the project"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *           description: "Start date of the project"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2023-06-01"
 *           description: "End date of the project"
 *         projectUrl:
 *           type: string
 *           format: uri
 *           example: "https://example.com/project"
 *           description: "Live project URL"
 *         repositoryUrl:
 *           type: string
 *           format: uri
 *           example: "https://github.com/username/project"
 *           description: "Link to the source code repository"
 *         attachment:
 *           type: string
 *           format: uri
 *           example: "https://github.com/username/project"
 *           description: "Link to the source code repository"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ProjectSuccess:
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
 *                 $ref: '#/components/schemas/ProjectDTO'
 */

/**
 * @swagger
 * /project/add:
 *   post:
 *     summary: Add project
 *     tags: [Project]
 *     description: Add project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectSuccess'
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
  asyncHandler(expressValidator(validateProjectAdd)),
  asyncHandler(controller.addProject.bind(controller))
);

/**
 * @swagger
 * /project/get:
 *   get:
 *     tags: [Project]
 *     summary: Get project data for a user
 *     description: Retrieve the project record of a specific user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectSuccess'
 *       400:
 *         description: Failed to fetch project data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /project/get/{projectId}:
 *   get:
 *     tags: [Project]
 *     summary: Get project data for a user
 *     description: Retrieve the project record of a specific user by id
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Get user project by id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectSuccess'
 *       400:
 *         description: Failed to fetch project data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:projectId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getProject.bind(controller))
);

/**
 * @swagger
 * /project/get-all:
 *   get:
 *     tags: [Project]
 *     summary: Get all project data for a user
 *     description: Get all project data for a user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectSuccess'
 *       400:
 *         description: Failed to fetch projects data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get-all",
  ...commonMiddlewares,
  asyncHandler(controller.getAllProjects.bind(controller))
);

/**
 * @swagger
 * /project/update:
 *   put:
 *     tags: [Project]
 *     summary: Update project record
 *     description: Update current a user's project information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectDTO'
 *       400:
 *         description: Failed to update project record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /project/update/{projectId}:
 *   put:
 *     tags: [Project]
 *     summary: Update project record
 *     description: Update specific a user's project information by id
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The project id of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectSuccess'
 *       400:
 *         description: Failed to update project record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:projectId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateProjectUpdate)),
  asyncHandler(controller.updateProject.bind(controller))
);

/**
 * @swagger
 * /project/delete:
 *   delete:
 *     tags: [Project]
 *     summary: Delete project record
 *     description: Delete current a user's project information
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectSuccess'
 *       400:
 *         description: Failed to delete project record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /project/delete/{projectId}:
 *   delete:
 *     tags: [Project]
 *     summary: Delete project record
 *     description: Delete specific a user's project information by id
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The project id of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectSuccess'
 *       400:
 *         description: Failed to delete project record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:projectId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.deleteProject.bind(controller))
);

export default router;
