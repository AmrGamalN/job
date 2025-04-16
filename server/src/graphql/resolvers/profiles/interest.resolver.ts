import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/interest.controller";
import { applyMiddleware } from "../../../middleware/applyMiddleWare";
import { asyncHandler } from "../../../middleware/handleError";
import { validateParamMiddleware } from "../../../middleware/validatorMiddleware";
import TokenMiddleware from "../../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(
    tokenMiddleware.authorizationMiddleware(["user", "admin", "manager"])
  ),
];
const controller = UserController.getInstance();
export const interestResolver: IResolvers = {
  Query: {
    getInterest: applyMiddleware(
      asyncHandler(controller.getInterest.bind(controller)),
      [...commonMiddlewares, asyncHandler(validateParamMiddleware())]
    ),
  },
};
