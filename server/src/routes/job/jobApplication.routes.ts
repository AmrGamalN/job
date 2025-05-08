import express from "express";
import JobController from "../../controllers/job/jobApplication.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  requiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateJobAppAdd,
  validateJobAppUpdate,
} from "../../validation/job/jobApplication.validator";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
} from "../../utils/authorizationRole.util";
import { jobAppUpload } from "../../middlewares/uploadFile.middleware";
import {
  checkFilesMiddleware,
  parserImagesMiddleware,
} from "../../middlewares/parseFields.middleware";
import {
  validateQueryJobAppCount,
  validateQueryJobAppGetAll,
} from "../../validation/query/job/jobApp.validator";
const controller = JobController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/job/application/add:
 *   post:
 *     tags: [JobApplication]
 *     summary: Add job application
 *     description: Add a new job application
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/JobAppAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add job application
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...companyViewerRoleMiddlewares,
  jobAppUpload,
  checkFilesMiddleware(["cv", "idImage"]),
  parserImagesMiddleware(),
  expressValidator(validateJobAppAdd),
  asyncHandler(controller.addJobApp.bind(controller))
);

/**
 * @swagger
 * /company/job/application/count/{id}:
 *   get:
 *     tags: [JobApplication]
 *     summary: Get the count of job application
 *     description: Returns the total count of job application
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *      - $ref: '#/components/parameters/CurrAddress'
 *      - $ref: '#/components/parameters/JobExperience'
 *      - $ref: '#/components/parameters/ApplicantTypes'
 *      - $ref: '#/components/parameters/JobType'
 *      - $ref: '#/components/parameters/WorkplaceType'
 *      - $ref: '#/components/parameters/JobTitle'
 *      - $ref: '#/components/parameters/SortCreatedAt'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch job application data
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
  expressValidator(validateQueryJobAppCount()),
  asyncHandler(controller.countJobApp.bind(controller))
);

/**
 * @swagger
 * /company/job/application/get/{id}:
 *   get:
 *     tags: [JobApplication]
 *     summary: Get job application data by id
 *     description: Retrieve job application by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/JobAppResponse'
 *       400:
 *         description: Failed to fetch job application data
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
  asyncHandler(controller.getJobApp.bind(controller))
);

/**
 * @swagger
 * /company/job/application/{id}:
 *   get:
 *     tags: [JobApplication]
 *     summary: Get all job application
 *     description: Retrieve job application by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/CurrAddress'
 *      - $ref: '#/components/parameters/JobExperience'
 *      - $ref: '#/components/parameters/ApplicantTypes'
 *      - $ref: '#/components/parameters/JobType'
 *      - $ref: '#/components/parameters/WorkplaceType'
 *      - $ref: '#/components/parameters/JobTitle'
 *      - $ref: '#/components/parameters/SortCreatedAt'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/JobAppResponse'
 *       400:
 *         description: Failed to fetch job application data
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
  expressValidator(validateQueryJobAppGetAll()),
  asyncHandler(controller.getAllJobApps.bind(controller))
);

/**
 * @swagger
 * /company/job/application/update/{id}:
 *   put:
 *     tags: [JobApplication]
 *     summary: Update job application
 *     description: Update job application by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/JobAppUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update job application
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
  jobAppUpload,
  parserImagesMiddleware(),
  expressValidator(validateJobAppUpdate),
  asyncHandler(controller.updateJobApp.bind(controller))
);

/**
 * @swagger
 * /company/job/application/delete/{id}:
 *   delete:
 *     tags: [JobApplication]
 *     summary: Delete job application
 *     description: Delete specific job application by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete job application
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:id",
  ...companyViewerRoleMiddlewares,
  requiredParamMiddleware(),
  asyncHandler(controller.deleteJobApp.bind(controller))
);
export default router;
