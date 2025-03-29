import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth/auth.routes";
import UserRouters from "./routes/profiles/user.routes";
import ProfileRouters from "./routes/profiles/profile.routes";
import SecurityRouters from "./routes/security/security.routes";
import { asyncHandler } from "./middleware/handleError";
import TokenMiddleware from "./middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const router = Router();

// Health Check
router.get(
  "/health-check",
  asyncHandler(tokenMiddleware.accessTokenMiddleware),
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(["admin", "manager"])),
  (req: Request, res: Response) => {
    console.log("Server is running");
    res.send("Server is running");
  }
);

// Define routes
router.use("/auth", AuthRouters);
router.use("/user", UserRouters);
router.use("/profile", ProfileRouters);
router.use("/security", SecurityRouters);
export default router;
