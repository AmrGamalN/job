import express from "express";
import ProjectController from "../../controllers/profiles/project.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
  validateQueryFirebaseMiddleware,
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
 *             $ref: '#/components/schemas/ProjectBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BaseResponse'
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
 * /project/get/{id}:
 *   get:
 *     tags: [Project]
 *     summary: Get project data for a user
 *     description: Retrieve the project record of a specific user by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectResponse'
 *       400:
 *         description: Failed to fetch project data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id?",
  ...commonMiddlewares,
  asyncHandler(validateQueryFirebaseMiddleware()),
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
 *         $ref: '#/components/responses/ProjectResponse'
 *       400:
 *         description: Failed to fetch project data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
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
 * /project/update/{id}:
 *   put:
 *     tags: [Project]
 *     summary: Update project record
 *     description: Update specific a user's project information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectResponse'
 *       400:
 *         description: Failed to update project record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateProjectUpdate)),
  asyncHandler(controller.updateProject.bind(controller))
);

/**
 * @swagger
 * /project/delete/{id}:
 *   delete:
 *     tags: [Project]
 *     summary: Delete project record
 *     description: Delete specific a user's project information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BaseResponse'
 *       400:
 *         description: Failed to delete project record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:id?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.deleteProject.bind(controller))
);

export default router;
