import express from "express";
import JobController from "../../controllers/job/job.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateJobAdd,
  validateJobUpdate,
} from "../../validation/job/job.validator";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
} from "../../utils/authorizationRole.util";
import {
  validateQueryJobCount,
  validateQueryJobGetAll,
} from "../../validation/query/job/job.validator";
const controller = JobController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/job/count:
 *   get:
 *     tags: [Job]
 *     summary: Get the count of job
 *     description: Returns the total count of job
 *     parameters:
 *      - $ref: '#/components/parameters/SalaryMin'
 *      - $ref: '#/components/parameters/SalaryMax'
 *      - $ref: '#/components/parameters/Department'
 *      - $ref: '#/components/parameters/Location'
 *      - $ref: '#/components/parameters/Skills'
 *      - $ref: '#/components/parameters/JobExperience'
 *      - $ref: '#/components/parameters/ApplicantTypes'
 *      - $ref: '#/components/parameters/JobType'
 *      - $ref: '#/components/parameters/WorkplaceType'
 *      - $ref: '#/components/parameters/JobTitle'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch job data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...companyAdminRoleMiddlewares,
  expressValidator(validateQueryJobCount()),
  asyncHandler(controller.countJob.bind(controller))
);

/**
 * @swagger
 * /company/job/add:
 *   post:
 *     tags: [Job]
 *     summary: Add job 
 *     description: Add a new job 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add job 
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...companyAdminRoleMiddlewares,
  expressValidator(validateJobAdd),
  asyncHandler(controller.addJob.bind(controller))
);

/**
 * @swagger
 * /company/job/get/{id}:
 *   get:
 *     tags: [Job]
 *     summary: Get job data by id
 *     description: Retrieve job by id
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/JobResponse'
 *       400:
 *         description: Failed to fetch job data
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
  asyncHandler(controller.getJob.bind(controller))
);

/**
 * @swagger
 * /company/job:
 *   get:
 *     tags: [Job]
 *     summary: Get all job
 *     description: Retrieve job by id
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/SalaryMin'
 *      - $ref: '#/components/parameters/SalaryMax'
 *      - $ref: '#/components/parameters/Department'
 *      - $ref: '#/components/parameters/Location'
 *      - $ref: '#/components/parameters/Skills'
 *      - $ref: '#/components/parameters/JobExperience'
 *      - $ref: '#/components/parameters/ApplicantTypes'
 *      - $ref: '#/components/parameters/JobType'
 *      - $ref: '#/components/parameters/WorkplaceType'
 *      - $ref: '#/components/parameters/JobTitle'
 *      - $ref: '#/components/parameters/SortSalary'
 *      - $ref: '#/components/parameters/SortViews'
 *      - $ref: '#/components/parameters/SortCreatedAt'
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/JobResponse'
 *       400:
 *         description: Failed to fetch job data
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
  expressValidator(validateQueryJobGetAll()),
  asyncHandler(controller.getAllJobs.bind(controller))
);

/**
 * @swagger
 * /company/job/update/{id}:
 *   put:
 *     tags: [Job]
 *     summary: Update job
 *     description: Update job by id
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update job 
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
  expressValidator(validateJobUpdate),
  asyncHandler(controller.updateJob.bind(controller))
);

/**
 * @swagger
 * /company/job/delete/{id}:
 *   delete:
 *     tags: [Job]
 *     summary: Delete job 
 *     description: Delete job by id
 *     parameters:
 *      - $ref: '#/components/parameters/RequiredId'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete job 
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
  asyncHandler(controller.deleteJob.bind(controller))
);
export default router;
