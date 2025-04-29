import express from "express";
import EducationController from "../../controllers/profiles/education.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateToggleParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateEducationUpdate,
  validateEducationAdd,
} from "../../validation/profiles/education.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = EducationController.getInstance();
const router = express.Router();

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
 *             $ref: '#/components/schemas/EducationBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add education record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  expressValidator(validateEducationAdd),
  asyncHandler(controller.addEducation.bind(controller))
);

/**
 * @swagger
 * /education/get/{id}:
 *   get:
 *     tags: [Education]
 *     summary: Get education data for a user
 *     description: Retrieve the education record of a specific user by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationResponse'
 *       400:
 *         description: Failed to fetch education data
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
  asyncHandler(controller.getEducation.bind(controller))
);

/**
 * @swagger
 * /education/get-all:
 *   get:
 *     tags: [Education]
 *     summary: Get all education data for a user
 *     description: Get all education data for a user
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationResponse'
 *       400:
 *         description: Failed to fetch educations data
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
  asyncHandler(controller.getAllEducations.bind(controller))
);

/**
 * @swagger
 * /education/update/{id}:
 *   put:
 *     tags: [Education]
 *     summary: Update education record
 *     description: Update specific a user's education information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EducationBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EducationResponse'
 *       400:
 *         description: Failed to update education record
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
  expressValidator(validateEducationUpdate),
  asyncHandler(controller.updateEducation.bind(controller))
);

/**
 * @swagger
 * /education/delete/{id}:
 *   delete:
 *     tags: [Education]
 *     summary: Delete education record
 *     description: Delete specific a user's education information by id or curUser id
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete education record
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
  asyncHandler(controller.deleteEducation.bind(controller))
);
export default router;
