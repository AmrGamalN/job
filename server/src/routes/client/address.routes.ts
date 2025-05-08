import express from "express";
import AddressController from "../../controllers/client/address.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import UserMiddleware from "../../middlewares/user.middlewares";
import {
  expressValidator,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateAddressUpdate,
  validateAddressAdd,
} from "../../validation/client/address.validator";
import { userAuthorizationMiddlewares } from "../../utils/authorizationRole.util";
import Address from "../../models/mongodb/client/address.model";
import { AddressDtoType } from "../../dto/client/address.dto";
const controller = AddressController.getInstance();
const userMiddleware = UserMiddleware.getInstance();
const router = express.Router();

/**
 * @swagger
 * /user/address/add:
 *   post:
 *     tags: [Address]
 *     summary: Add new address
 *     description: Add new address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressAddComponents'
 *     responses:
 *      200:
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
  "/add",
  ...userAuthorizationMiddlewares,
  expressValidator(validateAddressAdd),
  asyncHandler(controller.addAddress.bind(controller))
);

/**
 * @swagger
 * /user/address/get/{id}:
 *   get:
 *     tags: [Address]
 *     summary: Get address by id
 *     description: Get user address by id
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
  "/get/:id",
  ...userAuthorizationMiddlewares,
  requiredParamMiddleware(),
  userMiddleware.expressVisibilityMiddleware<AddressDtoType>({
    model: Address,
    method: "findById",
    idField: "params",
    idKey: "id",
  }),
  asyncHandler(controller.getAddress.bind(controller))
);

/**
 * @swagger
 * /user/address/update/{id}:
 *   put:
 *     tags: [Address]
 *     summary: Update address
 *     description: Update user address by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressUpdateComponents'
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

/**
 * @swagger
 * /user/address/delete/{id}:
 *   delete:
 *     tags: [Address]
 *     summary: Delete address
 *     description: Delete address by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
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
  asyncHandler(controller.deleteAddress.bind(controller))
);

export default router;
