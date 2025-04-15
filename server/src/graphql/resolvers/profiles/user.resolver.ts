import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/profiles/user.controller";
import { applyMiddleware } from "../../../middleware/applyMiddleWare";
import { asyncHandler } from "../../../middleware/handleError";
import { expressValidator } from "../../../middleware/validatorMiddleware";
import { validateUserId } from "../../../validation/general";
const controller = UserController.getInstance();

export const userResolver: IResolvers = {
  Query: {
    getUser: applyMiddleware(
      asyncHandler(controller.getUser.bind(controller)),
      [asyncHandler(expressValidator(validateUserId))]
    ),
    getAllUsers: applyMiddleware(
      asyncHandler(controller.getAllUsers.bind(controller)),
      []
    ),
  },
};
