import express from "express";
import UserController from "../../controllers/profiles/user.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { validateUserUpdate } from "../../validation/profiles/user.validator";
import {
  expressValidator,
  validateOptionalUserIdMiddleware,
} from "../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = UserController.getInstance();
const router = express.Router();

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
 *         $ref: '#/components/schemas/BaseResponse'
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
  ...userAuthorizationMiddlewares,
  validateOptionalUserIdMiddleware(),
  expressValidator(validateUserUpdate),
  asyncHandler(controller.updateUser.bind(controller))
);

export default router;
