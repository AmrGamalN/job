import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/user.controller";
import { applyMiddleware } from "../../../middlewares/apply.middleware";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import { validateOptionalUserIdMiddleware } from "../../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";

const controller = UserController.getInstance();

export const userResolver: IResolvers = {
  Query: {
    getUser: applyMiddleware(
      asyncHandler(controller.getUser.bind(controller)),
      [
        ...userAuthorizationMiddlewares,
        asyncHandler(validateOptionalUserIdMiddleware()),
      ]
    ),
    getAllUsers: applyMiddleware(
      asyncHandler(controller.getAllUsers.bind(controller)),
      [...userAuthorizationMiddlewares]
    ),
  },
};
