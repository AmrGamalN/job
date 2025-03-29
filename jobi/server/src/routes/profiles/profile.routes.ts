import express from "express";
import ProfileController from "../../controllers/profiles/profile.controller";
import { asyncHandler } from "../../middleware/handleError";
import { expressValidator } from "../../middleware/validatorMiddleware";
import { validateProfileUpdate } from "../../validation/profiles/profile.validator";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = ProfileController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.accessTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

// Update profile
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  expressValidator(validateProfileUpdate),
  asyncHandler(controller.updateProfile.bind(controller))
);

// Get profile by link
router.get(
  "/:id?",
  ...commonMiddlewares,
  expressValidator(validateProfileUpdate),
  asyncHandler(controller.getProfileByLink.bind(controller))
);
export default router;
