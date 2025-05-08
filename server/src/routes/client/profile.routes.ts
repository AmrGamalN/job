import express from "express";
import ProfileController from "../../controllers/client/profile.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import { expressValidator } from "../../middlewares/validator.middleware";

import { profileValidator } from "../../validation/client/profile.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import Profile from "../../models/mongodb/client/profile.model";
import { ProfileDtoType } from "../../dto/client/profile.dto";
const controller = ProfileController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/profile/update:
 *   put:
 *     tags: [Profile]
 *     summary: Update profile by user id
 *     description: Admin can update profile by specifying the profile id.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *              allOf:
 *               - $ref: '#/components/schemas/UserId'
 *               - $ref: '#/components/schemas/ProfileUpdateComponents'
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
  "/update",
  ...userAuthorizationMiddlewares,
  expressValidator(profileValidator),
  asyncHandler(controller.updateProfile.bind(controller))
);

/**
 * @swagger
 * /user/profile/link/{id}:
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
  "/link/:id",
  userMiddleware.expressVisibilityMiddleware<ProfileDtoType>({
    model: Profile,
    method: "findOne",
    idField: "params",
    idKey: "id",
  }),
  asyncHandler(controller.getProfileByLink.bind(controller))
);
export default router;
