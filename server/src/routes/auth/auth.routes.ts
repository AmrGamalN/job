import express from "express";
import LoginController from "../../controllers/auth/login.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const loginController = LoginController.getInstance();
import RegisterController from "../../controllers/auth/register.controller";
const registerController = RegisterController.getInstance();
import {role} from "../../utils/role";
const router = express.Router();

/**
 * @swagger
 * tags: [Auth]
 * description: Auth Management API
 */

/**
 * @swagger
 * components:
 *   responses:
 *     AuthSuccess:
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
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout
 *     description: Logout
 *     responses:
 *       200:
 *          $ref: '#/components/responses/AuthSuccess'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/logout",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(loginController.logOut.bind(loginController))
);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     tags: [Auth]
 *     summary: Verify email
 *     description: Verify email
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The token
 *     responses:
 *       200:
 *          $ref: '#/components/responses/AuthSuccess'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  "/verify-email/:token",
  asyncHandler(registerController.verifyEmail.bind(registerController))
);
export default router;
