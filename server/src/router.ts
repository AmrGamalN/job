import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth/auth.routes";
import UserRouters from "./routes/profiles/user.routes";
import AddressRouters from "./routes/profiles/address.routes";
import ProfileRouters from "./routes/profiles/profile.routes";
import SecurityRouters from "./routes/profiles/security.routes";
import LoginRoutes from "./routes/auth/login.routes";
import RegisterRoutes from "./routes/auth/register.routes";
import EducationRoutes from "./routes/profiles/education.routes";
import ExperienceRoutes from "./routes/profiles/experience.routes";
import InterestRoutes from "./routes/profiles/interest.routes";
const router = Router();

// Health Check
router.get("/health-check", (req: Request, res: Response) => {
  console.log("Server is running");
  res.send("Server is running");
});

// Define routes
router.use("/auth", AuthRouters);
router.use("/user", UserRouters);
router.use("/profile", ProfileRouters);
router.use("/address", AddressRouters);
router.use("/security", SecurityRouters);
router.use("/login", LoginRoutes);
router.use("/register", RegisterRoutes);
router.use("/education", EducationRoutes);
router.use("/experience", ExperienceRoutes);
router.use("/interest", InterestRoutes);
export default router;
