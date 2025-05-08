import express from "express";
import UserController from "../../controllers/client/user.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { validateUserUpdate } from "../../validation/client/user.validator";
import { expressValidator } from "../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import { uploadImageProfile } from "../../middlewares/uploadFile.middleware";
import {
  parseFieldsMiddleware,
  parserImagesMiddleware,
} from "../../middlewares/parseFields.middleware";
const controller = UserController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/update:
 *   put:
 *     tags: [User]
 *     summary: Update user
 *     description: Update user by userId
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              $ref: '#/components/schemas/UserUpdateComponents'
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
  uploadImageProfile,
  parseFieldsMiddleware(),
  parserImagesMiddleware(),
  expressValidator(validateUserUpdate),
  asyncHandler(controller.updateUser.bind(controller))
);

export default router;
