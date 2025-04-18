import express from "express";
import PostController from "../../controllers/post/post.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
import {
  validatePostUpdate,
  validatePostAdd,
} from "../../validation/post/post.validator";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = PostController.getInstance();
import { role } from "../../utils/role";
const router = express.Router();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags: [Post]
 * definitions: Post Management Api
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostAddDTO:
 *       type: object
 *       required:
 *         - userId
 *         - prefixS3
 *         - content
 *       properties:
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of mentioned user IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5ee47cv21"]
 *         content:
 *           type: string
 *           description: Main content of the post
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
 *         visibility:
 *           type: string
 *           enum: [public, connections, private]
 *           default: public
 *           example: "connections"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["#nodejs", "#typescript"]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostGetDTO:
 *       type: object
 *       required:
 *         - userId
 *         - prefixS3
 *         - content
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user who created the post
 *           example: "643a5b2e8b9d2f001c8f4e5a"
 *         commentId:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           description: Array of comment IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5c"]
 *         reactionId:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           description: Array of reaction IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5d"]
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of mentioned user IDs
 *           example: ["643a5b2e8b9d2f001c8f4e5e"]
 *         prefixS3:
 *           type: string
 *           description: S3 prefix for media storage
 *           example: "user_uploads/posts/"
 *         content:
 *           type: string
 *           description: Main content of the post
 *           example: "Just launched my new portfolio website 🚀"
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
 *         shares:
 *           type: integer
 *           default: 0
 *           example: 3
 *         watch:
 *           type: integer
 *           default: 0
 *           example: 154
 *         visibility:
 *           type: string
 *           enum: [public, connections, private]
 *           default: public
 *           example: "connections"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["#nodejs", "#typescript"]
 *         reactionCount:
 *           type: array
 *           items:
 *             type: integer
 *           example: [4, 0, 2, 1, 0]
 *         commentCount:
 *           type: number
 *           default: 0
 *           example: 150
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-02T12:00:00.000Z"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     PostSuccess:
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
 *                 $ref: '#/components/schemas/PostGetDTO'
 */

/**
 * @swagger
 * /post/add:
 *   post:
 *     tags: [Post]
 *     summary: Add post record
 *     description: Add a new post record for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostAddDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to add post record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validatePostAdd)),
  asyncHandler(controller.addPost.bind(controller))
);

/**
 * @swagger
 * /post/count:
 *   get:
 *     tags: [Post]
 *     summary: Get count of post
 *     description: Returns the total count of post
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to fetch post data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...commonMiddlewares,
  asyncHandler(controller.countPost.bind(controller))
);

/**
 * @swagger
 * /post/get:
 *   get:
 *     tags: [Post]
 *     summary: Get post data for a user
 *     description: Retrieve the post record of a specific user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to fetch post data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /post/get/{postId}:
 *   get:
 *     tags: [Post]
 *     summary: Get post data for a user
 *     description: Retrieve the post record of a specific user by id
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Get user post by id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to fetch post data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:postId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getPost.bind(controller))
);

/**
 * @swagger
 * /post/update:
 *   put:
 *     tags: [Post]
 *     summary: Update post record
 *     description: Update current a user's post information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostAddDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to update post record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /post/update/{postId}:
 *   put:
 *     tags: [Post]
 *     summary: Update post record
 *     description: Update specific a user's post information by id
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The post id of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostAddDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to update post record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:postId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validatePostUpdate)),
  asyncHandler(controller.updatePost.bind(controller))
);

/**
 * @swagger
 * /post/delete:
 *   delete:
 *     tags: [Post]
 *     summary: Delete post record
 *     description: Delete current a user's post information
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to delete post record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /post/delete/{postId}:
 *   delete:
 *     tags: [Post]
 *     summary: Delete post record
 *     description: Delete specific a user's post information by id
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The post id of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostSuccess'
 *       400:
 *         description: Failed to delete post record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:postId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.deletePost.bind(controller))
);
export default router;
