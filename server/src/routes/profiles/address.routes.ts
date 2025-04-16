import express from "express";
import AddressController from "../../controllers/profiles/address.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = AddressController.getInstance();
import { role } from "../../utils/role";
import {
  validateAddressUpdate,
  validateAddressAdd,
} from "../../validation/profiles/address.validator";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
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
 *       description: Successfully
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
 *             properties:
 *               country:
 *                 type: string
 *                 description: The user country
 *                 example: Vietnam
 *               city:
 *                 type: string
 *                 description: The user city
 *                 example: Ho Chi City
 *               state:
 *                 type: string
 *                 description: The user state
 *                 example: EG
 *               address:
 *                 type: string
 *                 description: The user address
 *                 example: 123 Le Thanh
 *               timeZone:
 *                 type: string
 *                 description: The user timeZone
 *                 example: Asia
 *     responses:
 *      200:
 *        $ref: '#/components/responses/AddressSuccess'
 *     400:
 *        description: Failed to add address
 *     401:
 *        description: Unauthorized
 *     500:
 *        description: Internal Server Error
 */
router.post(
  "/add",
  ...commonMiddlewares,
  asyncHandler(expressValidator(validateAddressAdd)),
  asyncHandler(controller.addAddress.bind(controller))
);

/**
 * @swagger
 * /address/get:
 *   get:
 *     tags: [Address]
 *     summary: Get address for current user
 *     description: If no addressId is provided, returns address for the current user.
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AddressSuccess'
 *       400:
 *         description: Failed to get address
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /address/get/{addressId}:
 *   get:
 *     tags: [Address]
 *     summary: Get address by id
 *     description: Get a specific address
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: The address id
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AddressSuccess'
 *       400:
 *         description: Failed to get address
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:addressId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getAddress.bind(controller))
);

/**
 * @swagger
 * /address/update:
 *   put:
 *     tags: [Address]
 *     summary: Update current user's address
 *     description: Update address for the currently authenticated user.
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
 * /address/update/{addressId}:
 *   put:
 *     tags: [Address]
 *     summary: Update address by id
 *     description: Admin can update address by specifying the address id.
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: The address id
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
  "/update/:addressId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateAddressUpdate)),
  asyncHandler(controller.updateAddress.bind(controller))
);

export default router;
