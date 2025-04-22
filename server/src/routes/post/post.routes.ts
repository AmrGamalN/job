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
 *             $ref: '#/components/schemas/PostAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BaseResponse'
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
 *         $ref: '#/components/responses/BaseResponse'
 *       400:
 *         description: Failed to fetch post data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
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
 * /post/get/{id}:
 *   get:
 *     tags: [Post]
 *     summary: Get post data for a user
 *     description: Retrieve the post record of a specific user by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostResponse'
 *       400:
 *         description: Failed to fetch post data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getPost.bind(controller))
);

/**
 * @swagger
 * /post/update/{id}:
 *   put:
 *     tags: [Post]
 *     summary: Update post record
 *     description: Update specific a user's post information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostResponse'
 *       400:
 *         description: Failed to update post record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validatePostUpdate)),
  asyncHandler(controller.updatePost.bind(controller))
);

/**
 * @swagger
 * /post/delete/{id}:
 *   delete:
 *     tags: [Post]
 *     summary: Delete post record
 *     description: Delete specific a user's post information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BaseResponse'
 *       400:
 *         description: Failed to delete post record
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
  asyncHandler(controller.deletePost.bind(controller))
);

/**
 * @swagger
 * /post/search:
 *   get:
 *     tags: [Post]
 *     summary: Get post by hash tag
 *     description: Get post by hash tag
 *     parameters:
 *      - name: hashtag
 *        in: query
 *        description: hashtag
 *        required: true
 *        schema:
 *          type: string
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BaseResponse'
 *       400:
 *         description: Failed to get post record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/search",
  ...commonMiddlewares,
  asyncHandler(controller.searchWithHashtag.bind(controller))
);
export default router;
