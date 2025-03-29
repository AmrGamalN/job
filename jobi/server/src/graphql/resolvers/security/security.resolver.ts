import { IResolvers } from "@graphql-tools/utils";
import UserController from "../../../controllers/security/security.controller";
import { applyMiddleware } from "../../../middleware/applyMiddleWare";
import { asyncHandler } from "../../../middleware/handleError";
import { expressValidator } from "../../../middleware/validatorMiddleware";
import { validateUserId } from "../../../validation/general";
const controller = UserController.getInstance();

export const SecurityResolver: IResolvers = {
  Query: {
    getSecurity: applyMiddleware(
      asyncHandler(controller.getSecurity.bind(controller)),
      [asyncHandler(expressValidator(validateUserId))]
    ),
    getAllSecurities: applyMiddleware(
      asyncHandler(controller.getAllSecurities.bind(controller)),
      []
    ),
  },
};