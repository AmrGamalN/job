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
 *             $ref: '#/components/schemas/AddressBaseComponents'
 *     responses:
 *      200:
 *        $ref: '#/components/responses/BaseResponse'
 *      400:
 *        description: Failed to add address
 *      401:
 *        description: Unauthorized
 *      500:
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
 * /address/get/{id}:
 *   get:
 *     tags: [Address]
 *     summary: Get address by id
 *     description: Get a specific address by id or curUser id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AddressResponse'
 *       400:
 *         description: Failed to get address
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(controller.getAddress.bind(controller))
);

/**
 * @swagger
 * /address/update/{id}:
 *   put:
 *     tags: [Address]
 *     summary: Update address by id  or curUser id
 *     description: Admin can update address by specifying the address id or curUser id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressBaseComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AddressResponse'
 *       400:
 *         description: Failed to update address
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(validateAddressUpdate)),
  asyncHandler(controller.updateAddress.bind(controller))
);

export default router;
