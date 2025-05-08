import express from "express";
import ExperienceController from "../../controllers/client/experience.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import {
  expressValidator,
  requiredParamMiddleware,
  requiredUserIdMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateExperienceUpdate,
  validateExperienceAdd,
} from "../../validation/client/experience.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import { ExperienceDtoType } from "../../dto/client/experience.dto";
import Experience from "../../models/mongodb/client/experience.model";
const controller = ExperienceController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/experience/add:
 *   post:
 *     summary: Add experience
 *     tags: [Experience]
 *     description: Add new experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceBaseComponents'
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
  expressValidator(validateExperienceAdd),
  asyncHandler(controller.addExperience.bind(controller))
);

/**
 * @swagger
 * /user/experience/get/{id}:
 *   get:
 *     tags: [Experience]
 *     summary: Get experience
 *     description: Get experience by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceResponse'
 *       400:
 *         description: Failed to get experience data
 *       403:
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
  userMiddleware.expressVisibilityMiddleware<ExperienceDtoType>({
    model: Experience,
    method: "findById",
    idField: "params",
    idKey: "id",
  }),
  asyncHandler(controller.getExperience.bind(controller))
);

/**
 * @swagger
 * /user/experience/all/{userId}:
 *   get:
 *     tags: [Experience]
 *     summary: Get all experience
 *     description: Get all experience by userId
 *     parameters:
 *      - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceResponse'
 *       400:
 *         description: Failed to get all experiences data
 *       403:
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
  userMiddleware.expressVisibilityMiddleware<ExperienceDtoType>({
    model: Experience,
    method: "find",
    idField: "params",
    idKey: "userId",
  }),
  asyncHandler(controller.getAllExperiences.bind(controller))
);

/**
 * @swagger
 * /user/experience/update/{id}:
 *   put:
 *     tags: [Experience]
 *     summary: Update experience
 *     description: Update experience by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update experience
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
  expressValidator(validateExperienceUpdate),
  asyncHandler(controller.updateExperience.bind(controller))
);

/**
 * @swagger
 * /user/experience/delete/{id}:
 *   delete:
 *     tags: [Experience]
 *     summary: Delete experience
 *     description: Delete experience by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
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
  asyncHandler(controller.deleteExperience.bind(controller))
);

export default router;
