import express from "express";
import LoginController from "../../controllers/auth/login.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import { expressValidator } from "../../middleware/validatorMiddleware";
import {
  validateLoginByPhone,
  validateLoginByEmail,
} from "../../validation/auth/login.validator";
import { validateCode2AF } from "../../validation/profiles/security.validator";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = LoginController.getInstance();
const role = [
  "user",
  "client",
  "freelance",
  "company",
  "school",
  "admin",
  "manager",
];
const router = express.Router();

// Login by email
router.post(
  "/email",
  asyncHandler(expressValidator(validateLoginByEmail)),
  asyncHandler(controller.loginByEmail.bind(controller))
);

// Login by phone
router.post(
  "/phone",
  asyncHandler(expressValidator(validateLoginByPhone)),
  asyncHandler(controller.loginByPhone.bind(controller))
);

// Verify two factor authentication after Login
router.post(
  "/2fa",
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(expressValidator(validateCode2AF)),
  asyncHandler(controller.verifyTwoFactorAuthentication.bind(controller))
);


export default router;
