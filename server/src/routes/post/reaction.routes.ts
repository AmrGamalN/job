import express from "express";
import ReactionController from "../../controllers/post/reaction.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { reactionValidator } from "../../validation/post/reaction.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import {
  expressValidator,
  requiredParamMiddleware,
  validateQueryMiddleware,
} from "../../middlewares/validator.middleware";

const controller = ReactionController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /reaction/add:
 *   post:
 *     tags: [Reaction]
 *     summary: Add reaction record
 *     description: Add a new reaction record for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReactionAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add reaction record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  expressValidator(reactionValidator),
  asyncHandler(controller.addReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/count/{id}:
 *   get:
 *     tags: [Reaction]
 *     summary: Get count reaction of specific post
 *     description: Returns the total count of reaction
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *       - in: query
 *         name: reactionType
 *         required: true
 *         description: reaction type
 *         schema:
 *           type: string
 *           enum: [post, comment]
 *           example: post
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch reaction data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.countReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/get/{id}:
 *   get:
 *     tags: [Reaction]
 *     summary: Get reaction data for a user
 *     description: Retrieve the reaction record of a specific user by id
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *       - in: query
 *         name: reactionType
 *         required: true
 *         description: reaction type
 *         schema:
 *           type: string
 *           enum: [post, comment]
 *           example: post
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReactionResponse'
 *       400:
 *         description: Failed to fetch reaction data
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
  validateQueryMiddleware(),
  requiredParamMiddleware(),
  asyncHandler(controller.getReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/update/{id}:
 *   put:
 *     tags: [Reaction]
 *     summary: Update reaction record
 *     description: Update specific a user's reaction information by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReactionUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReactionResponse'
 *       400:
 *         description: Failed to update reaction record
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
  expressValidator(reactionValidator),
  asyncHandler(controller.updateReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/delete/{id}:
 *   delete:
 *     tags: [Reaction]
 *     summary: Delete reaction record
 *     description: Delete specific a user's reaction information by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReactionUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReactionSuccess'
 *       400:
 *         description: Failed to delete reaction record
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
  expressValidator(reactionValidator),
  asyncHandler(controller.deleteReaction.bind(controller))
);
export default router;
