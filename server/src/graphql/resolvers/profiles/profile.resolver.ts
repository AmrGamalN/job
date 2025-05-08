import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/client/profile.controller";
import { applyMiddleware } from "../../../middlewares/apply.graphql.middleware";
import UserMiddleware from "../../../middlewares/user.middlewares";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import { requiredUserIdMiddleware } from "../../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";
import Profile from "../../../models/mongodb/client/profile.model";
import { ProfileDtoType } from "../../../dto/client/profile.dto";
const controller = UserController.getInstance();
const userMiddleware = UserMiddleware.getInstance();

export const profileResolver: IResolvers = {
  Query: {
    getProfile: applyMiddleware(
      asyncHandler(controller.getProfile.bind(controller)),
      [
        ...userAuthorizationMiddlewares,
        asyncHandler(requiredUserIdMiddleware()),
        userMiddleware.graphqlVisibilityMiddleware<ProfileDtoType>({
          model: Profile,
          method: "findOne",
          idField: "params",
          idKey: "userId",
        }),
      ]
    ),
    getAllProfiles: applyMiddleware(
      asyncHandler(controller.getAllProfiles.bind(controller)),
      [...userAuthorizationMiddlewares]
    ),
  },
};
