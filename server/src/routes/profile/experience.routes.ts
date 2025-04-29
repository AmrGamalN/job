import express from "express";
import ExperienceController from "../../controllers/profiles/experience.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateToggleParamMiddleware,
} from "../../middlewares/validator.middleware";
const controller = ExperienceController.getInstance();
const router = express.Router();
import {
  validateExperienceUpdate,
  validateExperienceAdd,
} from "../../validation/profiles/experience.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";

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
 * /experience/get/{id}:
 *   get:
 *     tags: [Experience]
 *     summary: Get experience data for a user
 *     description: Retrieve the experience record of a specific user by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceResponse'
 *       400:
 *         description: Failed to fetch experience data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id?",
  ...userAuthorizationMiddlewares,
  validateToggleParamMiddleware(),
  asyncHandler(controller.getExperience.bind(controller))
);

/**
 * @swagger
 * /experience/get-all:
 *   get:
 *     tags: [Experience]
 *     summary: Get all experience data for a user
 *     description: Get all experience data for a user
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ExperienceResponse'
 *       400:
 *         description: Failed to fetch experiences data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get-all",
  ...userAuthorizationMiddlewares,
  asyncHandler(controller.getAllExperiences.bind(controller))
);

/**
 * @swagger
 * /experience/update/{id}:
 *   put:
 *     tags: [Experience]
 *     summary: Update experience record
 *     description: Update specific a user's experience information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *            - $ref: '#/components/schemas/ExperienceBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update experience record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id?",
  ...userAuthorizationMiddlewares,
  validateToggleParamMiddleware(),
  expressValidator(validateExperienceUpdate),
  asyncHandler(controller.updateExperience.bind(controller))
);

/**
 * @swagger
 * /experience/delete/{id}:
 *   delete:
 *     tags: [Experience]
 *     summary: Delete experience record
 *     description: Delete specific a user's experience information by id
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
  "/delete/:id?",
  ...userAuthorizationMiddlewares,
  validateToggleParamMiddleware(),
  asyncHandler(controller.deleteExperience.bind(controller))
);

export default router;
