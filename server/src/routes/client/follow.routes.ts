import express from "express";
import FollowController from "../../controllers/client/follow.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import {
  expressValidator,
  requiredParamMiddleware,
  requiredUserIdMiddleware,
  validateQueryMiddleware,
} from "../../middlewares/validator.middleware";
import { validateFollowAdd } from "../../validation/client/follow.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import { FollowDtoType } from "../../dto/client/follow.dto";
import Follow from "../../models/mongodb/client/follow.model";
import {
  validateQueryFollowCount,
  validateQueryFollowGetAll,
} from "../../validation/query/user/follow.validator";
const controller = FollowController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/follow/add:
 *   post:
 *     summary: Add new follow
 *     tags: [Follow]
 *     description: Add new follow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  expressValidator(validateFollowAdd()),
  asyncHandler(controller.addFollow.bind(controller))
);

/**
 * @swagger
 * /user/follow/count:
 *   get:
 *     tags: [Follow]
 *     summary: Get the count of follow
 *     description: Returns the total count of follow
 *     parameters:
 *      - $ref: '#/components/parameters/NameFollower'
 *      - $ref: '#/components/parameters/NameFollowing'
 *      - $ref: '#/components/parameters/FollowingType'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch follow data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryFollowCount()),
  asyncHandler(controller.countFollow.bind(controller))
);

/**
 * @swagger
 * /user/follow/get/{id}:
 *   get:
 *     tags: [Follow]
 *     summary: Get follow
 *     description: Get follow by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FollowResponse'
 *       400:
 *         description: Failed to get follow data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  userMiddleware.expressVisibilityMiddleware<FollowDtoType>({
    model: Follow,
    method: "findById",
    idField: "params",
    idKey: "id",
  }),
  asyncHandler(controller.getFollow.bind(controller))
);

/**
 * @swagger
 * /user/follow:
 *   get:
 *     tags: [Follow]
 *     summary: Get all follow
 *     description: Get all follow by userId
 *     parameters:
 *      - $ref: '#/components/parameters/NameFollower'
 *      - $ref: '#/components/parameters/NameFollowing'
 *      - $ref: '#/components/parameters/FollowingType'
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FollowResponse'
 *       400:
 *         description: Failed to get all follow data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryFollowGetAll()),
  asyncHandler(controller.getAllFollows.bind(controller))
);

/**
 * @swagger
 * /user/follow/delete/{id}:
 *   delete:
 *     tags: [Follow]
 *     summary: Delete follow
 *     description: Delete follow by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FollowResponse'
 *       400:
 *         description: Failed to delete follow
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.deleteFollow.bind(controller))
);

export default router;
