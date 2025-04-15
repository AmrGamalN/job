import express from "express";
import SecurityController from "../../controllers/profiles/security.controller";
import { expressValidator } from "../../middleware/validatorMiddleware";
import { asyncHandler } from "../../middleware/handleError";
import {
  validateUserSecurityUpdate,
  validateSecurityEmail,
  validateSecurityUpdatePass,
  validateSecurityStatus,
  validateCode2AF,
} from "../../validation/security/security.validator";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = SecurityController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(["admin", "manager"])),
];

// Update user security
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateUserSecurityUpdate)),
  asyncHandler(controller.updateSecurity.bind(controller))
);

// Count security model
router.get(
  "/count",
  ...commonMiddlewares,
  asyncHandler(controller.countSecurity.bind(controller))
);

//  security-related statistics or counts.
router.post(
  "/block-delete/:userId",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateSecurityStatus)),
  asyncHandler(controller.deleteBlockUser.bind(controller))
);

// Request a password reset
router.post(
  "/reset",
  asyncHandler(expressValidator(validateSecurityEmail)),
  asyncHandler(controller.resetPassword.bind(controller))
);

// Update the user's password
router.post(
  "/update-password",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(expressValidator(validateSecurityUpdatePass)),
  asyncHandler(controller.updatePassword.bind(controller))
);

// Send a verification email to confirm the user's email address.
router.post(
  "/request-email-verification",
  asyncHandler(expressValidator(validateSecurityEmail)),
  asyncHandler(controller.sendVerificationEmail.bind(controller))
);

// Generating the QR code to 2FA.
router.post(
  "/generate/2fa",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(controller.generateTwoFactorAuth.bind(controller))
);

// Endpoint to verify the two-factor authentication (2FA) code after generating the QR code.
router.post(
  "/confirm/2fa",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(expressValidator(validateCode2AF)),
  asyncHandler(controller.verifyTwoFactorAuth.bind(controller))
);

router.get(
  "/get/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.getSecurity.bind(controller))
);

router.get(
  "/get-all",
  ...commonMiddlewares,
  asyncHandler(controller.getAllSecurities.bind(controller))
);

export default router;
