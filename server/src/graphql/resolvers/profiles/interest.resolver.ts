import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/client/interest.controller";
import { applyMiddleware } from "../../../middlewares/apply.graphql.middleware";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import UserMiddleware from "../../../middlewares/user.middlewares";
import { requiredParamMiddleware } from "../../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";
import Interest from "../../../models/mongodb/client/interest.model";
import { InterestDtoType } from "../../../dto/client/interest.dto";
const controller = UserController.getInstance();
const userMiddleware = UserMiddleware.getInstance();

export const interestResolver: IResolvers = {
  Query: {
    getInterest: applyMiddleware(
      asyncHandler(controller.getInterest.bind(controller)),
      [
        ...userAuthorizationMiddlewares,
        asyncHandler(requiredParamMiddleware()),
        userMiddleware.graphqlVisibilityMiddleware<InterestDtoType>({
          model: Interest,
          method: "findById",
          idField: "params",
          idKey: "id",
        }),
      ]
    ),
  },
};
