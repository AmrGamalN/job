import express from "express";
import HelpController from "../../controllers/support/help.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateHelpUpdate,
  validateHelpAdd,
} from "../../validation/interaction/help.validator";
import {
  adminAuthorizationMiddlewares,
  userAuthorizationMiddlewares,
} from "../../utils/authorizationRole.util";
import {
  validateQueryHelpCount,
  validateQueryHelpGetAll,
} from "../../validation/query/support/help";
const controller = HelpController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /help/add:
 *   post:
 *     summary: Add help
 *     tags: [Help]
 *     description: Add new help
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HelpAddComponents'
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
  expressValidator(validateHelpAdd()),
  asyncHandler(controller.addHelp.bind(controller))
);

/**
 * @swagger
 * /help/count:
 *   get:
 *     tags: [Help]
 *     summary: Get the count of help
 *     description: Returns the total count of help
 *     parameters:
 *      - $ref: '#/components/parameters/TargetType'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Subject'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to get count of help
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...adminAuthorizationMiddlewares,
  expressValidator(validateQueryHelpCount()),
  asyncHandler(controller.countHelp.bind(controller))
);

/**
 * @swagger
 * /help/get/{id}:
 *   get:
 *     tags: [Help]
 *     summary: Get help
 *     description: Get help by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/HelpResponse'
 *       400:
 *         description: Failed to get help data
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
  asyncHandler(controller.getHelp.bind(controller))
);

/**
 * @swagger
 * /help:
 *   get:
 *     tags: [Help]
 *     summary: Get all help
 *     description: Get all help if admin or manger | get all help of current user
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/HelpTargetType'
 *      - $ref: '#/components/parameters/HelpStatus'
 *      - $ref: '#/components/parameters/Subject'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/HelpResponse'
 *       400:
 *         description: Failed to get all helps data
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
  expressValidator(validateQueryHelpGetAll()),
  asyncHandler(controller.getAllHelps.bind(controller))
);

/**
 * @swagger
 * /help/update/{id}:
 *   put:
 *     tags: [Help]
 *     summary: Update help
 *     description: Update help by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HelpUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update help
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id",
  ...adminAuthorizationMiddlewares,
  requiredParamMiddleware(),
  expressValidator(validateHelpUpdate()),
  asyncHandler(controller.updateHelp.bind(controller))
);

/**
 * @swagger
 * /help/delete/{id}:
 *   delete:
 *     tags: [Help]
 *     summary: Delete help
 *     description: Delete help by id
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
  asyncHandler(controller.deleteHelp.bind(controller))
);

export default router;
