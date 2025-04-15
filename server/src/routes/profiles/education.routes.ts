import express from "express";
import EducationController from "../../controllers/profiles/education.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = EducationController.getInstance();
import {role} from "../../utils/role";
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

// Add education
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(controller.addEducation.bind(controller))
);

// Get education
router.get(
  "/get/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.getEducation.bind(controller))
);

// Update education
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.updateEducation.bind(controller))
);

export default router;
