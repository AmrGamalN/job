import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth/auth.routes";
import UserRouters from "./routes/profiles/user.routes";
import AddressRouters from "./routes/profiles/address.routes";
import ProfileRouters from "./routes/profiles/profile.routes";
import SecurityRouters from "./routes/profiles/security.routes";
import LoginRoutes from "./routes/auth/login.routes";
import RegisterRoutes from "./routes/auth/register.routes";
const router = Router();

// Health Check
router.get(
  "/health-check",
  (req: Request, res: Response) => {
    console.log("Server is running");
    res.send("Server is running");
  }
);

// Define routes
router.use("/auth", AuthRouters);
router.use("/user", UserRouters);
router.use("/profile", ProfileRouters);
router.use("/address", AddressRouters);
router.use("/security", SecurityRouters);
router.use("/login", LoginRoutes);
router.use("/register", RegisterRoutes);
export default router;
