import express from "express";
import MemberController from "../../controllers/company/member.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateMemberAdd,
  validateMemberUpdate,
} from "../../validation/company/member.validator";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
} from "../../utils/authorizationRole.util";
import {
  validateQueryMemberCount,
  validateQueryMemberGetAll,
} from "../../validation/query/company/member.validator";
const controller = MemberController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/member/count:
 *   get:
 *     tags: [Member]
 *     summary: Get the count of companies
 *     description: Returns the total count of companies
 *     parameters:
 *      - $ref: '#/components/parameters/Role'
 *      - $ref: '#/components/parameters/Name'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Position'
 *      - $ref: '#/components/parameters/Department'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch member data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...companyAdminRoleMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryMemberCount()),
  asyncHandler(controller.countMember.bind(controller))
);

/**
 * @swagger
 * /company/member/add:
 *   post:
 *     tags: [Member]
 *     summary: Add member record
 *     description: Add a new member record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add member record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...companyAdminRoleMiddlewares,
  expressValidator(validateMemberAdd),
  asyncHandler(controller.addMember.bind(controller))
);

/**
 * @swagger
 * /company/member/get/{id}:
 *   get:
 *     tags: [Member]
 *     summary: Get member data by id
 *     description: Retrieve member record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MemberResponse'
 *       400:
 *         description: Failed to fetch member data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id",
  ...companyViewerRoleMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.getMember.bind(controller))
);

/**
 * @swagger
 * /company/member:
 *   get:
 *     tags: [Member]
 *     summary: Get all member
 *     description: Retrieve member record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/Role'
 *      - $ref: '#/components/parameters/Name'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Position'
 *      - $ref: '#/components/parameters/Department'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MemberResponse'
 *       400:
 *         description: Failed to fetch member data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/",
  ...companyViewerRoleMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryMemberGetAll()),
  asyncHandler(controller.getAllMembers.bind(controller))
);

/**
 * @swagger
 * /company/member/update/{id}:
 *   put:
 *     tags: [Member]
 *     summary: Update member record
 *     description: Update specific member information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update member record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id",
  ...companyAdminRoleMiddlewares,
  requiredParamMiddleware(),
  expressValidator(validateMemberUpdate),
  asyncHandler(controller.updateMember.bind(controller))
);

/**
 * @swagger
 * /company/member/delete/{id}:
 *   delete:
 *     tags: [Member]
 *     summary: Delete member record
 *     description: Delete specific member record by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete member record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:id",
  ...companyAdminRoleMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.deleteMember.bind(controller))
);
export default router;
