import express from "express";
import ReactionController from "../../controllers/post/reaction.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
  validateQueryMiddleware,
} from "../../middleware/validatorMiddleware";
import { validateReaction } from "../../validation/post/reaction.validator";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = ReactionController.getInstance();
import { role } from "../../utils/role";
const router = express.Router();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags: [Reaction]
 * definitions: Reaction Management Api
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReactionDTO:
 *       type: object
 *       required:
 *         - reactionType
 *       properties:
 *         reactionType:
 *           type: string
 *           enum: [like, love, haha, wow, sad, angry]
 *           example: like
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ReactionSuccess:
 *       description: Successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *               count:
 *                 type: number
 *               success:
 *                 type: boolean
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/ReactionDTO'
 */

/**
 * @swagger
 * /reaction/add/{id}:
 *   post:
 *     tags: [Reaction]
 *     summary: Add reaction record
 *     description: Add a new reaction record for the user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The post id or comment id  of the user to add reaction
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
 *         $ref: '#/components/responses/ReactionSuccess'
 *       400:
 *         description: Failed to add reaction record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add/:id",
  ...commonMiddlewares,
  asyncHandler(validateQueryMiddleware()),
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateReaction)),
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
 *       - in: path
 *         name: id
 *         required: true
 *         description: The post id or comment id  of the user to count reaction
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
 *         description: Failed to fetch reaction data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count/:id",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.countReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/get/{reactionId}:
 *   get:
 *     tags: [Reaction]
 *     summary: Get reaction data for a user
 *     description: Retrieve the reaction record of a specific user by id
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         required: true
 *         description: Get user reaction by id
 *         schema:
 *           type: string
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
 *         description: Failed to fetch reaction data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:reactionId",
  ...commonMiddlewares,
  asyncHandler(validateQueryMiddleware()),
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/update/{reactionId}:
 *   put:
 *     tags: [Reaction]
 *     summary: Update reaction record
 *     description: Update specific a user's reaction information by id
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         required: true
 *         description: The reaction id of the user to update
 *         schema:
 *           type: string
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
 *         $ref: '#/components/responses/ReactionSuccess'
 *       400:
 *         description: Failed to update reaction record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:reactionId",
  ...commonMiddlewares,
  asyncHandler(validateQueryMiddleware()),
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateReaction)),
  asyncHandler(controller.updateReaction.bind(controller))
);

/**
 * @swagger
 * /reaction/delete/{reactionId}:
 *   delete:
 *     tags: [Reaction]
 *     summary: Delete reaction record
 *     description: Delete specific a user's reaction information by id
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         required: true
 *         description: The reaction id of the user to update
 *         schema:
 *           type: string
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
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:reactionId",
  ...commonMiddlewares,
  asyncHandler(validateQueryMiddleware()),
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateReaction)),
  asyncHandler(controller.deleteReaction.bind(controller))
);
export default router;
