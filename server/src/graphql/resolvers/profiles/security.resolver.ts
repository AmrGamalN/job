import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/client/security.controller";
import { applyMiddleware } from "../../../middlewares/apply.graphql.middleware";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
import { validateQueryMiddleware } from "../../../middlewares/validator.middleware";
import { adminAuthorizationMiddlewares } from "../../../utils/authorizationRole.util";
const controller = UserController.getInstance();

export const SecurityResolver: IResolvers = {
  Query: {
    getSecurity: applyMiddleware(
      asyncHandler(controller.getSecurity.bind(controller)),
      [
        ...adminAuthorizationMiddlewares,
        asyncHandler(validateQueryMiddleware()),
      ]
    ),
    getAllSecurities: applyMiddleware(
      asyncHandler(controller.getAllSecurities.bind(controller)),
      [...adminAuthorizationMiddlewares]
    ),
  },
};
