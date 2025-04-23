import express from "express";
import ConnectionController from "../../controllers/profiles/connection.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = ConnectionController.getInstance();
import { role } from "../../utils/role";
import //   validateConnectionUpdate,
//   validateConnectionAdd,
"../../validation/profiles/address.validator";
import {
  expressValidator,
  validateParamMiddleware,
  validateRequiredUserIdMiddleware,
} from "../../middleware/validatorMiddleware";
const router = express.Router();
const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * /connection:
 *   post:
 *     summary: Add a new connection
 *     tags: [Connection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserId'
 *     responses:
 *      201:
 *        $ref: '#/components/responses/BaseResponse'
 *      400:
 *        description: Failed to add address
 *      401:
 *        description: Unauthorized
 *      409:
 *        description: Conflict
 *      500:
 *        description: Internal Server Error
 */
router.post(
  "/",
  ...commonMiddlewares,
  asyncHandler(validateRequiredUserIdMiddleware()),
  asyncHandler(controller.addConnection.bind(controller))
);

/**
 * @swagger
 * /connection/get:
 *   post:
 *     summary: Get a specific connection by ID
 *     tags: [Connection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserId'
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
router.post(
  "/get",
  ...commonMiddlewares,
  asyncHandler(validateRequiredUserIdMiddleware()),
  asyncHandler(controller.getConnection.bind(controller))
);

/**
 * @swagger
 * /connection/filter:
 *   get:
 *     summary: Filter connections by status
 *     tags: [Connection]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "accepted", "blocked", "unBlocked"]
 *         required: false
 *         description: Filter by connection status
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
  "/filter",
  ...commonMiddlewares,
  asyncHandler(controller.filterConnectionByStatus.bind(controller))
);

/**
 * @swagger
 * /connection/count:
 *   get:
 *     summary: Count user connections by filter
 *     tags: [Connection]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "accepted", "blocked", "unBlocked"]
 *         required: false
 *         description: Filter by connection status
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to filter connections
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...commonMiddlewares,
  asyncHandler(controller.countConnection.bind(controller))
);

/**
 * @swagger
 * /connection/delete:
 *   delete:
 *     summary: Delete connection
 *     tags: [Connection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserId'
 *     responses:
 *      201:
 *        $ref: '#/components/responses/BaseResponse'
 *      400:
 *        description: Failed to delete address
 *      401:
 *        description: Unauthorized
 *      409:
 *        description: Conflict
 *      500:
 *        description: Internal Server Error
 */
router.delete(
  "/delete",
  ...commonMiddlewares,
  asyncHandler(validateRequiredUserIdMiddleware()),
  asyncHandler(controller.deleteConnection.bind(controller))
);

/**
 * @swagger
 * /connection/update:
 *   put:
 *     summary: Update connection status
 *     tags: [Connection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UserId'
 *               - type: object
 *                 properties:
 *                  status:
 *                    type: string
 *                    enum: ["pending", "accepted", "blocked", "unBlocked"]
 *     responses:
 *      200:
 *        $ref: '#/components/schemas/BaseResponse'
 *      400:
 *        description: Failed to delete address
 *      401:
 *        description: Unauthorized
 *      409:
 *        description: Conflict
 *      500:
 *        description: Internal Server Error
 */
router.put(
  "/update",
  ...commonMiddlewares,
  asyncHandler(validateRequiredUserIdMiddleware()),
  asyncHandler(controller.updateConnection.bind(controller))
);

/**
 * @swagger
 * /connection/all:
 *   get:
 *     summary: Get all connection
 *     tags: [Connection]
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "accepted", "blocked", "unBlocked"]
 *         required: false
 *         description: Filter by connection status
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
  "/all",
  ...commonMiddlewares,
  asyncHandler(controller.getAllConnection.bind(controller))
);
export default router;
