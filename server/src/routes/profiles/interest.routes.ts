import express from "express";
import InterestController from "../../controllers/profiles/interest.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = InterestController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();
import { InterestValidator } from "../../validation/profiles/interest.validator";

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * /interest/update/{id}:
 *   put:
 *     tags: [Interest]
 *     summary: Update interest record
 *     description: Update specific a user's interest information by id or curUser id
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
 *         description: Failed to update interest record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(InterestValidator)),
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
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(InterestValidator)),
  asyncHandler(controller.deleteInterest.bind(controller))
);

export default router;
