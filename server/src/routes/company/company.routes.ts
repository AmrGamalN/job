import express from "express";
import CompanyController from "../../controllers/company/company.controller";
import CompanyMiddleware from "../../middlewares/company.middleware";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import AuthenticationMiddleware from "../../middlewares/authentication.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateCompanyAdd,
  validateCompanyUpdate,
} from "../../validation/company/company.validator";
import { uploadImageProfile } from "../../middlewares/uploadFile.middleware";
import {
  checkFilesMiddleware,
  parseFieldsMiddleware,
  parserImagesMiddleware,
} from "../../middlewares/parseFields.middleware";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
  userAuthorizationMiddlewares,
} from "../../utils/authorizationRole.util";
import {
  validateQueryCompanyCount,
  validateQueryCompanyGetAll,
} from "../../validation/query/company/company.validator";
const authMiddleware = AuthenticationMiddleware.getInstance();
const companyMiddleware = CompanyMiddleware.getInstance();
const controller = CompanyController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/add:
 *   post:
 *     tags: [Company]
 *     summary: Add company record
 *     description: Add a new company record
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CompanyAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add company record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  companyMiddleware.authorizationMiddleware([
    "owner",
    "founder",
    "admin",
    "viewer",
  ]),
  uploadImageProfile,
  checkFilesMiddleware(["companyLogo"]),
  parseFieldsMiddleware(),
  parserImagesMiddleware(),
  expressValidator(validateCompanyAdd),
  asyncHandler(controller.addCompany.bind(controller))
);

/**
 * @swagger
 * /company/count:
 *   get:
 *     tags: [Company]
 *     summary: Get the count of companies
 *     description: Returns the total count of companies
 *     parameters:
 *      - $ref: '#/components/parameters/CompanyName'
 *      - $ref: '#/components/parameters/Tags'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch company data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  authMiddleware.refreshTokenMiddleware,
  authMiddleware.authorizationMiddleware(["admin", "manager"]),
  validateQueryMiddleware(),
  expressValidator(validateQueryCompanyCount()),
  asyncHandler(controller.countCompany.bind(controller))
);

/**
 * @swagger
 * /company/get/{id}:
 *   get:
 *     tags: [Company]
 *     summary: Get company data by id
 *     description: Retrieve company record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CompanyResponse'
 *       400:
 *         description: Failed to fetch company data
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
  companyMiddleware.activeCompanyMiddleware(),
  asyncHandler(controller.getCompany.bind(controller))
);

/**
 * @swagger
 * /company:
 *   get:
 *     tags: [Company]
 *     summary: Get all company
 *     description: Retrieve company record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/CompanyName'
 *      - $ref: '#/components/parameters/Tags'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CompanyResponse'
 *       400:
 *         description: Failed to fetch company data
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
  expressValidator(validateQueryCompanyGetAll()),
  asyncHandler(controller.getAllCompanies.bind(controller))
);

/**
 * @swagger
 * /company/update/{id}:
 *   put:
 *     tags: [Company]
 *     summary: Update company record
 *     description: Update specific company information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CompanyUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update company record
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
  uploadImageProfile,
  parseFieldsMiddleware(),
  parserImagesMiddleware(),
  expressValidator(validateCompanyUpdate),
  companyMiddleware.activeCompanyMiddleware(),
  asyncHandler(controller.updateCompany.bind(controller))
);

/**
 * @swagger
 * /company/delete/{id}:
 *   delete:
 *     tags: [Company]
 *     summary: Delete company record
 *     description: Delete specific company record by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete company record
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
  companyMiddleware.activeCompanyMiddleware(),
  asyncHandler(controller.deleteCompany.bind(controller))
);
export default router;
