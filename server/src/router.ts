import { Request, Response, Router } from "express";
// Auth
import AuthRouters from "./routes/auth/auth.routes";
import LoginRoutes from "./routes/auth/login.routes";
import RegisterRoutes from "./routes/auth/register.routes";

// User
import UserRouters from "./routes/client/user.routes";
import AddressRouters from "./routes/client/address.routes";
import ConnectionRouters from "./routes/client/connection.routes";
import ProfileRouters from "./routes/client/profile.routes";
import SecurityRouters from "./routes/client/security.routes";
import EducationRoutes from "./routes/client/education.routes";
import ExperienceRoutes from "./routes/client/experience.routes";
import InterestRoutes from "./routes/client/interest.routes";
import ProjectRoutes from "./routes/client/project.routes";
import FollowRoutes from "./routes/client/follow.routes";

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
import AddressRoutes from "./routes/company/address.routes";

// Job
import JobRoutes from "./routes/job/job.routes";
import JobAnalyticsRoutes from "./routes/job/jobAnalytics.routes";
import JobAppRoutes from "./routes/job/jobApplication.routes";
import InterviewRoutes from "./routes/job/interview.routes";

// Support
import SaveRoutes from "./routes/support/save.routes";
import ReportRoutes from "./routes/support/report.routes";

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
router.use("/user/profile", ProfileRouters);
router.use("/user/address", AddressRouters);
router.use("/user/connection", ConnectionRouters);
router.use("/user/security", SecurityRouters);
router.use("/user/education", EducationRoutes);
router.use("/user/experience", ExperienceRoutes);
router.use("/user/interest", InterestRoutes);
router.use("/user/project", ProjectRoutes);
router.use("/user/follow", FollowRoutes);

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
router.use("/company/address", AddressRoutes);
router.use("/company", CompanyRoutes);

// Job
router.use("/company/job", JobRoutes);
router.use("/company/job/analytics", JobAnalyticsRoutes);
router.use("/company/job/application", JobAppRoutes);
router.use("/company/job/interview", InterviewRoutes);

// Support
router.use("/save", SaveRoutes);
router.use("/report", ReportRoutes);

export default router;
