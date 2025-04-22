import express from "express";
import UserController from "../../controllers/profiles/user.controller";
import { asyncHandler } from "../../middleware/handleError";
import { validateUserUpdate } from "../../validation/profiles/user.validator";
import {
  expressValidator,
  validateOptionalUserIdMiddleware,
} from "../../middleware/validatorMiddleware";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = UserController.getInstance();
import { role } from "../../utils/role";
const router = express.Router();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * /user/update:
 *   put:
 *     tags: [User]
 *     summary: Update user details
 *     description: Admin can update user by specifying the user id.
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              allOf:
 *               - $ref: '#/components/schemas/UserId'
 *               - $ref: '#/components/schemas/UserUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BaseResponse'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update",
  ...commonMiddlewares,
  asyncHandler(validateOptionalUserIdMiddleware()),
  asyncHandler(expressValidator(validateUserUpdate)),
  asyncHandler(controller.updateUser.bind(controller))
);

export default router;
