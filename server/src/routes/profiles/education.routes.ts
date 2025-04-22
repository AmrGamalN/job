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
 *         $ref: '#/components/responses/BaseResponse'
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
  ...commonMiddlewares,
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
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateEducationUpdate)),
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
 *         $ref: '#/components/responses/BaseResponse'
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
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.deleteEducation.bind(controller))
);
export default router;
