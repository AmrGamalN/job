import express from "express";
import AddressController from "../../controllers/profiles/address.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";

import {
  validateAddressUpdate,
  validateAddressAdd,
} from "../../validation/profiles/address.validator";
import {
  expressValidator,
  validateToggleParamMiddleware,
} from "../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = AddressController.getInstance();
const router = express.Router();

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
 *        $ref: '#/components/schemas/BaseResponse'
 *      400:
 *        description: Failed to add address
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  expressValidator(validateAddressAdd),
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
  ...userAuthorizationMiddlewares,
  validateToggleParamMiddleware(),
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
  ...userAuthorizationMiddlewares,
  validateToggleParamMiddleware(),
  expressValidator(validateAddressUpdate),
  asyncHandler(controller.updateAddress.bind(controller))
);

export default router;
