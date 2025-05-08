import express from "express";
import AddressController from "../../controllers/client/address.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import {
  validateAddressUpdate,
  validateAddressAdd,
} from "../../validation/client/address.validator";
import {
  expressValidator,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
const controller = AddressController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/address/add:
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
 * /company/address/get/{id}:
 *   get:
 *     tags: [Address]
 *     summary: Get address
 *     description: Get address by id
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

  requiredParamMiddleware(),
  asyncHandler(controller.getAddress.bind(controller))
);

/**
 * @swagger
 * /company/address/update/{id}:
 *   put:
 *     tags: [Address]
 *     summary: Update address
 *     description: Update address by id
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
  "/update/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  expressValidator(validateAddressUpdate),
  asyncHandler(controller.updateAddress.bind(controller))
);

export default router;
