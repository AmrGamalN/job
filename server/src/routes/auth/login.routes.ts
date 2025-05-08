import express from "express";
import LoginController from "../../controllers/auth/login.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { expressValidator } from "../../middlewares/validator.middleware";
import { validateCode2AF } from "../../validation/client/security.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import {
  validateLoginByPhone,
  validateLoginByEmail,
} from "../../validation/auth/login.validator";
const controller = LoginController.getInstance();
const router = express.Router();

/**
 *  @swagger
 *  /login/email:
 *    post:
 *      summary: Login by email
 *      tags: [Login]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginEmailComponents'
 *      responses:
 *        200:
 *          $ref: '#/components/schemas/BaseResponse'
 *        400:
 *          description: Bad Request
 *        404:
 *          description: Not Found
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.post(
  "/email",
  expressValidator(validateLoginByEmail),
  asyncHandler(controller.loginByEmail.bind(controller))
);

/**
 *  @swagger
 *  /login/phone:
 *    post:
 *      summary: Login by phone
 *      tags: [Login]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginPhoneComponents'
 *      responses:
 *        200:
 *          $ref: '#/components/schemas/BaseResponse'
 *        400:
 *          description: Bad Request
 *        404:
 *          description: Not Found
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.post(
  "/phone",
  expressValidator(validateLoginByPhone),
  asyncHandler(controller.loginByPhone.bind(controller))
);

/**
 *  @swagger
 *  /login/2fa:
 *    post:
 *      summary: Login by 2FA
 *      tags: [Login]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login2FAComponents'
 *      responses:
 *        200:
 *          $ref: '#/components/schemas/BaseResponse'
 *        400:
 *          description: Bad Request
 *        404:
 *          description: Not Found
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.post(
  "/2fa",
  ...userAuthorizationMiddlewares,
  expressValidator(validateCode2AF),
  asyncHandler(controller.verifyTwoFactorAuthentication.bind(controller))
);

export default router;
