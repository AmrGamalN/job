import { IResolvers } from "@graphql-tools/utils";
import { applyMiddleware } from "../../../middleware/applyMiddleWare";
import RegisterController from "../../../controllers/auth/register.controller";
import { expressValidator } from "../../../middleware/validatorMiddleware";
import { registerValidator } from "../../../validation/auth/register.validator";
import { asyncHandler } from "../../../middleware/handleError";
const controller = RegisterController.getInstance();

export const registerResolver: IResolvers = {
  Mutation: {
    register: applyMiddleware(
      asyncHandler(controller.register.bind(controller)),
      [expressValidator(registerValidator)]
    ),
  },
};
