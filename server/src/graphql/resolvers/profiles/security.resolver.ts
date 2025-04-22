import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/security.controller";
import { applyMiddleware } from "../../../middleware/applyMiddleWare";
import { asyncHandler } from "../../../middleware/handleError";
import { validateQueryFirebaseMiddleware } from "../../../middleware/validatorMiddleware";
import TokenMiddleware from "../../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(["admin", "manager"])),
];
const controller = UserController.getInstance();

export const SecurityResolver: IResolvers = {
  Query: {
    getSecurity: applyMiddleware(
      asyncHandler(controller.getSecurity.bind(controller)),
      [
        ...commonMiddlewares,
        asyncHandler(asyncHandler(validateQueryFirebaseMiddleware())),
      ]
    ),
    getAllSecurities: applyMiddleware(
      asyncHandler(controller.getAllSecurities.bind(controller)),
      [...commonMiddlewares]
    ),
  },
};
