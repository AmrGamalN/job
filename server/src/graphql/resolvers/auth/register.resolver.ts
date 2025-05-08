import { IResolvers } from "@graphql-tools/utils";
import { applyMiddleware } from "../../../middlewares/apply.graphql.middleware";
import RegisterController from "../../../controllers/auth/register.controller";
import { expressValidator } from "../../../middlewares/validator.middleware";
import { registerValidator } from "../../../validation/auth/register.validator";
import { asyncHandler } from "../../../middlewares/handleError.middleware";
const controller = RegisterController.getInstance();

export const registerResolver: IResolvers = {
  Mutation: {
    register: applyMiddleware(
      asyncHandler(controller.register.bind(controller)),
      [expressValidator(registerValidator)]
    ),
  },
};
