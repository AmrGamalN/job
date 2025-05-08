import express from "express";
import ReportController from "../../controllers/support/report.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateReportUpdate,
  validateReportAdd,
} from "../../validation/interaction/report.validator";
import {
  adminAuthorizationMiddlewares,
  userAuthorizationMiddlewares,
} from "../../utils/authorizationRole.util";
import {
  validateQueryReportCount,
  validateQueryReportGetAll,
} from "../../validation/query/support/report";
const controller = ReportController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /report/add:
 *   post:
 *     summary: Add report
 *     tags: [Report]
 *     description: Add new report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add",
  ...userAuthorizationMiddlewares,
  expressValidator(validateReportAdd()),
  asyncHandler(controller.addReport.bind(controller))
);

/**
 * @swagger
 * /report/count:
 *   get:
 *     tags: [Report]
 *     summary: Get the count of report
 *     description: Returns the total count of report
 *     parameters:
 *      - $ref: '#/components/parameters/TargetType'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Subject'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to get count of report
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...adminAuthorizationMiddlewares,
  expressValidator(validateQueryReportCount()),
  asyncHandler(controller.countReport.bind(controller))
);

/**
 * @swagger
 * /report/get/{id}:
 *   get:
 *     tags: [Report]
 *     summary: Get report
 *     description: Get report by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReportResponse'
 *       400:
 *         description: Failed to get report data
 *       403:
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
  asyncHandler(controller.getReport.bind(controller))
);

/**
 * @swagger
 * /report:
 *   get:
 *     tags: [Report]
 *     summary: Get all report
 *     description: Get all report if admin or manger | get all report of current user
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/ReportTargetType'
 *      - $ref: '#/components/parameters/ReportStatus'
 *      - $ref: '#/components/parameters/Subject'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReportResponse'
 *       400:
 *         description: Failed to get all reports data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/",
  ...userAuthorizationMiddlewares,
  expressValidator(validateQueryReportGetAll()),
  asyncHandler(controller.getAllReports.bind(controller))
);

/**
 * @swagger
 * /report/update/{id}:
 *   put:
 *     tags: [Report]
 *     summary: Update report
 *     description: Update report by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update report
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id",
  ...adminAuthorizationMiddlewares,
  requiredParamMiddleware(),
  expressValidator(validateReportUpdate()),
  asyncHandler(controller.updateReport.bind(controller))
);

/**
 * @swagger
 * /report/delete/{id}:
 *   delete:
 *     tags: [Report]
 *     summary: Delete report
 *     description: Delete report by id
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
  asyncHandler(controller.deleteReport.bind(controller))
);

export default router;
