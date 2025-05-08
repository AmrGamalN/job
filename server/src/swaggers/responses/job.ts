/**
 * @swagger
 * components:
 *   schemas:
 *     JobResponse:
 *       description: Job Response
 *       responses:
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/JobGetComponents'
 *
 *     JobAppResponse:
 *       description: Job Application Response
 *       responses:
 *         200:
 *           description: Successful job application response
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/BaseResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/JobAppGetComponents'
 *
 *     InterviewResponse:
 *       description: Job Interview Response
 *       responses:
 *         200:
 *           description: Successful interview response
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/BaseResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/InterviewGetComponents'
 *
 *     JobAnalyticsResponse:
 *       description: Job Analytics Response
 *       responses:
 *         200:
 *           description: Successful job analytics response
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/BaseResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/AnalyticsGetComponents'
 */
