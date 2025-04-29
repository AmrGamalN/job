import express from "express";
import ConnectionController from "../../controllers/profiles/connection.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import {
  validateRequiredUserIdMiddleware,
  validateQueryMiddleware,
} from "../../middlewares/validator.middleware";
const controller = ConnectionController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /connection:
 *   post:
 *     summary: Add a new connection
 *     tags: [Connection]
 *     description: Add a new connection between two users
 *     parameters:
 *       - ref: '#/components/parameters/OwnerType'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserId'
 *     responses:
 *      201:
 *        $ref: '#/components/schemas/BaseResponse'
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
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateRequiredUserIdMiddleware(),
  asyncHandler(controller.addConnection.bind(controller))
);

/**
 * @swagger
 * /connection/get:
 *   post:
 *     summary: Get a specific connection by ID
 *     tags: [Connection]
 *     parameters:
 *       - ref: '#/components/parameters/OwnerType'
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
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateRequiredUserIdMiddleware(),
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
 *       - ref: '#/components/parameters/OwnerType'
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
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
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
 *       - ref: '#/components/parameters/OwnerType'
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
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  asyncHandler(controller.countConnection.bind(controller))
);

/**
 * @swagger
 * /connection/delete:
 *   delete:
 *     summary: Delete connection
 *     tags: [Connection]
 *     description: Delete a specific connection by ID
 *     parameters:
 *       - ref: '#/components/parameters/OwnerType'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserId'
 *     responses:
 *      201:
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
router.delete(
  "/delete",
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateRequiredUserIdMiddleware(),
  asyncHandler(controller.deleteConnection.bind(controller))
);

/**
 * @swagger
 * /connection/update:
 *   put:
 *     summary: Update connection status
 *     tags: [Connection]
 *     description: Update the status of a specific connection by ID
 *     parameters:
 *       - ref: '#/components/parameters/OwnerType'
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
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  validateRequiredUserIdMiddleware(),
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
 *       - $ref: '#/components/parameters/OwnerType'
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
  ...userAuthorizationMiddlewares,
  validateQueryMiddleware(),
  asyncHandler(controller.getAllConnection.bind(controller))
);
export default router;
