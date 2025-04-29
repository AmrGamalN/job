import express from "express";
import InterestController from "../../controllers/profiles/interest.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  validateToggleParamMiddleware,
} from "../../middlewares/validator.middleware";
const router = express.Router();
import { InterestValidator } from "../../validation/profiles/interest.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = InterestController.getInstance();

/**
 * @swagger
 * /interest/update/{id}:
 *   put:
 *     tags: [Interest]
 *     summary: Update interest record
 *     description: Update specific a user's interest information by id or curUser id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *      - $ref: '#/components/parameters/OwnerType'
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
 *         description: Failed to update interest record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id?",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateToggleParamMiddleware(),
  expressValidator(InterestValidator),
  asyncHandler(controller.updateInterest.bind(controller))
);

/**
 * @swagger
 * /interest/delete/{id}:
 *   delete:
 *     tags: [Interest]
 *     summary: Delete interest record
 *     description: Delete specific a user's interest information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *      - $ref: '#/components/parameters/OwnerType'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/InterestBaseComponents'
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
  "/delete/:id?",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateToggleParamMiddleware(),
  expressValidator(InterestValidator),
  asyncHandler(controller.deleteInterest.bind(controller))
);

export default router;
