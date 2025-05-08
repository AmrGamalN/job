/**
 * @swagger
 * components:
 *   schemas:
 *    SaveResponse:
 *       description: Save Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/SaveGetComponents'
 *
 *    ReportResponse:
 *       description: Report Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/ReportGetComponents'
 *
 *    HelpResponse:
 *       description: Help Response
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BaseResponse'
 *               - type: object
 *                 properties:
 *                  data:
 *                   $ref: '#/components/schemas/HelpGetComponents'
 */
