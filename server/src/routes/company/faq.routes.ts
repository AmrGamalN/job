import express from "express";
import FaqController from "../../controllers/company/faq.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
import {
  expressValidator,
  validateQueryMiddleware,
  validateRequiredParamMiddleware,
} from "../../middlewares/validator.middleware";
import {
  validateFaqAdd,
  validateFaqUpdate,
} from "../../validation/company/faq.validator";
import {
  companyAdminRoleMiddlewares,
  companyViewerRoleMiddlewares,
} from "../../utils/authorizationRole.util";
import { validateQueryParams } from "../../validation/query/query.validator";
const controller = FaqController.getInstance();
const router = express.Router();

/**
 * @swagger
 * /company/faq/count:
 *   get:
 *     tags: [Faq]
 *     summary: Get the count of faq
 *     description: Returns the total count of faq
 *     parameters:
 *      - $ref: '#/components/parameters/Start'
 *      - $ref: '#/components/parameters/End'
 *      - $ref: '#/components/parameters/UserType'
 *      - $ref: '#/components/parameters/QuestionType'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Department'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to fetch faq data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/count",
  ...companyAdminRoleMiddlewares,
    expressValidator(validateQueryParams()),
  asyncHandler(controller.countFaq.bind(controller))
);

/**
 * @swagger
 * /company/faq/add:
 *   post:
 *     tags: [Faq]
 *     summary: Add faq record
 *     description: Add a new faq record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FaqAddComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to add faq record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/add",
  ...companyViewerRoleMiddlewares,
  expressValidator(validateFaqAdd),
  asyncHandler(controller.addFaq.bind(controller))
);

/**
 * @swagger
 * /company/faq/get/{id}:
 *   get:
 *     tags: [Faq]
 *     summary: Get faq data by id
 *     description: Retrieve faq record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FaqResponse'
 *       400:
 *         description: Failed to fetch faq data
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
  asyncHandler(controller.getFaq.bind(controller))
);

/**
 * @swagger
 * /company/faq:
 *   get:
 *     tags: [Faq]
 *     summary: Get all faq
 *     description: Retrieve faq record by its id
 *     parameters:
 *      - $ref: '#/components/parameters/Page'
 *      - $ref: '#/components/parameters/Limit'
 *      - $ref: '#/components/parameters/UserType'
 *      - $ref: '#/components/parameters/QuestionType'
 *      - $ref: '#/components/parameters/Status'
 *      - $ref: '#/components/parameters/Department'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/FaqResponse'
 *       400:
 *         description: Failed to fetch faq data
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
  asyncHandler(controller.getAllFaqs.bind(controller))
);

/**
 * @swagger
 * /user/faq/update/{id}:
 *   put:
 *     tags: [Faq]
 *     summary: Update faq record by user
 *     description: Update specific faq viewer information by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FaqUpdateComponents'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to update faq record
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:id",
  ...companyViewerRoleMiddlewares,
  validateRequiredParamMiddleware(),
  expressValidator(validateFaqUpdate),
  asyncHandler(controller.updateFaq.bind(controller))
);

/**
 * @swagger
 * /company/faq/delete/{id}:
 *   delete:
 *     tags: [Faq]
 *     summary: Delete faq record
 *     description: Delete specific faq record by id
 *     parameters:
 *      - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Failed to delete faq record
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
  validateRequiredParamMiddleware(),
  asyncHandler(controller.deleteFaq.bind(controller))
);
export default router;
