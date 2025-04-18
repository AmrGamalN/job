import express from "express";
import CommentController from "../../controllers/post/comment.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
import {
  validateCommentUpdate,
  validateCommentAdd,
} from "../../validation/post/comment.validator";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = CommentController.getInstance();
import { role } from "../../utils/role";
const router = express.Router();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags: [Comment]
 * definitions: Comment Management Api
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentAddDTO:
 *       type: object
 *       required:
 *         - userId
 *         - prefixS3
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: Main content of the comment
 *           example: "Just launched my new portfolio website"
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - type
 *               - url
 *               - key
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [image, video, document]
 *                 example: "image"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://s3.amazonaws.com/bucket/image.png"
 *               key:
 *                 type: string
 *                 example: "uploads/image.png"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentGetDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "661f0871e4f546d1a9c5ad78"
 *         userId:
 *           type: string
 *           example: "user_123"
 *         postId:
 *           type: string
 *           example: "661f0850e4f546d1a9c5ad34"
 *         commentId:
 *           type: array
 *           items:
 *             type: string
 *           example: ["661f089be4f546d1a9c5ad99"]
 *         reactionId:
 *           type: array
 *           items:
 *             type: string
 *           example: ["661f089be4f546d1a9c5ad77"]
 *         content:
 *           type: string
 *           maxLength: 1000
 *           example: "This is a comment"
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [image, video]
 *                 example: "image"
 *               url:
 *                 type: string
 *                 example: "https://example.com/image.png"
 *               key:
 *                 type: string
 *                 example: "uploads/image123.png"
 *         reactionCount:
 *           type: array
 *           items:
 *             type: number
 *           example: [5, 0, 2, 0, 1]
 *         isEdited:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-17T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-17T12:05:00Z"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CommentSuccess:
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
 *                 $ref: '#/components/schemas/CommentGetDTO'
 */

/**
 * @swagger
 * /comment/add/{postId}:
 *   post:
 *     tags: [Comment]
 *     summary: Add comment record
 *     description: Add a new comment record for the user
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The post id of the user to delete
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentAddDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to add comment record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add/:postId",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateCommentAdd)),
  asyncHandler(controller.addComment.bind(controller))
);

/**
 * @swagger
 * /comment/count/{postId}:
 *   get:
 *     tags: [Comment]
 *     summary: Get count of comment
 *     description: Returns the total count of comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The post id of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to fetch comment data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count/:postId",
  ...commonMiddlewares,
  asyncHandler(controller.countComment.bind(controller))
);

/**
 * @swagger
 * /comment/get:
 *   get:
 *     tags: [Comment]
 *     summary: Get comment data for a user
 *     description: Retrieve the comment record of a specific user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to fetch comment data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /comment/get/{commentId}:
 *   get:
 *     tags: [Comment]
 *     summary: Get comment data for a user
 *     description: Retrieve the comment record of a specific user by id
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Get user comment by id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to fetch comment data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:commentId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getComment.bind(controller))
);

/**
 * @swagger
 * /comment/update:
 *   put:
 *     tags: [Comment]
 *     summary: Update comment record
 *     description: Update current a user's comment information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentAddDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to update comment record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /comment/update/{commentId}:
 *   put:
 *     tags: [Comment]
 *     summary: Update comment record
 *     description: Update specific a user's comment information by id
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The comment id of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentAddDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to update comment record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:commentId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateCommentUpdate)),
  asyncHandler(controller.updateComment.bind(controller))
);

/**
 * @swagger
 * /comment/delete:
 *   delete:
 *     tags: [Comment]
 *     summary: Delete comment record
 *     description: Delete current a user's comment information
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to delete comment record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /comment/delete/{commentId}:
 *   delete:
 *     tags: [Comment]
 *     summary: Delete comment record
 *     description: Delete specific a user's comment information by id
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The comment id of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to delete comment record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:commentId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.deleteComment.bind(controller))
);
export default router;
