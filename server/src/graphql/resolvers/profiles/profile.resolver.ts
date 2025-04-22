import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/profile.controller";
import { applyMiddleware } from "../../../middleware/applyMiddleWare";
import { asyncHandler } from "../../../middleware/handleError";
import { validateOptionalUserIdMiddleware } from "../../../middleware/validatorMiddleware";
import TokenMiddleware from "../../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(["admin", "manager"])),
];
const controller = UserController.getInstance();

export const profileResolver: IResolvers = {
  Query: {
    getProfile: applyMiddleware(
      asyncHandler(controller.getProfile.bind(controller)),
      [...commonMiddlewares, asyncHandler(validateOptionalUserIdMiddleware())]
    ),
    getAllProfiles: applyMiddleware(
      asyncHandler(controller.getAllProfiles.bind(controller)),
      [...commonMiddlewares]
    ),
  },
};
