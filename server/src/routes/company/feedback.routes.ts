import express from "express";
import FeedBackController from "../../controllers/company/feedBack.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  validateRequiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import { feedBackValidate } from "../../validation/company/feedBack.validator";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
} from "../../utils/authorizationRole.util";
import { validateQueryParams } from "../../validation/query/query.validator";
const controller = FeedBackController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/feedback/update/{id}:
 *   put:
 *     tags: [FeedBack]
 *     summary: Update feedBack record
 *     description: Update specific feedBack information by id
 *     parameters:
 *      - $ref: '#/components/parameters/requiredId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedBackUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update feedBack record
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
  expressValidator(feedBackValidate()),
  asyncHandler(controller.updateFeedBackStatus.bind(controller))
);

/**
 * @swagger
 * /company/feedback/count:
 *   get:
 *     tags: [FeedBack]
 *     summary: Get the count of companies
 *     description: Returns the total count of companies
 *     parameters:
 *      - $ref: '#/components/parameters/CompanyName'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch feedBack data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...companyAdminRoleMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryParams()),
  asyncHandler(controller.countFeedBack.bind(controller))
);

/**
 * @swagger
 * /company/feedback/get/{id}:
 *   get:
 *     tags: [FeedBack]
 *     summary: Get feedBack data by id
 *     description: Retrieve feedBack record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/requiredId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FeedBackResponse'
 *       400:
 *         description: Failed to fetch feedBack data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/get/:id",
  ...companyAdminRoleMiddlewares,
  validateRequiredParamMiddleware(),
  asyncHandler(controller.getFeedBack.bind(controller))
);

/**
 * @swagger
 * /company/feedback/{id}:
 *   get:
 *     tags: [FeedBack]
 *     summary: Get feedBack data by link
 *     description: Retrieve feedBack record by link
 *     parameters:
 *      - $ref: '#/components/parameters/requiredId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FeedBackResponse'
 *       400:
 *         description: Failed to fetch feedBack data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/:id",
  ...companyViewerRoleMiddlewares,
  asyncHandler(controller.getFeedBackByLink.bind(controller))
);

/**
 * @swagger
 * /company/feedback:
 *   get:
 *     tags: [FeedBack]
 *     summary: Get all feedBack
 *     description: Retrieve feedBack record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/CompanyName'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FeedBackResponse'
 *       400:
 *         description: Failed to fetch feedBack data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/",
  ...companyAdminRoleMiddlewares,
  validateQueryMiddleware(),
  expressValidator(validateQueryParams()),
  asyncHandler(controller.getAllFeedBack.bind(controller))
);

/**
 * @swagger
 * /company/feedback/delete/{id}:
 *   delete:
 *     tags: [FeedBack]
 *     summary: Delete feedBack record
 *     description: Delete specific feedBack record by id
 *     parameters:
 *      - $ref: '#/components/parameters/requiredId'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete feedBack record
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
  asyncHandler(controller.deleteFeedBack.bind(controller))
);
export default router;
