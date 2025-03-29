import express from "express";
import AddressController from "../../controllers/profiles/address.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = AddressController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.accessTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

// Add user
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(controller.addAddress.bind(controller))
);

// Get user
router.get(
  "/get/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.getAddress.bind(controller))
);

// Update user
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.updateAddress.bind(controller))
);

export default router;
