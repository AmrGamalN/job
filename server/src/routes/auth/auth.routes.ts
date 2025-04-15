import express from "express";
import LoginController from "../../controllers/auth/login.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import LoginRoutes from "./login.routes";
import RegisterRoutes from "./register.routes";
const tokenMiddleware = TokenMiddleware.getInstance();
const loginController = LoginController.getInstance();
import RegisterController from "../../controllers/auth/register.controller";
const registerController = RegisterController.getInstance();
const role = ["user","client", "freelance", "company", "school", "admin", "manager"];
const router = express.Router();

router.use("/login", LoginRoutes);
router.use("/register", RegisterRoutes);

// Logout
router.post(
  "/logout",
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
  asyncHandler(loginController.logOut.bind(loginController))
);

// Verify email
router.get(
  "/verify-email/:token",
  asyncHandler(registerController.verifyEmail.bind(registerController))
);

export default router;
