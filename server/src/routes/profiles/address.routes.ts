import express from "express";
import AddressController from "../../controllers/profiles/address.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = AddressController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags: [Address]
 * description: Address Management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddressDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user id
 *         country:
 *           type: string
 *           description: The user country
 *         city:
 *           type: string
 *           description: The user city
 *         state:
 *           type: string
 *           description: The user state
 *         address:
 *           type: string
 *           description: The user address
 *         timeZone:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   responses:
 *     AddressSuccess:
 *       description: Address updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *               success:
 *                 type: boolean
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/AddressDTO'
 */

/**
 * @swagger
 * /address/add:
 *   post:
 *     tags: [Address]
 *     summary: Add address
 *     description: Add address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressDTO'
 *     responses:
 *     200:
 *       $ref: '#/components/responses/AddressSuccess'
 *     400:
 *       description: Failed to add address
 *     403:
 *       description: Unauthorized
 *     500:
 *       description: Internal Server Error
 */
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(controller.addAddress.bind(controller))
);

/**
 * @swagger
 * /address/get/{userId}:
 *   get:
 *     tags: [Address]
 *     summary: Get address
 *     description: Get address
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user id
 *     responses:
 *      200:
 *        $ref: '#/components/responses/AddressSuccess'
 *      400:
 *        description: Failed to add address
 *      403:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 */
router.get(
  "/get/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.getAddress.bind(controller))
);

/**
 * @swagger
 * /address/update/{userId}:
 *   put:
 *     tags: [Address]
 *     summary: Update address
 *     description: Update address
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AddressSuccess'
 *       400:
 *         description: Failed to update address
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:userId",
  ...commonMiddlewares,
  asyncHandler(controller.updateAddress.bind(controller))
);

export default router;
