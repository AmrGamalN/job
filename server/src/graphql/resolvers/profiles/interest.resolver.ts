import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/interest.controller";
import { applyMiddleware } from "../../../middlewares/apply.middleware";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import { validateToggleParamMiddleware } from "../../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";
const controller = UserController.getInstance();

export const interestResolver: IResolvers = {
  Query: {
    getInterest: applyMiddleware(
      asyncHandler(controller.getInterest.bind(controller)),
      [
        ...userAuthorizationMiddlewares,
        asyncHandler(validateToggleParamMiddleware()),
      ]
    ),
  },
};
