import express from "express";
import DocumentController from "../../controllers/company/document.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  validateRequiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateDocumentAdd,
  validateDocumentUpdate,
} from "../../validation/company/document.validator";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
} from "../../utils/authorizationRole.util";
import { validateQueryParams } from "../../validation/query/query.validator";
import { companyUploadDocument } from "../../middlewares/uploadFile.middleware";
import {
  checkFilesMiddleware,
  parserImagesMiddleware,
} from "../../middlewares/parseFields.middleware";
const controller = DocumentController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/document/add:
 *   post:
 *     tags: [Document]
 *     summary: Add document record
 *     description: Add a new document record
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DocumentAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add document record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...companyAdminRoleMiddlewares,
  companyUploadDocument,
  checkFilesMiddleware(["documentFile"]),
  parserImagesMiddleware(),
  expressValidator(validateDocumentAdd),
  asyncHandler(controller.addDocument.bind(controller))
);

/**
 * @swagger
 * /company/document/count:
 *   get:
 *     tags: [Document]
 *     summary: Get the count of document
 *     description: Returns the total count of document
 *     parameters:
 *      - $ref: '#/components/parameters/Name'
 *      - $ref: '#/components/parameters/DocumentType'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch document data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...companyAdminRoleMiddlewares,
  expressValidator(validateQueryParams()),
  asyncHandler(controller.countDocument.bind(controller))
);

/**
 * @swagger
 * /company/document/get/{id}:
 *   get:
 *     tags: [Document]
 *     summary: Get document data by id
 *     description: Retrieve document record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DocumentResponse'
 *       400:
 *         description: Failed to fetch document data
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
  validateRequiredParamMiddleware(),
  asyncHandler(controller.getDocument.bind(controller))
);

/**
 * @swagger
 * /company/document:
 *   get:
 *     tags: [Document]
 *     summary: Get all document
 *     description: Retrieve document record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/Name'
 *      - $ref: '#/components/parameters/DocumentType'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DocumentResponse'
 *       400:
 *         description: Failed to fetch document data
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
  expressValidator(validateQueryParams()),
  asyncHandler(controller.getAllDocuments.bind(controller))
);

/**
 * @swagger
 * /company/document/update/{id}:
 *   put:
 *     tags: [Document]
 *     summary: Update document record
 *     description: Update specific document information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DocumentAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update document record
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
  validateRequiredParamMiddleware(),
  companyUploadDocument,
  parserImagesMiddleware(),
  expressValidator(validateDocumentUpdate),
  asyncHandler(controller.updateDocument.bind(controller))
);

/**
 * @swagger
 * /company/document/delete/{id}:
 *   delete:
 *     tags: [Document]
 *     summary: Delete document record
 *     description: Delete specific document record by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete document record
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
  validateRequiredParamMiddleware(),
  asyncHandler(controller.deleteDocument.bind(controller))
);
export default router;
