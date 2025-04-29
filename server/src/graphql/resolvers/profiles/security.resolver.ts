import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/security.controller";
import { applyMiddleware } from "../../../middlewares/apply.middleware";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import { validateOptionalUserIdMiddleware } from "../../../middlewares/validator.middleware";
import { adminAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";
const controller = UserController.getInstance();

export const SecurityResolver: IResolvers = {
  Query: {
    getSecurity: applyMiddleware(
      asyncHandler(controller.getSecurity.bind(controller)),
      [
        ...adminAuthorizationMiddlewares,
        asyncHandler(validateOptionalUserIdMiddleware()),
      ]
    ),
    getAllSecurities: applyMiddleware(
      asyncHandler(controller.getAllSecurities.bind(controller)),
      [...adminAuthorizationMiddlewares]
    ),
  },
};
