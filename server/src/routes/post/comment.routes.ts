import express from "express";
import CommentController from "../../controllers/post/comment.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import {
  expressValidator,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateCommentUpdate,
  validateCommentAdd,
} from "../../validation/post/comment.validator";
const controller = CommentController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /comment/add/{id}:
 *   post:
 *     tags:
 *       - Comment
 *     summary: Add comment record
 *     description: Add a new comment record for the user
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add comment record
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
  requiredParamMiddleware(),
  expressValidator(validateCommentAdd),
  asyncHandler(controller.addComment.bind(controller))
);

/**
 * @swagger
 * /comment/count/{id}:
 *   get:
 *     tags: [Comment]
 *     summary: Get count of comment
 *     description: Returns the total count of comment
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch comment data
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
  asyncHandler(controller.countComment.bind(controller))
);

/**
 * @swagger
 * /comment/get/{id}:
 *   get:
 *     tags: [Comment]
 *     summary: Get comment data for a user
 *     description: Retrieve the comment record of a specific user by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentResponse'
 *       400:
 *         description: Failed to fetch comment data
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
  requiredParamMiddleware(),
  asyncHandler(controller.getComment.bind(controller))
);

/**
 * @swagger
 * /comment/update/{id}:
 *   put:
 *     tags: [Comment]
 *     summary: Update comment record
 *     description: Update specific a user's comment information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentResponse'
 *       400:
 *         description: Failed to update comment record
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
  requiredParamMiddleware(),
  expressValidator(validateCommentUpdate),
  asyncHandler(controller.updateComment.bind(controller))
);

/**
 * @swagger
 * /comment/delete/{id}:
 *   delete:
 *     tags: [Comment]
 *     summary: Delete comment record
 *     description: Delete specific a user's comment information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentSuccess'
 *       400:
 *         description: Failed to delete comment record
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
  requiredParamMiddleware(),
  asyncHandler(controller.deleteComment.bind(controller))
);
export default router;
