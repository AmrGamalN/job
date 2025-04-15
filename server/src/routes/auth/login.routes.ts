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
import {role} from "../../utils/role";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = LoginController.getInstance();
const router = express.Router();

/**
 * @swagger
 * tags: [Login]
 * description: Login Management API
 */

/**
 * @swagger
 * components:
 *   responses:
 *     LoginSuccess:
 *       description: Login Successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *               success:
 *                 type: boolean
 *               message:
 *                 type: string
 */

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
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: amr5189520@gmail.com
 *                password:
 *                  type: string
 *                  example: 01200812638Amr@
 *      responses:
 *        200:
 *          $ref: '#/components/responses/LoginSuccess'
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Internal Server Error
 */

router.post(
  "/email",
  asyncHandler(expressValidator(validateLoginByEmail)),
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
 *              type: object
 *              properties:
 *                phoneNumber:
 *                  type: string
 *                  example: +201200812638
 *                password:
 *                  type: string
 *                  example: 01200812638Amr@
 *      responses:
 *        200:
 *          $ref: '#/components/responses/LoginSuccess'
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Internal Server Error
 */
router.post(
  "/phone",
  asyncHandler(expressValidator(validateLoginByPhone)),
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
 *              type: object
 *              properties:
 *                twoFactorCode:
 *                  type: string
 *                  example: 123456
 *                  description: The code that sent to your 2FA device
 *      responses:
 *        200:
 *          $ref: '#/components/responses/LoginSuccess'
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Internal Server Error
 */
router.post(
  "/2fa",
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(expressValidator(validateCode2AF)),
  asyncHandler(controller.verifyTwoFactorAuthentication.bind(controller))
);


export default router;
