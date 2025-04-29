import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/profile.controller";
import { applyMiddleware } from "../../../middlewares/apply.middleware";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import { validateOptionalUserIdMiddleware } from "../../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";
const controller = UserController.getInstance();

export const profileResolver: IResolvers = {
  Query: {
    getProfile: applyMiddleware(
      asyncHandler(controller.getProfile.bind(controller)),
      [
        ...userAuthorizationMiddlewares,
        asyncHandler(validateOptionalUserIdMiddleware()),
      ]
    ),
    getAllProfiles: applyMiddleware(
      asyncHandler(controller.getAllProfiles.bind(controller)),
      [...userAuthorizationMiddlewares]
    ),
  },
};
