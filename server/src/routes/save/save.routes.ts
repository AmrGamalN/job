import express from "express";
import SaveController from "../../controllers/save/save.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import { saveValidate } from "../../validation/save/save.validator";
import { validateQueryParams } from "../../validation/query/query.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = SaveController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /save/count:
 *   get:
 *     tags: [Save]
 *     summary: Get the count of save
 *     description: Returns the total count of save
 *     parameters:
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *      - $ref: '#/components/parameters/TargetType'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch save data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...userAuthorizationMiddlewares,
  expressValidator(validateQueryParams()),
  asyncHandler(controller.countSave.bind(controller))
);

/**
 * @swagger
 * /save/add:
 *   post:
 *     tags: [Save]
 *     summary: Add save record
 *     description: Add a new save record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add save record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  expressValidator(saveValidate),
  asyncHandler(controller.addSave.bind(controller))
);

/**
 * @swagger
 * /save/get/{id}:
 *   get:
 *     tags: [Save]
 *     summary: Get save data by id
 *     description: Retrieve save record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SaveResponse'
 *       400:
 *         description: Failed to fetch save data
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
  asyncHandler(controller.getSave.bind(controller))
);

/**
 * @swagger
 * /save:
 *   get:
 *     tags: [Save]
 *     summary: Get all save
 *     description: Retrieve save record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *      - $ref: '#/components/parameters/TargetType'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SaveResponse'
 *       400:
 *         description: Failed to fetch save data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryParams()),
  asyncHandler(controller.getAllSaves.bind(controller))
);

/**
 * @swagger
 * /save/delete/{id}:
 *   delete:
 *     tags: [Save]
 *     summary: Delete save record
 *     description: Delete specific save record by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete save record
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
  asyncHandler(controller.deleteSave.bind(controller))
);
export default router;
