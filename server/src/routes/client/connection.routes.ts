import express from "express";
import ConnectionController from "../../controllers/client/connection.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import {
  validateQueryMiddleware,
  expressValidator,
  requiredParamMiddleware,
  requiredUserIdMiddleware,
} from "../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import {
  validateQueryConnectionCount,
  validateQueryConnectionGetAll,
} from "../../validation/query/user/connection.validator";
import { ConnectionDtoType } from "../../dto/client/connection.dto";
import Connection from "../../models/mongodb/client/connection.model";
const controller = ConnectionController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/connection/add:
 *   post:
 *     summary: Add a new connection
 *     tags: [Connection]
 *     description: Add a new connection between two users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectionAddComponents'
 *     responses:
 *      201:
 *        $ref: '#/components/schemas/BaseResponse'
 *      400:
 *        description: Failed to add connection
 *      401:
 *        description: Unauthorized
 *      409:
 *        description: Conflict
 *      500:
 *        description: Internal Server Error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  asyncHandler(controller.addConnection.bind(controller))
);

/**
 * @swagger
 * /user/connection/count:
 *   get:
 *     summary: Count user connections by filter
 *     tags: [Connection]
 *     parameters:
 *       - $ref: '#/components/parameters/ConnectionStatus'
 *       - $ref: '#/components/parameters/BlockStatus'
 *       - $ref: '#/components/parameters/RecipientName'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to count connections
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryConnectionCount()),
  asyncHandler(controller.countConnection.bind(controller))
);

/**
 * @swagger
 * /user/connection/get/{id}:
 *   get:
 *     summary: Get connection
 *     description: Get user connection by id
 *     tags: [Connection]
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ConnectionResponse'
 *       400:
 *         description: Failed to get connection
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  userMiddleware.expressVisibilityMiddleware<ConnectionDtoType>({
    model: Connection,
    method: "findById",
    idField: "params",
    idKey: "id",
  }),
  asyncHandler(controller.getConnection.bind(controller))
);

/**
 * @swagger
 * /user/connection/all/{userId}:
 *   get:
 *     summary: Get all connection
 *     tags: [Connection]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/ConnectionStatus'
 *       - $ref: '#/components/parameters/BlockStatus'
 *       - $ref: '#/components/parameters/RecipientName'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ConnectionResponse'
 *       400:
 *         description: Failed to get connections
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/all/:userId",
  ...userAuthorizationMiddlewares,
  requiredUserIdMiddleware(),
  validateQueryMiddleware(),
  expressValidator(validateQueryConnectionGetAll()),
  userMiddleware.expressVisibilityMiddleware<ConnectionDtoType>({
    model: Connection,
    method: "find",
    idField: "params",
    idKey: "userId",
  }),
  asyncHandler(controller.getAllConnection.bind(controller))
);

/**
 * @swagger
 * /user/connection/update/{id}:
 *   put:
 *     summary: Update connection
 *     tags: [Connection]
 *     description: Update connection by ID
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectionUpdateComponents'
 *     responses:
 *      200:
 *        $ref: '#/components/schemas/BaseResponse'
 *      400:
 *        description: Failed to update connection
 *      401:
 *        description: Unauthorized
 *      409:
 *        description: Conflict
 *      500:
 *        description: Internal Server Error
 */
router.put(
  "/update/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.updateConnection.bind(controller))
);

/**
 * @swagger
 * /user/connection/delete/{id}:
 *   delete:
 *     summary: Delete connection
 *     tags: [Connection]
 *     description: Delete connection by ID
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *      200:
 *        $ref: '#/components/schemas/BaseResponse'
 *      400:
 *        description: Failed to delete connection
 *      401:
 *        description: Unauthorized
 *      409:
 *        description: Conflict
 *      500:
 *        description: Internal Server Error
 */
router.delete(
  "/delete/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.deleteConnection.bind(controller))
);
export default router;
