import express from "express";
import ExperienceController from "../../controllers/profiles/experience.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = ExperienceController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.accessTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

// Add experience
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(controller.addExperience.bind(controller))
);

// Get experience
router.get(
  "/get/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.getExperience.bind(controller))
);

// Get experience
router.get(
  "/get-all",
  ...commonMiddlewares,
  asyncHandler(controller.getAllExperiences.bind(controller))
);

// Update experience
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.updateExperience.bind(controller))
);

export default router;
