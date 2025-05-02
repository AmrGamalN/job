import express from "express";
import JobController from "../../controllers/job/interview.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateInterviewAdd,
  validateInterviewUpdate,
} from "../../validation/job/interview.validator";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
} from "../../utils/authorizationRole.util";
import {
  validateQueryInterviewCount,
  validateQueryInterviewGetAll,
} from "../../validation/query/job/interview.validator";
const controller = JobController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/job/interview/count/{id}:
 *   get:
 *     tags: [Interview]
 *     summary: Get the count of interview
 *     description: Returns the total count of interview
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *      - $ref: '#/components/parameters/InterviewStatus'
 *      - $ref: '#/components/parameters/InterviewPlatform'
 *      - $ref: '#/components/parameters/InterviewResult'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to count interview data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count/:id",
  ...companyAdminRoleMiddlewares,
  requiredParamMiddleware(),
  validateQueryMiddleware(),
  expressValidator(validateQueryInterviewCount()),
  asyncHandler(controller.countInterview.bind(controller))
);

/**
 * @swagger
 * /company/job/interview/add:
 *   post:
 *     tags: [Interview]
 *     summary: Add interview
 *     description: Add a new interview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterviewAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add interview
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...companyAdminRoleMiddlewares,
  expressValidator(validateInterviewAdd),
  asyncHandler(controller.addInterview.bind(controller))
);

/**
 * @swagger
 * /company/job/interview/get/{id}:
 *   get:
 *     tags: [Interview]
 *     summary: Get interview data
 *     description: Retrieve interview by id
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/InterviewResponse'
 *       400:
 *         description: Failed to fetch interview data
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
  asyncHandler(controller.getInterview.bind(controller))
);

/**
 * @swagger
 * /company/job/interview/link/{id}:
 *   get:
 *     tags: [Interview]
 *     summary: Get interview data by link
 *     description: Retrieve interview by link
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/InterviewResponse'
 *       400:
 *         description: Failed to fetch interview data by link
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/link/:id",
  // ...companyViewerRoleMiddlewares,
  asyncHandler(controller.getInterviewByLink.bind(controller))
);

/**
 * @swagger
 * /company/job/interview/{id}:
 *   get:
 *     tags: [Interview]
 *     summary: Get all interview
 *     description: Retrieve interview by id
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *      - $ref: '#/components/parameters/InterviewStatus'
 *      - $ref: '#/components/parameters/InterviewPlatform'
 *      - $ref: '#/components/parameters/InterviewResult'
 *      - $ref: '#/components/parameters/SortCreatedAt'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/InterviewResponse'
 *       400:
 *         description: Failed to fetch interview data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/:id",
  ...companyAdminRoleMiddlewares,
  requiredParamMiddleware(),
  validateQueryMiddleware(),
  expressValidator(validateQueryInterviewGetAll()),
  asyncHandler(controller.getAllInterviews.bind(controller))
);

/**
 * @swagger
 * /company/job/interview/update/{id}:
 *   put:
 *     tags: [Interview]
 *     summary: Update interview
 *     description: Update interview by id
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterviewUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update interview
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
  expressValidator(validateInterviewUpdate),
  asyncHandler(controller.updateInterview.bind(controller))
);

/**
 * @swagger
 * /company/job/interview/delete/{id}:
 *   delete:
 *     tags: [Interview]
 *     summary: Delete interview
 *     description: Delete interview by id
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete interview
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
  asyncHandler(controller.deleteInterview.bind(controller))
);
export default router;
