import express from "express";
import EducationController from "../../controllers/client/education.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import {
  expressValidator,
  requiredParamMiddleware,
  requiredUserIdMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateEducationUpdate,
  validateEducationAdd,
} from "../../validation/client/education.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import { EducationDtoType } from "../../dto/client/education.dto";
import Education from "../../models/mongodb/client/education.model";
const controller = EducationController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/education/add:
 *   post:
 *     tags: [Education]
 *     summary: Add education
 *     description: Add a new education
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
 * /user/education/get/{id}:
 *   get:
 *     tags: [Education]
 *     summary: Get education
 *     description: Get education by id
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
  "/get/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  userMiddleware.expressVisibilityMiddleware<EducationDtoType>({
    model: Education,
    method: "findById",
    idField: "params",
    idKey: "id",
  }),
  asyncHandler(controller.getEducation.bind(controller))
);

/**
 * @swagger
 * /user/education/{userId}:
 *   get:
 *     tags: [Education]
 *     summary: Get all education
 *     description: Get all education by userId
 *     parameters:
 *      - $ref: '#/components/parameters/UserId'
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
  "/all/:userId",
  ...userAuthorizationMiddlewares,
  requiredUserIdMiddleware(),
  userMiddleware.expressVisibilityMiddleware<EducationDtoType>({
    model: Education,
    method: "find",
    idField: "params",
    idKey: "userId",
  }),
  asyncHandler(controller.getAllEducations.bind(controller))
);

/**
 * @swagger
 * /user/education/update/{id}:
 *   put:
 *     tags: [Education]
 *     summary: Update education
 *     description: Update education by id
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
  "/update/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  expressValidator(validateEducationUpdate),
  asyncHandler(controller.updateEducation.bind(controller))
);

/**
 * @swagger
 * /user/education/delete/{id}:
 *   delete:
 *     tags: [Education]
 *     summary: Delete education
 *     description: Delete education by id
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
  "/delete/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.deleteEducation.bind(controller))
);
export default router;
