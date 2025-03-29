import express from "express";
import UserController from "../../controllers/profiles/user.controller";
import { asyncHandler } from "../../middleware/handleError";
import { validateUserAdd } from "../../validation/profiles/user.validator";
import { expressValidator } from "../../middleware/validatorMiddleware";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = UserController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.accessTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

// Update user
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  expressValidator(validateUserAdd),
  asyncHandler(controller.updateUser.bind(controller))
);

export default router;
