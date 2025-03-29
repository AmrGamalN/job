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

<<<<<<< HEAD
// Add address
=======
// Add user
>>>>>>> 29b8f4664265e0eee83a43ea35bc726ca7eebe56
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(controller.addAddress.bind(controller))
);

<<<<<<< HEAD
// Get address
=======
// Get user
>>>>>>> 29b8f4664265e0eee83a43ea35bc726ca7eebe56
router.get(
  "/get/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.getAddress.bind(controller))
);

<<<<<<< HEAD
// Update address
=======
// Update user
>>>>>>> 29b8f4664265e0eee83a43ea35bc726ca7eebe56
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.updateAddress.bind(controller))
);

export default router;
