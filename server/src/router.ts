import { Request, Response, Router } from "express";
// Auth
import AuthRouters from "./routes/auth/auth.routes";
import LoginRoutes from "./routes/auth/login.routes";
import RegisterRoutes from "./routes/auth/register.routes";

// User
import UserRouters from "./routes/profile/user.routes";
import AddressRouters from "./routes/profile/address.routes";
import ConnectionRouters from "./routes/profile/connection.routes";
import ProfileRouters from "./routes/profile/profile.routes";
import SecurityRouters from "./routes/profile/security.routes";
import EducationRoutes from "./routes/profile/education.routes";
import ExperienceRoutes from "./routes/profile/experience.routes";
import InterestRoutes from "./routes/profile/interest.routes";
import ProjectRoutes from "./routes/profile/project.routes";

// Post
import PostRoutes from "./routes/post/post.routes";
import CommentRoutes from "./routes/post/comment.routes";
import ReactionRoutes from "./routes/post/reaction.routes";

// Company
import CompanyRoutes from "./routes/company/company.routes";
import MemberRoutes from "./routes/company/member.routes";
import CertificateRoutes from "./routes/company/certificate.routes";
import FaqRoutes from "./routes/company/faq.routes";
import FeedBackRoutes from "./routes/company/feedback.routes";
import DocumentRoutes from "./routes/company/document.routes";
const router = Router();

router.get("/health-check", (req: Request, res: Response) => {
  console.log("Server is running");
  res.send("Server is running");
});

// Auth
router.use("/auth", AuthRouters);
router.use("/login", LoginRoutes);
router.use("/register", RegisterRoutes);

// User
router.use("/user", UserRouters);
router.use("/profile", ProfileRouters);
router.use("/address", AddressRouters);
router.use("/connection", ConnectionRouters);
router.use("/security", SecurityRouters);
router.use("/education", EducationRoutes);
router.use("/experience", ExperienceRoutes);
router.use("/interest", InterestRoutes);
router.use("/project", ProjectRoutes);

// Post
router.use("/post", PostRoutes);
router.use("/comment", CommentRoutes);
router.use("/reaction", ReactionRoutes);

// Company
router.use("/company/member", MemberRoutes);
router.use("/company/certificate", CertificateRoutes);
router.use("/company/faq", FaqRoutes);
router.use("/company/feedback", FeedBackRoutes);
router.use("/company/document", DocumentRoutes);
router.use("/company", CompanyRoutes);

export default router;
