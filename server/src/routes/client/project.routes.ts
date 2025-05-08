import express from "express";
import ProjectController from "../../controllers/client/project.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import {
  expressValidator,
  requiredParamMiddleware,
  requiredUserIdMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateProjectUpdate,
  validateProjectAdd,
} from "../../validation/client/project.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import { ProjectDtoType } from "../../dto/client/project.dto";
import Project from "../../models/mongodb/client/project.model";
const controller = ProjectController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/project/add:
 *   post:
 *     summary: Add new project
 *     tags: [Project]
 *     description: Add new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  expressValidator(validateProjectAdd),
  asyncHandler(controller.addProject.bind(controller))
);

/**
 * @swagger
 * /user/project/get/{id}:
 *   get:
 *     tags: [Project]
 *     summary: Get project
 *     description: Get project by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectResponse'
 *       400:
 *         description: Failed to get project data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  userMiddleware.expressVisibilityMiddleware<ProjectDtoType>({
    model: Project,
    method: "findById",
    idField: "params",
    idKey: "id",
  }),
  asyncHandler(controller.getProject.bind(controller))
);

/**
 * @swagger
 * /user/project/all/{userId}:
 *   get:
 *     tags: [Project]
 *     summary: Get all project
 *     description: Get all project by userId
 *     parameters:
 *      - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProjectResponse'
 *       400:
 *         description: Failed to get all project data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/all/:userId",
  ...userAuthorizationMiddlewares,
  requiredUserIdMiddleware(),
  userMiddleware.expressVisibilityMiddleware<ProjectDtoType>({
    model: Project,
    method: "find",
    idField: "params",
    idKey: "userId",
  }),
  asyncHandler(controller.getAllProjects.bind(controller))
);

/**
 * @swagger
 * /user/project/update/{id}:
 *   put:
 *     tags: [Project]
 *     summary: Update project
 *     description: Update project by id
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
 *         description: Failed to update project
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  expressValidator(validateProjectUpdate),
  asyncHandler(controller.updateProject.bind(controller))
);

/**
 * @swagger
 * /user/project/delete/{id}:
 *   delete:
 *     tags: [Project]
 *     summary: Delete project
 *     description: Delete project by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete project
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.deleteProject.bind(controller))
);

export default router;
