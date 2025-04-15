import express from "express";
import RegisterController from "../../controllers/auth/register.controller";
import { asyncHandler } from "../../middleware/handleError";
const controller = RegisterController.getInstance();
const router = express.Router();
export default router;
