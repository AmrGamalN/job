import express from "express";
import ProfileController from "../../controllers/profiles/profile.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateToggleParamMiddleware,
  validateOptionalUserIdMiddleware,
} from "../../middlewares/validator.middleware";
import { validateProfileUpdate } from "../../validation/profiles/profile.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = ProfileController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /profile/update/{userId}:
 *   put:
 *     tags: [Profile]
 *     summary: Update profile by id
 *     description: Admin can update profile by specifying the profile id.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/update/:userId",
  ...userAuthorizationMiddlewares,
  validateOptionalUserIdMiddleware(),
  expressValidator(validateProfileUpdate),
  asyncHandler(controller.updateProfile.bind(controller))
);

/**
 * @swagger
 * /profile/get/{id}:
 *   get:
 *     tags: [Profile]
 *     summary: Get profile by link
 *     description: Get profile by link
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user profile link
 *     responses:
 *      200:
 *        $ref: '#/components/responses/ProfileResponse'
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
router.get(
  "/get/:id?",
  validateToggleParamMiddleware(),
  asyncHandler(controller.getProfileByLink.bind(controller))
);
export default router;
