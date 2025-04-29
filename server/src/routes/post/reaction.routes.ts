import express from "express";
import ReactionController from "../../controllers/post/reaction.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { validateReaction } from "../../validation/post/reaction.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import {
  expressValidator,
  validateToggleParamMiddleware,
  validateQueryMiddleware,
} from "../../middlewares/validator.middleware";

const controller = ReactionController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /reaction/add/{id}:
 *   post:
 *     tags: [Reaction]
 *     summary: Add reaction record
 *     description: Add a new reaction record for the user
 *     parameters:
 *       - $ref: '#/components/schemas/Id'
 *       - in: query
 *         name: post
 *         required: false
 *         description: The reaction type of the user to add reaction
 *         schema:
 *           type: string
 *           enum: [like, love, haha, wow, sad, angry]
 *           example: like
 *       - in: query
 *         name: comment_reaction
 *         required: false
 *         description: The reaction type of the user to add reaction
 *         schema:
 *           type: string
 *           enum: [like, love, haha, wow, sad, angry]
 *           example: like
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
  "/add/:id?",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateToggleParamMiddleware(),
  expressValidator(validateReaction),
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
  "/count/:id?",
  ...userAuthorizationMiddlewares,
  validateToggleParamMiddleware(),
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
  "/get/:id?",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateToggleParamMiddleware(),
  asyncHandler(controller.getReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/update/{id}:
 *   put:
 *     tags: [Reaction]
 *     summary: Update reaction record
 *     description: Update specific a user's reaction information by id
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *       - in: query
 *         name: post
 *         required: false
 *         description: The reaction type of the user to add reaction
 *         schema:
 *           type: string
 *           enum: [like, love, haha, wow, sad, angry]
 *           example: like
 *       - in: query
 *         name: comment
 *         required: false
 *         description: The reaction type of the user to add reaction
 *         schema:
 *           type: string
 *           enum: [like, love, haha, wow, sad, angry]
 *           example: like
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
  "/update/:id?",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateToggleParamMiddleware(),
  expressValidator(validateReaction),
  asyncHandler(controller.updateReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/delete/{id}:
 *   delete:
 *     tags: [Reaction]
 *     summary: Delete reaction record
 *     description: Delete specific a user's reaction information by id
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
  "/delete/:id?",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateToggleParamMiddleware(),
  expressValidator(validateReaction),
  asyncHandler(controller.deleteReaction.bind(controller))
);
export default router;
