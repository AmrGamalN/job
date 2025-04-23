import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/user.controller";
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

export const userResolver: IResolvers = {
  Query: {
    getUser: applyMiddleware(
      asyncHandler(controller.getUser.bind(controller)),
      [
        ...commonMiddlewares,
        asyncHandler(asyncHandler(validateOptionalUserIdMiddleware())),
      ]
    ),
    getAllUsers: applyMiddleware(
      asyncHandler(controller.getAllUsers.bind(controller)),
      [...commonMiddlewares]
    ),
  },
};
