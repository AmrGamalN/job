import express from "express";
import LoginController from "../../controllers/auth/login.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import { expressValidator } from "../../middleware/validatorMiddleware";
import { validateLogin } from "../../validation/auth/login.validator";
import { validateCode2AF } from "../../validation/security/security.validator";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = LoginController.getInstance();
const role = ["client", "freelance", "company", "school", "admin", "manager"];
const router = express.Router();

// Login with email and password
router.post(
  "/email",
  asyncHandler(expressValidator(validateLogin)),
  asyncHandler(controller.loginByEmail.bind(controller))
);

// Verify two factor authentication after Login
router.post(
  "/2fa",
  asyncHandler(tokenMiddleware.accessTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(expressValidator(validateCode2AF)),
  asyncHandler(controller.verifyTwoFactorAuthentication.bind(controller))
);

// Logout
router.post(
  "/logout",
  asyncHandler(tokenMiddleware.accessTokenMiddleware),
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(controller.logOut.bind(controller))
);

export default router;
