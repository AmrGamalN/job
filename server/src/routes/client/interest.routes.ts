import express from "express";
import InterestController from "../../controllers/client/interest.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
const router = express.Router();
import { InterestValidator } from "../../validation/client/interest.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = InterestController.getInstance();

/**
 * @swagger
 * /user/interest/update/{id}:
 *   put:
 *     tags: [Interest]
 *     summary: Update interest
 *     description: Update user interest by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/InterestResponse'
 *       400:
 *         description: Failed to update interest
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
  expressValidator(InterestValidator),
  asyncHandler(controller.updateInterest.bind(controller))
);

/**
 * @swagger
 * /user/interest/delete/{id}:
 *   delete:
 *     tags: [Interest]
 *     summary: Delete interest
 *     description: Delete user interest by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/InterestResponse'
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
  expressValidator(InterestValidator),
  asyncHandler(controller.deleteInterest.bind(controller))
);

export default router;
