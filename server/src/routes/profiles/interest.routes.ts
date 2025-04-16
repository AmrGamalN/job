import express from "express";
import InterestController from "../../controllers/profiles/interest.controller";
import { asyncHandler } from "../../middleware/handleError";
import TokenMiddleware from "../../middleware/token.middleware";
import {
  expressValidator,
  validateParamMiddleware,
} from "../../middleware/validatorMiddleware";
const tokenMiddleware = TokenMiddleware.getInstance();
const controller = InterestController.getInstance();
const role = ["user", "admin", "manager"];
const router = express.Router();
import { InterestValidator } from "../../validation/profiles/interest.validator";

const commonMiddlewares = [
  asyncHandler(tokenMiddleware.refreshTokenMiddleware),
  asyncHandler(tokenMiddleware.authorizationMiddleware(role)),
];

/**
 * @swagger
 * tags:
 *   name: Interest
 *   description: Interest management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InterestDTO:
 *       type: object
 *       properties:
 *         industries:
 *           type: array
 *           items:
 *             type: string
 *           description: List of related industries
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *           description: List of related hobbies
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         influencers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of influencers the user follows
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         companies:
 *           type: array
 *           items:
 *             type: string
 *           description: List of companies the user is interested in
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 *         groups:
 *           type: array
 *           items:
 *             type: string
 *           description: List of groups the user is a member of or interested in
 *           example:
 *             - 67ff4067f748a97e2bdd112d
 *             - 67ff4067f748a97e2bdd112d
 */

/**
 * @swagger
 * components:
 *   responses:
 *     InterestSuccess:
 *       description: Successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *               success:
 *                 type: boolean
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/InterestDTO'
 */

/**
 * @swagger
 * /interest/update:
 *   put:
 *     tags: [Interest]
 *     summary: Update interest record
 *     description: Update current a user's interest information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/InterestDTO'
 *       400:
 *         description: Failed to update interest record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /interest/update/{interestId}:
 *   put:
 *     tags: [Interest]
 *     summary: Update interest record
 *     description: Update specific a user's interest information by id
 *     parameters:
 *       - in: path
 *         name: interestId
 *         required: true
 *         description: The interest id of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/InterestSuccess'
 *       400:
 *         description: Failed to update interest record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/:interestId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(InterestValidator)),
  asyncHandler(controller.updateInterest.bind(controller))
);

/**
 * @swagger
 * /interest/delete:
 *   delete:
 *     tags: [Interest]
 *     summary: Delete interest record
 *     description: Delete current a user's interest information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/InterestSuccess'
 *       400:
 *         description: Failed to delete interest record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * /interest/delete/{interestId}:
 *   delete:
 *     tags: [Interest]
 *     summary: Delete interest record
 *     description: Delete specific a user's interest information by id
 *     parameters:
 *       - in: path
 *         name: interestId
 *         required: true
 *         description: The interest id of the user to delete
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestDTO'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/InterestSuccess'
 *       400:
 *         description: Failed to delete interest record
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/delete/:interestId?",
  ...commonMiddlewares,
  asyncHandler(validateParamMiddleware()),
  asyncHandler(expressValidator(InterestValidator)),
  asyncHandler(controller.deleteInterest.bind(controller))
);

export default router;
