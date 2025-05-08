import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/client/user.controller";
import { applyMiddleware } from "../../../middlewares/apply.graphql.middleware";
import UserMiddleware from "../../../middlewares/user.middlewares";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import { requiredUserIdMiddleware } from "../../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";
import { UserDtoType } from "../../../dto/client/user.dto";
import User from "../../../models/mongodb/client/user.model";
const controller = UserController.getInstance();
const userMiddleware = UserMiddleware.getInstance();

export const userResolver: IResolvers = {
  Query: {
    getUser: applyMiddleware(
      asyncHandler(controller.getUser.bind(controller)),
      [
        ...userAuthorizationMiddlewares,
        asyncHandler(requiredUserIdMiddleware()),
        userMiddleware.graphqlVisibilityMiddleware<UserDtoType>({
          model: User,
          method: "findOne",
          idField: "params",
          idKey: "userId",
        }),
      ]
    ),
    getAllUsers: applyMiddleware(
      asyncHandler(controller.getAllUsers.bind(controller)),
      [...userAuthorizationMiddlewares]
    ),
  },
};
