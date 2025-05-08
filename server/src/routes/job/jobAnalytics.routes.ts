import express from "express";
import JobAnalyticsController from "../../controllers/job/companyJobAnalytics.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import { requiredParamMiddleware } from "../../middlewares/validator.middleware";
import { companyAdminRoleMiddlewares } from "../../utils/authorizationRole.util";
const controller = JobAnalyticsController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/job/analytics/get/{id}:
 *   get:
 *     tags: [JobAnalytics]
 *     summary: Get job analytics data by id
 *     description: Retrieve job analytics by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/JobAnalyticsResponse'
 *       400:
 *         description: Failed to fetch job analytics data
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
  requiredParamMiddleware(),
  asyncHandler(controller.getAnalytics.bind(controller))
);

/**
 * @swagger
 * /company/job/analytics/reset-by-name/{id}:
 *   put:
 *     tags: [JobAnalytics]
 *     summary: Reset job analytics by field name
 *     description: Reset job analytics by field name
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *      - $ref: '#/components/parameters/ResetByName'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to reset job analytics
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/reset-by-name/:id",
  ...companyAdminRoleMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.resetAnalyticsByName.bind(controller))
);

/**
 * @swagger
 * /company/job/analytics/reset-all/{id}:
 *   put:
 *     tags: [JobAnalytics]
 *     summary: Reset all job analytics
 *     description: Reset all job analytics
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to reset  job analytics
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/reset-all/:id",
  ...companyAdminRoleMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.resetAllAnalytics.bind(controller))
);

/**
 * @swagger
 * /company/job/analytics/delete/{id}:
 *   delete:
 *     tags: [JobAnalytics]
 *     summary: Delete job analytics
 *     description: Delete specific job analytics by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete job analytics
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
  asyncHandler(controller.deleteAnalytics.bind(controller))
);

export default router;
