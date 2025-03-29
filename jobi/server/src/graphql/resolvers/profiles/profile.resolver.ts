import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/profile.controller";
import { applyMiddleware } from "../../../middleware/applyMiddleWare";
import { asyncHandler } from "../../../middleware/handleError";
import { expressValidator } from "../../../middleware/validatorMiddleware";
import { validateUserId } from "../../../validation/general";
const controller = UserController.getInstance();

export const profileResolver: IResolvers = {
  Query: {
    getProfile: applyMiddleware(
      asyncHandler(controller.getProfile.bind(controller)),
      [asyncHandler(expressValidator(validateUserId))]
    ),
    getAllProfiles: applyMiddleware(
      asyncHandler(controller.getAllProfiles.bind(controller)),
      []
    ),
  },
};